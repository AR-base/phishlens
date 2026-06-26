# PhishLens

> AI Cyber Awareness Platform — Group 04 / ESAIP

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)
![Lint](https://github.com/AR-base/phishlens/actions/workflows/lint.yml/badge.svg)
![Vercel](https://img.shields.io/badge/deploy-vercel-black.svg)
![Claude](https://img.shields.io/badge/model-Claude%20Haiku%204.5-orange.svg)

PhishLens is an interactive phishing-awareness training platform combining a realistic email simulator, an AI tutor powered by the **Anthropic Claude API**, a **URL Inspector** that analyzes suspicious links in real time, and a personalized scoring dashboard.

**Live:** https://phishlens.vercel.app · **Security policy:** [SECURITY.md](SECURITY.md)

---

## Project Structure

```
phishguard/
├── index.html                  # Entry point (semantic markup only)
├── package.json                # Node project metadata (for Vercel)
├── .env.example                # Documents required env vars
├── .gitignore                  # Keeps secrets out of git
│
├── api/
│   ├── chat.js                 # Vercel serverless function → Claude API (tutor)
│   └── check-url.js            # Vercel serverless function → Claude API (URL analysis)
│
├── css/
│   ├── reset.css               # Cross-browser normalization
│   ├── styles.css              # Design tokens, layout, components
│   └── responsive.css          # Mobile and tablet breakpoints
│
├── js/
│   ├── data/
│   │   ├── emails.js           # 10 phishing/legit scenarios
│   │   └── knowledge-base.js   # 29 curated topics (fallback KB)
│   ├── utils.js                # Shared helpers
│   ├── chatbot.js              # AI tutor — API client + KB fallback
│   ├── url-checker.js          # URL Inspector — API client + heuristic fallback
│   ├── simulator.js            # Email triage flow
│   ├── dashboard.js            # Scoring and breakdown
│   └── app.js                  # Event delegation, orchestrator
│
└── README.md
```

**Architecture:** strict separation of concerns. HTML is markup only, CSS is presentation only, JS is split into independent modules exposed on the `window` namespace. The API key never touches the browser — all model calls go through `api/chat.js`.

---

## How the AI Tutor Works

```
  Browser                       Vercel Edge                  Anthropic
  ───────                       ───────────                  ─────────
  chatbot.js  ──── POST ───►  api/chat.js  ──── POST ───►  Claude API
              ◄─── reply ────                 ◄──── reply ────
```

1. User types a question. `chatbot.js` sends the full message history to `/api/chat`.
2. The serverless function in `api/chat.js` adds a curated cybersecurity-focused **system prompt** and forwards the conversation to **Claude Haiku 4.5** (`claude-haiku-4-5`).
3. Claude responds. The function returns the reply.
4. If the API call fails (no key, rate limit, network), `chatbot.js` falls back to local keyword retrieval against the curated knowledge base in `js/data/knowledge-base.js`. **The demo never breaks.**

**Built-in safety:**

- API key stays server-side in a Vercel env var
- In-memory per-IP rate limit (15 requests / minute) — see *Hardening* below
- Origin allowlist via `ALLOWED_ORIGIN` env var blocks cross-origin browser abuse
- System prompt constrains the tutor to cybersecurity topics
- Message length capped at 2,000 characters
- Conversation history capped at the last 10 turns

---

## Setup & Deployment

### 1. Get a Claude API key

1. Go to https://console.anthropic.com/
2. Create an account (free credits included)
3. Generate an API key — it starts with `sk-ant-...`

### 2. Deploy to Vercel (recommended)

```bash
# Install Vercel CLI once
npm i -g vercel

# From inside the phishguard/ folder
vercel
```

Follow the prompts. When asked for the project name, accept the default.

**Then set the env vars:**

```bash
vercel env add ANTHROPIC_API_KEY
# Paste your key, select "Production" + "Preview" + "Development"

# Optional but strongly recommended once you know your deployed URL:
vercel env add ALLOWED_ORIGIN
# Paste e.g. https://phishlens.vercel.app — comma-separate multiple
# origins if you have a custom domain too.

# Redeploy with the new env vars
vercel --prod
```

Your live URL appears in the terminal. Done.

### Hardening for production

The default rate limit lives in process memory: cold starts and routing to a
new Vercel instance both reset the bucket, which is fine for a student demo
but means a determined attacker can keep burning API credits. If this site
ever sees real traffic, swap the in-memory `rateBuckets` Map for a shared
store such as [Vercel KV](https://vercel.com/docs/storage/vercel-kv) or
[Upstash Redis](https://upstash.com/), keyed on the same client IP.

### 3. Local development

```bash
# Install Vercel CLI (if you haven't)
npm i -g vercel

# Create a local env file
cp .env.example .env.local
# Edit .env.local and paste your real ANTHROPIC_API_KEY

# Run the dev server (proxies API + serves static files)
vercel dev
```

Visit `http://localhost:3000`.

> ⚠️ Do **not** open `index.html` directly with `file://` — the chatbot needs the `/api/chat` endpoint, which only works through `vercel dev` or a deployed instance. The keyword-fallback KB will kick in if the API is unreachable, but you want to test the real path.

---

## Alternative Deployments

| Platform        | Static site | Serverless function | Verdict                          |
|-----------------|:-----------:|:-------------------:|----------------------------------|
| **Vercel**      | ✅          | ✅ (`/api/`)         | **Recommended** — used here       |
| Netlify         | ✅          | ✅ (different path)  | Works, but `api/chat.js` needs to move to `netlify/functions/` |
| GitHub Pages    | ✅          | ❌                  | Won't work — no backend           |
| Cloudflare Pages| ✅          | ✅                  | Works with Pages Functions        |

If you must use a static-only host, the app degrades gracefully — the keyword-retrieval KB takes over, but you lose the real Claude tutor.

---

## Modules

| Module          | Responsibility                                                       |
|-----------------|----------------------------------------------------------------------|
| `api/chat.js`   | Vercel serverless function. System prompt, rate limit, Claude proxy. |
| `utils.js`      | HTML escaping, DOM lookups, smooth scrolling                         |
| `chatbot.js`    | API client, message history, typing indicator, KB fallback           |
| `simulator.js`  | Email rendering, verdict capture, feedback, attempt tracking         |
| `dashboard.js`  | Score aggregation, grade assignment, category breakdown              |
| `app.js`        | Centralized `data-action` event delegation, keyboard handling        |

Each module exposes a small public API on `window.<ModuleName>` and is independently testable.

---

## Knowledge Base (Fallback)

The fallback KB used when the API is unreachable. 29 entries grouped into six categories:

- **Foundations** — definitions, red flags, fundamentals
- **Attack Types** — spear phishing, whaling, vishing, smishing, quishing, AI-powered, deepfakes, OAuth consent, MFA fatigue
- **Technical Analysis** — link inspection, sender spoofing, email headers, SPF/DKIM/DMARC, attachments, HTTPS limits
- **Authentication** — 2FA/MFA, passwords, password managers, passkeys
- **Incident Response** — what to do after clicking, reporting, data breaches
- **Scams** — gift cards, tech support, fake jobs, crypto / pig butchering

Retrieval uses weighted keyword matching: longer keywords score higher, favoring specific over generic matches.

Extend the KB by appending a new object to `window.KNOWLEDGE_BASE` in `js/data/knowledge-base.js`. No other file needs to change.

---

## Cost Estimate

Using **Claude Haiku 4.5** at $1 / $5 per million tokens:

- Average tutor reply: ~200 input + ~250 output tokens = ~$0.0014
- A typical demo session (15 questions): ~$0.02
- New Anthropic accounts include free starter credits — more than enough for the evaluation period.

---

## Browser Support

Tested on Chrome 120+, Firefox 121+, Safari 17+, Edge 120+. No transpiler or polyfill required.

---

## License & Credits

Educational project built by **Group 04, ESAIP** as part of the 2026 Cybersecurity + AI module.
