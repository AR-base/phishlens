# Security Policy

PhishLens is a security-awareness training app, so good-faith security reports are especially welcome here. If you find a way to read the API key, run arbitrary script in another user's browser, bypass the rate limiter at scale, or burn the project's Anthropic budget, please report it privately first.

## Reporting

Email **psaianish2001@gmail.com** with:

- A brief description of the issue and its impact.
- Steps to reproduce, ideally with a minimal `curl` or browser repro.
- The commit SHA you tested against.

You should hear back within 72 hours. Please don't open a public issue or PR until we've agreed it's safe to.

## Scope

In scope:

- `api/chat.js` and `api/check-url.js` — auth, rate-limit, body validation, upstream proxying.
- `js/*.js` — frontend rendering, in particular every `innerHTML` write and the `Utils.escapeHtml` helper.
- `index.html` — markup and attribute injection.
- `vercel.json` — response-header policy (CSP, HSTS, XFO, …).
- Anything in `README.md` that would push an operator toward an insecure configuration.

Out of scope:

- Issues that require the attacker to already control the Vercel project.
- Phishing scenarios *content* in `js/data/emails.js` — these are intentionally realistic for training.
- Rate-limit gaps caused by Vercel cold starts re-creating the in-memory `Map` — documented in the README and the right fix is Vercel KV / Upstash.
- Vulnerabilities in upstream dependencies (Anthropic API, Vercel runtime, browser engines).

## Hardening checklist

If you operate a deployment:

- Set `ALLOWED_ORIGIN` (comma-separated) to your real domains. Without it, the function accepts any origin.
- For real traffic, swap the in-memory rate-limit Map for Vercel KV / Upstash keyed on caller IP.
- Set an Anthropic spending limit at console.anthropic.com.

## Acknowledgements

If you'd like to be credited for a finding, say so in your initial email. Otherwise reports are handled privately.
