/* ============================================================
   PhishLens — Dashboard Module
   Aggregates simulator attempts into a score, performance grade,
   personalized advice, and a per-category accuracy breakdown.
   ============================================================ */

window.Dashboard = (function () {

  /* ---------- Grading thresholds ---------- */
  var GRADES = [
    { min: 90, label: "Sentinel",
      advice: "Excellent. You can reliably distinguish legitimate from malicious emails. Stay alert — phishing techniques evolve constantly." },
    { min: 70, label: "Aware",
      advice: "Solid awareness, but a few attacks slipped through. Review the red flags you missed and consider repeating the training next week." },
    { min: 50, label: "At Risk",
      advice: "You missed several attacks that could have led to credential theft or malware. Ask the AI tutor about the categories you missed." },
    { min: 0,  label: "High Risk",
      advice: "Most modern phishing attacks would currently succeed against you. Spend time with the AI tutor — start with 'what are the red flags?' — then redo the training." }
  ];

  /* ---------- Computation ---------- */
  /**
   * Group attempts by category and compute accuracy per group.
   */
  function categoryBreakdown(attempts) {
    var cats = {};
    attempts.forEach(function (a) {
      if (!cats[a.category]) cats[a.category] = { total: 0, correct: 0 };
      cats[a.category].total++;
      if (a.correct) cats[a.category].correct++;
    });
    return cats;
  }

  function gradeFor(pct) {
    for (var i = 0; i < GRADES.length; i++) {
      if (pct >= GRADES[i].min) return GRADES[i];
    }
    return GRADES[GRADES.length - 1];
  }

  /* ---------- Rendering ---------- */
  function show(attempts) {
    Utils.byId("simulator").classList.remove("active");
    Utils.byId("dashboard").classList.add("active");

    var correct = attempts.filter(function (a) { return a.correct; }).length;
    var total = attempts.length;
    var pct = total ? Math.round((correct / total) * 100) : 0;
    var grade = gradeFor(pct);

    Utils.byId("big-score").textContent = correct;
    Utils.byId("score-sub").textContent =
      "out of " + total + " emails classified correctly (" + pct + "%)";
    Utils.byId("score-grade").textContent = grade.label;
    Utils.byId("score-advice").textContent = grade.advice;

    Utils.byId("category-breakdown").innerHTML = renderCategories(attempts);

    Utils.scrollTo(Utils.byId("dashboard"));
  }

  function renderCategories(attempts) {
    var cats = categoryBreakdown(attempts);
    var labels = window.CATEGORY_LABELS || {};

    return Object.keys(cats).map(function (key) {
      var c = cats[key];
      var p = Math.round((c.correct / c.total) * 100);
      var label = labels[key] || key;

      return (
        '<div class="cat-row">' +
          '<span class="cat-name">' + Utils.escapeHtml(label) + '</span>' +
          '<div class="cat-bar"><div class="cat-fill" style="width:' + p + '%"></div></div>' +
          '<span class="cat-pct">' + p + '%</span>' +
        '</div>'
      );
    }).join("");
  }

  return {
    show: show,
    categoryBreakdown: categoryBreakdown,
    gradeFor: gradeFor
  };
})();
