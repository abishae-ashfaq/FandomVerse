/* ============================================================
   FANDOMVERSE — animations.js
   Step 4: Motion engine + Lazy loading
   ============================================================ */

(function () {
  'use strict';

  console.log('[FandomVerse] animations.js loaded');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* ---------- 1. SCROLL PROGRESS BAR ---------- */
  function initProgressBar() {
    let bar = document.querySelector('.fv-scroll-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'fv-scroll-progress';
      document.body.appendChild(bar);
    }
    const update = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (scrolled / max) * 100 : 0;
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- 2. CURSOR GLOW ---------- */
  function initCursorGlow() {
    if (isTouch || prefersReduced) return;

    let glow = document.querySelector('.fv-cursor-glow');
    if (!glow) {
      glow = document.createElement('div');
      glow.className = 'fv-cursor-glow';
      document.body.appendChild(glow);
    }

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let gx = mx, gy = my;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      glow.classList.add('active');
      glow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      glow.style.opacity = '0';
    });

    (function tick() {
      gx += (mx - gx) * 0.15;
      gy += (my - gy) * 0.15;
      glow.style.left = gx + 'px';
      glow.style.top = gy + 'px';
      requestAnimationFrame(tick);
    })();
  }

  /* ---------- 3. REVEAL ON SCROLL ---------- */
  function initReveal() {
    if (prefersReduced) {
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
        .forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    document
      .querySelectorAll('.reveal, .reveal-left, .reveal-right')
      .forEach((el) => observer.observe(el));
  }

  /* ---------- 4. COUNTER ANIMATIONS ---------- */
  function animateCounter(el, target, suffix) {
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    const stats = document.querySelectorAll('.fv-stat strong');
    if (!stats.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting && !el.dataset.animated) {
            el.dataset.animated = 'true';
            const raw = el.dataset.target || el.textContent.trim();
            const match = raw.match(/^(\d+)(.*)$/);
            if (!match) return;
            const target = parseInt(match[1], 10);
            const suffix = match[2] || '';
            animateCounter(el, target, suffix);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    stats.forEach((s) => {
      if (!s.dataset.target) s.dataset.target = s.textContent.trim();
      if (s.dataset.target.startsWith('∞')) return;
      s.textContent = '0';
      observer.observe(s);
    });
  }

  /* ---------- 5. HERO PARALLAX ---------- */
  function initHeroParallax() {
    if (prefersReduced) return;

    const bg = document.querySelector('.fv-hero-bg');
    const content = document.querySelector('.fv-hero-content');
    if (!bg) return;

    let ticking = false;

    function update() {
      const scrolled = window.scrollY;
      const heroHeight = window.innerHeight;
      if (scrolled > heroHeight) {
        ticking = false;
        return;
      }
      const ratio = scrolled / heroHeight;

      bg.style.transform = `translateY(${scrolled * 0.4}px) scale(1.05)`;

      if (content) {
        content.style.transform = `translateY(${scrolled * 0.15}px)`;
        content.style.opacity = String(1 - ratio * 0.6);
      }

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  /* ---------- 6. CARD 3D TILT ---------- */
  function initTilt() {
    if (prefersReduced || isTouch) return;

    const cards = document.querySelectorAll('.fv-cat-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rx = ((y - cy) / cy) * -6;
        const ry = ((x - cx) / cx) * 6;
        card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        card.style.transformStyle = 'preserve-3d';
        card.style.transition = 'transform 120ms ease-out';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1)';
      });
    });
  }

  /* ---------- 7. LAZY LOAD BACKGROUNDS ---------- */
  function initLazyBackgrounds() {
    const lazyElements = document.querySelectorAll('.fv-lazy-bg[data-src]');
    if (!lazyElements.length) return;

    // Fallback for older browsers
    if (!('IntersectionObserver' in window)) {
      lazyElements.forEach(el => {
        el.style.backgroundImage = `url('${el.dataset.src}')`;
        el.removeAttribute('data-src');
        el.classList.remove('fv-lazy-bg');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const src = el.dataset.src;
            if (src) {
              el.style.backgroundImage = `url('${src}')`;
              el.removeAttribute('data-src');
              el.classList.remove('fv-lazy-bg');
            }
            observer.unobserve(el);
          }
        });
      },
      { rootMargin: '300px' }
    );

    lazyElements.forEach(el => observer.observe(el));
  }

  /* ---------- 8. ROUTE TRANSITION HOOK ---------- */
  function initRouteTransitions() {
    const view = document.getElementById('view');
    if (!view) return;

    window.addEventListener('hashchange', () => {
      view.classList.add('fv-leaving');
      setTimeout(() => view.classList.remove('fv-leaving'), 180);
    });
  }

  /* ---------- RE-INIT ---------- */
  function reinitAll() {
    initReveal();
    initHeroParallax();
    initTilt();
    if (window.FV && window.FV.initParticles) window.FV.initParticles();

    document.querySelectorAll('.fv-stat strong').forEach(s => delete s.dataset.animated);
    initCounters();

    // ✅ Lazy load backgrounds
    initLazyBackgrounds();
  }

  window.FV = window.FV || {};
  window.FV.reinitAnimations = reinitAll;

  /* ---------- INIT ---------- */
  function init() {
    initProgressBar();
    initCursorGlow();
    initRouteTransitions();
    setTimeout(reinitAll, 80);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('hashchange', () => {
    setTimeout(reinitAll, 120);
  });
})();