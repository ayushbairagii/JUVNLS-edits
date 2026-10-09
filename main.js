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
    ['Turnaround', 'Depends on one person’s schedule', 'A studio team, so deadlines are held'],
    ['Accountability', 'One person, no backup', 'We own the result and fix anything that slips'],
    ['Style', 'One look reused for everyone', 'Every piece styled for your own audience'],
    ['Storytelling', 'Cuts what’s in front of them', 'Years of craft, so we know what makes a video flow'],
    ['Consistency', 'Quality shifts with their workload', 'The same standard on every video, across a whole series'],
    ['Scale', 'Capped by one person’s hours', 'We can take on a series or a busy month without slowing down'],
    ['Communication', 'Hard to reach, replies when they can', 'One clear point of contact and regular updates']
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
      '<span class="play"><img class="i-play" src="assets/play-white.svg" alt=""><i class="i-pause"><b></b><b></b></i></span>' +
      '<button class="snd" type="button" aria-label="Turn sound on">' +
        '<svg class="s-off" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>' +
        '<svg class="s-on" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z"/><path d="M15.5 9a4.5 4.5 0 010 6M18 6.5a8 8 0 010 11"/></svg>' +
      '</button>' +
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

  // Hero reel: muted looping preview streamed from Drive, only while on screen
  function loopMuted(el, id) {
    var src = 'https://drive.usercontent.google.com/download?id=' + id + '&export=download&confirm=t';
    var v = null, failed = false;
    function build() {
      v = document.createElement('video');
      v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true;
      v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.preload = 'auto';
      v.className = 'loopvid';
      v.addEventListener('playing', function () { el.classList.add('looping'); });
      v.addEventListener('error', function () { failed = true; if (v) { v.remove(); v = null; } el.classList.remove('looping'); });
      v.src = src;
      el.insertBefore(v, el.querySelector('.poster').nextSibling);
    }
    function play() { if (failed) return; if (!v) build(); var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    function pause() { if (v) v.pause(); }
    if (!('IntersectionObserver' in window)) { play(); return; }
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.isIntersecting ? play() : pause(); });
    }, { rootMargin: '0px', threshold: 0.1 }).observe(el);
  }

  // Google Drive: thumbnail as poster, click opens Drive's embedded player
  function mountDrive(el, id, customPoster, autoplay) {
    var thumb = customPoster || 'https://drive.google.com/thumbnail?id=' + id + '&sz=w800';
    var img = new Image();
    img.className = 'poster'; img.alt = ''; img.loading = 'lazy'; img.referrerPolicy = 'no-referrer'; img.src = thumb;
    el.insertBefore(img, el.firstChild);
    if (el.classList.contains('mini')) return;     // too small for a player
    if (autoplay) loopMuted(el, id);
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
    var src = VIDEOS[slot];
    var dm = src && /drive\.google\.com\/file\/d\/([\w-]+)/.exec(src);
    var poster = POSTERS[slot] || el.getAttribute('data-poster');
    if (src && !dm && !POSTERS[slot] && /\.(mp4|webm|mov)(\?|$)/i.test(src)) poster = src.replace(/\.(mp4|webm|mov)/i, '.jpg');
    if (dm) poster = null;
    if (poster) {
      var img = new Image();
      img.className = 'poster'; img.alt = ''; img.loading = 'lazy'; img.src = poster;
      el.insertBefore(img, el.firstChild);
    }
    if (!src) return;
    if (dm) { mountDrive(el, dm[1], POSTERS[slot], el.hasAttribute('data-autoplay')); return; }

    var auto = el.hasAttribute('data-autoplay');
    var interactive = el.classList.contains('vcard');
    var v = document.createElement('video');
    v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true; v.preload = 'none';
    v.setAttribute('playsinline', ''); v.setAttribute('muted', '');
    if (poster) v.poster = poster;
    v.className = 'loopvid';
    el.insertBefore(v, el.querySelector('.poster') ? el.querySelector('.poster').nextSibling : el.firstChild);

    var loaded = false, full = false;
    var want = auto;            // should this card be playing when it is on screen?
    var snd = el.querySelector('.snd');
    // autoplay cards stream a tiny silent preview (videos/hero/…); the full video loads only when sound is wanted
    var previewSrc = auto ? src.replace(/^videos\//, 'videos/hero/') : src;
    var saveData = !!(navigator.connection && navigator.connection.saveData);
    function ensure() { if (!loaded) { loaded = true; v.preload = 'auto'; v.src = previewSrc; } }
    function goFull() {
      if (full || previewSrc === src) { full = true; return; }
      full = true;
      var t = v.currentTime, wasPaused = v.paused;
      v.src = src; v.preload = 'auto'; loaded = true;
      v.addEventListener('loadedmetadata', function once() {
        v.removeEventListener('loadedmetadata', once);
        try { v.currentTime = t % (v.duration || 1); } catch (e) {}
        if (!wasPaused || want) play();
      });
    }
    function play() { ensure(); var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    function setUI() {
      el.classList.toggle('is-playing', !v.paused);
      el.classList.toggle('sound', !v.muted);
      if (snd) snd.setAttribute('aria-label', v.muted ? 'Turn sound on' : 'Turn sound off');
      el.setAttribute('aria-label', v.paused ? 'Play video' : 'Pause video');
    }
    v.addEventListener('play', setUI);
    v.addEventListener('pause', setUI);
    v.addEventListener('volumechange', setUI);
    v.addEventListener('ended', setUI);

    var tc = el.querySelector('.tc'), bar = el.querySelector('.bar');
    v.addEventListener('timeupdate', function () {
      if (tc) tc.textContent = fmt(v.currentTime) + ' / ' + fmt(v.duration);
      if (bar && v.duration) bar.style.width = (v.currentTime / v.duration * 100) + '%';
    });

    // load only near the screen; play only while visible (and only if the user hasn't paused it)
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { ensure(); if (want) play(); }
          else v.pause();
        });
      }, { rootMargin: '200px', threshold: 0.1 }).observe(el);
    } else if (auto) { play(); }
    if (saveData) want = false;

    if (!interactive) return;   // small slot cards: silent loop only

    function toggle() {
      if (v.paused) {
        want = true;
        if (!auto) {                       // grid cards: one at a time, with sound
          document.querySelectorAll('.vcard.is-playing:not([data-autoplay])').forEach(function (o) {
            if (o !== el && o._pause) o._pause();
          });
          v.muted = false;
        }
        play();
      } else {
        want = false;
        v.pause();
      }
    }
    el._pause = function () { want = false; v.pause(); };
    el.addEventListener('click', toggle);
    el.addEventListener('keydown', function (e) {
      if (e.target !== el) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
    if (snd) snd.addEventListener('click', function (e) {
      e.stopPropagation();
      if (v.muted) goFull();          // swap the silent preview for the full video (with audio)
      v.muted = !v.muted;
      if (!v.muted && v.paused) { want = true; play(); }
    });
    setUI();
  }

  /* ---------- render ---------- */
  var reel = $('#reel');
  [0, 1].forEach(function (pass) {            // two copies for seamless marquee
    HERO.forEach(function (h, i) {
      var c = card(h);
      c.setAttribute('data-autoplay', '');
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
      '<div class="c c3"><img src="assets/yes.svg" alt="">' + r[2] + '</div>';
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

  document.querySelectorAll('.slot').forEach(function (s) { s.setAttribute('data-autoplay', ''); });
  document.querySelectorAll('.vcard, .slot').forEach(mount);


  /* ---------- menu ---------- */
  (function () {
    var btn = $('#menu-btn'), menu = $('#menu');
    if (!btn || !menu) return;
    function set(open) {
      btn.classList.toggle('open', open);
      menu.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.setAttribute('aria-hidden', String(!open));
    }
    btn.addEventListener('click', function (e) { e.stopPropagation(); set(!menu.classList.contains('open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('click', function (e) { if (!e.target.closest('#menu, #menu-btn')) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  })();
})();
