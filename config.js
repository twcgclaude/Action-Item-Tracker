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


/* ====== Menu fix: keeps the Columns / Download / More menus on screen ====== */
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


/* ====== Meetings tab: sort the meeting cards by title or by meeting date ======
   Adds a "Sort meetings by" box above the cards. It only changes the ORDER the cards are shown in on
   this device (your choice is remembered per browser). It never reads or writes the database. */
(function () {
  var KEY = 'twcg-meeting-sort-v1';
  var OPTS = [
    ['date-desc', 'Date of meeting \u2014 newest first'],
    ['date-asc',  'Date of meeting \u2014 oldest first'],
    ['title-asc', 'Title \u2014 A to Z'],
    ['title-desc','Title \u2014 Z to A']
  ];
  var mode = 'date-desc', list = null, bar = null, obs = null, deferred = false;
  try { var saved = localStorage.getItem(KEY); if (saved && OPTS.some(function (o) { return o[0] === saved; })) mode = saved; } catch (e) { /* storage unavailable: just use the default */ }

  function txt(el) { return el ? String(el.textContent || '').replace(/\s+/g, ' ').trim() : ''; }
  function toDay(s) {   // "10/26/2026" or "2026-10-26" -> 20261026 ; anything else (e.g. "No date") -> null
    s = String(s || '').trim(); var m;
    if ((m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s))) return +m[3] * 10000 + (+m[1]) * 100 + (+m[2]);
    if ((m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s))) return +m[1] * 10000 + (+m[2]) * 100 + (+m[3]);
    var t = Date.parse(s); if (isNaN(t)) return null; var d = new Date(t);
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }
  function meetingDay(card) {   // the real meeting date, even for a weekly meeting that displays "Ongoing"
    var btn = card.querySelector('.mdate'); if (!btn) return null;
    var shown = btn.querySelector('.dtxt'); if (shown) return toDay(txt(shown));
    var m = /date on file:\s*([^)]*)\)/i.exec(btn.getAttribute('title') || ''); return m ? toDay(m[1]) : null;
  }
  function compare(a, b) {
    var byTitle = a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });   // "(2 of 3)" sorts before "(10 of 12)"
    if (mode === 'title-asc') return byTitle || a.i - b.i;
    if (mode === 'title-desc') return -byTitle || a.i - b.i;
    if (a.day === null && b.day === null) return byTitle || a.i - b.i;
    if (a.day === null) return 1;            // meetings without a date always go last
    if (b.day === null) return -1;
    if (a.day !== b.day) return mode === 'date-asc' ? a.day - b.day : b.day - a.day;
    return byTitle || a.i - b.i;             // same date: by title
  }
  function apply() {
    deferred = false;
    if (!list || !bar) return;
    var cards = Array.prototype.filter.call(list.children, function (c) { return c.classList && c.classList.contains('mcard'); });
    bar.hidden = cards.length < 2;
    if (cards.length < 2) return;
    var a = document.activeElement;
    if (a && list.contains(a) && (a.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))) { deferred = true; return; }   // never move a card while someone is typing in it
    var infos = cards.map(function (c, i) { return { el: c, i: i, title: txt(c.querySelector('.mtitle')), day: meetingDay(c) }; });
    var sorted = infos.slice().sort(compare);
    if (sorted.every(function (x, i) { return x.el === cards[i]; })) return;   // already in order
    obs.disconnect();
    sorted.forEach(function (x) { list.appendChild(x.el); });
    obs.observe(list, { childList: true });
  }
  function init() {
    list = document.getElementById('meetList'); if (!list || !list.parentNode) return;
    bar = document.createElement('div'); bar.className = 'tools'; bar.id = 'msortBar'; bar.hidden = true;
    var lab = document.createElement('label'); lab.className = 'dl'; lab.appendChild(document.createTextNode('Sort meetings by '));
    var sel = document.createElement('select'); sel.id = 'msortSel'; sel.style.maxWidth = 'none'; sel.setAttribute('aria-label', 'Sort meetings by');
    OPTS.forEach(function (o) { var op = document.createElement('option'); op.value = o[0]; op.textContent = o[1]; if (o[0] === mode) op.selected = true; sel.appendChild(op); });
    lab.appendChild(sel); bar.appendChild(lab); list.parentNode.insertBefore(bar, list);
    sel.addEventListener('change', function () { mode = sel.value; try { localStorage.setItem(KEY, mode); } catch (e) { /* ignore */ } apply(); });
    obs = new MutationObserver(apply);                      // the page redraws the cards after every change (rename, date, merge, live update): sort again each time
    obs.observe(list, { childList: true });
    document.addEventListener('focusout', function () { if (deferred) setTimeout(apply, 60); });
    apply();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
