/* ============================================================
   FANDOMVERSE — trailers.js
   Dedicated Trailers Page
   ============================================================ */

(function () {
  'use strict';

  window.FV = window.FV || {};

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  /* ---------- Page template ---------- */
  window.FV.trailersPageTemplate = function (allData) {
    const trailers = allData.trailers || [];
    
    // Get unique categories present in trailers
    const catKeys = ['all', ...new Set(trailers.map(t => t.category))];

    return `
      <!-- Hero -->
      <section class="fv-merch-hero">
        <div class="fv-merch-hero-bg" style="background-image:url('images/trailers-bg.jpg');"></div>
        <div class="fv-merch-hero-overlay"></div>
        <div class="fv-merch-hero-content container-fv">
          <div class="fv-hub-icon"><i class="fa-solid fa-video"></i></div>
          <h1 class="fv-hub-title">Trailers & Videos</h1>
          <p class="fv-hub-desc">
            Watch the latest trailers, teasers, and fan content across all fandoms.
          </p>
          <div class="fv-merch-hero-stats">
            <div><strong>${trailers.length}</strong><span>Videos</span></div>
            <div><strong>${catKeys.length - 1}</strong><span>Categories</span></div>
            <div><strong>HD</strong><span>Quality</span></div>
          </div>
        </div>
      </section>

      <!-- Controls -->
      <section class="fv-hub-controls container-fv">
        <div class="fv-filters" id="trailersFilters">
          ${catKeys.map((k, i) => {
            const label = k === 'all' ? 'All' : k.charAt(0).toUpperCase() + k.slice(1).replace('-', ' ');
            return `<button class="fv-filter-chip ${i === 0 ? 'active' : ''}" data-filter="${k}">${esc(label)}</button>`;
          }).join('')}
        </div>
      </section>

      <!-- Grid -->
      <section class="fv-section fv-hub-content">
        <div class="container-fv">
          <div class="fv-content-grid" id="trailersGrid"></div>
          <div class="fv-empty-state hidden" id="trailersEmpty">
            <i class="fa-solid fa-video-slash"></i>
            <h3>No videos in this category</h3>
            <p>Try another filter above.</p>
          </div>
        </div>
      </section>
    `;
  };

  /* ---------- Wire filters ---------- */
  window.FV.wireTrailersPage = function () {
    const grid = document.getElementById('trailersGrid');
    const empty = document.getElementById('trailersEmpty');
    const filterChips = document.querySelectorAll('#trailersFilters .fv-filter-chip');
    if (!grid) return;

    const trailers = (window.FV.DATA?.trailers) || [];
    let filter = 'all';

    function cardHtml(t) {
      return `
        <article class="fv-content-card" data-trailer-id="${esc(t.id)}" style="cursor:pointer;">
          <div class="fv-card-img" style="background-image:url('${esc(t.thumbnail || '')}')">
            <span class="badge-fv badge-fv-amber">${esc(t.category)}</span>
            <div class="fv-play-btn"><i class="fa-solid fa-play"></i></div>
          </div>
          <div class="fv-card-body">
            <h4>${esc(t.title)}</h4>
            <p>${esc(t.description || '')}</p>
            <span class="fv-meta"><i class="fa-regular fa-clock"></i> ${esc(t.duration)} • ${esc(t.type)}</span>
          </div>
        </article>
      `;
    }

    function apply() {
      let items = filter === 'all' ? trailers : trailers.filter(t => t.category === filter);

      if (!items.length) {
        grid.innerHTML = '';
        empty.classList.remove('hidden');
        return;
      }
      empty.classList.add('hidden');
      grid.innerHTML = items.map(cardHtml).join('');

      // Wire trailer clicks to open modal
      grid.querySelectorAll('[data-trailer-id]').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.dataset.trailerId;
          const trailer = trailers.find(t => t.id === id);
          if (trailer && window.FV.openTrailer) {
            window.FV.openTrailer(trailer);
          }
        });
      });
    }

    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        filter = chip.dataset.filter;
        apply();
      });
    });

    apply();
  };
})();