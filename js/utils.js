/* ============================================================
   PhishLens — Utilities
   Small DOM and string helpers shared across modules.
   Exposed on the global `Utils` namespace.
   ============================================================ */

window.Utils = (function () {

  /**
   * Escape HTML special characters to prevent XSS when injecting
   * user-controlled or data-driven content via innerHTML.
   */
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[c];
    });
  }

  /**
   * Shorthand wrappers around getElementById / querySelectorAll.
   */
  function byId(id) { return document.getElementById(id); }
  function qsa(selector, root) { return Array.from((root || document).querySelectorAll(selector)); }

  /**
   * Smoothly scroll a section into view.
   */
  function scrollTo(el) {
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return {
    escapeHtml: escapeHtml,
    byId: byId,
    qsa: qsa,
    scrollTo: scrollTo
  };
})();
