/* ============================================================
   FANDOMVERSE — modal.js
   Trailer modal: YouTube embed overlay
   ============================================================ */

(function () {
  'use strict';

  window.FV = window.FV || {};

  let modalEl = null;
  let iframeEl = null;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function ensureModal() {
    if (modalEl) return modalEl;

    modalEl = document.createElement('div');
    modalEl.id = 'fv-trailer-modal';
    modalEl.className = 'fv-modal';
    modalEl.innerHTML = `
      <div class="fv-modal-backdrop"></div>
      <div class="fv-modal-content" role="dialog" aria-modal="true" aria-label="Trailer">
        <button class="fv-modal-close" aria-label="Close">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="fv-modal-video">
          <iframe
            id="fv-modal-iframe"
            src=""
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        <div class="fv-modal-info">
          <h3 class="fv-modal-title" id="fv-modal-title"></h3>
          <p class="fv-modal-desc" id="fv-modal-desc"></p>
          <div class="fv-modal-meta" id="fv-modal-meta"></div>
        </div>
      </div>
    `;
    document.body.appendChild(modalEl);

    iframeEl = modalEl.querySelector('#fv-modal-iframe');

    // Close handlers
    modalEl.querySelector('.fv-modal-close').addEventListener('click', closeModal);
    modalEl.querySelector('.fv-modal-backdrop').addEventListener('click', closeModal);

    return modalEl;
  }

  function openTrailer(trailer) {
    ensureModal();

    const id = trailer.youtubeId || 'dQw4w9WgXcQ';
    iframeEl.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;

    modalEl.querySelector('#fv-modal-title').textContent = trailer.title || '';
    modalEl.querySelector('#fv-modal-desc').textContent = trailer.description || '';

    const meta = modalEl.querySelector('#fv-modal-meta');
    const items = [];
    if (trailer.category) items.push(`<span class="badge-fv badge-fv-primary">${esc(trailer.category)}</span>`);
    if (trailer.type) items.push(`<span class="badge-fv badge-fv-amber">${esc(trailer.type)}</span>`);
    if (trailer.duration) items.push(`<span class="fv-modal-duration"><i class="fa-regular fa-clock"></i> ${esc(trailer.duration)}</span>`);
    meta.innerHTML = items.join('');

    document.body.style.overflow = 'hidden';
    modalEl.classList.add('open');

    console.log('[FandomVerse] Opening trailer:', trailer.title);
  }

  function closeModal() {
    if (!modalEl) return;
    iframeEl.src = ''; // stops playback
    modalEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ESC closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalEl && modalEl.classList.contains('open')) {
      closeModal();
    }
  });

  // Expose globally
  window.FV.openTrailer = openTrailer;
  window.FV.closeTrailerModal = closeModal;

  console.log('[FandomVerse] modal.js loaded');
})();