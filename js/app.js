/* ============================================================
   FANDOMVERSE — app.js
   Global init:
   - Navbar solid-on-scroll
   - Search bar toggle (open/close)
   - Mobile menu drawer
   - Chatbot FAB (visual feedback placeholder)
   - Login button (placeholder)
   - Footer year
   ============================================================ */

(function () {
  'use strict';

  console.log('[FandomVerse] app.js loaded');

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar: solid on scroll ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 30) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Search bar toggle ---------- */
  const searchToggle = document.getElementById('searchToggle');
  const searchBar    = document.getElementById('searchBar');
  const searchClose  = document.getElementById('searchClose');
  const searchInput  = document.getElementById('searchInput');

  console.log('[FandomVerse] Search elements found:', {
    searchToggle: !!searchToggle,
    searchBar:    !!searchBar,
    searchClose:  !!searchClose,
    searchInput:  !!searchInput,
  });

  if (searchToggle && searchBar) {
    searchToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('[FandomVerse] Search toggle clicked');
      searchBar.classList.toggle('open');
      if (searchBar.classList.contains('open') && searchInput) {
        setTimeout(() => searchInput.focus(), 250);
      }
    });
  } else {
    console.warn('[FandomVerse] Search elements missing — check IDs in index.html');
  }

  if (searchClose && searchBar) {
    searchClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchBar.classList.remove('open');
    });
  }

  // ESC key closes search
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchBar) searchBar.classList.remove('open');
  });

  /* ---------- Mobile menu drawer ---------- */
  const hamburger      = document.getElementById('hamburger');
  const mobileMenu     = document.getElementById('mobileMenu');
  const mobileBackdrop = document.getElementById('mobileBackdrop');

  const closeMobile = () => {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (mobileBackdrop) mobileBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  const openMobile = () => {
    if (mobileMenu) mobileMenu.classList.add('open');
    if (mobileBackdrop) mobileBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  if (hamburger && mobileMenu && mobileBackdrop) {
    hamburger.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) closeMobile();
      else openMobile();
    });
    mobileBackdrop.addEventListener('click', closeMobile);
    mobileMenu.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', closeMobile)
    );
  }

  /* ---------- Chatbot FAB (placeholder until Step 12) ---------- */
  const fab = document.getElementById('chatbotFab');
  if (fab) {
    fab.addEventListener('click', () => {
      console.log('[FandomVerse] Chatbot coming in Step 12');
      // Visual feedback: quick bounce so user knows it registered
      fab.animate(
        [
          { transform: 'scale(1) rotate(0deg)' },
          { transform: 'scale(1.15) rotate(-6deg)' },
          { transform: 'scale(1) rotate(0deg)' },
        ],
        { duration: 300, easing: 'ease-out' }
      );
    });
  }

  /* ---------- Login button (placeholder until Step 13) ---------- */
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      console.log('[FandomVerse] Login modal coming in Step 13');
    });
  }

  /* ---------- Expose small API for router ---------- */
  window.FV = window.FV || {};
  window.FV.closeMobile = closeMobile;
})();