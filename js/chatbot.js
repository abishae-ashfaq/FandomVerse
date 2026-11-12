/* ============================================================
   FANDOMVERSE — chatbot.js
   Rule-based chatbot using data/chatbot.json
   ============================================================ */

(function () {
  'use strict';

  window.FV = window.FV || {};

  const fab = document.getElementById('chatbotFab');
  if (!fab) {
    console.warn('[FandomVerse] Chatbot FAB not found');
    return;
  }

  // ---------- Build panel ----------
  const panel = document.createElement('div');
  panel.id = 'chatbotPanel';
  panel.className = 'fv-chat-panel';
  panel.innerHTML = `
    <header class="fv-chat-header">
      <div class="fv-chat-title">
        <span class="fv-chat-dot"></span>
        <strong>FandomVerse Assistant</strong>
      </div>
      <button class="fv-chat-close" id="chatClose" aria-label="Close chat">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </header>
    <div class="fv-chat-body" id="chatBody"></div>
    <div class="fv-chat-quick" id="chatQuick"></div>
    <form class="fv-chat-input" id="chatForm">
      <input
        type="text"
        id="chatInput"
        placeholder="Ask about anime, gaming, characters..."
        autocomplete="off"
      />
      <button type="submit" aria-label="Send">
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </form>
  `;
  document.body.appendChild(panel);

  const chatBody = document.getElementById('chatBody');
  const chatQuick = document.getElementById('chatQuick');
  const chatInput = document.getElementById('chatInput');
  const chatClose = document.getElementById('chatClose');
  const chatForm = document.getElementById('chatForm');

  let rules = [];
  let greeting = '';
  let quickReplies = [];
  let fallback = '';
  let rulesLoaded = false;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function loadRules() {
    const data = (window.FV && window.FV.DATA) || {};
    if (data.chatbot) {
      rules = data.chatbot.rules || [];
      greeting = data.chatbot.greeting || "Hi! I'm the FandomVerse assistant. Ask me about anime, gaming, or anything fandom!";
      quickReplies = data.chatbot.quickReplies || ['Anime', 'Gaming', 'Movies', 'Characters', 'Events', 'Merchandise'];
      fallback = data.chatbot.fallback || "I'm not sure about that yet. Try asking about anime, gaming, movies, characters, events or merchandise!";
      rulesLoaded = true;
      return true;
    }
    return false;
  }

  function addMessage(text, from, link) {
    const msg = document.createElement('div');
    msg.className = `fv-chat-msg fv-chat-${from}`;
    const linkHtml = link
      ? `<a href="${esc(link)}" class="fv-chat-link">Open <i class="fa-solid fa-arrow-right"></i></a>`
      : '';
    msg.innerHTML = `
      <div class="fv-chat-bubble">
        ${esc(text)}
        ${linkHtml}
      </div>
    `;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function renderQuickReplies() {
    if (!quickReplies.length) {
      chatQuick.innerHTML = '';
      return;
    }
    chatQuick.innerHTML = quickReplies.map(q =>
      `<button type="button" class="fv-quick-reply">${esc(q)}</button>`
    ).join('');

    chatQuick.querySelectorAll('.fv-quick-reply').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.textContent.trim();
        addMessage(text, 'user');
        setTimeout(() => respond(text), 300);
      });
    });
  }

  function matchRule(query) {
    const q = String(query || '').toLowerCase().trim();
    if (!q) return null;

    // Exact keyword first
    for (const rule of rules) {
      for (const kw of (rule.keywords || [])) {
        if (q === String(kw).toLowerCase()) return rule;
      }
    }
    // Substring match
    for (const rule of rules) {
      for (const kw of (rule.keywords || [])) {
        if (q.includes(String(kw).toLowerCase())) return rule;
      }
    }
    return null;
  }

  function respond(query) {
    if (!rulesLoaded) loadRules();
    const rule = matchRule(query);
    setTimeout(() => {
      if (rule) {
        addMessage(rule.answer, 'bot', rule.link);
      } else {
        addMessage(fallback, 'bot');
      }
    }, 350);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    chatInput.value = '';
    respond(text);
  }

  let initialized = false;

  function openChat() {
    panel.classList.add('open');

    if (!rulesLoaded) loadRules();

    if (!initialized && rulesLoaded) {
      initialized = true;
      addMessage(greeting, 'bot');
      renderQuickReplies();
    }

    if (!rulesLoaded) {
      // Data may still be loading — retry shortly
      setTimeout(openChat, 300);
    }

    setTimeout(() => chatInput.focus(), 250);
  }

  function closeChat() {
    panel.classList.remove('open');
  }

  fab.addEventListener('click', () => {
    if (panel.classList.contains('open')) closeChat();
    else openChat();
  });

  chatClose.addEventListener('click', closeChat);
  chatForm.addEventListener('submit', handleSubmit);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('open')) closeChat();
  });

  // Hide the ping on first open
  fab.addEventListener('click', () => {
    const ping = fab.querySelector('.fv-chatbot-ping');
    if (ping) ping.style.display = 'none';
  }, { once: true });

  console.log('[FandomVerse] chatbot.js loaded');
})();