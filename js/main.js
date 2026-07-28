document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () { nav.classList.toggle('open'); });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
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
        '<a class="btn btn-accent" href="plan/index.html">Choose Your Meal Plan</a>' +
        '<button class="fv-skip">I\'ll look around first</button>' +
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
    overlay.querySelector('.fv-skip').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    cta.addEventListener('click', markSeen);
    document.addEventListener('keydown', onKey);
  }

});
