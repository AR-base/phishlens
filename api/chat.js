/**
 * PhishLens — Chat API (Vercel Serverless Function)
 *
 * Proxies user messages to the Anthropic Claude API.
 * Keeps the API key on the server so it is never exposed to the browser.
 *
 * Environment variable required:
 *   ANTHROPIC_API_KEY — your key from https://console.anthropic.com/
 *
 * Endpoint:
 *   POST /api/chat
 *   Body: { messages: [{ role: "user" | "assistant", content: string }, ...] }
 *   Response: { reply: string }
 */

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 600;
const MAX_HISTORY = 10;
const MAX_MESSAGE_LEN = 2000;

/* ---------- System prompt ---------- */
const SYSTEM_PROMPT = `You are the AI Security Tutor inside PhishLens, an interactive phishing-awareness training platform built by Group 04 at ESAIP.

YOUR ROLE
You teach users how to recognize and respond to phishing attacks and related social-engineering threats. You are friendly, concise, and expert. You assume the user is a non-technical student or employee learning practical security skills.

TOPICS YOU COVER
- Email phishing, spear phishing, whaling, CEO fraud, business email compromise
- Vishing (voice), smishing (SMS), quishing (QR codes)
- AI-generated phishing and deepfakes
- Suspicious link inspection, sender spoofing, email header analysis, SPF/DKIM/DMARC
- Malicious attachments, macro-enabled documents
- Two-factor authentication (2FA / MFA), passkeys, MFA fatigue attacks
- Password security and password managers
- OAuth consent phishing
- Incident response: what to do after clicking a link or opening a bad attachment
- Reporting phishing to the right authorities
- Common scam patterns: gift cards, tech support, fake jobs, crypto / pig-butchering

STAY ON TOPIC
If the user asks about something unrelated to cybersecurity awareness (general coding help, personal advice, trivia, etc.), politely redirect them: "I'm here to help with cybersecurity questions — try asking me about phishing, suspicious links, or account security."

STYLE
- Keep replies short: 3–6 short paragraphs OR a tight bulleted list. Never write walls of text.
- Plain language. Define jargon the first time you use it.
- Be encouraging, never condescending. Assume the user wants to learn.
- When useful, end with one concrete action the user can take.
- Do not invent statistics. If you are unsure, say so and give the safest general guidance.
- Never ask the user to share passwords, OTP codes, or personal data.`;

/* ---------- Simple in-memory rate limiter ---------- */
/* Resets on cold start — adequate for a student demo. */
const rateBuckets = new Map();
const RATE_LIMIT = 15;            // requests per window
const RATE_WINDOW_MS = 60 * 1000; // 1 minute

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

/* ---------- Helpers ---------- */
function sanitizeMessages(raw) {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter(m => m && typeof m.content === "string" && (m.role === "user" || m.role === "assistant"))
    .slice(-MAX_HISTORY)
    .map(m => ({
      role: m.role,
      content: m.content.trim().slice(0, MAX_MESSAGE_LEN)
    }))
    .filter(m => m.content.length > 0);
}

function clientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    "unknown"
  );
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

  const messages = sanitizeMessages(req.body && req.body.messages);
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return res.status(400).json({ error: "Invalid request: messages array must end with a user message." });
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
        messages
      })
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error("Anthropic API error:", apiRes.status, errText);
      return res.status(502).json({ error: "Upstream model error. Please try again in a moment." });
    }

    const data = await apiRes.json();
    const reply = (data.content || [])
      .filter(block => block.type === "text")
      .map(block => block.text)
      .join("\n")
      .trim();

    if (!reply) {
      return res.status(502).json({ error: "Empty response from model." });
    }

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("Chat handler error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}
