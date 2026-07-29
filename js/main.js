document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    var setNav = function (open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', function () { setNav(!nav.classList.contains('open')); });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setNav(false); });
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && nav.classList.contains('open')) setNav(false);
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }


  /* ---------- Hero logo shrink on scroll ---------- */
  /* Big hero logo scales down and fades as you scroll; the small header logo
     fades in to take over. Tune FADE_OVER (px of scroll) and MIN_SCALE. */
  var heroLogo = document.querySelector('.hero-logo');
  var headLogo = document.querySelector('.logo-mark');
  var FADE_OVER = window.innerWidth < 680 ? 200 : 320;
  var MIN_SCALE = 0.42;

  if (heroLogo && headLogo) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      headLogo.classList.remove('hidden');
    } else {
      headLogo.classList.add('hidden');
      var ticking = false;

      var onScroll = function () {
        var p = Math.min(1, Math.max(0, window.scrollY / FADE_OVER));
        heroLogo.style.transform = 'scale(' + (1 - p * (1 - MIN_SCALE)).toFixed(3) + ')';
        heroLogo.style.opacity = (1 - p).toFixed(3);
        headLogo.classList.toggle('hidden', p < 0.6);
        ticking = false;
      };

      window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
      }, { passive: true });

      onScroll();
    }
  }

  /* ---------- Hero carousel ---------- */
  var carousel = document.querySelector('.carousel');
  if (carousel) {
    var slides = carousel.querySelectorAll('.carousel-slide');
    var dotsWrap = carousel.querySelector('.carousel-dots');
    var current = 0;
    var timer = null;
    var DELAY = 5000;

    slides.forEach(function (s, i) {
      var d = document.createElement('button');
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      if (i === 0) d.classList.add('active');
      d.addEventListener('click', function () { go(i); restart(); });
      dotsWrap.appendChild(d);
    });
    var dots = dotsWrap.querySelectorAll('button');

    function go(n) {
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }
    function next() { go(current + 1); }
    function prev() { go(current - 1); }
    function start() {
      if (slides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        timer = setInterval(next, DELAY);
      }
    }
    function restart() { clearInterval(timer); start(); }

    var btnNext = carousel.querySelector('.carousel-btn.next');
    var btnPrev = carousel.querySelector('.carousel-btn.prev');
    if (btnNext) btnNext.addEventListener('click', function () { next(); restart(); });
    if (btnPrev) btnPrev.addEventListener('click', function () { prev(); restart(); });

    carousel.addEventListener('mouseenter', function () { clearInterval(timer); });
    carousel.addEventListener('mouseleave', restart);

    var startX = null;
    carousel.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) { dx < 0 ? next() : prev(); restart(); }
      startX = null;
    });

    start();
  }

  /* ---------- First-visit plan prompt ---------- */
  /* Shows once per browser. Reset while testing with:
     localStorage.removeItem('friskaSeenPlanPrompt')  */
  var FV_KEY = 'friskaSeenPlanPrompt';
  var FV_DELAY = 1400;

  function seen() {
    try { return localStorage.getItem(FV_KEY) === '1'; } catch (e) { return true; }
  }
  function markSeen() {
    try { localStorage.setItem(FV_KEY, '1'); } catch (e) {}
  }

  if (!seen()) {
    setTimeout(showPlanPrompt, FV_DELAY);
  }

  function showPlanPrompt() {
    var lastFocus = document.activeElement;

    var overlay = document.createElement('div');
    overlay.className = 'fv-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'fvTitle');
    overlay.innerHTML =
      '<div class="fv-modal">' +
        '<button class="fv-close" aria-label="Close">&times;</button>' +
        '<span class="eyebrow">First time here?</span>' +
        '<h3 id="fvTitle">Find your plan in 2 minutes</h3>' +
        '<p>Answer a few quick questions and see exactly what your meals will cost — no signup, no waiting on a call.</p>' +
        '<ul class="fv-points">' +
          '<li><b>1</b>Tell us your goal</li>' +
          '<li><b>2</b>Pick your meals and slots</li>' +
          '<li><b>3</b>Get your price instantly</li>' +
        '</ul>' +
        '<a class="btn btn-primary" href="plan/index.html">Choose Your Meal Plan</a>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { overlay.classList.add('show'); });

    var cta = overlay.querySelector('.btn');
    cta.focus();

    function close() {
      markSeen();
      overlay.classList.remove('show');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      setTimeout(function () { overlay.remove(); }, 300);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function onKey(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      var f = overlay.querySelectorAll('button, a');
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    overlay.querySelector('.fv-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    cta.addEventListener('click', markSeen);
    document.addEventListener('keydown', onKey);
  }

  /* ---------- Google reviews ---------- */
  /* Set REVIEWS_API to your Apps Script web app URL (same one plan/config.js uses).
     Leave it blank and the section simply hides itself. */
  var REVIEWS_API = 'https://script.google.com/macros/s/AKfycbzHnowCDuJ5s0lEMapCV8LQKDmsz0FDZfq87FMcIXnNwHWxc_M7bw6vJa62aBrjBqE/exec';
  var REVIEW_CHARS = 190;

  var rvBox = document.getElementById('reviews');
  if (rvBox) {
    if (!REVIEWS_API) {
      hideReviews();
    } else {
      rvBox.innerHTML = '<div class="rv-state">Loading reviews\u2026</div>';
      fetch(REVIEWS_API + '?action=reviews')
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!d || !d.reviews || !d.reviews.length) { hideReviews(); return; }
          renderReviews(d);
        })
        .catch(function () { hideReviews(); });
    }
  }

  function hideReviews() {
    var sec = rvBox && rvBox.closest('.testimonials');
    if (sec) sec.style.display = 'none';
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function stars(n) {
    var full = Math.round(Number(n) || 0), out = '';
    for (var i = 1; i <= 5; i++) {
      out += i <= full ? '\u2605' : '<span class="off">\u2605</span>';
    }
    return out;
  }

  function initials(name) {
    var p = String(name || '').trim().split(/\s+/);
    return ((p[0] || '')[0] || '?').toUpperCase() + ((p[1] || '')[0] || '').toUpperCase();
  }

  var GOOGLE_G = '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.6z"/>' +
    '<path fill="#34A853" d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3C3.7 21.4 7.6 24 12 24z"/>' +
    '<path fill="#FBBC05" d="M5.6 14.7a7.2 7.2 0 0 1 0-4.6v-3H1.8a12 12 0 0 0 0 10.6l3.8-3z"/>' +
    '<path fill="#EA4335" d="M12 4.8c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 1.2 15.1 0 12 0 7.6 0 3.7 2.6 1.8 6.1l3.8 3c.9-2.7 3.4-4.3 6.4-4.3z"/></svg>';

  function renderReviews(d) {
    var html = '';

    html += '<div class="rv-summary">' +
      '<div><div class="rv-score">' + (Number(d.rating) || 0).toFixed(1) + '</div></div>' +
      '<div>' +
        '<div class="rv-stars">' + stars(d.rating) + '</div>' +
        '<div class="rv-meta">' + (d.total || 0) + ' Google reviews</div>' +
      '</div>' +
      '<div class="rv-nav">' +
        (d.mapsUrl ? '<a class="rv-link" href="' + esc(d.mapsUrl) + '" target="_blank" rel="noopener">See all on Google \u2192</a>' : '') +
        '<div class="rv-arrows">' +
          '<button class="rv-arrow" data-dir="-1" aria-label="Previous review">\u2039</button>' +
          '<button class="rv-arrow" data-dir="1" aria-label="Next review">\u203A</button>' +
        '</div>' +
      '</div>' +
    '</div>';

    html += '<div class="rv-track">';
    d.reviews.forEach(function (v) {
      var text = String(v.text || '');
      var long = text.length > REVIEW_CHARS;
      var shown = long ? text.slice(0, REVIEW_CHARS).trim() + '\u2026' : text;

      var avatar = v.photo
        ? '<img class="rv-avatar" src="' + esc(v.photo) + '" alt="" loading="lazy" referrerpolicy="no-referrer">'
        : '<div class="rv-avatar">' + esc(initials(v.author)) + '</div>';

      html += '<div class="rv-card">' +
        '<div class="rv-head">' + avatar +
          '<div class="rv-who">' +
            '<div class="rv-name">' + esc(v.author || 'Google user') + '</div>' +
            '<div class="rv-when">' + esc(v.when || '') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="rv-stars">' + stars(v.rating) + '</div>' +
        '<p class="rv-text" data-full="' + esc(text) + '" data-short="' + esc(shown) + '">' + esc(shown) + '</p>' +
        (long ? '<button class="rv-more">Read more</button>' : '') +
        '<div class="rv-badge">' + GOOGLE_G + 'Posted on Google</div>' +
      '</div>';
    });
    html += '</div><div class="rv-dots"></div>';

    rvBox.innerHTML = html;

    rvBox.querySelectorAll('.rv-more').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var p = btn.previousElementSibling;
        var open = btn.textContent === 'Read less';
        p.textContent = open ? p.dataset.short : p.dataset.full;
        btn.textContent = open ? 'Read more' : 'Read less';
      });
    });

    initReviewCarousel();
  }

  function initReviewCarousel() {
    var track = rvBox.querySelector('.rv-track');
    var cards = track.querySelectorAll('.rv-card');
    var dotsWrap = rvBox.querySelector('.rv-dots');
    var arrows = rvBox.querySelectorAll('.rv-arrow');
    if (!cards.length) return;

    var timer = null;
    var DELAY = 6000;

    function step() {
      if (cards.length < 2) return track.clientWidth;
      return cards[1].offsetLeft - cards[0].offsetLeft;
    }
    function perView() {
      return Math.max(1, Math.round(track.clientWidth / step()));
    }
    function pages() {
      return Math.max(1, cards.length - perView() + 1);
    }
    function index() {
      return Math.round(track.scrollLeft / step());
    }

    function buildDots() {
      var n = pages();
      dotsWrap.innerHTML = '';
      if (n < 2) return;
      for (var i = 0; i < n; i++) {
        var b = document.createElement('button');
        b.setAttribute('aria-label', 'Go to review ' + (i + 1));
        b.addEventListener('click', (function (k) {
          return function () { track.scrollTo({ left: k * step(), behavior: 'smooth' }); stop(); };
        })(i));
        dotsWrap.appendChild(b);
      }
      sync();
    }

    function sync() {
      var i = index();
      dotsWrap.querySelectorAll('button').forEach(function (b, k) {
        b.classList.toggle('active', k === i);
      });
      arrows.forEach(function (a) {
        var dir = Number(a.dataset.dir);
        a.disabled = dir < 0 ? track.scrollLeft < 6
                             : track.scrollLeft > track.scrollWidth - track.clientWidth - 6;
      });
    }

    arrows.forEach(function (a) {
      a.addEventListener('click', function () {
        track.scrollBy({ left: Number(a.dataset.dir) * step(), behavior: 'smooth' });
        stop();
      });
    });

    var raf;
    track.addEventListener('scroll', function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    });
    window.addEventListener('resize', buildDots);

    function auto() {
      if (index() >= pages() - 1) track.scrollTo({ left: 0, behavior: 'smooth' });
      else track.scrollBy({ left: step(), behavior: 'smooth' });
    }
    function start() {
      if (cards.length > perView() && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        timer = setInterval(auto, DELAY);
      }
    }
    function stop() { clearInterval(timer); timer = null; }

    track.addEventListener('mouseenter', stop);
    track.addEventListener('touchstart', stop, { passive: true });

    buildDots();
    start();
  }

});
