/* ============================================================
   FANDOMVERSE — detail.js
   Detail view templates: Article, Character, Event
   ============================================================ */

(function () {
  'use strict';

  window.FV = window.FV || {};

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function formatDate(d) {
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch { return d; }
  }

  /* ---------- breadcrumbs ---------- */
  function breadcrumbs(items) {
    return `
      <div class="fv-breadcrumbs container-fv">
        ${items.map((item, i) => {
          const sep = i < items.length - 1
            ? '<i class="fa-solid fa-chevron-right"></i>'
            : '';
          if (item.href) {
            return `<a href="${item.href}">${item.icon ? `<i class="fa-solid ${item.icon}"></i> ` : ''}${esc(item.label)}</a>${sep}`;
          }
          return `<span>${esc(item.label)}</span>${sep}`;
        }).join('')}
      </div>
    `;
  }

  /* ---------- share buttons ---------- */
  function shareButtons(title, url) {
    const u = encodeURIComponent(url || window.location.href);
    const t = encodeURIComponent(title || 'FandomVerse');
    return `
      <div class="fv-share">
        <span class="fv-share-label">Share:</span>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${u}" target="_blank" rel="noopener" aria-label="Share on Facebook" class="fv-share-btn fv-share-fb">
          <i class="fa-brands fa-facebook-f"></i>
        </a>
        <a href="https://wa.me/?text=${t}%20${u}" target="_blank" rel="noopener" aria-label="Share on WhatsApp" class="fv-share-btn fv-share-wa">
          <i class="fa-brands fa-whatsapp"></i>
        </a>
        <a href="https://twitter.com/intent/tweet?text=${t}&url=${u}" target="_blank" rel="noopener" aria-label="Share on X" class="fv-share-btn fv-share-x">
          <i class="fa-brands fa-x-twitter"></i>
        </a>
      </div>
    `;
  }

  /* ============================================================
     ARTICLE DETAIL VIEW
     ============================================================ */
  window.FV.articleDetailTemplate = function (article, allData) {
    if (!article) {
      return `<section class="fv-placeholder"><h1>Article not found</h1><a href="#/" class="btn-fv btn-fv-primary">Back to Home</a></section>`;
    }

    const cat = (allData.categories || []).find(c => c.key === article.category);
    const related = (allData.articles || [])
      .filter(a => a.category === article.category && a.id !== article.id)
      .slice(0, 3);

    return `
      ${breadcrumbs([
        { label: 'Home', href: '#/', icon: 'fa-house' },
        { label: cat ? cat.name : article.category, href: `#/${article.category}` },
        { label: article.title }
      ])}

      <article class="fv-detail fv-detail-article">
        <header class="fv-detail-hero">
          <div class="fv-detail-hero-img" style="background-image:url('${esc(article.image)}')"></div>
          <div class="fv-detail-hero-overlay"></div>
          <div class="fv-detail-hero-content container-fv">
            <div class="fv-detail-badges">
              <span class="badge-fv badge-fv-primary">${esc(article.category)}</span>
              <span class="badge-fv badge-fv-amber">${esc(article.readTime || 'Article')}</span>
            </div>
            <h1 class="fv-detail-title">${esc(article.title)}</h1>
            <div class="fv-detail-meta">
              <span><i class="fa-regular fa-calendar"></i> ${formatDate(article.date)}</span>
              <span><i class="fa-solid fa-user-pen"></i> ${esc(article.author || 'FandomVerse')}</span>
            </div>
          </div>
        </header>

        <div class="container-fv fv-detail-body">
          <div class="fv-detail-actions">
            <button class="fv-action-btn" data-bookmark="article" data-id="${esc(article.id)}">
              <i class="fa-regular fa-bookmark"></i> Bookmark
            </button>
            ${shareButtons(article.title)}
          </div>

          <div class="fv-detail-content">
            <p class="fv-detail-lead">${esc(article.excerpt)}</p>
            <p>${esc(article.content)}</p>
          </div>

          ${related.length ? `
            <section class="fv-related">
              <h3 class="fv-related-title">Related Articles</h3>
              <div class="fv-content-grid">
                ${related.map(a => `
                  <a href="#/article/${esc(a.id)}" class="fv-content-card">
                    <div class="fv-card-img" style="background-image:url('${esc(a.image)}')">
                      <span class="badge-fv badge-fv-primary">Article</span>
                    </div>
                    <div class="fv-card-body">
                      <h4>${esc(a.title)}</h4>
                      <p>${esc(a.excerpt)}</p>
                      <span class="fv-meta"><i class="fa-regular fa-clock"></i> ${esc(a.readTime)}</span>
                    </div>
                  </a>
                `).join('')}
              </div>
            </section>
          ` : ''}
        </div>
      </article>
    `;
  };

  /* ============================================================
     CHARACTER DETAIL VIEW
     ============================================================ */
  window.FV.characterDetailTemplate = function (char, allData) {
    if (!char) {
      return `<section class="fv-placeholder"><h1>Character not found</h1><a href="#/" class="btn-fv btn-fv-primary">Back to Home</a></section>`;
    }

    const cat = (allData.categories || []).find(c => c.key === char.category);
    const related = (allData.characters || [])
      .filter(c => c.category === char.category && c.id !== char.id)
      .slice(0, 4);

    const imageStyle = char.image
      ? `background-image:url('${esc(char.image)}')`
      : '';

    return `
      ${breadcrumbs([
        { label: 'Home', href: '#/', icon: 'fa-house' },
        { label: cat ? cat.name : char.category, href: `#/${char.category}` },
        { label: char.name }
      ])}

      <article class="fv-detail fv-detail-character">
        <header class="fv-detail-hero">
          <div class="fv-detail-hero-img ${char.image ? '' : 'fv-detail-hero-placeholder'}" style="${imageStyle}">
            ${!char.image ? '<i class="fa-solid fa-user"></i>' : ''}
          </div>
          <div class="fv-detail-hero-overlay"></div>
          <div class="fv-detail-hero-content container-fv">
            <div class="fv-detail-badges">
              <span class="badge-fv badge-fv-primary">${esc(char.category)}</span>
              <span class="badge-fv badge-fv-teal">Character</span>
            </div>
            <h1 class="fv-detail-title">${esc(char.name)}</h1>
            <p class="fv-detail-series"><i class="fa-solid fa-book"></i> ${esc(char.series)}</p>
          </div>
        </header>

        <div class="container-fv fv-detail-body">
          <div class="fv-detail-actions">
            <button class="fv-action-btn" data-bookmark="character" data-id="${esc(char.id)}">
              <i class="fa-regular fa-bookmark"></i> Bookmark
            </button>
            ${shareButtons(char.name)}
          </div>

          <section class="fv-detail-section">
            <h3>Biography</h3>
            <p>${esc(char.biography)}</p>
          </section>

          ${char.traits && char.traits.length ? `
            <section class="fv-detail-section">
              <h3>Traits</h3>
              <div class="fv-traits">
                ${char.traits.map(t => `<span class="fv-trait">${esc(t)}</span>`).join('')}
              </div>
            </section>
          ` : ''}

          ${related.length ? `
            <section class="fv-related">
              <h3 class="fv-related-title">More ${cat ? cat.name : char.category} Characters</h3>
              <div class="fv-content-grid">
                ${related.map(c => `
                  <a href="#/character/${esc(c.id)}" class="fv-content-card">
                    <div class="fv-card-img ${c.image ? '' : 'fv-card-img-placeholder'}" ${c.image ? `style="background-image:url('${esc(c.image)}')"` : ''}>
                      <span class="badge-fv badge-fv-primary">Character</span>
                      ${!c.image ? '<i class="fa-solid fa-user"></i>' : ''}
                    </div>
                    <div class="fv-card-body">
                      <h4>${esc(c.name)}</h4>
                      <p>${esc(c.series)}</p>
                      <span class="fv-meta">${(c.traits || []).slice(0, 2).join(' • ')}</span>
                    </div>
                  </a>
                `).join('')}
              </div>
            </section>
          ` : ''}
        </div>
      </article>
    `;
  };

  /* ============================================================
     EVENT DETAIL VIEW
     ============================================================ */
  window.FV.eventDetailTemplate = function (evt, allData) {
    if (!evt) {
      return `<section class="fv-placeholder"><h1>Event not found</h1><a href="#/" class="btn-fv btn-fv-primary">Back to Home</a></section>`;
    }

    const cat = (allData.categories || []).find(c => c.key === evt.category);
    const related = (allData.events || [])
      .filter(e => e.category === evt.category && e.id !== evt.id)
      .slice(0, 3);

    return `
      ${breadcrumbs([
        { label: 'Home', href: '#/', icon: 'fa-house' },
        { label: cat ? cat.name : evt.category, href: `#/${evt.category}` },
        { label: evt.name }
      ])}

      <article class="fv-detail fv-detail-event">
        <header class="fv-detail-hero fv-detail-hero-gradient">
          <div class="fv-detail-hero-overlay"></div>
          <div class="fv-detail-hero-content container-fv">
            <div class="fv-detail-badges">
              <span class="badge-fv badge-fv-teal">${esc(evt.category)}</span>
              <span class="badge-fv badge-fv-primary">Event</span>
            </div>
            <h1 class="fv-detail-title">${esc(evt.name)}</h1>
            <div class="fv-detail-meta">
              <span><i class="fa-regular fa-calendar"></i> ${formatDate(evt.date)}</span>
              <span><i class="fa-solid fa-location-dot"></i> ${esc(evt.location)}</span>
            </div>
          </div>
        </header>

        <div class="container-fv fv-detail-body">
          <div class="fv-detail-actions">
            <button class="fv-action-btn" data-bookmark="event" data-id="${esc(evt.id)}">
              <i class="fa-regular fa-bookmark"></i> Bookmark
            </button>
            ${shareButtons(evt.name)}
          </div>

          <section class="fv-detail-section">
            <h3>About This Event</h3>
            <p>${esc(evt.description)}</p>
          </section>

          ${related.length ? `
            <section class="fv-related">
              <h3 class="fv-related-title">More ${cat ? cat.name : evt.category} Events</h3>
              <div class="fv-content-grid">
                ${related.map(e => `
                  <a href="#/event/${esc(e.id)}" class="fv-content-card">
                    <div class="fv-card-img fv-card-img-placeholder">
                      <span class="badge-fv badge-fv-teal">Event</span>
                      <i class="fa-solid fa-calendar-star"></i>
                    </div>
                    <div class="fv-card-body">
                      <h4>${esc(e.name)}</h4>
                      <p>${esc(e.description)}</p>
                      <span class="fv-meta">${formatDate(e.date)} • ${esc(e.location)}</span>
                    </div>
                  </a>
                `).join('')}
              </div>
            </section>
          ` : ''}
        </div>
      </article>
    `;
  };

})();