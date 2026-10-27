/* ===================================================================
   TWCG Action Item Tracker - connection settings
   Fill in the three values below ONCE (README, Step 3), then leave this file alone.
   Re-publishing index.html never changes your data, and this file is safe to keep in GitHub:
   the "anon / publishable" key is meant to be public because the database only answers
   signed-in users (see supabase_setup.sql).

   NEVER put a "service_role" key or your database password in this file.
   =================================================================== */
window.TWCG_CONFIG = {
  // Supabase > Project Settings > API > Project URL
  SUPABASE_URL: "https://rjqszqfiwetgoufcpeir.supabase.co",

  // Supabase > Project Settings > API > "anon" public key (or the "publishable" key)
  SUPABASE_ANON_KEY: "sb_publishable_lneiGb8X2-ZxcC16jB7StA_X_lQa8mE",

  // The e-mail of the ONE shared team user you create in Supabase (README, Step 2).
  // It never receives mail and people never type it - they only type the team password.
  TEAM_EMAIL: "hswift@juneaucc.com"

  // Optional: if your company network blocks cdn.jsdelivr.net, save supabase.js
  // in this folder (README, Troubleshooting) and uncomment:
  // , SUPABASE_LIB_URL: "supabase.js"
};   // <-- the settings end here. Nothing may be pasted above this line.


/* ====== Menu fix (keeps the Columns / Download / More menus on screen) - this part goes BELOW the settings ====== */
(function () {
  var M = 8;
  function place(pop) {
    if (!pop || !pop.classList.contains('show') || !pop.parentElement) return;
    var s = pop.style;
    s.left = s.right = s.top = s.bottom = s.maxHeight = s.maxWidth = '';
    var vw = document.documentElement.clientWidth, vh = window.innerHeight, pr = pop.parentElement.getBoundingClientRect();
    s.maxWidth = (vw - 2 * M) + 'px'; s.overflowY = 'auto';
    var w = pop.offsetWidth;
    var left = pr.right - w;                        // normal: right edges lined up
    if (left < M) left = pr.left;                   // would run off the left side: line up left edges instead
    left = Math.max(M, Math.min(left, vw - M - w)); // and never leave the window on either side
    s.right = 'auto'; s.left = (left - pr.left) + 'px';
    var below = vh - pr.bottom - 8 - M, above = pr.top - 8 - M;
    if (pop.offsetHeight > below && above > below) { s.top = 'auto'; s.bottom = 'calc(100% + 8px)'; s.maxHeight = Math.max(120, above) + 'px'; }
    else s.maxHeight = Math.max(120, below) + 'px';
  }
  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('.menu-pop'), function (pop) {
      new MutationObserver(function () { place(pop); }).observe(pop, { attributes: true, attributeFilter: ['class'] });
      new MutationObserver(function () { place(pop); }).observe(pop, { childList: true });
    });
    window.addEventListener('resize', function () { Array.prototype.forEach.call(document.querySelectorAll('.menu-pop.show'), place); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
