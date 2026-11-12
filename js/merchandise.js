/* ============================================================
   FANDOMVERSE — merchandise.js
   Merchandise page: full product grid + add to cart
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
  window.FV.merchandiseTemplate = function (allData) {
    const products = allData.merchandise || [];
    const categories = allData.categories || [];

    // Which category chips to show (unique categories in products)
    const catKeys = ['all', ...new Set(products.map(p => p.category))];

    return `
      <!-- Hero -->
      <section class="fv-merch-hero">
        <div class="fv-merch-hero-bg"></div>
        <div class="fv-merch-hero-overlay"></div>
        <div class="fv-merch-hero-content container-fv">
          <div class="fv-hub-icon"><i class="fa-solid fa-bag-shopping"></i></div>
          <h1 class="fv-hub-title">Merchandise</h1>
          <p class="fv-hub-desc">
            Wear your fandom. Premium apparel, collectibles, and gifts from every universe.
          </p>
          <div class="fv-merch-hero-stats">
            <div><strong>${products.length}+</strong><span>Products</span></div>
            <div><strong>${categories.length}</strong><span>Categories</span></div>
            <div><strong>Free</strong><span>On orders $50+</span></div>
          </div>
        </div>
      </section>

      <!-- Controls -->
      <section class="fv-hub-controls container-fv">
        <div class="fv-filters" id="merchFilters">
          ${catKeys.map((k, i) => {
            const label = k === 'all' ? 'All' : (categories.find(c => c.key === k)?.name || k);
            return `<button class="fv-filter-chip ${i === 0 ? 'active' : ''}" data-filter="${k}">${esc(label)}</button>`;
          }).join('')}
        </div>
        <div class="fv-sort">
          <label for="merchSort">Sort:</label>
          <select id="merchSort">
            <option value="featured">Featured</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
            <option value="az">A - Z</option>
          </select>
        </div>
      </section>

      <!-- Grid -->
      <section class="fv-section fv-hub-content">
        <div class="container-fv">
          <div class="fv-merch-grid" id="merchGrid"></div>
          <div class="fv-empty-state hidden" id="merchEmpty">
            <i class="fa-solid fa-store-slash"></i>
            <h3>No products in this category</h3>
            <p>Try another filter above.</p>
          </div>
        </div>
      </section>
    `;
  };

  /* ---------- Wire filters + sort ---------- */
  window.FV.wireMerchandise = function () {
    const grid = document.getElementById('merchGrid');
    const empty = document.getElementById('merchEmpty');
    const filterChips = document.querySelectorAll('#merchFilters .fv-filter-chip');
    const sortSelect = document.getElementById('merchSort');
    if (!grid) return;

    const products = (window.FV.DATA?.merchandise) || [];
    let filter = 'all';
    let sort = 'featured';

    function cardHtml(p) {
      return `
        <article class="fv-merch-card" data-id="${esc(p.id)}">
          <div class="fv-merch-img" style="background-image:url('${esc(p.image || '')}')">
            <span class="badge-fv badge-fv-primary">${esc(p.category)}</span>
          </div>
          <div class="fv-merch-body">
            <h4>${esc(p.name)}</h4>
            <p>${esc(p.description || '')}</p>
            <div class="fv-merch-footer">
              <span class="fv-merch-price">$${(p.price || 0).toFixed(2)}</span>
              <button type="button" class="fv-add-cart" data-add="${esc(p.id)}">
                <i class="fa-solid fa-cart-plus"></i> Add to Cart
              </button>
            </div>
          </div>
        </article>
      `;
    }

    function apply() {
      let items = filter === 'all' ? products.slice() : products.filter(p => p.category === filter);

      if (sort === 'low') items.sort((a, b) => (a.price || 0) - (b.price || 0));
      else if (sort === 'high') items.sort((a, b) => (b.price || 0) - (a.price || 0));
      else if (sort === 'az') items.sort((a, b) => a.name.localeCompare(b.name));

      if (!items.length) {
        grid.innerHTML = '';
        empty.classList.remove('hidden');
        return;
      }
      empty.classList.add('hidden');
      grid.innerHTML = items.map(cardHtml).join('');

      // Wire add-to-cart buttons
      grid.querySelectorAll('[data-add]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.dataset.add;
          const product = products.find(p => p.id === id);
          if (product && window.FV.addToCart) {
            window.FV.addToCart(product);
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

    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        sort = sortSelect.value;
        apply();
      });
    }

    apply();
  };
})();