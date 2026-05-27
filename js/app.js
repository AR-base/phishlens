/* ============================================================
   PhishLens — App Orchestrator
   Wires modules together via centralized event delegation,
   so individual modules stay free of inline DOM bindings.
   ============================================================ */

(function App() {

  /* ---------- Action Router ---------- */
  /**
   * Map a data-action attribute to the corresponding module call.
   */
  var actions = {
    "start":       function () { Simulator.start(); },
    "restart":     function () { Simulator.start(); },
    "next":        function () { Simulator.next(); },
    "toggle-chat": function () { Chatbot.toggle(); },
    "open-chat":   function () { var p = Utils.byId("chat-panel"); if (!p.classList.contains("open")) Chatbot.toggle(); },
    "send-chat":   function () { Chatbot.send(); },
    "check-url":   function () { UrlChecker.check(); },
    "show-url":    function () { Utils.scrollTo(Utils.byId("url-inspector")); },
    "open-info":   function () { toggleInfoModal(true); },
    "close-info":  function () { toggleInfoModal(false); }
  };

  function toggleInfoModal(open) {
    var modal = Utils.byId("info-modal");
    if (!modal) return;
    if (open) {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    } else {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  /* ---------- Event Delegation ---------- */
  document.addEventListener("click", function (event) {
    var target = event.target.closest("[data-action], [data-verdict], [data-suggestion]");
    if (!target) return;

    if (target.hasAttribute("data-suggestion")) {
      event.preventDefault();
      Chatbot.send(target.getAttribute("data-suggestion"));
      return;
    }

    if (target.hasAttribute("data-verdict")) {
      var verdict = target.getAttribute("data-verdict");
      Simulator.answer(verdict === "report"); // 'report' means user thinks it's phishing
      return;
    }

    var action = target.getAttribute("data-action");
    if (actions[action]) {
      event.preventDefault();
      actions[action]();
    }
  });

  /* ---------- Keyboard ---------- */
  document.addEventListener("keydown", function (event) {
    // Send chat on Enter when input is focused
    if (event.key === "Enter" && document.activeElement === Utils.byId("chat-input")) {
      Chatbot.send();
    }
    // Submit URL on Enter when URL input is focused
    if (event.key === "Enter" && document.activeElement === Utils.byId("url-input")) {
      event.preventDefault();
      UrlChecker.check();
    }
    // Close chat with Escape
    if (event.key === "Escape") {
      var panel = Utils.byId("chat-panel");
      if (panel.classList.contains("open")) Chatbot.toggle();
      var modal = Utils.byId("info-modal");
      if (modal && modal.classList.contains("open")) toggleInfoModal(false);
    }
  });

  // Click outside modal to close
  document.addEventListener("click", function (event) {
    if (event.target && event.target.id === "info-modal") {
      toggleInfoModal(false);
    }
  });

  /* ---------- Console banner (devtools friendly) ---------- */
  if (typeof console !== "undefined" && console.log) {
    console.log(
      "%cPhishLens%c v1.0 — Group 04, ESAIP",
      "color:#ff7a1a;font-size:14px;font-weight:bold;",
      "color:#8a8276;font-size:12px;"
    );
  }
})();
