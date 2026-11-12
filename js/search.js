/* ============================================================
   FANDOMVERSE — search.js
   Global search: live dropdown + full results page
   ============================================================ */

(function () {
  'use strict';

  window.FV = window.FV || {};

  const searchInput = document.getElementById('searchInput');
  const searchBar = document.getElementById('searchBar');
  if (!searchInput) return;

  // Build dropdown container inside search bar
  let dropdown = document.getElementById('searchDropdown');
  if (!dropdown) {
    dropdown = document.createElement('div');
    dropdown.id = 'searchDropdown';
    dropdown.className = 'fv-search-dropdown';
    searchBar.appendChild(dropdown);
  }

  let debounceTimer = null;

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function getData() {
    return (window.FV && window.FV.DATA) || {};
  }

  /* ---------- Search engine ---------- */
  function searchAll(query) {
    const q = String(query || '').toLowerCase().trim();
    if (q.length < 2) return [];

    const data = getData();
    const results = [];

    // Categories
    (data.categories || []).forEach(c => {
      const hay = [c.name, c.tagline, c.description].join(' ').toLowerCase();
      if (hay.includes(q)) {
        results.push({
          type: 'category',
          typeLabel: 'Category',
          title: c.name,
          subtitle: c.tagline || c.description || '',
          href: `#/${c.key}`,
          badge: 'Category',
        });
      }
    });

    // Articles
    (data.articles || []).forEach(a => {
      const hay = [a.title, a.excerpt, a.content, a.author].join(' ').toLowerCase();
      if (hay.includes(q)) {
        results.push({
          type: 'articles',
          typeLabel: 'Article',
          title: a.title,
          subtitle: a.excerpt || '',
          href: `#/article/${a.id}`,
          badge: a.category || 'Article',
        });
      }
    });

    // Characters
    (data.characters || []).forEach(c => {
      const hay = [c.name, c.series, (c.traits || []).join(' '), c.biography].join(' ').toLowerCase();
      if (hay.includes(q)) {
        results.push({
          type: 'characters',
          typeLabel: 'Character',
          title: c.name,
          subtitle: c.series || '',
          href: `#/character/${c.id}`,
          badge: c.category || 'Character',
        });
      }
    });

    // Events
    (data.events || []).forEach(e => {
      const hay = [e.name, e.description, e.location].join(' ').toLowerCase();
      if (hay.includes(q)) {
        results.push({
          type: 'events',
          typeLabel: 'Event',
          title: e.name,
          subtitle: `${e.date || ''} • ${e.location || ''}`,
          href: `#/event/${e.id}`,
          badge: e.category || 'Event',
        });
      }
    });

    // Trailers
    (data.trailers || []).forEach(t => {
      const hay = [t.title, t.description, t.type].join(' ').toLowerCase();
      if (hay.includes(q)) {
        results.push({
          type: 'videos',
          typeLabel: 'Video',
          title: t.title,
          subtitle: `${t.duration || ''} • ${t.type || ''}`,
          href: null,
          trailerId: t.id,
          badge: t.category || 'Trailer',
        });
      }
    });

    // Merchandise
    (data.merchandise || []).forEach(m => {
      const hay = [m.name, m.description, m.category].join(' ').toLowerCase();
      if (hay.includes(q)) {
        results.push({
          type: 'merchandise',
          typeLabel: 'Merch',
          title: m.name,
          subtitle: m.priceRange || `$${(m.price || 0).toFixed(2)}`,
          href: null,
          merchId: m.id,
          badge: m.category || 'Merch',
        });
      }
    });

    return results;
  }

  /* ---------- Dropdown rendering ---------- */
  function renderDropdown(query, results) {
    if (!query || query.length < 2) {
      dropdown.classList.remove('open');
      dropdown.innerHTML = '';
      return;
    }

    if (!results.length) {
      dropdown.innerHTML = `
        <div class="fv-search-empty">
          <i class="fa-solid fa-magnifying-glass"></i>
          <p>No results for "<strong>${esc(query)}</strong>"</p>
          <span>Try: Naruto, Batman, gaming, K-Pop</span>
        </div>
      `;
      dropdown.classList.add('open');
      return;
    }

    const shown = results.slice(0, 8);
    const remaining = results.length - shown.length;

    dropdown.innerHTML = `
      <ul class="fv-search-list">
        ${shown.map(r => `
          <li>
            <a href="${r.href || '#'}" class="fv-search-item"
               data-type="${esc(r.type)}"
               data-href="${r.href ? esc(r.href) : ''}"
               data-trailer="${esc(r.trailerId || '')}"
               data-merch="${esc(r.merchId || '')}">
              <span class="fv-search-type-badge">${esc(r.typeLabel)}</span>
              <span class="fv-search-info">
                <strong>${esc(r.title)}</strong>
                <span>${esc(r.subtitle)}</span>
              </span>
              <i class="fa-solid fa-arrow-right fv-search-arrow"></i>
            </a>
          </li>
        `).join('')}
      </ul>
      <div class="fv-search-footer">
        <button type="button" class="fv-search-viewall" id="searchViewAll">
          View all ${results.length} result${results.length === 1 ? '' : 's'} for "${esc(query)}"
          <i class="fa-solid fa-arrow-right"></i>
        </button>
        ${remaining > 0 ? `<span class="fv-search-more">+${remaining} more</span>` : ''}
      </div>
    `;
    dropdown.classList.add('open');

    // Wire click handlers
    dropdown.querySelectorAll('.fv-search-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const href = item.dataset.href;
        const trailerId = item.dataset.trailer;
        const merchId = item.dataset.merch;

        closeDropdown();
        searchInput.value = '';

        if (href) {
          window.location.hash = href.replace(/^#/, '');
        } else if (trailerId) {
          const t = (getData().trailers || []).find(x => x.id === trailerId);
          if (t && window.FV.openTrailer) window.FV.openTrailer(t);
        } else if (merchId) {
          // Navigate to merch page
          window.location.hash = '/merchandise';
        }
      });
    });

    // "View all results" button
    const viewAllBtn = dropdown.querySelector('#searchViewAll');
    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', () => {
        closeDropdown();
        window.location.hash = `/search/${encodeURIComponent(query)}`;
      });
    }
  }

  function closeDropdown() {
    dropdown.classList.remove('open');
  }

  /* ---------- Full results page template ---------- */
  window.FV.searchResultsTemplate = function (query, allData) {
    const q = String(query || '').trim();
    const results = searchAll(q);

    return `
      <div class="fv-breadcrumbs container-fv">
        <a href="#/"><i class="fa-solid fa-house"></i> Home</a>
        <i class="fa-solid fa-chevron-right"></i>
        <span>Search</span>
      </div>

      <section class="fv-search-hero">
        <div class="container-fv">
          <span class="fv-section-kicker">Search Results</span>
          <h1 class="fv-search-title">
            <i class="fa-solid fa-magnifying-glass"></i> "${esc(q)}"
          </h1>
          <p class="fv-search-count">
            ${results.length} result${results.length === 1 ? '' : 's'} found across FandomVerse
          </p>
        </div>
      </section>

      <section class="fv-search-page-controls container-fv">
        <div class="fv-filters" id="searchFilters">
          <button class="fv-filter-chip active" data-filter="all">All (${results.length})</button>
          <button class="fv-filter-chip" data-filter="articles">Articles (${results.filter(r => r.type === 'articles').length})</button>
          <button class="fv-filter-chip" data-filter="characters">Characters (${results.filter(r => r.type === 'characters').length})</button>
          <button class="fv-filter-chip" data-filter="events">Events (${results.filter(r => r.type === 'events').length})</button>
          <button class="fv-filter-chip" data-filter="videos">Videos (${results.filter(r => r.type === 'videos').length})</button>
          <button class="fv-filter-chip" data-filter="merchandise">Merch (${results.filter(r => r.type === 'merchandise').length})</button>
          <button class="fv-filter-chip" data-filter="category">Categories (${results.filter(r => r.type === 'category').length})</button>
        </div>
      </section>

      <section class="fv-section fv-search-page-content">
        <div class="container-fv">
          <div class="fv-search-results-list" id="searchResultsList"></div>
          <div class="fv-empty-state hidden" id="searchEmpty">
            <i class="fa-solid fa-inbox"></i>
            <h3>Nothing here yet</h3>
            <p>Try a different filter above.</p>
          </div>
        </div>
      </section>
    `;
  };

  /* ---------- Wire up full results page ---------- */
  window.FV.wireSearchResults = function (query) {
    const q = String(query || '').trim();
    const results = searchAll(q);

    const list = document.getElementById('searchResultsList');
    const empty = document.getElementById('searchEmpty');
    const filterChips = document.querySelectorAll('#searchFilters .fv-filter-chip');
    if (!list) return;

    let filter = 'all';

    function cardHtml(r) {
      // Non-clickable content types (video/merch) get a button wrapper
      const tag = r.href ? 'a' : 'button';
      const extraAttrs = r.href
        ? ` href="${esc(r.href)}"`
        : ` type="button" data-trailer="${esc(r.trailerId || '')}" data-merch="${esc(r.merchId || '')}"`;

      return `
        <${tag} class="fv-search-result-row" data-type="${esc(r.type)}"${extraAttrs}>
          <span class="fv-search-result-badge fv-search-badge-${esc(r.type)}">
            ${esc(r.typeLabel)}
          </span>
          <span class="fv-search-result-info">
            <strong>${esc(r.title)}</strong>
            <span>${esc(r.subtitle)}</span>
          </span>
          <i class="fa-solid fa-arrow-right fv-search-arrow"></i>
        </${tag}>
      `;
    }

    function apply() {
      const items = filter === 'all' ? results : results.filter(r => r.type === filter);

      if (!items.length) {
        list.innerHTML = '';
        empty.classList.remove('hidden');
        return;
      }
      empty.classList.add('hidden');
      list.innerHTML = items.map(cardHtml).join('');

      // Wire click handlers
      list.querySelectorAll('.fv-search-result-row').forEach(el => {
        el.addEventListener('click', (e) => {
          const trailerId = el.dataset.trailer;
          const merchId = el.dataset.merch;
          const href = el.getAttribute('href');

          if (href) return; // real links handled by browser

          e.preventDefault();
          if (trailerId) {
            const t = (getData().trailers || []).find(x => x.id === trailerId);
            if (t && window.FV.openTrailer) window.FV.openTrailer(t);
          } else if (merchId) {
            window.location.hash = '/merchandise';
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

  /* ---------- Input handlers ---------- */
  function handleInput() {
    const q = searchInput.value.trim();
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const results = searchAll(q);
      renderDropdown(q, results);
    }, 180);
  }

  searchInput.addEventListener('input', handleInput);

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDropdown();
      searchInput.blur();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const q = searchInput.value.trim();
      if (q.length >= 2) {
        closeDropdown();
        window.location.hash = `/search/${encodeURIComponent(q)}`;
      }
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchBar.contains(e.target)) closeDropdown();
  });

  // Reopen dropdown with previous query when reopening search bar
  const toggle = document.getElementById('searchToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      setTimeout(() => {
        if (searchInput.value.length >= 2) handleInput();
      }, 250);
    });
  }

  // Expose searchAll so router can use it
  window.FV.searchAll = searchAll;

  console.log('[FandomVerse] search.js loaded');
})();