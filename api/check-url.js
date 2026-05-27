/**
 * PhishLens — URL Check API (Vercel Serverless Function)
 *
 * Sends a URL to Claude with a focused system prompt and returns
 * a structured risk analysis (JSON).
 *
 * Endpoint:
 *   POST /api/check-url
 *   Body: { url: string }
 *   Response: { risk, summary, flags[], advice }
 *
 * NOTE: Claude analyzes the URL string only. It does not fetch the
 * URL or consult live threat-intelligence feeds.
 */

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 400;
const MAX_URL_LEN = 500;

const SYSTEM_PROMPT = `You are PhishLens's URL Safety Analyzer.

Given a URL, analyze it for phishing and scam indicators.

You analyze the URL STRING only. You cannot visit the URL or query threat-intel feeds. State this limitation in your advice when relevant.

Consider:
- Typosquatting and lookalike domains (paypa1, micros0ft, amaz0n)
- Suspicious TLDs commonly abused for phishing (.tk, .xyz, .top, .support, .click)
- Brand impersonation patterns
- URL structure red flags (IP addresses, @ obfuscation, excessive subdomains, encoded chars)
- Suspicious paths or query keywords combined with brand names ("/verify", "/secure-login", "/update")
- URL shorteners that hide the destination (bit.ly, tinyurl, t.co) — flag as medium risk because the real destination is unknown

Respond ONLY with valid minified JSON, no prose, no markdown fences, in this exact format:

{"risk":"safe"|"low"|"medium"|"high"|"critical","score":<integer 0-100>,"summary":"one sentence verdict, max 15 words","flags":["red flag 1","red flag 2"],"advice":"what the user should do, 1-2 sentences"}

Risk scale (and matching score range):
- safe (0-15): matches a known major brand domain with no anomalies
- low (16-35): minor concerns, probably fine
- medium (36-60): suspicious patterns, recommend verification before clicking
- high (61-85): clear phishing indicators, do not click
- critical (86-100): obvious credential-harvesting or scam attempt

The score should be consistent with the risk label.`;

/* ---------- Rate limit (shared instance is fine) ---------- */
const rateBuckets = new Map();
const RATE_LIMIT = 15;
const RATE_WINDOW_MS = 60 * 1000;

function isRateLimited(ip) {
  const now = Date.now();
  const bucket = rateBuckets.get(ip) || { count: 0, reset: now + RATE_WINDOW_MS };
  if (now > bucket.reset) {
    bucket.count = 0;
    bucket.reset = now + RATE_WINDOW_MS;
  }
  bucket.count++;
  rateBuckets.set(ip, bucket);
  return bucket.count > RATE_LIMIT;
}

function clientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    "unknown"
  );
}

function safeParseJson(text) {
  // Strip markdown fences if the model added them despite instructions.
  const cleaned = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Try to recover by extracting the first {...} block.
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch (e2) { /* fall through */ }
    }
    return null;
  }
}

/* ---------- Handler ---------- */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY environment variable." });
  }

  if (isRateLimited(clientIp(req))) {
    return res.status(429).json({ error: "Too many requests. Please slow down and try again in a minute." });
  }

  const url = (req.body && typeof req.body.url === "string") ? req.body.url.trim() : "";
  if (!url || url.length > MAX_URL_LEN) {
    return res.status(400).json({ error: "Provide a URL between 1 and " + MAX_URL_LEN + " characters." });
  }

  try {
    const apiRes = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: "Analyze this URL: " + url }]
      })
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error("Anthropic API error:", apiRes.status, errText);
      return res.status(502).json({ error: "Upstream model error. Please try again in a moment." });
    }

    const data = await apiRes.json();
    const raw = (data.content || [])
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("")
      .trim();

    const parsed = safeParseJson(raw);

    if (!parsed || !parsed.risk) {
      // Fallback: return the raw text wrapped in a sensible default.
      return res.status(200).json({
        risk: "medium",
        score: 50,
        summary: "Analysis returned non-standard format — review manually.",
        flags: [],
        advice: raw.slice(0, 300)
      });
    }

    // Derive a sane score if the model omitted it
    var score = parsed.score;
    if (typeof score !== "number" || score < 0 || score > 100) {
      var defaults = { safe: 8, low: 25, medium: 50, high: 75, critical: 95 };
      score = defaults[parsed.risk] !== undefined ? defaults[parsed.risk] : 50;
    }

    return res.status(200).json({
      risk: parsed.risk,
      score: Math.round(score),
      summary: parsed.summary || "",
      flags: Array.isArray(parsed.flags) ? parsed.flags.slice(0, 8) : [],
      advice: parsed.advice || ""
    });

  } catch (err) {
    console.error("URL check handler error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}
