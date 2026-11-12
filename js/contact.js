/* ============================================================
   FANDOMVERSE — contact.js
   Contact Us page: info cards, team, form, Google Map, GPS
   ============================================================ */

(function () {
  'use strict';

  window.FV = window.FV || {};

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  const CONTACT_INFO = {
    email: 'hello@fandomverse.com',
    phone: '+92 300 1234567',
    address: 'Tower 21, Clifton Block 5, Karachi, Pakistan',
    hours: 'Mon – Fri · 9 AM – 6 PM (PKT)',
  };

  const TEAM = [
    {
         name: 'Sherdad Khan',
      role: 'Content Manager',
      bio: 'Curates articles, reviews, and interviews across every fandom.',
      emoji: '◈'
      ,
    },
    {
      name: 'Abishae',
      role: 'Founder & Lead Editor',
      bio: 'Passionate about anime, gaming, and building communities for fans worldwide.',
      emoji: '✦',
    },
    {
      name: 'Hammad Abrar',
      role: 'Community Lead',
      bio: 'Runs events, fan meetups, and keeps the FandomVerse community thriving.',
      emoji: '✧',
    },
    
  ];

  const SOCIALS = [
    { icon: 'fa-brands fa-facebook-f', label: 'Facebook', href: '#' },
    { icon: 'fa-brands fa-instagram', label: 'Instagram', href: '#' },
    { icon: 'fa-brands fa-x-twitter', label: 'X', href: '#' },
    { icon: 'fa-brands fa-youtube', label: 'YouTube', href: '#' },
    { icon: 'fa-brands fa-discord', label: 'Discord', href: '#' },
  ];


    const MENTOR = [
    {
      name: 'Sir Lahman',
      role: 'Project Mentor & Guide',
      bio: 'A guiding force behind FandomVerse — shaping the vision and helping fans turn ideas into a thriving universe.',
      emoji: '★',
    },
  ];

  /* ============================================================
     CONTACT PAGE TEMPLATE
     ============================================================ */
  window.FV.contactTemplate = function () {
    return `
      <section class="fv-contact-hero">
        <div class="fv-contact-hero-bg"></div>
        <div class="fv-contact-hero-overlay"></div>
        <div class="fv-contact-hero-content container-fv">
          <span class="fv-section-kicker">Get in touch</span>
          <h1 class="fv-hub-title">Contact Us</h1>
          <p class="fv-hub-desc">
            Have a question, a suggestion, or want to collaborate? We'd love to hear from you.
          </p>
        </div>
      </section>

      <!-- Contact info cards -->
      <section class="fv-section">
        <div class="container-fv">
          <div class="fv-contact-info-grid">
            ${[
              { icon: 'fa-envelope',       label: 'Email',   value: CONTACT_INFO.email,   href: `mailto:${CONTACT_INFO.email}` },
              { icon: 'fa-phone',          label: 'Phone',   value: CONTACT_INFO.phone,   href: `tel:${CONTACT_INFO.phone.replace(/\\s/g, '')}` },
              { icon: 'fa-location-dot',   label: 'Address', value: CONTACT_INFO.address, href: null },
              { icon: 'fa-clock',          label: 'Hours',   value: CONTACT_INFO.hours,   href: null },
            ].map(c => `
              <div class="fv-contact-info-card">
                <div class="fv-contact-info-icon">
                  <i class="fa-solid ${c.icon}"></i>
                </div>
                <h4>${c.label}</h4>
                ${c.href
                  ? `<a href="${c.href}" class="fv-contact-info-value">${esc(c.value)}</a>`
                  : `<span class="fv-contact-info-value">${esc(c.value)}</span>`
                }
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Contact form + map -->
      <section class="fv-section fv-section-alt">
        <div class="container-fv">
          <div class="fv-contact-split">
            <!-- Left: form -->
            <div class="fv-contact-form-wrap">
              <h2 class="fv-contact-section-title">Send us a Message</h2>
              <p class="fv-contact-section-sub">We usually reply within 24 hours.</p>

              <form class="fv-contact-form" id="contactForm">
                <div class="fv-field">
                  <label for="cfName">Your Name</label>
                  <input type="text" id="cfName" required placeholder="John Doe" />
                </div>
                <div class="fv-field">
                  <label for="cfEmail">Email Address</label>
                  <input type="email" id="cfEmail" required placeholder="you@example.com" />
                </div>
                <div class="fv-field">
                  <label for="cfSubject">Subject</label>
                  <input type="text" id="cfSubject" required placeholder="What's this about?" />
                </div>
                <div class="fv-field">
                  <label for="cfMessage">Message</label>
                  <textarea id="cfMessage" required rows="5" placeholder="Tell us what's on your mind..."></textarea>
                </div>
                <button type="submit" class="btn-fv btn-fv-primary" style="width:100%;justify-content:center;">
                  <i class="fa-solid fa-paper-plane"></i> Send Message
                </button>
                <p class="fv-checkout-note">This is a demo form — no message is actually sent.</p>
              </form>
            </div>

            <!-- Right: map + GPS -->
            <div class="fv-contact-map-wrap">
              <h2 class="fv-contact-section-title">Find Us</h2>
              <p class="fv-contact-section-sub">Our team is based in Karachi, Pakistan.</p>

              <div class="fv-map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115896.23681121!2d66.99095155!3d24.8607343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e06651d4bbf%3A0x9cf92f3c3b6a2f73!2sKarachi%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                  width="100%"
                  height="360"
                  style="border:0;"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  title="FandomVerse Location"
                ></iframe>
              </div>

              <div class="fv-gps-row">
                <button type="button" class="btn-fv btn-fv-ghost" id="gpsBtn" style="gap:0.6rem;">
                  <i class="fa-solid fa-location-crosshairs"></i> Use My Location
                </button>
                <span class="fv-gps-status" id="gpsStatus">Click to detect your location via GPS</span>
              </div>

              <div class="fv-gps-result hidden" id="gpsResult">
                <h5><i class="fa-solid fa-map-pin"></i> Your Coordinates</h5>
                <div class="fv-gps-coord">
                  <span>Latitude</span><strong id="gpsLat">—</strong>
                </div>
                <div class="fv-gps-coord">
                  <span>Longitude</span><strong id="gpsLng">—</strong>
                </div>
                <div class="fv-gps-coord">
                  <span>Accuracy</span><strong id="gpsAcc">—</strong>
                </div>
                <p class="fv-gps-note" id="gpsAddress">Fetching address...</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Team -->
      <section class="fv-section">
        <div class="container-fv">
          <div class="fv-section-head">
            <span class="fv-section-kicker">The people behind</span>
            <h2 class="fv-section-title">Meet Our Team</h2>
            <p class="fv-section-sub">A small group of fans building a universe for fans.</p>
          </div>
          <div class="fv-team-grid">
            ${TEAM.map(m => `
              <div class="fv-team-card">
                <div class="fv-team-avatar">${esc(m.emoji)}</div>
                <h4>${esc(m.name)}</h4>
                <span class="fv-team-role">${esc(m.role)}</span>
                <p>${esc(m.bio)}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      
      <!-- Mentor -->
      <section class="fv-section">
        <div class="container-fv">
          <div class="fv-section-head">
            <span class="fv-section-kicker">The guiding force</span>
            <h2 class="fv-section-title">Meet Our Mentor</h2>
            <p class="fv-section-sub">The person who helped shape this universe of coding for us and the future.</p>
          </div>
          <div class="fv-team-grid">
            ${MENTOR.map(m => `
              <div class="fv-team-card fv-mentor-card">
                <div class="fv-team-avatar fv-mentor-avatar">${esc(m.emoji)}</div>
                <h4>${esc(m.name)}</h4>
                <span class="fv-team-role">${esc(m.role)}</span>
                <p>${esc(m.bio)}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Social -->
      <section class="fv-section fv-section-alt">
        <div class="container-fv fv-contact-socials">
          <h3 class="fv-contact-social-title">Connect with us</h3>
          <div class="fv-contact-socials-row">
            ${SOCIALS.map(s => `
              <a href="${s.href}" class="fv-contact-social-btn" aria-label="${esc(s.label)}" target="_blank" rel="noopener">
                <i class="${s.icon}"></i>
                <span>${esc(s.label)}</span>
              </a>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  };

  /* ============================================================
     WIRE UP CONTACT PAGE
     ============================================================ */
  window.FV.wireContact = function () {
    const form = document.getElementById('contactForm');
    const gpsBtn = document.getElementById('gpsBtn');
    const gpsStatus = document.getElementById('gpsStatus');
    const gpsResult = document.getElementById('gpsResult');

    // ----- Contact form -----
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.querySelector('#cfName').value.trim();

        // Success state
        showToast(`Thank you${name ? ', ' + name : ''}! Your message was received (demo).`);
        form.reset();
      });
    }

    // ----- GPS button -----
    if (gpsBtn) {
      gpsBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
          if (gpsStatus) gpsStatus.textContent = 'GPS not supported by your browser.';
          return;
        }

        if (gpsStatus) gpsStatus.textContent = 'Detecting your location...';
        gpsBtn.disabled = true;

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude.toFixed(6);
            const lng = pos.coords.longitude.toFixed(6);
            const acc = Math.round(pos.coords.accuracy);

            document.getElementById('gpsLat').textContent = lat + '°';
            document.getElementById('gpsLng').textContent = lng + '°';
            document.getElementById('gpsAcc').textContent = '±' + acc + ' meters';

            // Reverse geocode via OpenStreetMap Nominatim (free, no key)
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
              .then(r => r.json())
              .then(data => {
                const addr = data?.display_name || 'Address not available';
                const el = document.getElementById('gpsAddress');
                if (el) el.textContent = '📍 ' + addr;
              })
              .catch(() => {
                const el = document.getElementById('gpsAddress');
                if (el) el.textContent = '📍 Location detected (address unavailable)';
              });

            gpsResult.classList.remove('hidden');
            if (gpsStatus) gpsStatus.textContent = '✓ Location detected';
            gpsBtn.disabled = false;
          },
          (err) => {
            if (gpsStatus) {
              gpsStatus.textContent =
                err.code === 1 ? 'Permission denied. Please allow location access.' :
                err.code === 2 ? 'Location unavailable.' :
                err.code === 3 ? 'Location request timed out.' :
                'Could not get location.';
            }
            gpsBtn.disabled = false;
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
      });
    }
  };

  /* ---------- Shared toast ---------- */
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
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  console.log('[FandomVerse] contact.js loaded');
})();