/* ============================================================
   PhishLens — Knowledge Base
   Curated cybersecurity knowledge used by the AI tutor module.
   Each entry exposes keywords used for retrieval and a multi-
   paragraph answer. Topics are grouped by theme for clarity.
   ============================================================ */

window.KNOWLEDGE_BASE = [

  /* ============================================================
     1. FOUNDATIONS
     ============================================================ */
  {
    topic: "greeting",
    category: "foundations",
    keywords: ["hi", "hello", "hey", "help", "start", "yo", "good morning", "good evening"],
    answer: "Hi! I'm your AI security tutor. I can answer questions about phishing, suspicious links, password safety, multi-factor authentication, what to do after a mistake, and most other email-security topics.\n\nTry one of the suggestions below, or just type a question in your own words."
  },
  {
    topic: "what_is_phishing",
    category: "foundations",
    keywords: ["what is phishing", "define phishing", "explain phishing", "meaning of phishing"],
    answer: "Phishing is a social-engineering attack where an attacker impersonates a trusted entity — a bank, a colleague, a service you use — to trick you into doing something harmful: clicking a malicious link, opening an infected attachment, transferring money, or sharing credentials.\n\nIt is the entry point of the majority of corporate breaches because it bypasses technical defenses by targeting the human."
  },
  {
    topic: "red_flags_general",
    category: "foundations",
    keywords: ["red flag", "spot", "recognize", "identify", "sign", "warning sign", "how to detect", "indicators"],
    answer: "The seven most common phishing red flags:\n\n• Urgency or threats ('your account will be closed in 24h')\n• Misspelled sender domains (micros0ft, amaz0n, paypa1)\n• Generic greetings ('Dear Customer', 'Dear User')\n• Requests for passwords, OTP codes, or payment info\n• Suspicious attachments (.exe, .zip, .scr, double extensions)\n• Mismatch between the display name and the actual email address\n• Bad grammar, strange formatting, or off-brand logos\n\nNone of these is a guarantee on its own — but if you spot two or more, treat the email as hostile until proven otherwise."
  },

  /* ============================================================
     2. ATTACK TYPES
     ============================================================ */
  {
    topic: "spear_phishing",
    category: "attack_types",
    keywords: ["spear phishing", "spear", "targeted phishing", "personalized"],
    answer: "Spear phishing is a phishing attack tailored to one specific person, usually built on reconnaissance from LinkedIn, Twitter, the company website, or breached data.\n\nUnlike mass phishing, a spear-phish often references your real role, your manager's name, or a recent event — making it dramatically harder to spot.\n\nDefense: verify any unusual request via a second channel (a phone call, a face-to-face check) regardless of how legitimate the email looks."
  },
  {
    topic: "whaling_ceo_fraud",
    category: "attack_types",
    keywords: ["whaling", "whale", "ceo fraud", "ceo", "executive", "wire transfer", "bec", "business email compromise"],
    answer: "Whaling targets executives (CEO, CFO, board members). CEO fraud is a closely related scam where the attacker impersonates an executive and pressures finance, HR, or assistants to act quickly — typically a wire transfer or a request for sensitive employee data.\n\nThese attacks rely on authority and urgency. Standard defenses:\n\n• Enforce a 'verify by phone' rule for any wire transfer above a threshold\n• Train finance staff that legitimate executives expect verification, not blind obedience\n• Use email banners that visibly flag external senders"
  },
  {
    topic: "vishing",
    category: "attack_types",
    keywords: ["vishing", "phone", "call", "voice", "voice phishing", "fake call"],
    answer: "Vishing is phishing by voice call. Common pretexts:\n\n• 'I'm calling from IT support — we detected an issue with your machine'\n• 'This is your bank's fraud team — we need to verify a transaction'\n• 'I'm from the tax office — you owe money and risk arrest'\n\nThe attacker often uses caller-ID spoofing to display a trusted number.\n\nRule: never share passwords, OTP codes, or payment info on an inbound call. Hang up, then call back using the official number printed on your card or the company's real website."
  },
  {
    topic: "smishing",
    category: "attack_types",
    keywords: ["smishing", "sms", "text", "text message", "package delivery"],
    answer: "Smishing is phishing by SMS. The most common variants in 2026:\n\n• Fake parcel delivery ('package on hold, pay customs fee')\n• Fake bank alerts ('suspicious transaction, confirm here')\n• Fake government messages ('unpaid fine, click to settle')\n\nSMS is dangerous because previews look short and trustworthy. Treat any link in an SMS as guilty until proven innocent — open the app or the official website manually instead."
  },
  {
    topic: "quishing",
    category: "attack_types",
    keywords: ["quishing", "qr", "qr code", "scan", "qr phishing"],
    answer: "Quishing is phishing via QR codes. Attackers print malicious QR codes on flyers, restaurant tables, parking meters, or embed them in emails. Scanning the code opens a phishing site on your phone — where browser security warnings are less prominent.\n\nDefense: only scan QR codes from sources you trust. After scanning, always check the preview URL your camera app shows before opening it. If a 'restaurant menu' QR points to bit.ly or an unknown domain, walk away."
  },
  {
    topic: "ai_phishing",
    category: "attack_types",
    keywords: ["ai", "chatgpt", "gpt", "ai phishing", "generative ai", "llm"],
    answer: "Generative AI has changed phishing in three significant ways:\n\n1. Grammar is now perfect — the classic 'broken English' tell is dead.\n2. Personalization is automated at scale — attackers can produce thousands of unique, well-researched lures per hour.\n3. Conversational follow-ups feel natural — attackers can sustain a back-and-forth thread that looks human.\n\nDefense shifts from 'look for typos' to 'verify the request itself': does this email ask me to do something unusual (move money, share credentials, open a file)? Verify through a second channel before acting."
  },
  {
    topic: "deepfakes",
    category: "attack_types",
    keywords: ["deepfake", "voice clone", "video", "fake voice", "synthetic media"],
    answer: "Deepfake-enabled phishing uses synthetic audio or video to impersonate someone you trust — typically an executive or family member. Documented incidents include CFOs wiring millions after a 'video call' with a deepfaked CEO and parents wiring money after a 'voice call' from a deepfaked child.\n\nIndicators: unusual urgency, audio artifacts, refusal to switch channels, requests that bypass normal process.\n\nDefense: establish a verbal codeword with high-trust contacts (family, executives) and require it for any high-stakes request."
  },
  {
    topic: "oauth_consent",
    category: "attack_types",
    keywords: ["oauth", "consent", "third party app", "google permissions", "microsoft permissions", "app permission"],
    answer: "OAuth consent phishing tricks you into authorizing a malicious third-party app to read your email, files, or contacts — without ever stealing your password. The page looks like a normal 'Sign in with Google' or 'Connect to Microsoft' screen.\n\nOnce granted, the attacker keeps access even if you change your password. They can quietly exfiltrate data for months.\n\nDefense: review your authorized apps periodically (Google → 'Apps with access to your account'; Microsoft → 'My Apps') and revoke anything you don't recognize."
  },
  {
    topic: "mfa_fatigue",
    category: "attack_types",
    keywords: ["mfa fatigue", "push bombing", "spam mfa", "approve prompt", "push notification"],
    answer: "MFA fatigue (or push bombing) is when an attacker who already has your password floods your phone with MFA approval prompts, hoping you'll tap 'Approve' just to make the noise stop. Famous breaches at Uber and Microsoft used this technique.\n\nDefense:\n\n• Never approve a prompt you didn't initiate, no matter how many arrive\n• Switch from simple push to number-matching or code-entry MFA where available\n• Report repeated unsolicited prompts to your security team immediately"
  },

  /* ============================================================
     3. TECHNICAL ANALYSIS
     ============================================================ */
  {
    topic: "check_links",
    category: "technical",
    keywords: ["link", "url", "check link", "hover", "safe link", "is this link safe"],
    answer: "To check a link before clicking:\n\n1. Hover (don't click) — most browsers show the real destination at the bottom of the screen.\n2. Read the domain carefully: paypa1.com ≠ paypal.com.\n3. Watch for unusual TLDs like .support, .info, .top on banking/IT-related links.\n4. Strip the tracking parameters and check what's left after the first '/'.\n5. Paste suspicious links into urlscan.io or VirusTotal for a sandboxed report.\n6. When in doubt, go to the official site directly — never via the email link."
  },
  {
    topic: "spoofed_sender",
    category: "technical",
    keywords: ["spoof", "sender", "domain", "fake email", "display name", "from address"],
    answer: "Sender spoofing has two flavors:\n\n1. Display-name spoofing — the From name reads 'PayPal Security' but the actual address is random@gmail.com. Mobile clients often hide the address by default, which is why phones are a popular phishing target.\n\n2. Lookalike-domain spoofing — the attacker registers paypa1.com (digit 1) or paypal-secure.com and sends from a real mailbox at that domain. This passes basic spam filters because the domain technically exists.\n\nDefense: always expand the From field on mobile and compare the domain character-by-character against the official one."
  },
  {
    topic: "email_headers",
    category: "technical",
    keywords: ["header", "email header", "raw email", "trace", "originating"],
    answer: "Email headers contain the routing history of a message and can confirm whether it's spoofed. The fields that matter most:\n\n• Return-Path: the actual address that will receive bounces — often different from the displayed From\n• Received: lists every server the email passed through, in reverse order\n• Authentication-Results: shows pass/fail for SPF, DKIM, and DMARC checks\n\nIn most clients you can view headers via 'Show original' (Gmail) or 'View source' (Outlook). If SPF or DKIM is 'fail' on a message claiming to be from your bank, treat it as hostile."
  },
  {
    topic: "spf_dkim_dmarc",
    category: "technical",
    keywords: ["spf", "dkim", "dmarc", "email authentication"],
    answer: "Three email-authentication standards work together to make spoofing harder:\n\n• SPF (Sender Policy Framework) — declares which servers are allowed to send mail for a given domain.\n• DKIM (DomainKeys Identified Mail) — cryptographically signs each message so the recipient can verify it wasn't altered in transit.\n• DMARC — tells receivers what to do when SPF or DKIM fail (quarantine, reject) and reports back to the legitimate domain owner.\n\nProperly configured DMARC with p=reject is one of the highest-impact, lowest-cost defenses an organization can deploy."
  },
  {
    topic: "dangerous_attachments",
    category: "technical",
    keywords: ["attachment", "pdf", "exe", "zip", "file", "virus", "malware", "open file"],
    answer: "High-risk attachment patterns:\n\n• .exe, .scr, .bat, .com — executables, almost never sent legitimately by email\n• .zip / .rar with password — often used to defeat scanners; the password is in the email body\n• .docm, .xlsm, .pptm — Office files with macros, the classic infection vector\n• .iso, .img — disk images that auto-mount in modern Windows\n• Double extensions like 'invoice.pdf.exe' — Windows hides the real one by default\n\nNever enable macros on a document you didn't expect. If unsure, contact the sender by phone or chat — not by replying to the suspicious email."
  },
  {
    topic: "https_certificates",
    category: "technical",
    keywords: ["https", "ssl", "tls", "certificate", "padlock", "secure site"],
    answer: "Common misconception: 'HTTPS means safe'. It only means the connection is encrypted in transit — not that the site is trustworthy.\n\nModern phishing sites almost always use HTTPS, because TLS certificates are free (Let's Encrypt) and automatic. The padlock icon proves encryption, not legitimacy.\n\nWhat actually matters is the domain name in the URL bar. https://paypa1-login.com is encrypted — and still a scam."
  },

  /* ============================================================
     4. AUTHENTICATION & ACCOUNT SECURITY
     ============================================================ */
  {
    topic: "two_factor",
    category: "authentication",
    keywords: ["2fa", "mfa", "two factor", "authenticator", "totp", "second factor", "multi factor"],
    answer: "2FA / MFA adds a second proof of identity beyond your password. The factor is typically:\n\n• Something you have (phone with an app, hardware key)\n• Something you are (fingerprint, face)\n\nWhy it matters: even if attackers phish your password, they can't get in without that second factor.\n\nStrength ranking (best to worst): hardware key (YubiKey, Titan) > authenticator app (Authy, Aegis, Google Authenticator) > push notification > SMS code.\n\nAvoid SMS where possible — it's vulnerable to SIM-swapping attacks."
  },
  {
    topic: "passwords",
    category: "authentication",
    keywords: ["password", "strong password", "passphrase", "create password"],
    answer: "Password best practices:\n\n• Never reuse passwords — a single breach exposes every other account where you used the same one.\n• Length beats complexity: a 20-character passphrase like 'correct horse battery staple' is stronger than 'P@ss12!'.\n• Use a unique password per site and let a manager remember them.\n• Enable 2FA wherever the option exists.\n• Check haveibeenpwned.com periodically to see whether your email has appeared in a known breach."
  },
  {
    topic: "password_managers",
    category: "authentication",
    keywords: ["password manager", "bitwarden", "1password", "lastpass", "keepass", "manager"],
    answer: "A password manager generates and stores unique, strong passwords for every site, and auto-fills them when you visit the real domain.\n\nKey side benefit: it protects you from phishing. If the URL doesn't match the saved one — say, paypa1.com instead of paypal.com — the manager won't autofill. That silence is a warning.\n\nGood options: Bitwarden (open-source, free tier), 1Password (paid, polished UX), KeePassXC (offline, advanced users). Avoid storing critical passwords in browser sync alone."
  },
  {
    topic: "passkeys",
    category: "authentication",
    keywords: ["passkey", "fido", "webauthn", "passwordless"],
    answer: "Passkeys are a passwordless authentication standard built on FIDO2/WebAuthn. Instead of typing a password, your device cryptographically proves your identity using a key stored locally (often protected by biometrics).\n\nWhy this beats passwords: there's nothing to phish. Even a perfect lookalike site can't trick your device into signing for the wrong domain — the cryptographic check binds the credential to the real domain.\n\nWhere passkeys are supported (Google, Apple, Microsoft, GitHub, and growing), prefer them over passwords + 2FA."
  },

  /* ============================================================
     5. INCIDENT RESPONSE
     ============================================================ */
  {
    topic: "i_clicked",
    category: "incident",
    keywords: ["clicked", "i clicked", "opened", "what to do", "mistake", "fell for", "i was phished"],
    answer: "If you clicked a phishing link or opened a suspicious attachment, act in this order:\n\n1. Don't panic, but move fast — minutes matter.\n2. Disconnect from Wi-Fi / Ethernet if you downloaded or executed anything.\n3. From a different, trusted device, change the password of any account you may have exposed.\n4. Enable 2FA on those accounts immediately.\n5. Run an antivirus / EDR scan on the affected device.\n6. Report the incident to your IT or security team — speed of detection limits damage.\n7. Watch for unusual activity over the following days (new logins, password reset emails you didn't request, unexpected MFA prompts)."
  },
  {
    topic: "report_phishing",
    category: "incident",
    keywords: ["report", "forward", "tell", "who to tell", "admin", "phishing button"],
    answer: "How to report a phishing email:\n\n1. Don't click, don't reply, don't forward inline.\n2. Use the 'Report phishing' button in Gmail, Outlook, or your corporate client — it preserves headers and notifies both your provider and your IT team.\n3. If no button exists, forward as an attachment (so the headers survive) to your security team or to a national reporting body:\n   • France: signal-spam.fr / phishing-initiative.fr\n   • EU: report to the platform being impersonated\n   • US: reportphishing@apwg.org\n4. Then delete the email."
  },
  {
    topic: "data_breach",
    category: "incident",
    keywords: ["breach", "leaked", "have i been pwned", "data leak", "stolen credentials"],
    answer: "If your email shows up in a data breach (check haveibeenpwned.com):\n\n1. Change the password on the breached service immediately.\n2. Change the password on every other site where you reused it (do this with a password manager going forward).\n3. Enable 2FA on the breached account and on your primary email account — your inbox is the recovery key for everything else.\n4. Watch for an uptick in phishing in the weeks after the breach — attackers buy breach lists and target users with personalized lures."
  },

  /* ============================================================
     6. SCAM PATTERNS
     ============================================================ */
  {
    topic: "gift_card_scam",
    category: "scams",
    keywords: ["gift card", "google play card", "amazon card", "itunes card", "voucher"],
    answer: "Gift-card scams are a classic CEO-fraud pattern: 'Hey, are you at your desk? I'm in a meeting and need you to buy €500 of Apple gift cards for client appreciation. Send me the codes when done.'\n\nThe attacker uses gift cards because they're untraceable and impossible to reverse.\n\nRule: no legitimate executive, government agency, or employer will ever ask you to pay or be paid in gift cards. The request itself is the proof of fraud."
  },
  {
    topic: "tech_support_scam",
    category: "scams",
    keywords: ["tech support", "microsoft support", "apple support", "computer problem", "popup"],
    answer: "Tech-support scams begin with a pop-up, a phone call, or a search result claiming your computer is infected. The scammer asks you to install remote-access software (AnyDesk, TeamViewer) so they can 'fix' the problem, then either drains your bank account or installs real malware.\n\nLegitimate signals:\n\n• Microsoft, Apple, and your bank will never call you out of the blue about your computer.\n• Real virus warnings appear in your antivirus product, not in a browser pop-up.\n• If a 'support agent' asks for remote access, hang up."
  },
  {
    topic: "job_scam",
    category: "scams",
    keywords: ["job offer", "recruiter", "fake job", "remote job", "task scam"],
    answer: "Fake job offers are a growing channel for both data theft and money laundering. Red flags:\n\n• Recruiter contacts you via WhatsApp or Telegram instead of an official corporate platform\n• Offer comes without an interview, or after a single chat exchange\n• Salary is unusually high for the listed role\n• You're asked to buy equipment up-front and be reimbursed (the reimbursement check bounces)\n• You're asked to handle money or packages on behalf of the 'company'\n\nVerify any offer by going to the company's real careers page and contacting their HR directly."
  },
  {
    topic: "crypto_scam",
    category: "scams",
    keywords: ["crypto", "bitcoin", "investment", "trading", "pig butchering", "romance"],
    answer: "Crypto-investment scams (sometimes called 'pig butchering') start with a friendly chat — often via dating apps, LinkedIn, or a 'wrong number' WhatsApp. Over weeks the scammer builds trust, then introduces a 'guaranteed' trading platform. Initial small withdrawals work; large withdrawals don't.\n\nDefense:\n\n• No legitimate trading platform reaches out via social DMs.\n• Any guaranteed return is a guaranteed scam.\n• If a platform refuses or delays a withdrawal, the money is already gone — stop adding funds and report it."
  }

];

/* ============================================================
   Suggestion chips shown at the bottom of the chat panel.
   These should map to high-traffic / high-value topics.
   ============================================================ */
window.CHAT_SUGGESTIONS = [
  "How do I check a link?",
  "What are the red flags?",
  "I think I clicked a phishing link",
  "What is 2FA?",
  "How do I report phishing?"
];

/* Fallback used when no entry matches the user's query */
window.CHAT_FALLBACK =
  "Good question — I don't have a specific answer for that, but here are the universal rules:\n\n" +
  "1. Never enter credentials from a link in an email — go to the official site directly.\n" +
  "2. Verify unusual requests through a second channel (phone, chat in person).\n" +
  "3. When in doubt, ask your IT or security team before acting.\n\n" +
  "Try asking about: red flags, suspicious links, 2FA, what to do if you clicked something, attachments, or specific scams (gift cards, crypto, tech support).";
