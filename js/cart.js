/* ============================================================
   FANDOMVERSE — cart.js
   Shopping cart with localStorage persistence
   ============================================================ */

(function () {
  'use strict';

  window.FV = window.FV || {};

  const STORAGE_KEY = 'fv_cart_v1';

  /* ---------- Cart state ---------- */
  let items = loadCart();

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) { console.warn('[FandomVerse] Cart save failed', e); }
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  /* ---------- Core operations ---------- */
  function addItem(product, qty = 1) {
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        priceRange: product.priceRange,
        image: product.image,
        category: product.category,
        qty: qty,
      });
    }
    saveCart();
    updateBadge();
    renderDrawer();
    flashFab();
    showToast(`${product.name} added to cart`);
  }

  function removeItem(id) {
    items = items.filter(i => i.id !== id);
    saveCart();
    updateBadge();
    renderDrawer();
  }

  function setQty(id, qty) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (qty <= 0) return removeItem(id);
    item.qty = qty;
    saveCart();
    updateBadge();
    renderDrawer();
  }

  function clearCart() {
    items = [];
    saveCart();
    updateBadge();
    renderDrawer();
  }

  function totalItems() {
    return items.reduce((s, i) => s + i.qty, 0);
  }

  function subtotal() {
    return items.reduce((s, i) => s + (i.price || 0) * i.qty, 0);
  }

  /* ---------- Badge ---------- */
  function updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const n = totalItems();
    badge.textContent = n > 99 ? '99+' : String(n);
    badge.style.display = n > 0 ? 'flex' : 'none';
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
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function flashFab() {
    const fab = document.getElementById('cartFab');
    if (!fab) return;
    fab.classList.add('bump');
    setTimeout(() => fab.classList.remove('bump'), 400);
  }

  /* ---------- Drawer ---------- */
  function ensureDrawer() {
    let drawer = document.getElementById('cartDrawer');
    if (drawer) return drawer;

    drawer = document.createElement('div');
    drawer.id = 'cartDrawer';
    drawer.className = 'fv-cart-drawer';
    drawer.innerHTML = `
      <div class="fv-cart-backdrop" data-close></div>
      <aside class="fv-cart-panel" role="dialog" aria-label="Shopping cart">
        <header class="fv-cart-header">
          <h3><i class="fa-solid fa-bag-shopping"></i> Your Cart</h3>
          <button class="fv-cart-close" data-close aria-label="Close cart">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </header>
        <div class="fv-cart-body" id="cartBody"></div>
        <footer class="fv-cart-footer" id="cartFooter"></footer>
      </aside>
    `;
    document.body.appendChild(drawer);

    drawer.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) closeDrawer();
    });

    return drawer;
  }

  function renderDrawer() {
    const drawer = ensureDrawer();
    const body = drawer.querySelector('#cartBody');
    const footer = drawer.querySelector('#cartFooter');

    if (!items.length) {
      body.innerHTML = `
        <div class="fv-cart-empty">
          <i class="fa-solid fa-bag-shopping"></i>
          <h4>Your cart is empty</h4>
          <p>Add something from the Merchandise page to get started.</p>
          <a href="#/merchandise" class="btn-fv btn-fv-primary" data-close>
            <i class="fa-solid fa-store"></i> Browse Merchandise
          </a>
        </div>
      `;
      footer.innerHTML = '';
      return;
    }

    body.innerHTML = `
      <ul class="fv-cart-list">
        ${items.map(i => `
          <li class="fv-cart-item" data-id="${esc(i.id)}">
            <div class="fv-cart-thumb" style="background-image:url('${esc(i.image || '')}')"></div>
            <div class="fv-cart-info">
              <h5>${esc(i.name)}</h5>
              <span class="fv-cart-price">$${(i.price || 0).toFixed(2)}</span>
              <div class="fv-cart-qty">
                <button type="button" data-qty="-" data-id="${esc(i.id)}" aria-label="Decrease">
                  <i class="fa-solid fa-minus"></i>
                </button>
                <span>${i.qty}</span>
                <button type="button" data-qty="+" data-id="${esc(i.id)}" aria-label="Increase">
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
            <button type="button" class="fv-cart-remove" data-remove="${esc(i.id)}" aria-label="Remove">
              <i class="fa-solid fa-trash"></i>
            </button>
          </li>
        `).join('')}
      </ul>
    `;

    const sub = subtotal();
    const shipping = sub > 0 ? 5.00 : 0;
    const tax = sub * 0.05;
    const total = sub + shipping + tax;

    footer.innerHTML = `
      <div class="fv-cart-summary">
        <div class="fv-cart-row"><span>Subtotal</span><span>$${sub.toFixed(2)}</span></div>
        <div class="fv-cart-row"><span>Shipping</span><span>$${shipping.toFixed(2)}</span></div>
        <div class="fv-cart-row"><span>Tax (5%)</span><span>$${tax.toFixed(2)}</span></div>
        <div class="fv-cart-row fv-cart-total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
      </div>
      <button type="button" class="btn-fv btn-fv-primary fv-cart-checkout" id="cartCheckout">
        <i class="fa-solid fa-credit-card"></i> Proceed to Checkout
      </button>
      <button type="button" class="fv-cart-clear" id="cartClear">Clear Cart</button>
    `;

    // Wire qty buttons
    body.querySelectorAll('[data-qty]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const item = items.find(i => i.id === id);
        if (!item) return;
        setQty(id, item.qty + (btn.dataset.qty === '+' ? 1 : -1));
      });
    });

    // Wire remove buttons
    body.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => removeItem(btn.dataset.remove));
    });

    // Wire checkout + clear
    footer.querySelector('#cartCheckout').addEventListener('click', openCheckout);
    footer.querySelector('#cartClear').addEventListener('click', () => {
      if (confirm('Clear all items from your cart?')) {
        clearCart();
        showToast('Cart cleared');
      }
    });
  }

  /* ---------- Checkout ---------- */
  function openCheckout() {
    if (!items.length) return;

    const sub = subtotal();
    const shipping = 5.00;
    const tax = sub * 0.05;
    const total = sub + shipping + tax;

    let modal = document.getElementById('cartCheckoutModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'cartCheckoutModal';
      modal.className = 'fv-modal fv-checkout-modal';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="fv-modal-backdrop" data-close></div>
      <div class="fv-modal-content fv-checkout-content" role="dialog" aria-label="Checkout">
        <button class="fv-modal-close" data-close aria-label="Close">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="fv-checkout-inner">
          <div class="fv-checkout-icon">
            <i class="fa-solid fa-lock"></i>
          </div>
          <h2 class="fv-checkout-title">Checkout</h2>
          <p class="fv-checkout-sub">Review your order and confirm your purchase.</p>

          <div class="fv-checkout-summary">
            <div class="fv-cart-row"><span>Items</span><span>${totalItems()}</span></div>
            <div class="fv-cart-row"><span>Subtotal</span><span>$${sub.toFixed(2)}</span></div>
            <div class="fv-cart-row"><span>Shipping</span><span>$${shipping.toFixed(2)}</span></div>
            <div class="fv-cart-row"><span>Tax</span><span>$${tax.toFixed(2)}</span></div>
            <div class="fv-cart-row fv-cart-total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
          </div>

          <form class="fv-checkout-form" id="checkoutForm">
            <div class="fv-field">
              <label for="coName">Full Name</label>
              <input type="text" id="coName" required placeholder="Jane Doe" />
            </div>
            <div class="fv-field">
              <label for="coEmail">Email</label>
              <input type="email" id="coEmail" required placeholder="you@example.com" />
            </div>
            <div class="fv-field">
              <label for="coAddress">Shipping Address</label>
              <input type="text" id="coAddress" required placeholder="123 Fandom Street" />
            </div>
            <button type="submit" class="btn-fv btn-fv-primary" style="width:100%;justify-content:center;">
              <i class="fa-solid fa-circle-check"></i> Place Order — $${total.toFixed(2)}
            </button>
          </form>
          <p class="fv-checkout-note">This is a demo checkout — no real payment is processed.</p>
        </div>
      </div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Close handlers
    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) closeCheckout();
    });

    // Submit
    modal.querySelector('#checkoutForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = modal.querySelector('#coName').value.trim();
      closeCheckout();
      showSuccess(name);
    });

    // Show modal
    requestAnimationFrame(() => modal.classList.add('open'));
  }

  function closeCheckout() {
    const modal = document.getElementById('cartCheckoutModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => modal.remove(), 300);
  }

  function showSuccess(name) {
    const orderId = 'FV-' + Math.floor(100000 + Math.random() * 900000);

    let success = document.getElementById('cartSuccessModal');
    if (!success) {
      success = document.createElement('div');
      success.id = 'cartSuccessModal';
      success.className = 'fv-modal fv-checkout-modal';
      document.body.appendChild(success);
    }

    success.innerHTML = `
      <div class="fv-modal-backdrop" data-close></div>
      <div class="fv-modal-content fv-checkout-content" role="dialog" aria-label="Order confirmed">
        <div class="fv-checkout-inner fv-checkout-success">
          <div class="fv-success-icon">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <h2 class="fv-checkout-title">Order Confirmed!</h2>
          <p class="fv-checkout-sub">
            Thank you${name ? ', ' + esc(name) : ''}! Your order has been placed.
          </p>
          <div class="fv-order-id">
            <span>Order ID</span>
            <strong>${orderId}</strong>
          </div>
          <p class="fv-checkout-note">A confirmation email has been sent (demo — not real).</p>
          <button type="button" class="btn-fv btn-fv-primary" style="width:100%;justify-content:center;" data-close>
            <i class="fa-solid fa-thumbs-up"></i> Continue Shopping
          </button>
        </div>
      </div>
    `;

    // Clear cart now that order is placed
    clearCart();

    success.classList.add('open');
    document.body.style.overflow = 'hidden';

    success.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) {
        success.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(() => success.remove(), 300);
      }
    });
  }

  /* ---------- Drawer open/close ---------- */
  function openDrawer() {
    const drawer = ensureDrawer();
    renderDrawer();
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    const drawer = document.getElementById('cartDrawer');
    if (!drawer) return;
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ---------- Fab + Badge ---------- */
  function ensureCartFab() {
    // Add cart icon to navbar
    const actions = document.querySelector('.fv-nav-actions');
    if (actions && !document.getElementById('cartNavBtn')) {
      const cartBtn = document.createElement('button');
      cartBtn.id = 'cartNavBtn';
      cartBtn.className = 'fv-icon-btn fv-cart-nav-btn';
      cartBtn.title = 'Cart';
      cartBtn.setAttribute('aria-label', 'Cart');
      cartBtn.innerHTML = `
        <i class="fa-solid fa-bag-shopping"></i>
        <span class="fv-cart-badge" id="cartBadge" style="display:none;">0</span>
      `;
      cartBtn.addEventListener('click', openDrawer);

      // Insert to the right of the login button (before hamburger)
      const loginBtn = document.getElementById('loginBtn');
      const hamburger = document.getElementById('hamburger');
      if (loginBtn && loginBtn.parentNode === actions) {
        actions.insertBefore(cartBtn, loginBtn.nextSibling);
      } else if (hamburger) {
        actions.insertBefore(cartBtn, hamburger);
      } else {
        actions.appendChild(cartBtn);
      }
    }

    // Add mobile menu entry
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu && !document.getElementById('cartMobileBtn')) {
      const a = document.createElement('a');
      a.href = '#';
      a.id = 'cartMobileBtn';
      a.innerHTML = '<i class="fa-solid fa-bag-shopping"></i> Cart';
      a.addEventListener('click', (e) => {
        e.preventDefault();
        openDrawer();
        if (window.FV.closeMobile) window.FV.closeMobile();
      });
      mobileMenu.appendChild(a);
    }
  }

  /* ---------- Public API ---------- */
  window.FV.addToCart = (product, qty) => addItem(product, qty);
  window.FV.openCart = openDrawer;
  window.FV.closeCart = closeDrawer;
  window.FV.cartItems = () => items.slice();

  /* ---------- Init ---------- */
  function init() {
    ensureCartFab();
    ensureDrawer();
    updateBadge();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('[FandomVerse] cart.js loaded');
})();