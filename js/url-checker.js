/* ============================================================
   PhishLens — URL Inspector Module
   Sends a URL to /api/check-url and renders a structured
   risk verdict. Falls back to a heuristic check if the API
   is unreachable.
   ============================================================ */

window.UrlChecker = (function () {

  /* ---------- Config ---------- */
  var API_ENDPOINT = "/api/check-url";
  var REQUEST_TIMEOUT_MS = 20000;

  /* ---------- Risk styling ---------- */
  var RISK_META = {
    safe:     { label: "Safe",       icon: "✓", color: "var(--success)" },
    low:      { label: "Low Risk",   icon: "•", color: "var(--success)" },
    medium:   { label: "Suspicious", icon: "?", color: "var(--warning)" },
    high:     { label: "Dangerous",  icon: "!", color: "var(--danger)"  },
    critical: { label: "Critical",   icon: "✗", color: "var(--danger)"  }
  };

  /* ---------- DOM Refs ---------- */
  function refs() {
    return {
      input:  Utils.byId("url-input"),
      result: Utils.byId("url-result"),
      button: Utils.byId("url-check-btn")
    };
  }

  /* ---------- Normalization & Validation ---------- */
  /**
   * Add a default scheme if the user pasted something like "paypal.com/login".
   */
  function normalize(raw) {
    var url = (raw || "").trim();
    if (!url) return "";
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(url)) {
      url = "https://" + url;
    }
    return url;
  }

  /**
   * Reject obviously non-URL input (garbage strings, missing TLD, etc.).
   * Accepts: domains (example.com, sub.example.co.uk), IPv4 (192.168.1.1).
   * Rejects: single words, missing TLD, numeric-only TLDs, weird characters.
   */
  function isValidUrl(url) {
    try {
      var u = new URL(url);
      if (u.protocol !== "http:" && u.protocol !== "https:") return false;
      var host = u.hostname;
      if (!host) return false;
      if (host.startsWith(".") || host.endsWith(".")) return false;
      if (host.indexOf(".") === -1) return false;

      // IPv4 path
      if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
        var octets = host.split(".");
        for (var i = 0; i < octets.length; i++) {
          var n = parseInt(octets[i], 10);
          if (isNaN(n) || n < 0 || n > 255) return false;
        }
        return true;
      }

      // Domain path
      if (!/^[a-z0-9.-]+$/i.test(host)) return false;
      var parts = host.split(".");
      var tld = parts[parts.length - 1];
      if (tld.length < 2) return false;
      if (!/^[a-z]+$/i.test(tld)) return false;
      // No empty parts (catches "example..com")
      for (var j = 0; j < parts.length; j++) {
        if (parts[j].length === 0) return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ---------- Local heuristic fallback ---------- */
  /**
   * If the API is unreachable, run a basic structural check so the user
   * always sees a useful response.
   */
  function heuristicCheck(url) {
    var flags = [];
    var risk = "low";
    var score = 10;

    try {
      var u = new URL(url);
      var host = u.hostname.toLowerCase();
      var fullUrl = url.toLowerCase();

      // IP literal in host
      if (/^[0-9.]+$/.test(host) || /^\[[0-9a-f:]+\]$/i.test(host)) {
        flags.push("URL uses a raw IP address instead of a domain name");
        risk = "high"; score += 50;
      }

      // Suspicious TLDs
      var suspiciousTlds = [".tk", ".top", ".click", ".support", ".xyz", ".buzz", ".rest"];
      for (var i = 0; i < suspiciousTlds.length; i++) {
        if (host.endsWith(suspiciousTlds[i])) {
          flags.push("Uses a TLD frequently abused by phishing (" + suspiciousTlds[i] + ")");
          score += 25;
          if (risk === "low") risk = "medium";
        }
      }

      // Lookalike to popular brands (also detect digit-for-letter typosquats)
      var brands = ["paypal", "amazon", "microsoft", "apple", "google", "netflix", "linkedin", "dhl", "fedex"];
      var normHost = host.replace(/0/g, "o").replace(/1/g, "l").replace(/3/g, "e").replace(/5/g, "s").replace(/4/g, "a");
      for (var j = 0; j < brands.length; j++) {
        var b = brands[j];
        var contains = normHost.indexOf(b) !== -1;
        var legitimate = host === b + ".com" || host.endsWith("." + b + ".com");
        if (contains && !legitimate) {
          flags.push("Imitates the brand '" + b + "' but is not the official " + b + ".com domain");
          risk = "high"; score += 45;
          break; // one brand match is enough
        }
      }

      // @ obfuscation
      if (url.indexOf("@") !== -1 && url.indexOf("@") < url.lastIndexOf("/")) {
        flags.push("Contains '@' which can hide the real destination");
        risk = "high"; score += 35;
      }

      // Excessive subdomains
      if (host.split(".").length > 4) {
        flags.push("Excessive subdomain depth");
        score += 15;
        if (risk === "low") risk = "medium";
      }

      // Suspicious path keywords
      if (/\/(verify|secure-login|update-account|confirm-identity)/.test(fullUrl)) {
        flags.push("Path contains a phishing-typical keyword");
        score += 20;
        if (risk === "low") risk = "medium";
      }

      // URL shortener
      var shorteners = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "rebrand.ly"];
      if (shorteners.indexOf(host) !== -1) {
        flags.push("URL shortener hides the real destination");
        score += 25;
        if (risk === "low") risk = "medium";
      }

    } catch (e) {
      return {
        risk: "medium", score: 55,
        summary: "URL could not be parsed — verify it is well-formed before clicking.",
        flags: ["Malformed URL structure"],
        advice: "Copy the URL again from the original source and check its format before deciding."
      };
    }

    score = Math.min(100, Math.max(0, score));
    if (score >= 86) risk = "critical";
    else if (score >= 61) risk = "high";
    else if (score >= 36) risk = "medium";
    else if (score >= 16) risk = "low";
    else risk = "safe";

    var summary, advice;
    if (flags.length === 0) {
      summary = "No structural red flags detected by the offline scanner.";
      advice = "The AI tutor is currently unreachable, so this is a basic structural check only. When in doubt, navigate to the site directly instead of clicking the link.";
    } else if (risk === "high" || risk === "critical") {
      summary = "Multiple high-confidence phishing indicators detected.";
      advice = "Do not click. Verify any urgent claims through the official site or app.";
    } else {
      summary = "Suspicious patterns detected — verify before clicking.";
      advice = "Open the official site by typing the domain manually rather than following this link.";
    }

    return { risk: risk, score: score, summary: summary, flags: flags, advice: advice };
  }

  /* ---------- API call ---------- */
  function callApi(url) {
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT_MS);

    return fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url }),
      signal: controller.signal
    })
      .then(function (res) {
        clearTimeout(timeout);
        return res.json().then(function (data) {
          if (!res.ok) throw new Error(data.error || ("HTTP " + res.status));
          return data;
        });
      })
      .catch(function (err) {
        clearTimeout(timeout);
        throw err;
      });
  }

  /* ---------- Rendering ---------- */
  function renderLoading() {
    refs().result.innerHTML =
      '<div class="url-result-card loading">' +
        '<div class="url-loading">' +
          '<span class="dot"></span><span class="dot"></span><span class="dot"></span>' +
        '</div>' +
        '<div class="url-loading-text">Analyzing URL with Claude…</div>' +
      '</div>';
  }

  function renderResult(verdict) {
    var meta = RISK_META[verdict.risk] || RISK_META.medium;
    var score = (typeof verdict.score === "number") ? verdict.score : 50;
    var circumference = 2 * Math.PI * 52; // r = 52
    var offset = circumference * (1 - score / 100);

    var flagsHtml = "";
    if (verdict.flags && verdict.flags.length) {
      flagsHtml =
        '<div class="url-flags">' +
          '<div class="label">Indicators</div>' +
          verdict.flags.map(function (f) {
            return '<span class="flag-tag">' + Utils.escapeHtml(f) + '</span>';
          }).join("") +
        '</div>';
    }

    var ringHtml =
      '<div class="score-ring" style="color:' + meta.color + '">' +
        '<svg viewBox="0 0 120 120" aria-label="Risk score ' + score + ' out of 100">' +
          '<circle class="ring-bg" cx="60" cy="60" r="52"/>' +
          '<circle class="ring-fg" cx="60" cy="60" r="52" ' +
            'stroke-dasharray="' + circumference.toFixed(1) + '" ' +
            'stroke-dashoffset="' + offset.toFixed(1) + '" ' +
            'transform="rotate(-90 60 60)"/>' +
        '</svg>' +
        '<div class="score-num">' + score + '</div>' +
        '<div class="score-denom">/100</div>' +
      '</div>';

    refs().result.innerHTML =
      '<div class="url-result-card risk-' + verdict.risk + '">' +
        '<div class="url-result-top">' +
          ringHtml +
          '<div class="url-verdict">' +
            '<span class="risk-badge" style="color:' + meta.color + ';border-color:' + meta.color + '">' +
              '<span class="risk-icon">' + meta.icon + '</span>' +
              '<span>' + Utils.escapeHtml(meta.label) + '</span>' +
            '</span>' +
            '<p class="url-summary">' + Utils.escapeHtml(verdict.summary || "") + '</p>' +
          '</div>' +
        '</div>' +
        flagsHtml +
        (verdict.advice ? '<div class="url-advice"><span class="label">Recommendation</span><p>' + Utils.escapeHtml(verdict.advice) + '</p></div>' : '') +
      '</div>';
  }

  function renderError(msg, title) {
    var heading = title || "Error";
    refs().result.innerHTML =
      '<div class="url-result-card error">' +
        '<div class="url-error-head">' +
          '<span class="url-error-icon">!</span>' +
          '<span>' + Utils.escapeHtml(heading) + '</span>' +
        '</div>' +
        '<p>' + Utils.escapeHtml(msg) + '</p>' +
      '</div>';
  }

  /* ---------- Public ---------- */
  function check() {
    var input = refs().input;
    var raw = input.value;
    var url = normalize(raw);

    if (!url) {
      renderError("Please paste a URL to analyze.", "Empty input");
      return;
    }

    if (!isValidUrl(url)) {
      renderError(
        "What you entered does not look like a valid web address. Try something like https://example.com or paypal.com/login.",
        "Invalid URL"
      );
      return;
    }

    refs().button.disabled = true;
    renderLoading();

    callApi(url)
      .then(function (verdict) {
        renderResult(verdict);
      })
      .catch(function (err) {
        console.warn("URL API failed, using heuristic fallback:", err.message);
        var verdict = heuristicCheck(url);
        renderResult(verdict);
      })
      .finally(function () {
        refs().button.disabled = false;
      });
  }

  return {
    check: check,
    normalize: normalize,
    isValidUrl: isValidUrl,
    heuristicCheck: heuristicCheck
  };
})();
