/* ============================================================
   PhishLens — Simulator Module
   Presents one email at a time, captures the user's verdict,
   shows feedback with red flags, and tracks attempts in memory.
   ============================================================ */

window.Simulator = (function () {

  /* ---------- State ---------- */
  var state = {
    index: 0,
    attempts: [],   // [{ index, category, isPhishing, userAnswer, correct }]
    answered: false
  };

  /* ---------- DOM Refs ---------- */
  function refs() {
    return {
      container:    Utils.byId("email-container"),
      progressText: Utils.byId("progress-text"),
      progressFill: Utils.byId("progress-fill"),
      section:      Utils.byId("simulator")
    };
  }

  /* ---------- Lifecycle ---------- */
  function start() {
    state = { index: 0, attempts: [], answered: false };
    Utils.byId("hero").style.display = "none";
    Utils.byId("simulator").classList.add("active");
    Utils.byId("dashboard").classList.remove("active");
    render();
    Utils.scrollTo(refs().section);
  }

  function getAttempts() {
    return state.attempts.slice();
  }

  /* ---------- Rendering ---------- */
  function render() {
    var email = window.EMAILS[state.index];
    state.answered = false;

    refs().container.innerHTML =
      '<div class="email-card">' +
        '<div class="email-meta">' +
          metaRow("From", email.sender) +
          metaRow("Date", email.date) +
        '</div>' +
        '<div class="email-subject">' +
          '<div class="label">Subject</div>' +
          '<h3>' + Utils.escapeHtml(email.subject) + '</h3>' +
        '</div>' +
        '<div class="email-body">' + Utils.escapeHtml(email.body) + '</div>' +
      '</div>' +
      '<div class="actions">' +
        '<button class="btn-action btn-trust"  data-verdict="trust">✓ Trust — looks legitimate</button>' +
        '<button class="btn-action btn-report" data-verdict="report">⚠ Report — this is phishing</button>' +
      '</div>' +
      '<div id="feedback-slot"></div>';

    updateProgress();
  }

  function metaRow(label, value) {
    return (
      '<div class="email-meta-row">' +
        '<span class="label">' + Utils.escapeHtml(label) + '</span>' +
        '<span class="value">' + Utils.escapeHtml(value) + '</span>' +
      '</div>'
    );
  }

  function updateProgress() {
    refs().progressText.textContent = state.index + " / " + window.EMAILS.length;
    refs().progressFill.style.width = ((state.index / window.EMAILS.length) * 100) + "%";
  }

  /* ---------- Interaction ---------- */
  function answer(userSaidPhishing) {
    if (state.answered) return;
    state.answered = true;

    var email = window.EMAILS[state.index];
    var correct = userSaidPhishing === email.isPhishing;

    state.attempts.push({
      index: state.index,
      category: email.category,
      isPhishing: email.isPhishing,
      userAnswer: userSaidPhishing,
      correct: correct
    });

    var isLast = state.index === window.EMAILS.length - 1;
    var feedbackHtml =
      '<div class="feedback ' + (correct ? "correct" : "wrong") + '">' +
        '<div class="feedback-head">' +
          '<span>' + (correct ? "✓" : "✗") + '</span>' +
          '<span>' + (correct ? "Correct." : "Not quite.") + '</span>' +
        '</div>' +
        '<div class="feedback-body">' +
          (email.isPhishing
            ? 'This email is a <strong>phishing attempt</strong>. The signals you should have spotted:'
            : 'This email is <strong>legitimate</strong>. There were no malicious indicators here.') +
        '</div>' +
        (email.isPhishing && email.redFlags.length
          ? '<div class="feedback-flags">' +
              '<div class="label">Red flags</div>' +
              email.redFlags.map(function (f) {
                return '<span class="flag-tag">' + Utils.escapeHtml(f) + '</span>';
              }).join("") +
            '</div>'
          : "") +
        '<button class="btn-next" data-action="next">' +
          (isLast ? "See Results" : "Next Email") + ' →' +
        '</button>' +
      '</div>';

    Utils.byId("feedback-slot").innerHTML = feedbackHtml;
  }

  function next() {
    if (state.index >= window.EMAILS.length - 1) {
      // Push progress to 100% before handing off to dashboard.
      refs().progressText.textContent = window.EMAILS.length + " / " + window.EMAILS.length;
      refs().progressFill.style.width = "100%";
      Dashboard.show(state.attempts);
    } else {
      state.index++;
      render();
    }
  }

  return {
    start: start,
    answer: answer,
    next: next,
    getAttempts: getAttempts
  };
})();
