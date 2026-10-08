(function () {
  'use strict';
  var VIDEOS = window.VIDEOS || {};
  var POSTERS = window.POSTERS || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };

  /* ---------- data ---------- */
  var HERO = ['hero-1', 'hero-2', 'hero-3', 'hero-4', 'hero-5'];
  var WORK = [1, 2, 3, 4, 5, 6, 7, 8];
  var STATS = [
    ['120M+', 'Views Generated', 'across platforms'],
    ['600+', 'Videos Delivered', 'across studios'],
    ['000', 'Deadlines missed', 'across clients']
  ];
  var ROWS = [
    ['Story', 'Long take', 'Find the line', 'Clear point'],
    ['Opening', 'Slow start', 'Lead with tension', 'Strong entry'],
    ['Pace', 'Dead air', 'Cut for rhythm', 'Feels alive'],
    ['Motion', 'Static frame', 'Move with purpose', 'More character'],
    ['Brand', 'Generic look', 'Use your language', 'Feels yours'],
    ['Versions', 'One long cut', 'Plan the outputs', 'Ready to use']
  ];
  var FAQ = [
    ['What footage do you take?', 'Interviews, podcasts and direct-to-camera<br>recordings. We find the story in the raw material.'],
    ['What do you handle?', 'Cutting, pacing, motion graphics, captions and platform-ready exports for every format you need.'],
    ['Can you work with our team?', 'Yes. We plug into your studio’s brief, brand language and review flow without slowing anyone down.'],
    ['Can you make a series?', 'Absolutely. We build a repeatable edit style so every episode feels consistent and still fresh.'],
    ['How fast can you deliver?', 'Most short-form cuts land within a few days. Tell us the deadline and we plan the outputs around it.'],
    ['How do revisions work?', 'Share notes in one round and we turn them around quickly. Clear feedback keeps the edit sharp.'],
    ['Can we see relevant work?', 'Everything above is real client work. Send a brief and we’ll share more that matches your format, tone and platform.']
  ];

  /* ---------- helpers ---------- */
  var EYE = '<span class="eye"><i class="e1"><img src="assets/eye-1.svg" alt=""></i><i class="e2"><img src="assets/eye-2.svg" alt=""></i></span>';

  function card(slot, poster, opts) {
    opts = opts || {};
    var el = document.createElement('article');
    el.className = 'vcard';
    el.setAttribute('data-slot', slot);
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', 'Play video');
    el.innerHTML =
      '<span class="play"><img src="assets/play-white.svg" alt=""></span>' +
      '<span class="tc">0:00 / 0:00</span><span class="bar"></span>';
    return el;
  }

  function fmt(t) {
    if (!isFinite(t)) t = 0;
    var m = Math.floor(t / 60), s = Math.floor(t % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  // Full-screen 9:16 player (used on phones / small cards so Drive's player stays in frame)
  var modal = null;
  function openModal(id) {
    if (modal) return;
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = '<div class="modal-box"><iframe allow="autoplay; fullscreen" allowfullscreen src="https://drive.google.com/file/d/' + id + '/preview"></iframe></div><button class="drive-x modal-x" aria-label="Close video">×</button>';
    function close() { modal.remove(); modal = null; document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; }
    function onKey(e) { if (e.key === 'Escape') close(); }
    modal.addEventListener('click', function (e) { if (!e.target.closest('.modal-box')) close(); });
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    document.body.appendChild(modal);
  }

  // Google Drive: thumbnail as poster, click opens Drive's embedded player
  function mountDrive(el, id, customPoster) {
    var thumb = customPoster || 'https://drive.google.com/thumbnail?id=' + id + '&sz=w800';
    var img = new Image();
    img.className = 'poster'; img.alt = ''; img.loading = 'lazy'; img.referrerPolicy = 'no-referrer'; img.src = thumb;
    el.insertBefore(img, el.firstChild);
    if (el.classList.contains('mini')) return;     // too small for a player
    var frame = null;
    function close(e) {
      if (e) e.stopPropagation();
      if (frame) { frame.remove(); frame.x.remove(); frame = null; }
      el.classList.remove('playing');
    }
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } });
    el.addEventListener('click', function () {
      if (frame) return;
      if (window.innerWidth <= 700 || el.offsetWidth < 300) { openModal(id); return; }
      frame = document.createElement('iframe');
      frame.className = 'drive-frame';
      frame.allow = 'autoplay; fullscreen';
      frame.allowFullscreen = true;
      frame.src = 'https://drive.google.com/file/d/' + id + '/preview';
      var x = document.createElement('button');
      x.className = 'drive-x'; x.setAttribute('aria-label', 'Close video'); x.textContent = '×';
      x.addEventListener('click', close);
      frame.x = x;
      el.appendChild(frame); el.appendChild(x);
      el.classList.add('playing');
    });
  }

  // Wire a poster image + (optional) <video> into any .vcard / .slot element
  function mount(el) {
    var slot = el.getAttribute('data-slot');
    var poster = POSTERS[slot] || el.getAttribute('data-poster');
    if (/drive\.google\.com\/file\/d\//.test(VIDEOS[slot] || '')) poster = null;
    if (poster) {
      var img = new Image();
      img.className = 'poster'; img.alt = ''; img.loading = 'lazy'; img.src = poster;
      el.insertBefore(img, el.firstChild);
    }
    var src = VIDEOS[slot];
    if (!src) return;
    var dm = /drive\.google\.com\/file\/d\/([\w-]+)/.exec(src);
    if (dm) { mountDrive(el, dm[1], POSTERS[slot]); return; }
    var v = document.createElement('video');
    v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'metadata';
    v.setAttribute('playsinline', ''); v.setAttribute('muted', '');
    if (poster) v.poster = poster;
    v.src = src;
    el.insertBefore(v, el.querySelector('.poster') ? el.querySelector('.poster').nextSibling : el.firstChild);

    var tc = el.querySelector('.tc'), bar = el.querySelector('.bar');
    var pinned = false;
    function setPlaying(on) { el.classList.toggle('playing', on); }
    v.addEventListener('timeupdate', function () {
      if (tc) tc.textContent = fmt(v.currentTime) + ' / ' + fmt(v.duration);
      if (bar && v.duration) bar.style.width = (v.currentTime / v.duration * 100) + '%';
    });
    function play() { var p = v.play(); if (p && p.catch) p.catch(function () {}); setPlaying(true); }
    function pause() { v.pause(); setPlaying(false); }
    if (window.matchMedia('(hover:hover)').matches) {
      el.addEventListener('mouseenter', function () { if (!pinned) play(); });
      el.addEventListener('mouseleave', function () { if (!pinned) pause(); });
    }
    el.addEventListener('click', function () {
      pinned = !pinned;
      if (pinned) { v.muted = false; play(); } else { v.muted = true; pause(); }
    });
  }

  /* ---------- render ---------- */
  var reel = $('#reel');
  [0, 1].forEach(function (pass) {            // two copies for seamless marquee
    HERO.forEach(function (h, i) {
      var c = card(h);
      if (pass) c.setAttribute('aria-hidden', 'true');
      reel.appendChild(c);
    });
  });

  var grid = $('#grid');
  WORK.forEach(function (n) { grid.appendChild(card('work-' + n)); });

  var stats = $('#stats');
  [0, 1, 2, 3].forEach(function () {
    STATS.forEach(function (s) {
      var d = document.createElement('div');
      d.className = 'stat';
      d.innerHTML = '<span class="pl"><img src="assets/play-dark.svg" alt=""></span>' +
        '<span class="val">' + s[0] + '</span>' +
        '<span class="lab"><b>' + s[1] + '</b><i>' + s[2] + '</i></span>';
      stats.appendChild(d);
    });
  });

  var rows = $('#rows');
  ROWS.forEach(function (r) {
    var d = document.createElement('div');
    d.className = 't-row';
    d.innerHTML =
      '<div class="c c0">' + r[0] + '</div>' +
      '<div class="c c1"><img src="assets/no.svg" alt="">' + r[1] + '</div>' +
      '<div class="c c2"><img src="assets/no.svg" alt="">' + r[2] + '</div>' +
      '<div class="c c3"><img src="assets/yes.svg" alt="">' + r[3] + '</div>';
    rows.appendChild(d);
  });

  var faq = $('#faq-list');
  FAQ.forEach(function (f, i) {
    var q = document.createElement('div');
    q.className = 'q' + (i === 0 ? ' open' : '');
    q.innerHTML =
      '<button class="q-head" aria-expanded="' + (i === 0) + '">' +
        '<span class="n">0' + (i + 1) + '</span><span class="qt">' + f[0] + '</span><span class="ic"></span>' +
      '</button>' +
      '<div class="q-body"><div><p>' + f[1] + '</p></div></div>';
    faq.appendChild(q);
  });
  faq.addEventListener('click', function (e) {
    var head = e.target.closest('.q-head');
    if (!head) return;
    var item = head.parentNode, willOpen = !item.classList.contains('open');
    faq.querySelectorAll('.q').forEach(function (q) {
      q.classList.remove('open');
      q.firstChild.setAttribute('aria-expanded', 'false');
    });
    if (willOpen) { item.classList.add('open'); head.setAttribute('aria-expanded', 'true'); }
  });

  /* ---------- mount videos ---------- */
  // contact mini-cards use work posters until real videos are supplied
  var minis = { 'contact-story': 'assets/work-07.png', 'contact-pace': 'assets/work-08.png', 'contact-motion': 'assets/work-06.png' };
  document.querySelectorAll('.mini').forEach(function (m) {
    var s = m.getAttribute('data-slot');
    if (!m.getAttribute('data-poster')) m.setAttribute('data-poster', minis[s]);
  });

  document.querySelectorAll('.vcard, .slot').forEach(mount);

  /* ---------- brief form (no backend yet) ---------- */
  var form = $('#brief');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var label = form.querySelectorAll('.roll span');
    label.forEach(function (s) { s.textContent = 'Thanks — we’ll be in touch'; });
    form.classList.add('sent');
  });
})();
