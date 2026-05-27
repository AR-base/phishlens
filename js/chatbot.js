/* ============================================================
   PhishLens — Chatbot Module
   Calls the /api/chat serverless endpoint (Claude API).
   Falls back to local KB keyword retrieval on network/API failure,
   so the demo never breaks even if the backend is unreachable.
   ============================================================ */

window.Chatbot = (function () {

  /* ---------- Configuration ---------- */
  var API_ENDPOINT = "/api/chat";
  var REQUEST_TIMEOUT_MS = 20000;

  /* ---------- State ---------- */
  var initialized = false;
  var history = []; // [{ role: "user" | "assistant", content: string }]
  var sending = false;

  /* ---------- DOM Refs (resolved lazily) ---------- */
  function refs() {
    return {
      panel: Utils.byId("chat-panel"),
      msgs:  Utils.byId("chat-msgs"),
      input: Utils.byId("chat-input"),
      chips: Utils.byId("chat-chips")
    };
  }

  /* ============================================================
     KB FALLBACK
     Uses weighted keyword retrieval against window.KNOWLEDGE_BASE.
     Triggered only when the API call fails.
     ============================================================ */
  function fallbackAnswer(query) {
    var q = (query || "").toLowerCase();
    var best = null;
    var bestScore = 0;

    for (var i = 0; i < window.KNOWLEDGE_BASE.length; i++) {
      var entry = window.KNOWLEDGE_BASE[i];
      var score = 0;
      for (var k = 0; k < entry.keywords.length; k++) {
        var kw = entry.keywords[k];
        if (q.indexOf(kw) !== -1) score += kw.length;
      }
      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    }
    return best ? best.answer : window.CHAT_FALLBACK;
  }

  /* ============================================================
     RENDERING
     ============================================================ */
  function addMessage(text, role) {
    var div = document.createElement("div");
    div.className = "msg " + role;

    if (role === "bot") {
      div.innerHTML = Utils.escapeHtml(text).replace(/\n/g, "<br/>");
    } else {
      div.textContent = text;
    }

    var msgs = refs().msgs;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  function showTyping() {
    var div = document.createElement("div");
    div.className = "msg bot typing";
    div.id = "typing-indicator";
    div.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';

    var msgs = refs().msgs;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    var el = Utils.byId("typing-indicator");
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function renderChips() {
    var chips = refs().chips;
    chips.innerHTML = window.CHAT_SUGGESTIONS.map(function (s) {
      var safe = Utils.escapeHtml(s);
      return '<button class="chat-chip" data-suggestion="' + safe + '">' + safe + "</button>";
    }).join("");
  }

  /* ============================================================
     API CALL
     ============================================================ */
  function callApi(messages) {
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT_MS);

    return fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messages }),
      signal: controller.signal
    })
      .then(function (res) {
        clearTimeout(timeout);
        return res.json().then(function (data) {
          if (!res.ok) {
            throw new Error(data.error || ("HTTP " + res.status));
          }
          return data.reply;
        });
      })
      .catch(function (err) {
        clearTimeout(timeout);
        throw err;
      });
  }

  /* ============================================================
     PUBLIC API
     ============================================================ */
  function toggle() {
    var panel = refs().panel;
    panel.classList.toggle("open");
    panel.setAttribute("aria-hidden", panel.classList.contains("open") ? "false" : "true");

    if (panel.classList.contains("open") && !initialized) {
      addMessage(
        "Hi! I'm your AI security tutor. Ask me anything about phishing, suspicious links, " +
        "password safety, or what to do if you clicked something you shouldn't have.",
        "bot"
      );
      renderChips();
      initialized = true;
    }

    if (panel.classList.contains("open")) {
      setTimeout(function () { refs().input.focus(); }, 200);
    }
  }

  function send(forced) {
    if (sending) return;
    var input = refs().input;
    var text = (forced || input.value).trim();
    if (!text) return;

    input.value = "";
    addMessage(text, "user");
    history.push({ role: "user", content: text });

    sending = true;
    showTyping();

    callApi(history)
      .then(function (reply) {
        hideTyping();
        addMessage(reply, "bot");
        history.push({ role: "assistant", content: reply });
      })
      .catch(function (err) {
        console.warn("Chat API failed, using KB fallback:", err.message);
        hideTyping();
        var fallback = fallbackAnswer(text);
        addMessage(fallback, "bot");
        // Don't add fallback to history — keeps conversation clean for next API call
      })
      .finally(function () {
        sending = false;
      });
  }

  return {
    toggle: toggle,
    send: send,
    fallbackAnswer: fallbackAnswer  // exported for testing
  };
})();
