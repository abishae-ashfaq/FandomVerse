/* ============================================================
   FANDOMVERSE — bookmarks.js
   Bookmark system with localStorage + notes with sessionStorage
   + Export to text file
   ============================================================ */

(function () {
  'use strict';

  window.FV = window.FV || {};

  const BM_KEY = 'fv_bookmarks_v1';
  const NOTES_KEY = 'fv_notes_v1';

  /* ---------- storage ---------- */
  function loadBookmarks() {
    try {
      const raw = localStorage.getItem(BM_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  function saveBookmarks() {
    try {
      localStorage.setItem(BM_KEY, JSON.stringify(bookmarks));
    } catch (e) { console.warn('[FandomVerse] Bookmark save failed', e); }
  }

  function loadNotes() {
    try {
      const raw = sessionStorage.getItem(NOTES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }

  function saveNotes() {
    try {
      sessionStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (e) { console.warn('[FandomVerse] Notes save failed', e); }
  }

  let bookmarks = loadBookmarks();
  let notes = loadNotes();

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function isBookmarked(id) {
    return bookmarks.some(b => b.id === id);
  }

  function getBookmark(id) {
    return bookmarks.find(b => b.id === id);
  }

  /* ---------- actions ---------- */
  function addBookmark(item) {
    if (isBookmarked(item.id)) return;

    bookmarks.push({
      id: item.id,
      type: item.type,
      title: item.title,
      subtitle: item.subtitle || '',
      href: item.href || null,
      trailerId: item.trailerId || null,
      merchId: item.merchId || null,
      image: item.image || null,
      savedAt: new Date().toISOString(),
    });

    saveBookmarks();
    updateNavBadge();
    showToast(`"${item.title}" bookmarked`);
  }

  function removeBookmark(id) {
    bookmarks = bookmarks.filter(b => b.id !== id);
    saveBookmarks();
    updateNavBadge();
    showToast('Bookmark removed');
  }

  function toggleBookmark(item, buttonEl) {
    if (isBookmarked(item.id)) {
      removeBookmark(item.id);
      if (buttonEl) setButtonState(buttonEl, false);
    } else {
      addBookmark(item);
      if (buttonEl) setButtonState(buttonEl, true);
    }
  }

  function setButtonState(btn, active) {
    btn.classList.toggle('bookmarked', active);
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = active ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';
    }
  }

  /* ---------- toast ---------- */
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
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  /* ---------- navbar badge ---------- */
  function updateNavBadge() {
    const links = document.querySelectorAll('a[href="#/bookmarks"]');
    links.forEach(link => {
      let badge = link.querySelector('.fv-bm-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'fv-bm-badge';
        link.appendChild(badge);
      }
      const n = bookmarks.length;
      badge.textContent = n > 99 ? '99+' : String(n);
      badge.style.display = n > 0 ? 'flex' : 'none';
    });
  }

  /* ---------- notes ---------- */
  function getNote(id) {
    return notes[id] || '';
  }

  function saveNote(id, text) {
    notes[id] = text;
    saveNotes();
    showToast('Note saved');
  }

  /* ---------- Export to .txt ---------- */
  function exportBookmarks() {
    if (!bookmarks.length) {
      showToast('No bookmarks to export');
      return;
    }

    const lines = [];
    lines.push('========================================');
    lines.push('   My FandomVerse Bookmarks');
    lines.push('========================================');
    lines.push('');
    lines.push(`Total bookmarks: ${bookmarks.length}`);
    lines.push(`Exported: ${new Date().toLocaleString()}`);
    lines.push('');

    const types = {
      'articles': '📄 ARTICLES',
      'characters': '👤 CHARACTERS',
      'events': '📅 EVENTS',
      'trailer': '🎬 TRAILERS',
      'videos': '🎬 VIDEOS',
      'merchandise': '🛍️ MERCHANDISE',
    };

    const grouped = {};
    bookmarks.forEach(b => {
      if (!grouped[b.type]) grouped[b.type] = [];
      grouped[b.type].push(b);
    });

    let counter = 1;
    Object.keys(grouped).forEach(typeKey => {
      lines.push(types[typeKey] || `📌 ${typeKey.toUpperCase()}`);
      lines.push('----------------------------------------');
      grouped[typeKey].forEach(b => {
        lines.push(`${counter}. ${b.title}`);
        if (b.subtitle) lines.push(`   ${b.subtitle}`);
        const note = getNote(b.id);
        if (note) {
          lines.push(`   📝 Note: ${note}`);
        }
        lines.push('');
        counter++;
      });
      lines.push('');
    });

    lines.push('========================================');
    lines.push('   Exported from FandomVerse');
    lines.push('========================================');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fandomverse-bookmarks-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Exported ${bookmarks.length} bookmark${bookmarks.length === 1 ? '' : 's'}`);
  }

  /* ---------- Bookmarks page template ---------- */
  window.FV.bookmarksTemplate = function (allData) {
    return `
      <div class="fv-breadcrumbs container-fv">
        <a href="#/"><i class="fa-solid fa-house"></i> Home</a>
        <i class="fa-solid fa-chevron-right"></i>
        <span>My Bookmarks</span>
      </div>

      <section class="fv-search-hero">
        <div class="container-fv">
          <span class="fv-section-kicker">Your Saved Items</span>
          <h1 class="fv-search-title">
            <i class="fa-solid fa-bookmark"></i> My Bookmarks
          </h1>
          <p class="fv-search-count" id="bmCount">
            ${bookmarks.length} item${bookmarks.length === 1 ? '' : 's'} saved
          </p>
        </div>
      </section>

      <section class="fv-search-page-controls container-fv">
        <div class="fv-filters" id="bmFilters">
          <button class="fv-filter-chip active" data-filter="all">All</button>
          <button class="fv-filter-chip" data-filter="articles">Articles</button>
          <button class="fv-filter-chip" data-filter="characters">Characters</button>
          <button class="fv-filter-chip" data-filter="events">Events</button>
          <button class="fv-filter-chip" data-filter="trailer">Videos</button>
          <button class="fv-filter-chip" data-filter="merchandise">Merch</button>
        </div>
        <div class="fv-sort">
          <button type="button" class="fv-action-btn" id="bmExportBtn" style="gap:0.5rem;">
            <i class="fa-solid fa-download"></i> Export Bookmarks
          </button>
        </div>
      </section>

      <section class="fv-section fv-search-page-content">
        <div class="container-fv">
          <div class="fv-bookmarks-list" id="bmList"></div>
          <div class="fv-empty-state hidden" id="bmEmpty">
            <i class="fa-regular fa-bookmark"></i>
            <h3>No bookmarks yet</h3>
            <p>
              Click the [🔖] icon on any card to save it here.
            </p>
                       <a href="#/anime" class="btn-fv btn-fv-primary" style="margin-top:1rem;gap:0.75rem;">
              <span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,0.25);border:1px solid rgba(255,255,255,0.4);">FV</span>
              </span>
              <span style="color:#fff;">Explore Content</span>
            </a>
          </div>
        </div>
      </section>
    `;
  };

  /* ---------- Wire up bookmarks page ---------- */
  window.FV.wireBookmarks = function () {
    const list = document.getElementById('bmList');
    const empty = document.getElementById('bmEmpty');
    const filterChips = document.querySelectorAll('#bmFilters .fv-filter-chip');
    const exportBtn = document.getElementById('bmExportBtn');
    const countEl = document.getElementById('bmCount');
    if (!list) return;

    let filter = 'all';

    function cardHtml(b) {
      const tag = b.href ? 'a' : 'article';
      const hrefAttr = b.href ? ` href="${esc(b.href)}"` : '';

      const imageStyle = b.image
        ? `background-image:url('${esc(b.image)}')`
        : '';

      const badgeClass = `fv-search-badge-${b.type}`;

      const note = getNote(b.id);

      return `
        <div class="fv-bm-item ${b.image ? '' : 'fv-bm-item-nopic'}" data-type="${esc(b.type)}" data-id="${esc(b.id)}">
          <${tag} class="fv-bm-link"${hrefAttr}>
            <div class="fv-bm-thumb" style="${imageStyle}">
              ${!b.image ? '<i class="fa-solid fa-bookmark"></i>' : ''}
            </div>
            <div class="fv-bm-info">
              <span class="fv-search-result-badge ${badgeClass}">${esc(b.type)}</span>
              <h4>${esc(b.title)}</h4>
              ${b.subtitle ? `<p>${esc(b.subtitle)}</p>` : ''}
            </div>
          </${tag}>
          <div class="fv-bm-actions">
            <button type="button" class="fv-bm-remove" data-remove="${esc(b.id)}" aria-label="Remove bookmark">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
          <div class="fv-bm-note-wrap">
            <label for="note-${esc(b.id)}">My Note:</label>
            <input
              type="text"
              id="note-${esc(b.id)}"
              class="fv-bm-note-input"
              data-note-id="${esc(b.id)}"
              placeholder="Add a private note..."
              value="${esc(note)}"
            />
            <button type="button" class="fv-bm-note-save" data-save-note="${esc(b.id)}">
              <i class="fa-solid fa-floppy-disk"></i> Save Note
            </button>
          </div>
        </div>
      `;
    }

    function apply() {
      const items = filter === 'all' ? bookmarks : bookmarks.filter(b => b.type === filter);

      if (!bookmarks.length) {
        list.innerHTML = '';
        if (empty) empty.classList.remove('hidden');
        return;
      }
      if (items.length === 0) {
        list.innerHTML = `<p style="text-align:center;color:var(--text-muted);padding:2rem;">No bookmarks of this type.</p>`;
        if (empty) empty.classList.add('hidden');
      } else {
        list.innerHTML = items.map(cardHtml).join('');
        if (empty) empty.classList.add('hidden');
      }

      // Wire remove buttons
      list.querySelectorAll('[data-remove]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          removeBookmark(btn.dataset.remove);
          apply();
          if (countEl) countEl.textContent = `${bookmarks.length} item${bookmarks.length === 1 ? '' : 's'} saved`;
        });
      });

      // Wire save note buttons
      list.querySelectorAll('[data-save-note]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const id = btn.dataset.saveNote;
          const input = list.querySelector(`[data-note-id="${id}"]`);
          if (input) saveNote(id, input.value.trim());
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

    if (exportBtn) exportBtn.addEventListener('click', exportBookmarks);

    apply();
  };

  /* ---------- Public API ---------- */
  window.FV.toggleBookmark = toggleBookmark;
  window.FV.isBookmarked = isBookmarked;
  window.FV.addBookmark = addBookmark;
  window.FV.removeBookmark = removeBookmark;
  window.FV.exportBookmarks = exportBookmarks;
  window.FV.getBookmarkCount = () => bookmarks.length;

  /* ---------- Init ---------- */
  function init() {
    updateNavBadge();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('[FandomVerse] bookmarks.js loaded');
})();