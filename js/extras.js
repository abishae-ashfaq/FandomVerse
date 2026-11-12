/* ============================================================
   FANDOMVERSE — extras.js
   About Us page, Login/Signup modals, Clock, Visitor counter,
   Back-to-top button
   ============================================================ */

(function () {
  'use strict';

  window.FV = window.FV || {};

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  /* ============================================================
     ABOUT US TEMPLATE
     ============================================================ */
  window.FV.aboutTemplate = function () {
    return `
      <section class="fv-about-hero">
        <div class="fv-about-hero-bg"></div>
        <div class="fv-about-hero-overlay"></div>
        <div class="fv-about-hero-content container-fv">
          <span class="fv-section-kicker">Our Story</span>
          <h1 class="fv-hub-title">About Us</h1>
          <p class="fv-hub-desc">
            FandomVerse is a universe built by fans, for fans — a home for every story, every hero, every beat drop.
          </p>
        </div>
      </section>

      <!-- Mission -->
      <section class="fv-section">
        <div class="container-fv">
          <div class="fv-about-grid">
            <div class="fv-about-block">
              <div class="fv-about-icon"><i class="fa-solid fa-bullseye"></i></div>
              <h3>Our Mission</h3>
              <p>
                To create a single, beautiful space where anime fans, gamers, movie lovers, K-Pop stans, comic readers
                and manga collectors can explore, discover and celebrate what they love — without the noise.
              </p>
            </div>
            <div class="fv-about-block">
              <div class="fv-about-icon"><i class="fa-solid fa-eye"></i></div>
              <h3>Our Vision</h3>
              <p>
                A global community where fandom is not just consumed but curated, shared and celebrated.
                FandomVerse aims to become the go-to hub for everything pop-culture — trusted by fans and creators alike.
              </p>
            </div>
            <div class="fv-about-block">
              <div class="fv-about-icon"><i class="fa-solid fa-heart"></i></div>
              <h3>Our Values</h3>
              <p>
                Passion. Authenticity. Community. We built FandomVerse because we wanted a place that felt like home —
                not algorithm-driven, but human-driven.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- What you'll find -->
      <section class="fv-section fv-section-alt">
        <div class="container-fv">
          <div class="fv-section-head">
            <span class="fv-section-kicker">Inside the verse</span>
            <h2 class="fv-section-title">What You'll Find Here</h2>
            <p class="fv-section-sub">Everything a fan could ask for — in one place.</p>
          </div>
          <div class="fv-about-features">
            ${[
              { icon: 'fa-tv',             title: '7 Category Hubs',    text: 'Anime · Gaming · Movies · TV Shows · K-Pop · Comics · Manga' },
              { icon: 'fa-user-group',     title: '35+ Characters',     text: 'Deep-dive profiles of iconic characters across every universe' },
              { icon: 'fa-calendar',       title: '21+ Events',         text: 'Conventions, tournaments, premieres and fan meetups' },
              { icon: 'fa-video',          title: 'Videos & Trailers',  text: 'Watch the latest trailers and content — right in the browser' },
              { icon: 'fa-newspaper',      title: 'Curated Articles',   text: 'Long-form reads written by fans, for fans' },
              { icon: 'fa-bag-shopping',   title: 'Merch Store',        text: 'Browse and buy collectibles, apparel, and more' },
            ].map(f => `
              <div class="fv-about-feature">
                <div class="fv-about-feature-icon"><i class="fa-solid ${f.icon}"></i></div>
                <h4>${esc(f.title)}</h4>
                <p>${esc(f.text)}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Closing -->
      <section class="fv-section">
        <div class="container-fv fv-about-closing">
          <h2 class="fv-section-title">Built with ❤️ by fans</h2>
          <p class="fv-about-lead">
            FandomVerse started as a simple idea: <em>"What if there was one place where all fandoms lived together?"</em>
            Today, it's that place — and it keeps growing, thanks to people like you.
          </p>
          <div class="fv-about-cta">
            <a href="#/anime" class="btn-fv btn-fv-primary">
              <i class="fa-solid fa-compass"></i> Explore the Verse
            </a>
            <a href="#/contact" class="btn-fv btn-fv-ghost">
              <i class="fa-solid fa-envelope"></i> Contact Us
            </a>
          </div>
        </div>
      </section>
    `;
  };

  /* ============================================================
     LOGIN / SIGNUP MODAL
     ============================================================ */
  let authModal = null;

  function ensureAuthModal() {
    if (authModal) return authModal;

    authModal = document.createElement('div');
    authModal.id = 'fvAuthModal';
    authModal.className = 'fv-modal fv-auth-modal';
    document.body.appendChild(authModal);

    return authModal;
  }

  function openAuthModal(mode) {
    const modal = ensureAuthModal();

    const isLogin = mode !== 'signup';

    modal.innerHTML = `
      <div class="fv-modal-backdrop" data-close></div>
      <div class="fv-modal-content fv-auth-content" role="dialog" aria-label="${isLogin ? 'Login' : 'Sign up'}">
        <button class="fv-modal-close" data-close aria-label="Close">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="fv-auth-inner">
          <div class="fv-auth-icon">
            <i class="fa-solid ${isLogin ? 'fa-user' : 'fa-user-plus'}"></i>
          </div>
          <h2 class="fv-auth-title">${isLogin ? 'Welcome Back' : 'Join the Verse'}</h2>
          <p class="fv-auth-sub">
            ${isLogin
              ? 'Log in to continue your fandom journey.'
              : 'Create an account and start exploring today.'}
          </p>

          <div class="fv-auth-tabs">
            <button type="button" class="fv-auth-tab ${isLogin ? 'active' : ''}" data-tab="login">Login</button>
            <button type="button" class="fv-auth-tab ${!isLogin ? 'active' : ''}" data-tab="signup">Sign Up</button>
          </div>

          <form class="fv-auth-form" id="authForm">
            ${!isLogin ? `
              <div class="fv-field">
                <label for="authName">Full Name</label>
                <input type="text" id="authName" placeholder="Jane Doe" required />
              </div>
            ` : ''}

            <div class="fv-field">
              <label for="authEmail">Email</label>
              <input type="email" id="authEmail" placeholder="you@example.com" required />
            </div>

            <div class="fv-field">
              <label for="authPassword">Password</label>
              <input type="password" id="authPassword" placeholder="••••••••" required minlength="6" />
            </div>

            <button type="submit" class="btn-fv btn-fv-primary" style="width:100%;justify-content:center;margin-top:0.5rem;">
              <i class="fa-solid ${isLogin ? 'fa-right-to-bracket' : 'fa-user-plus'}"></i>
              ${isLogin ? 'Log In' : 'Create Account'}
            </button>
          </form>

          <p class="fv-auth-note">
            <i class="fa-solid fa-lock"></i>
            This is a demo — no real authentication is performed.
          </p>
        </div>
      </div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Close handlers
    modal.querySelectorAll('[data-close]').forEach(el => {
      el.addEventListener('click', closeAuthModal);
    });

    // Tab switching
    modal.querySelectorAll('.fv-auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        openAuthModal(tab.dataset.tab);
      });
    });

    // Form submit
    const form = modal.querySelector('#authForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = modal.querySelector('#authName')?.value.trim() || '';
      const email = modal.querySelector('#authEmail').value.trim();

      closeAuthModal();

      // Success feedback
      showToast(isLogin
        ? `Welcome back, ${email.split('@')[0]}!`
        : `Account created${name ? ', ' + name : ''}! Welcome to FandomVerse.`);
    });
  }

  function closeAuthModal() {
    const modal = document.getElementById('fvAuthModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { if (modal.parentNode) modal.remove(); authModal = null; }, 300);
  }

  // Wire navbar login button + mobile menu
  function wireLoginButtons() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openAuthModal('login');
      });
    }

    // Also wire any mobile menu "Login" link if present
    document.querySelectorAll('[data-open-auth]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openAuthModal(el.dataset.openAuth || 'login');
      });
    });
  }

  // Wire About route — matches #/about link
  window.FV.wireAboutPage = function () {
    // Nothing to wire inside About — it's static
  };

  /* ============================================================
     REAL-TIME CLOCK (footer)
     ============================================================ */
  function initClock() {
    const el = document.getElementById('fvFooterClock');
    if (!el) return;

    function tick() {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
      });
      const date = now.toLocaleDateString('en-US', {
        weekday: 'long', month: 'short', day: 'numeric', year: 'numeric',
      });
      el.innerHTML = `
        <i class="fa-regular fa-clock"></i>
        <span>${date} · ${time}</span>
      `;
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ============================================================
     VISITOR COUNTER (footer)
     ============================================================ */
  function initVisitorCounter() {
    const el = document.getElementById('fvVisitorCounter');
    if (!el) return;

    const KEY = 'fv_visitor_count_v1';
    const SESSION_KEY = 'fv_visitor_session_v1';

    let count = 0;
    try {
      count = parseInt(localStorage.getItem(KEY) || '0', 10);
    } catch { count = 0; }

    // Only increment once per session
    const sessionCounted = sessionStorage.getItem(SESSION_KEY);
    if (!sessionCounted) {
      count += 1;
      try {
        localStorage.setItem(KEY, String(count));
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {}
    }

    // Add a random base to make it look populated (e.g. +1234)
    const display = count + 1234;

    el.innerHTML = `
      <i class="fa-solid fa-eye"></i>
      <span>You are visitor <strong>#${display.toLocaleString()}</strong></span>
    `;
  }

  /* ============================================================
     BACK TO TOP BUTTON
     ============================================================ */
  function initBackToTop() {
    let btn = document.getElementById('fvBackTop');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'fvBackTop';
      btn.className = 'fv-back-top';
      btn.setAttribute('aria-label', 'Back to top');
      btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
      document.body.appendChild(btn);
    }

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function toggle() {
      if (window.scrollY > 400) btn.classList.add('visible');
      else btn.classList.remove('visible');
    }

    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
  }

  /* ---------- Toast ---------- */
  let toastTimer = null;
  function showToast(msg) {
    let toast = document.getElementById('fvToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'fvToast';
      toast.className = 'fv-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    wireLoginButtons();
    initClock();
    initVisitorCounter();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('[FandomVerse] extras.js loaded');
})();