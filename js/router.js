/* ============================================================
   FANDOMVERSE — router.js
   Hash-based SPA router: Home, Category Hubs, Detail pages, Merchandise
   ============================================================ */

(function () {
  'use strict';

  const view = document.getElementById('view');

  const DATA = {
    categories: null,
    characters: null,
    articles: null,
    events: null,
    trailers: null,
    merchandise: null,
    galleries: null,
    chatbot: null,
  };

  const ROUTES = {
    home: { icon: 'fa-house', title: 'Home', tag: 'Welcome' },
    anime: { icon: 'fa-tv', title: 'Anime', tag: 'Category' },
    gaming: { icon: 'fa-gamepad', title: 'Gaming', tag: 'Category' },
    movies: { icon: 'fa-film', title: 'Movies', tag: 'Category' },
    'tv-shows': { icon: 'fa-tv', title: 'TV Shows', tag: 'Category' },
    'k-pop': { icon: 'fa-music', title: 'K-Pop', tag: 'Category' },
    comics: { icon: 'fa-book-open', title: 'Comics', tag: 'Category' },
    manga: { icon: 'fa-book', title: 'Manga', tag: 'Category' },
    trailers: { icon: 'fa-video', title: 'Trailers', tag: 'Coming Soon' },
    merchandise: { icon: 'fa-bag-shopping', title: 'Merchandise', tag: 'Shop' },
    bookmarks: { icon: 'fa-bookmark', title: 'My Bookmarks', tag: 'Saved' },
    about: { icon: 'fa-circle-info', title: 'About Us', tag: 'Coming Soon' },
    contact: { icon: 'fa-envelope', title: 'Contact Us', tag: 'Coming Soon' },
  };

  const CATEGORY_KEYS = ['anime', 'gaming', 'movies', 'tv-shows', 'k-pop', 'comics', 'manga'];

  function parseHash() {
    const raw = window.location.hash.replace(/^#\/?/, '').trim();
    if (!raw) return { route: 'home', params: [] };
    const parts = raw.split('/').filter(Boolean);
    return { route: parts[0], params: parts.slice(1) };
  }

  function getRoute() {
    const { route } = parseHash();
    if (ROUTES[route]) return route;
    if (['article', 'character', 'event', 'search'].includes(route)) return route;
    return 'home';
  }

   async function loadJSON(path) {
    try {
      // Cache in memory so it's not re-fetched
      if (!window.__FV_CACHE__) window.__FV_CACHE__ = {};
      if (window.__FV_CACHE__[path]) return window.__FV_CACHE__[path];

      const res = await fetch(path);
      if (!res.ok) throw new Error(`Failed: ${path}`);
      const data = await res.json();
      window.__FV_CACHE__[path] = data;
      return data;
    } catch (err) {
      console.error('[FandomVerse] JSON load error:', err);
      return null;
    }
  }

  async function ensureData() {
    if (DATA.categories) return;

    const [cats, chars, arts, evts, trls, mer, gals, bot] = await Promise.all([
      loadJSON('data/categories.json'),
      loadJSON('data/characters.json'),
      loadJSON('data/articles.json'),
      loadJSON('data/events.json'),
      loadJSON('data/trailers.json'),
      loadJSON('data/merchandise.json'),
      loadJSON('data/galleries.json'),
      loadJSON('data/chatbot.json'),
    ]);

    DATA.categories = cats?.categories || [];
    DATA.characters = chars?.characters || [];
    DATA.articles = arts?.articles || [];
    DATA.events = evts?.events || [];
    DATA.trailers = trls?.trailers || [];
    DATA.merchandise = mer?.merchandise || [];
    DATA.galleries = gals?.galleries || [];
    DATA.chatbot = bot?.chatbot || null;

    window.FV = window.FV || {};
    window.FV.DATA = DATA;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  /* ============================================================
     HOME TEMPLATE
     ============================================================ */
  function homeTemplate() {
    return `
      <section class="fv-hero">
        <div class="fv-hero-bg"></div>
        <div class="fv-hero-overlay"></div>
        <div class="fv-hero-content">
          <span class="fv-hero-kicker">Welcome to</span>
          <h1 class="fv-hero-title">FandomVerse</h1>
          <p class="fv-hero-tagline">
            Explore. Discover. Celebrate <span class="text-gradient">Your Fandom.</span>
          </p>
          <div class="fv-hero-actions">
            <a href="#/anime" class="btn-fv btn-fv-primary">
              <i class="fa-solid fa-play"></i> Explore Fandoms
            </a>
            <a href="#/merchandise" class="btn-fv btn-fv-ghost">
              <i class="fa-solid fa-bag-shopping"></i> Browse Merchandise
            </a>
          </div>
          <div class="fv-hero-stats">
            <div class="fv-stat"><strong>7</strong><span>Categories</span></div>
            <div class="fv-stat"><strong>35+</strong><span>Characters</span></div>
            <div class="fv-stat"><strong>21+</strong><span>Events</span></div>
            <div class="fv-stat"><strong>∞</strong><span>Fandoms</span></div>
          </div>
        </div>
      </section>

      <section class="fv-section">
        <div class="container-fv">
          <div class="fv-section-head reveal">
            <span class="fv-section-kicker">Browse by</span>
            <h2 class="fv-section-title">Explore Categories</h2>
            <p class="fv-section-sub">Dive into your favourite universe — from anime to manga.</p>
          </div>
          <div class="fv-cat-grid">
            ${DATA.categories.map((c, i) => `
              <a href="#/${c.key}" class="fv-cat-card reveal reveal-delay-${Math.min(i + 1, 6)}">
                <div class="fv-cat-img" style="background-image:url('${c.image}')"></div>
                <div class="fv-cat-body">
                  <div class="fv-cat-icon"><i class="fa-solid ${c.icon}"></i></div>
                  <h3>${esc(c.name)}</h3>
                  <p>${esc(c.tagline)}</p>
                  <span class="fv-cat-cta">Explore <i class="fa-solid fa-arrow-right"></i></span>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="fv-section fv-section-alt">
        <div class="container-fv">
          <div class="fv-section-head reveal">
            <span class="fv-section-kicker">Handpicked</span>
            <h2 class="fv-section-title">Featured Content</h2>
            <p class="fv-section-sub">Curated articles, trailers and events.</p>
          </div>
          <div class="fv-featured-tabs" id="featuredTabs">
            <button class="fv-tab active" data-tab="articles"><i class="fa-solid fa-newspaper"></i> Articles</button>
            <button class="fv-tab" data-tab="trailers"><i class="fa-solid fa-video"></i> Trailers</button>
            <button class="fv-tab" data-tab="events"><i class="fa-solid fa-calendar"></i> Events</button>
          </div>
          <div class="fv-featured-panels" id="featuredPanels"></div>
        </div>
      </section>

      <section class="fv-section">
        <div class="container-fv">
          <div class="fv-section-head reveal">
            <span class="fv-section-kicker">Mark your calendar</span>
            <h2 class="fv-section-title">Upcoming Releases</h2>
            <p class="fv-section-sub">Don't miss what's dropping next.</p>
          </div>
          <div class="fv-upcoming-grid">
            ${[
        { tag: 'Movie', date: 'Oct 15, 2026', title: 'Neon Horizons: Rise', sub: 'Theatrical Release', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80' },
        { tag: 'Anime', date: 'Nov 04, 2026', title: 'Shadow Blade S2', sub: 'New Season Premiere', img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80' },
        { tag: 'Game', date: 'Nov 22, 2026', title: 'Warpath Legends', sub: 'PC · PS5 · Xbox', img: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&q=80' },
        { tag: 'K-Pop Album', date: 'Dec 01, 2026', title: 'Starlit — Vol. 2', sub: 'Comeback Album', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80' },
      ].map(r => `
              <div class="fv-upcoming-card reveal">
                <div class="fv-upcoming-img" style="background-image:url('${r.img}')">
                  <span class="fv-upcoming-tag">${r.tag}</span>
                </div>
                <div class="fv-upcoming-body">
                  <span class="fv-upcoming-date"><i class="fa-regular fa-calendar"></i> ${r.date}</span>
                  <h4>${r.title}</h4>
                  <p>${r.sub}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  /* ============================================================
     CATEGORY HUB TEMPLATE
     ============================================================ */
  function categoryHubTemplate(catKey) {
    const cat = DATA.categories.find(c => c.key === catKey) || {
      key: catKey, name: catKey, description: '', icon: 'fa-star',
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1600&q=80',
    };

    return `
      <div class="fv-breadcrumbs container-fv">
        <a href="#/"><i class="fa-solid fa-house"></i> Home</a>
        <i class="fa-solid fa-chevron-right"></i>
        <span>${esc(cat.name)}</span>
      </div>

      <section class="fv-hub-hero">
        <div class="fv-hub-hero-bg" style="background-image:url('${cat.image}')"></div>
        <div class="fv-hub-hero-overlay"></div>
        <div class="fv-hub-hero-content">
          <div class="fv-hub-icon"><i class="fa-solid ${cat.icon}"></i></div>
          <h1 class="fv-hub-title">${esc(cat.name)}</h1>
          <p class="fv-hub-desc">${esc(cat.description)}</p>
        </div>
      </section>

      <section class="fv-hub-controls container-fv">
        <div class="fv-filters" id="hubFilters">
          <button class="fv-filter-chip active" data-filter="all">All</button>
          <button class="fv-filter-chip" data-filter="articles">Articles</button>
          <button class="fv-filter-chip" data-filter="characters">Characters</button>
          <button class="fv-filter-chip" data-filter="events">Events</button>
          <button class="fv-filter-chip" data-filter="videos">Videos</button>
          <button class="fv-filter-chip" data-filter="merchandise">Merchandise</button>
        </div>
        <div class="fv-sort">
          <label for="hubSort">Sort:</label>
          <select id="hubSort">
            <option value="featured">Featured</option>
            <option value="az">A - Z</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </section>

      <section class="fv-section fv-hub-content">
        <div class="container-fv">
          <div class="fv-content-grid" id="hubGrid"></div>
          <div class="fv-empty-state hidden" id="hubEmpty">
            <i class="fa-solid fa-inbox"></i>
            <h3>Nothing here yet</h3>
            <p>Try a different filter above.</p>
          </div>
        </div>
      </section>
    `;
  }

  function buildCategoryContent(catKey) {
    const items = [];

    DATA.articles.filter(a => a.category === catKey).forEach(a => items.push({
      type: 'articles', id: a.id, title: a.title, description: a.excerpt,
      image: a.image, meta: a.readTime, badge: 'Article', date: a.date,
      href: `#/article/${a.id}`,
    }));

    DATA.characters.filter(c => c.category === catKey).forEach(c => items.push({
      type: 'characters', id: c.id, title: c.name,
      description: c.series + ' — ' + (c.traits || []).join(' • '),
      image: c.image || null, meta: c.series, badge: 'Character', date: null,
      href: `#/character/${c.id}`,
    }));

    DATA.events.filter(e => e.category === catKey).forEach(e => items.push({
      type: 'events', id: e.id, title: e.name, description: e.description,
      image: e.image || null, meta: e.date + ' • ' + e.location, badge: 'Event', date: e.date, // ✅ FIXED
      href: `#/event/${e.id}`,
    }));

    DATA.trailers.filter(t => t.category === catKey).forEach(t => items.push({
      type: 'videos', id: t.id, title: t.title, description: t.description,
      image: t.thumbnail, meta: t.duration + ' • ' + t.type, badge: t.type, date: null,
      href: null,
    }));

    DATA.merchandise.filter(m => m.category === catKey).forEach(m => items.push({
      type: 'merchandise', id: m.id, title: m.name, description: m.description,
      image: m.image, meta: m.priceRange, badge: 'Merch', date: null,
      href: null,
    }));

    return items;
  }

    function contentCardTemplate(item) {
    const img = item.image
      ? `<div class="fv-card-img fv-lazy-bg" data-src="${esc(item.image)}">
           <span class="badge-fv badge-fv-primary">${esc(item.badge)}</span>
           ${item.type === 'videos' ? `<div class="fv-play-btn"><i class="fa-solid fa-play"></i></div>` : ''}
         </div>`
      : `<div class="fv-card-img fv-card-img-placeholder">
           <span class="badge-fv badge-fv-primary">${esc(item.badge)}</span>
           <i class="fa-solid fa-image"></i>
         </div>`;

    const tag = item.href ? 'a' : 'article';
    const hrefAttr = item.href ? ` href="${item.href}"` : '';

    return `
      <${tag} class="fv-content-card" data-type="${item.type}" data-id="${item.id}"${hrefAttr}>
        ${img}
        <button type="button" class="fv-bm-btn" data-bm
          data-bm-id="${esc(item.id)}"
          data-bm-type="${esc(item.type)}"
          data-bm-title="${esc(item.title)}"
          data-bm-subtitle="${esc(item.description || '')}"
          data-bm-href="${esc(item.href || '')}"
          data-bm-image="${esc(item.image || '')}"
          aria-label="Bookmark">
          <i class="fa-regular fa-bookmark"></i>
        </button>
        <div class="fv-card-body">
          <h4>${esc(item.title)}</h4>
          <p>${esc(item.description || '')}</p>
          ${item.meta ? `<span class="fv-meta">${esc(item.meta)}</span>` : ''}
        </div>
      </${tag}>
    `;
  }

  /* ============================================================
     WIRE BOOKMARK BUTTONS
     ============================================================ */
  function wireBookmarkButtons(scope) {
    const root = scope || document;
    const buttons = root.querySelectorAll('[data-bm]');

    buttons.forEach(btn => {
      const id = btn.dataset.bmId;

      // Set initial state based on saved bookmarks
      if (window.FV.isBookmarked && window.FV.isBookmarked(id)) {
        btn.classList.add('bookmarked');
        const icon = btn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bookmark';
      }

      // Avoid duplicate listeners — replace with clone
      const freshBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(freshBtn, btn);
    });

    // Re-query and attach handlers to the fresh buttons
    root.querySelectorAll('[data-bm]').forEach(btn => {
      const id = btn.dataset.bmId;

      if (window.FV.isBookmarked && window.FV.isBookmarked(id)) {
        btn.classList.add('bookmarked');
        const icon = btn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bookmark';
      }

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const item = {
          id: btn.dataset.bmId,
          type: btn.dataset.bmType,
          title: btn.dataset.bmTitle,
          subtitle: btn.dataset.bmSubtitle,
          href: btn.dataset.bmHref || null,
          image: btn.dataset.bmImage || null,
        };

        if (window.FV.toggleBookmark) {
          window.FV.toggleBookmark(item, btn);
        } else {
          console.warn('[FandomVerse] toggleBookmark not available');
        }
      });
    });
  }

  window.FV.wireBookmarkButtons = wireBookmarkButtons;

  /* ============================================================
     CATEGORY HUB WIRING
     ============================================================ */
  function wireCategoryHub(catKey) {
    const grid = document.getElementById('hubGrid');
    const empty = document.getElementById('hubEmpty');
    const filterChips = document.querySelectorAll('#hubFilters .fv-filter-chip');
    const sortSelect = document.getElementById('hubSort');
    if (!grid) return;

    const all = buildCategoryContent(catKey);
    let filter = 'all';
    let sort = 'featured';

    function render() {
      let items = filter === 'all' ? all.slice() : all.filter(i => i.type === filter);

      if (sort === 'az') {
        items.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sort === 'newest') {
        items.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      }

      if (!items.length) {
        grid.innerHTML = '';
        empty.classList.remove('hidden');
        return;
      }

      empty.classList.add('hidden');
      grid.innerHTML = items.map(contentCardTemplate).join('');
      wireTrailerClicks();
      wireBookmarkButtons(grid);
    }

    function wireTrailerClicks() {
      grid.querySelectorAll('.fv-content-card[data-type="videos"]').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
          // Ignore clicks on the bookmark button
          if (e.target.closest('[data-bm]')) return;

          const id = card.dataset.id;
          const trailer = (DATA.trailers || []).find(t => t.id === id);
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
        render();
      });
    });

    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        sort = sortSelect.value;
        render();
      });
    }

    render();
  }

  /* ============================================================
     HOME FEATURED PANELS
     ============================================================ */
  function fillFeaturedPanels() {
    const wrap = document.getElementById('featuredPanels');
    if (!wrap) return;

    const arts = DATA.articles.slice(0, 3);
    const trls = DATA.trailers.slice(0, 3);
    const evts = DATA.events.slice(0, 3);

    const articleCard = (a) => `
      <a href="#/article/${esc(a.id)}" class="fv-feature-card" style="position:relative;">
        <div class="fv-feature-img" style="background-image:url('${a.image}')">
          <span class="badge-fv badge-fv-primary">${esc(a.category)}</span>
        </div>
        <button type="button" class="fv-bm-btn" data-bm
          data-bm-id="${esc(a.id)}"
          data-bm-type="articles"
          data-bm-title="${esc(a.title)}"
          data-bm-subtitle="${esc(a.excerpt || '')}"
          data-bm-href="#/article/${esc(a.id)}"
          data-bm-image="${esc(a.image || '')}"
          aria-label="Bookmark">
          <i class="fa-regular fa-bookmark"></i>
        </button>
        <div class="fv-feature-body">
          <h4>${esc(a.title)}</h4>
          <span class="fv-meta"><i class="fa-regular fa-clock"></i> ${esc(a.readTime)}</span>
        </div>
      </a>`;

    const trailerCard = (t) => `
      <article class="fv-feature-card" data-trailer-id="${esc(t.id)}" style="cursor:pointer;position:relative;">
        <div class="fv-feature-img" style="background-image:url('${t.thumbnail}')">
          <div class="fv-play-btn"><i class="fa-solid fa-play"></i></div>
          <span class="badge-fv badge-fv-amber">${esc(t.category)} · ${esc(t.duration)}</span>
        </div>
        <button type="button" class="fv-bm-btn" data-bm
          data-bm-id="${esc(t.id)}"
          data-bm-type="trailer"
          data-bm-title="${esc(t.title)}"
          data-bm-subtitle="${esc(t.description || '')}"
          data-bm-href=""
          data-bm-image="${esc(t.thumbnail || '')}"
          aria-label="Bookmark">
          <i class="fa-regular fa-bookmark"></i>
        </button>
        <div class="fv-feature-body">
          <h4>${esc(t.title)}</h4>
          <span class="fv-meta"><i class="fa-solid fa-film"></i> ${esc(t.type)}</span>
        </div>
      </article>`;

    const eventCard = (e) => `
      <a href="#/event/${esc(e.id)}" class="fv-feature-card" style="position:relative;">
        <div class="fv-feature-img" style="background: linear-gradient(135deg, rgba(0,217,192,0.35), rgba(255,59,92,0.35));">
          <span class="badge-fv badge-fv-teal">${esc(e.category)}</span>
        </div>
        <button type="button" class="fv-bm-btn" data-bm
          data-bm-id="${esc(e.id)}"
          data-bm-type="events"
          data-bm-title="${esc(e.name)}"
          data-bm-subtitle="${esc(e.date || '')} • ${esc(e.location || '')}"
          data-bm-href="#/event/${esc(e.id)}"
          data-bm-image=""
          aria-label="Bookmark">
          <i class="fa-regular fa-bookmark"></i>
        </button>
        <div class="fv-feature-body">
          <h4>${esc(e.name)}</h4>
          <span class="fv-meta"><i class="fa-regular fa-calendar"></i> ${esc(e.date)}</span>
        </div>
      </a>`;

    wrap.innerHTML = `
      <div class="fv-panel active" data-panel="articles">
        <div class="fv-feature-grid">${arts.map(articleCard).join('')}</div>
      </div>
      <div class="fv-panel" data-panel="trailers">
        <div class="fv-feature-grid">${trls.map(trailerCard).join('')}</div>
      </div>
      <div class="fv-panel" data-panel="events">
        <div class="fv-feature-grid">${evts.map(eventCard).join('')}</div>
      </div>
    `;

    // Wire featured tabs
    const tabs = document.querySelectorAll('#featuredTabs .fv-tab');
    const panels = wrap.querySelectorAll('.fv-panel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.tab;
        tabs.forEach(t => t.classList.toggle('active', t === tab));
        panels.forEach(p => p.classList.toggle('active', p.dataset.panel === key));
      });
    });

    // Wire trailer clicks (ignore bookmark clicks)
    wrap.querySelectorAll('[data-trailer-id]').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-bm]')) return;
        const id = card.dataset.trailerId;
        const trailer = (DATA.trailers || []).find(t => t.id === id);
        if (trailer && window.FV.openTrailer) {
          window.FV.openTrailer(trailer);
        }
      });
    });

    // Wire bookmark buttons on featured cards
    wireBookmarkButtons(wrap);
  }

  function placeholderTemplate(route) {
    const info = ROUTES[route] || { title: route, tag: 'Coming Soon' };
    return `
      <section class="fv-placeholder">
        <i class="fa-solid ${info.icon || 'fa-star'} fv-placeholder-icon"></i>
        <span class="fv-placeholder-tag">${info.tag}</span>
        <h1>${info.title}</h1>
        <p>This page is coming soon.</p>
        <a href="#/" class="btn-fv btn-fv-primary" style="margin-top:1rem;">
          <i class="fa-solid fa-arrow-left"></i> Back to Home
        </a>
      </section>
    `;
  }

  /* ============================================================
     RENDER
     ============================================================ */
  async function render() {
    const { route, params } = parseHash();
    const normalizedRoute = getRoute();

    view.innerHTML = `<div style="min-height:80vh;display:flex;align-items:center;justify-content:center;color:var(--text-muted);">Loading...</div>`;

    await ensureData();

    let html = '';

    if (route === 'home' || !route) {
      html = homeTemplate();
    } else if (route === 'search' && params[0]) {
      html = window.FV.searchResultsTemplate
        ? window.FV.searchResultsTemplate(decodeURIComponent(params[0]), DATA)
        : placeholderTemplate('search');
    } else if (route === 'bookmarks') {
      html = window.FV.bookmarksTemplate
        ? window.FV.bookmarksTemplate(DATA)
        : placeholderTemplate('bookmarks');
    } else if (route === 'contact') {
      html = window.FV.contactTemplate
        ? window.FV.contactTemplate()
        : placeholderTemplate('contact');
    } else if (route === 'about') {
      html = window.FV.aboutTemplate
        ? window.FV.aboutTemplate()
        : placeholderTemplate('about');
    } else if (route === 'trailers') {
      html = window.FV.trailersPageTemplate
        ? window.FV.trailersPageTemplate(DATA)
        : placeholderTemplate('trailers');
    } else if (route === 'merchandise') {
      html = window.FV.merchandiseTemplate
        ? window.FV.merchandiseTemplate(DATA)
        : placeholderTemplate('merchandise');
    } else if (CATEGORY_KEYS.includes(route)) {
      html = categoryHubTemplate(route);
    } else if (route === 'article' && params[0]) {
      const article = DATA.articles.find(a => a.id === params[0]);
      html = window.FV.articleDetailTemplate
        ? window.FV.articleDetailTemplate(article, DATA)
        : placeholderTemplate('article');
    } else if (route === 'character' && params[0]) {
      const char = DATA.characters.find(c => c.id === params[0]);
      html = window.FV.characterDetailTemplate
        ? window.FV.characterDetailTemplate(char, DATA)
        : placeholderTemplate('character');
    } else if (route === 'event' && params[0]) {
      const evt = DATA.events.find(e => e.id === params[0]);
      html = window.FV.eventDetailTemplate
        ? window.FV.eventDetailTemplate(evt, DATA)
        : placeholderTemplate('event');
    } else {
      html = placeholderTemplate(normalizedRoute);
    }

    view.innerHTML = html;

    view.classList.remove('route-enter');
    void view.offsetWidth;
    view.classList.add('route-enter');

    window.scrollTo({ top: 0, behavior: 'auto' });

    document.querySelectorAll('[data-route]').forEach((link) => {
      link.classList.toggle('active', link.dataset.route === route);
    });

    if (window.FV && window.FV.closeMobile) window.FV.closeMobile();

    let titleText = ROUTES[route]?.title || route;
    if (route === 'article' && params[0]) {
      const a = DATA.articles.find(x => x.id === params[0]);
      if (a) titleText = a.title;
    } else if (route === 'character' && params[0]) {
      const c = DATA.characters.find(x => x.id === params[0]);
      if (c) titleText = c.name;
    } else if (route === 'event' && params[0]) {
      const e = DATA.events.find(x => x.id === params[0]);
      if (e) titleText = e.name;
    }
    document.title = `FandomVerse — ${titleText}`;

    if (route === 'home' || !route) fillFeaturedPanels();
    if (route === 'trailers' && window.FV.wireTrailersPage) window.FV.wireTrailersPage();
    if (route === 'merchandise' && window.FV.wireMerchandise) window.FV.wireMerchandise();
    if (route === 'search' && params[0] && window.FV.wireSearchResults) {
      window.FV.wireSearchResults(decodeURIComponent(params[0]));
    }
    if (route === 'bookmarks' && window.FV.wireBookmarks) window.FV.wireBookmarks();
    if (route === 'contact' && window.FV.wireContact) window.FV.wireContact();
    if (CATEGORY_KEYS.includes(route)) wireCategoryHub(route);

    if (window.FV && window.FV.reinitAnimations) {
      setTimeout(() => window.FV.reinitAnimations(), 60);
    }
  }

  window.addEventListener('hashchange', render);
  window.addEventListener('DOMContentLoaded', render);
  if (document.readyState !== 'loading') render();

  window.FV = window.FV || {};
  window.FV.render = render;
  window.FV.getRoute = getRoute;
})();