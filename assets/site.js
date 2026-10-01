/* Recimama site script. Two jobs, and the site is complete without either of them.

   1. Tables (the legal pages). Each cell learns its column's name, so on a narrow screen every row
      can be shown as a small card (see .can-stack in site.css), and each table is named after the
      section it sits in. Without this a wide table simply scrolls inside its own box.

   2. Animation (the home page). This file adds `js-anim` to <html>, and ONLY then does site.css
      hide anything; each thing is put back by the `in` class added below as it scrolls into view.
      So with JavaScript off, every section is fully visible and still. The class is not added at
      all when the reader has asked for reduced motion, and site.css guards every rule a second
      time with @media (prefers-reduced-motion: no-preference).

      The five drawn stories beside the screenshots work the other way round: they are DRAWN in
      their finished state, and `play` (below) is what rewinds and runs them. So they too are a
      still, finished picture with no script or with motion turned down.

   Loaded from <head> without `defer` on purpose: `js-anim` has to be on <html> before the body is
   painted, or the page would flash into view and then hide itself. It is a few kilobytes, local.

   Only transform and opacity are animated (and the chart's clip-path), so nothing reflows and no
   text ever moves while it is being read. Scroll triggers are IntersectionObservers; the one thing
   that loops (the Coming soon dot) runs only while it is on screen and pauses with the tab. */
