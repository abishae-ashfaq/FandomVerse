/* ============================================================
   FANDOMVERSE — particles.js
   Lightweight floating particle field (canvas)
   Renders behind the hero section
   ============================================================ */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let canvas, ctx, particles = [], animationId;
  let width = 0, height = 0;

  const COLORS = [
    'rgba(255, 59, 92, 0.7)',   // ember pink
    'rgba(255, 183, 3, 0.6)',   // amber
    'rgba(0, 217, 192, 0.55)',  // teal
    'rgba(255, 255, 255, 0.5)', // white
  ];

  function init() {
    const hero = document.querySelector('.fv-hero');
    if (!hero) return;

    canvas = document.createElement('canvas');
    canvas.className = 'fv-particles';
    hero.insertBefore(canvas, hero.firstChild);

    ctx = canvas.getContext('2d');
    resize();

       const count = Math.min(30, Math.floor((width * height) / 35000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 0.6,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        pulse: Math.random() * Math.PI * 2,
      });
    }

    window.addEventListener('resize', resize);
    animate();
  }

  function resize() {
    if (!canvas) return;
    const hero = canvas.parentElement;
    width = hero.clientWidth;
    height = hero.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;

      // Wrap around edges
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      const alpha = 0.5 + Math.sin(p.pulse) * 0.3;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.fill();

      // Soft glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.globalAlpha = alpha * 0.15;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    animationId = requestAnimationFrame(animate);
  }

  // Re-init when route changes (canvas is recreated)
  window.FV = window.FV || {};
  window.FV.initParticles = () => {
    if (animationId) cancelAnimationFrame(animationId);
    init();
  };

  // Initial
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();