(function () {
  var doc = document, root = doc.documentElement;
  var quiet = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  var MOTION = !(quiet && quiet.matches);

  var shown = false;

  if (MOTION) {
    root.classList.add('js-anim');
    /* Failsafe. `js-anim` is what lets site.css hide anything, so the only thing that must never
       happen is the class going on and nothing ever taking it off again. If nothing at all has been
       put back three seconds in — a thrown error, a browser we did not foresee — drop the class,
       which shows every finished state at once, exactly as with no script at all. */
    setTimeout(function () {
      if (!shown && !doc.querySelector('.in')) root.classList.remove('js-anim');
    }, 3000);
  }
  if (quiet && quiet.addEventListener) quiet.addEventListener('change', function () {
    /* Turned on mid-visit: drop the class, which puts every finished state back at once. */
    if (quiet.matches) root.classList.remove('js-anim');
  });

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start);
  else start();

  /* The animation goes first, and on its own: if it throws, the class comes straight off and the
     page is the still, complete one. The tables are a separate try so that neither job can take the
     other down — without them a wide table simply scrolls inside its own box, as it does with no
     script at all. */
  function start() {
    if (MOTION) {
      try { animate(); } catch (e) { root.classList.remove('js-anim'); }
    }
    try { tables(); } catch (e) { /* labels only; the table is readable without them */ }
  }

  /* 1. Tables ------------------------------------------------------------------------------- */

  function tables() {
    var wraps = doc.querySelectorAll('.table-wrap');
    for (var w = 0; w < wraps.length; w++) {
      var wrap = wraps[w], table = wrap.querySelector('table');
      if (!table) continue;
      var heads = [], ths = table.querySelectorAll('thead th');
      for (var i = 0; i < ths.length; i++) { heads.push(ths[i].textContent.trim()); ths[i].setAttribute('role', 'columnheader'); }
      if (!heads.length) continue;
      table.setAttribute('role', 'table');
      var groups = table.querySelectorAll('thead, tbody');
      for (var g = 0; g < groups.length; g++) groups[g].setAttribute('role', 'rowgroup');
      var rows = table.querySelectorAll('tr');
      for (var r = 0; r < rows.length; r++) {
        rows[r].setAttribute('role', 'row');
        var cells = rows[r].querySelectorAll('td');
        for (var c = 0; c < cells.length; c++) {
          cells[c].setAttribute('role', 'cell');
          if (heads[c]) cells[c].setAttribute('data-label', heads[c]);
        }
      }
      var h = wrap.previousElementSibling;
      while (h && !/^H[2-4]$/.test(h.tagName)) h = h.previousElementSibling;
      if (h) wrap.setAttribute('aria-label', 'Table: ' + h.textContent.trim());
      wrap.className += ' can-stack';
    }
  }

  /* 2. Animation ---------------------------------------------------------------------------- */

  /* A group is a box whose contents arrive one after another: [selector, first delay, step], in
     seconds. Keep this list in step with the "hidden until the script says so" list in site.css:
     anything hidden there must end up in a group here, or it would never come back. */
  var GROUPS = [
    ['.hero-title',   0.05, 0.09],
    ['.hero-intro',   0.28, 0.10],
    ['.meal',         0.40, 0],      /* the chart card arrives as one piece, then plays */
    ['.feature-text', 0,    0.07],
    ['.shots',        0.18, 0.11],   /* a little after the words beside them */
    ['.shot-wide',    0.26, 0],
    ['.closing-card', 0,    0.08]
  ];
  var SOLO = { '.meal': 1, '.shot-wide': 1 };

  function animate() {
    doc.addEventListener('visibilitychange', function () {
      root.classList.toggle('tab-hidden', doc.hidden);
    });

    var io = 'IntersectionObserver' in window
      ? new IntersectionObserver(seen, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 })
      : null;

    for (var g = 0; g < GROUPS.length; g++) {
      var sel = GROUPS[g][0], base = GROUPS[g][1], step = GROUPS[g][2];
      var boxes = doc.querySelectorAll(sel);
      for (var b = 0; b < boxes.length; b++) {
        var box = boxes[b], list = itemsOf(box, sel);
        for (var i = 0; i < list.length; i++) {
          list[i].style.setProperty('--rd', (base + Math.min(i, 8) * step).toFixed(2) + 's');
        }
        box._rv = list;
        if (io) io.observe(box); else show(box);   /* no observer: everything, at once */
      }
    }

    /* Keyboard: anything that takes focus is put back at once, along with the rest of its box, so a
       focus ring is never drawn on something that is still fading in. */
    doc.addEventListener('focusin', function (e) {
      for (var el = e.target; el && el !== doc.body; el = el.parentElement) {
        if (el._rv) {
          if (io) io.unobserve(el);
          show(el);
          return;
        }
      }
    });

    pulse();
    stories();
  }

  /* The drawn stories (site.css: "DRAWN STORIES"). Each panel's moving parts are CSS animations
     written `paused`; `play` is what runs them. It goes on while the panel is on screen and comes
     off when it leaves, so a story pauses where it stood and carries on from there when it comes
     back, and once it has finished, being paused at the end IS the finished picture. Nothing
     restarts, so no story ever runs the clock backwards. site.css also pauses them all while the
     tab is hidden, using the `tab-hidden` class set above. */
  function stories() {
    var list = doc.querySelectorAll('.story');
    if (!list.length) return;
    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < list.length; i++) list[i].classList.add('play');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      for (var e = 0; e < entries.length; e++) {
        entries[e].target.classList.toggle('play', entries[e].isIntersecting);
      }
    }, { threshold: 0.25 });
    for (var j = 0; j < list.length; j++) io.observe(list[j]);
  }

  /* The things inside a group, in reading order. A list hands over its own items, so the ticks and
     the Pro points arrive one by one; the headline hands over its words. */
  function itemsOf(box, sel) {
    if (SOLO[sel]) return [box];
    var out = [], kids = box.children;
    for (var i = 0; i < kids.length; i++) {
      var k = kids[i], tag = k.tagName;
      if (tag === 'UL' || tag === 'OL' || k.classList.contains('closing-notes')) {
        for (var j = 0; j < k.children.length; j++) out.push(k.children[j]);
      } else if (tag === 'H1' && box.classList.contains('hero-title')) {
        out = out.concat(words(k));
      } else {
        out.push(k);
      }
    }
    return out;
  }

  /* The headline's words, each in its own span. The text itself is untouched, spaces and all, so
     the heading reads and copies exactly as before. */
  function words(h) {
    var parts = h.textContent.split(/(\s+)/), frag = doc.createDocumentFragment(), out = [];
    for (var i = 0; i < parts.length; i++) {
      if (!parts[i]) continue;
      if (/^\s+$/.test(parts[i])) { frag.appendChild(doc.createTextNode(parts[i])); continue; }
      var s = doc.createElement('span');
      s.className = 'w';
      s.textContent = parts[i];
      frag.appendChild(s);
      out.push(s);
    }
    h.textContent = '';
    h.appendChild(frag);
    return out;
  }

  function seen(entries, obs) {
    for (var i = 0; i < entries.length; i++) {
      if (!entries[i].isIntersecting) continue;
      obs.unobserve(entries[i].target);   /* each thing arrives once and stays */
      show(entries[i].target);
    }
  }

  function show(box) {
    shown = true;
    var list = box._rv || [box];
    for (var i = 0; i < list.length; i++) list[i].classList.add('in');
    /* The chart card's own drawing — the bars appearing behind the red line — starts once the card
       itself has landed. Same observer, one class. */
    if (box.classList.contains('meal')) setTimeout(function () { box.classList.add('play'); }, 420);
  }

  /* The Coming soon dot breathes, but only while it is on screen (and site.css stops it with the
     tab hidden), so it can never distract from reading the rest of the page. */
  function pulse() {
    var soon = doc.querySelector('.soon');
    if (!soon) return;
    if (!('IntersectionObserver' in window)) { soon.classList.add('live'); return; }
    new IntersectionObserver(function (entries) {
      soon.classList.toggle('live', entries[0].isIntersecting);
    }, { threshold: 0 }).observe(soon);
  }
})();
