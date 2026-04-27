/* ═══════════════════════════════════════════════════════════════════
   TRYST 2026 — Master Script  (Merged)
   ─────────────────────────────────────────────────────────────────
   Structure:
     § 01  Globals & Init
     § 02  Custom Cursor
     § 03  Mystery Lock
     § 04  Stars
     § 05  Hero Animations
     § 06  Navbar & Mobile Menu
     § 07  Horizontal Cards  (drag + inertia + touch + 3-D tilt)
     § 08  Nav Cards  (scroll / modal dispatch)
     § 09  Modal System  (general overlay)
     § 10  Events Modal  (day tabs + accordion)
     § 11  Surprise Artist  (dual-card reveal + timer lock)
     § 12  Schedule Tabs
     § 13  Gallery Lightbox
     § 14  Countdown Timer
     § 15  Scroll Animations  (IntersectionObserver + GSAP)
     § 16  Smooth Scroll Anchors
     § 17  Contact Form
     § 18  Attendee Registration Modal  (UI open / close)
     § 19  Console Signature
     § 20  TRYST Production System  (event data, modals, form submission)
             · Event data map  (TRYST_EVENTS)
             · Utility helpers
             · Events modal renderer
             · Event-detail modal  (window.openEventDetailModal / close)
             · Attendee form submission  (→ Google Sheets)
             · Event registration modal  (window.openEventRegModal / close)
             · Global dispatchers  (window.toggleEvent, goToEvent, openEventDetail)
     § 21  Form Integration  (iframe POST patch)
     § 22  Helpers  (getLatestRegId)
   ─────────────────────────────────────────────────────────────────
   NOTE: window.goToEvent, window.toggleEvent, window.openEventDetail,
         window.openEventDetailModal, window.closeEventDetailModal,
         window.openEventRegModal, window.closeEventRegModal
         are all defined inside § 20 (trystProductionSystem IIFE) and
         exposed globally. Earlier placeholder definitions have been removed.
═══════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   TRYST 2026 — Master Script
   Organized: Init → Cursor → Hero → Nav → Cards →
              Modals → Schedule → Gallery → Countdown → Scroll
═══════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const IS_MOBILE = window.innerWidth <= 768 || ('ontouchstart' in window);

/* ─── Scroll to top on page reload ─── */
window.onbeforeunload = () => window.scrollTo(0, 0);

/* ═══════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════ */
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  initStars();
  initHeroAnimations();
  initScrollAnimations();
});

/* ═══════════════════════════════════════════════
   CUSTOM CURSOR  (desktop only)
═══════════════════════════════════════════════ */
if (!IS_MOBILE) {
  const cursor         = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

  // Throttled mousemove — only update cursor every animation frame
  let lastMoveRaf = null;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursor) {
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    }
  }, { passive: true });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.14;
    followerY += (mouseY - followerY) * 0.14;
    if (cursorFollower) {
      cursorFollower.style.left = followerX + 'px';
      cursorFollower.style.top  = followerY + 'px';
    }
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Cursor expand on interactive elements
  document.querySelectorAll('a, button, .nav-card, .artist-card, .gallery-item, .schedule-tab, .event-header, [data-modal], [data-target]')
    .forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (!cursor || !cursorFollower) return;
        cursor.style.width  = '20px';
        cursor.style.height = '20px';
        cursorFollower.style.width       = '60px';
        cursorFollower.style.height      = '60px';
        cursorFollower.style.borderColor = 'rgba(201,168,76,0.8)';
      });
      el.addEventListener('mouseleave', () => {
        if (!cursor || !cursorFollower) return;
        cursor.style.width  = '10px';
        cursor.style.height = '10px';
        cursorFollower.style.width       = '36px';
        cursorFollower.style.height      = '36px';
        cursorFollower.style.borderColor = 'rgba(201,168,76,0.5)';
      });
    });
}

/* ═══════════════════════════════════════════════
   MYSTERY LOCK  (guarded — only runs if element exists)
═══════════════════════════════════════════════ */
const mysteryWrapper = document.getElementById('mysteryLock');
if (mysteryWrapper) mysteryWrapper.classList.add('locked');

function unlockMystery() {
  const wrapper = document.getElementById('mysteryLock');
  if (!wrapper) return;
  wrapper.classList.remove('locked');
  const overlay = wrapper.querySelector('.lock-overlay');
  if (overlay) overlay.remove();
  const btn = document.getElementById('revealBtnLocked');
  if (btn) { btn.classList.remove('locked-btn'); btn.style.pointerEvents = 'auto'; }
}

/* ═══════════════════════════════════════════════
   STARS  (reduced count on mobile)
═══════════════════════════════════════════════ */
function initStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  const count = IS_MOBILE ? 40 : 100;
  for (let i = 0; i < count; i++) {
    const star  = document.createElement('div');
    const size  = Math.random() * 2.5 + 0.5;
    const dur   = (Math.random() * 4 + 2).toFixed(1);
    const delay = (Math.random() * 5).toFixed(1);
    const opacity = (Math.random() * 0.7 + 0.2).toFixed(2);
    star.classList.add('star');
    star.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%; top:${Math.random()*100}%;
      --dur:${dur}s; --delay:${delay}s; --opacity:${opacity};
      animation-delay:${delay}s;
    `;
    container.appendChild(star);
  }
}

/* ═══════════════════════════════════════════════
   HERO ANIMATIONS
═══════════════════════════════════════════════ */
function initHeroAnimations() {
  // Show navbar after hero intro
  setTimeout(() => {
    const nb = document.getElementById('navbar');
    if (nb) nb.classList.add('visible');
  }, 1200);

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  tl
    .to('.hero-badge',         { opacity: 1, y: 0, duration: 0.55, delay: 0.05 })
    .to('.hero-logo-wrap',     { opacity: 1, y: 0, duration: 0.6  }, '-=0.3')
    .to('.hero-title',         { opacity: 1,        duration: 0.8  }, '-=0.35')
    .from('.hero-title-tryst', { y: 55, clipPath: 'inset(100% 0 0 0)', duration: 0.85 }, '<')
    .from('.hero-title-year',  { y: 38, clipPath: 'inset(100% 0 0 0)', duration: 0.7  }, '-=0.55')
    .to('.hero-line',          { opacity: 1, duration: 0.38 }, '-=0.28')
    .to('.hero-subtitle',      { opacity: 1, y: 0, duration: 0.48 }, '-=0.22')
    .to('.hero-date',          { opacity: 1, y: 0, duration: 0.38 }, '-=0.28')
    .to('.hero-cta',           { opacity: 1, y: 0, duration: 0.48 }, '-=0.22');

  // Mouse parallax — desktop only, throttled via GSAP
  if (!IS_MOBILE) {
    let parallaxRaf = null;
    document.addEventListener('mousemove', (e) => {
      if (parallaxRaf) return; // skip if a frame is already queued
      parallaxRaf = requestAnimationFrame(() => {
        parallaxRaf = null;
        const xP = (e.clientX / window.innerWidth  - 0.5) * 2;
        const yP = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to('#hero-bg-img',  { x: xP * -14, y: yP * -9, duration: 1.1, ease: 'power2.out', overwrite: 'auto' });
        gsap.to('.hero-content', { x: xP *   4, y: yP *  3, duration: 1.1, ease: 'power2.out', overwrite: 'auto' });
      });
    }, { passive: true });
  }

  // Scroll parallax
  gsap.to('#hero-bg-img', {
    y: '28%', ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });
}

/* ═══════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;
  if (scrollY > 80) {
    navbar.classList.add('visible', 'scrolled');
  } else {
    navbar.classList.remove('visible', 'scrolled');
  }
}, { passive: true });

/* ═══════════════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════════════ */
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const menuClose  = document.getElementById('menu-close');

menuToggle.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
  gsap.fromTo('.mobile-link',
    { y: 18, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.06, duration: 0.38, ease: 'expo.out', delay: 0.04 }
  );
});

menuClose.addEventListener('click', closeMobileMenu);
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', closeMobileMenu));

function closeMobileMenu() {
  gsap.to('.mobile-link', { y: 12, opacity: 0, stagger: 0.04, duration: 0.2, ease: 'power2.in' });
  setTimeout(() => { mobileMenu.classList.remove('open'); document.body.style.overflow = ''; }, 240);
}

/* ═══════════════════════════════════════════════
   HORIZONTAL CARDS — Drag + Inertia
═══════════════════════════════════════════════ */
const cardsTrack = document.getElementById('cardsTrack');
let isDragging = false, startX = 0, scrollLeftStart = 0;
let velocity = 0, lastMouseX = 0, rafId = null;

cardsTrack.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.pageX - cardsTrack.offsetLeft;
  scrollLeftStart = cardsTrack.scrollLeft;
  lastMouseX = e.pageX;
  cardsTrack.classList.add('grabbing');
  cancelAnimationFrame(rafId);
});

cardsTrack.addEventListener('mouseleave', endDrag);
cardsTrack.addEventListener('mouseup',    endDrag);

cardsTrack.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - cardsTrack.offsetLeft;
  cardsTrack.scrollLeft = scrollLeftStart - (x - startX);
  velocity   = e.pageX - lastMouseX;
  lastMouseX = e.pageX;
});

function endDrag() {
  if (!isDragging) return;
  isDragging = false;
  cardsTrack.classList.remove('grabbing');
  applyInertia();
}

function applyInertia() {
  if (Math.abs(velocity) < 0.5) return;
  cardsTrack.scrollLeft -= velocity * 0.8;
  velocity *= 0.92;
  rafId = requestAnimationFrame(applyInertia);
}

// Touch support
let touchStartX = 0;
let scrollStart = 0;

cardsTrack.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].pageX;
  scrollStart = cardsTrack.scrollLeft;
}, { passive: true });

cardsTrack.addEventListener('touchmove', (e) => {
  const currentX = e.touches[0].pageX;
  const delta = currentX - touchStartX;

  cardsTrack.scrollLeft = scrollStart - delta;
}, { passive: true });

/* ═══════════════════════════════════════════════
   CARD 3D TILT  (desktop only)
═══════════════════════════════════════════════ */
if (!IS_MOBILE) {
  document.querySelectorAll('.nav-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const rotateX = ((e.clientY - rect.top)  / rect.height - 0.5) * -14;
      const rotateY = ((e.clientX - rect.left) / rect.width  - 0.5) *  14;
      gsap.to(card, { rotateX, rotateY, transformPerspective: 1000, duration: 0.22, ease: 'power2.out', overwrite: 'auto' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.48, ease: 'expo.out' });
    });
  });
}

/* ═══════════════════════════════════════════════
   NAV CARDS — data-target → scroll, data-modal → modal
═══════════════════════════════════════════════ */
document.querySelectorAll('.nav-card[data-target]').forEach(card => {
  card.addEventListener('click', () => {
    const target = document.querySelector(card.getAttribute('data-target'));
    if (!target) return;
    gsap.to(window, { scrollTo: { y: target, offsetY: 76 }, duration: 0.85, ease: 'expo.inOut' });
  });
});

document.querySelectorAll('.nav-card[data-modal]').forEach(card => {
  card.addEventListener('click', () => {
    const map = {
      events: 'modal-events',
      surprise: 'modal-surprise'
    };
    const modalId = map[card.dataset.modal];
    if (modalId) openModal(modalId);
  });
});

/* ═══════════════════════════════════════════════
   MODAL SYSTEM
═══════════════════════════════════════════════ */
function openModal(modalId) {
  const overlay = document.getElementById('modal-overlay');
  const modal   = document.getElementById(modalId);
  if (!modal) return;
  overlay.classList.add('active');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
  document.getElementById('modal-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

window.closeModal = closeModal;

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeModal(); closeLightbox(); }
});

/* ═══════════════════════════════════════════════
   EVENTS MODAL — day tabs + item accordion
═══════════════════════════════════════════════ */

// Events modal day tabs
document.querySelectorAll('.events-modal-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const day = tab.dataset.eventsDay;
    document.querySelectorAll('.events-modal-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.events-modal-day').forEach(d => d.classList.remove('active'));
    const next = document.querySelector(`.events-modal-day[data-events-day="${day}"]`);
    if (next) next.classList.add('active');
  });
});

// Events modal item accordion
window.toggleEventsModalItem = function(row) {
  const item = row.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.events-modal-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
};

/* ─── window.goToEvent ────────────────────────────────────────────────
   Defined in § 20  TRYST Production System (see below).
   Closes the events modal, scrolls to the schedule section,
   switches the day tab, and opens the event-detail modal.
─────────────────────────────────────────────────────────────────── */

/* ═══════════════════════════════════════════════
   SURPRISE ARTIST — 3-CARD STAGE + TIMER LOCK + TAP MODAL
   ─────────────────────────────────────────────
   CONFIGURATION: Set UNLOCK_TIME to the exact
   datetime when the button becomes active.
   Format: 'YYYY-MM-DDTHH:MM:SS'  (local time)
═══════════════════════════════════════════════ */
(function surpriseArtistSystem() {

  // ── CONFIG ─────────────────────────────────
  const UNLOCK_TIME = new Date('2026-04-26T17:00:00'); // ← change this date/time
  // ───────────────────────────────────────────

  // ── ARTIST DATA ────────────────────────────
  // ✏️ Edit here to update artist 1's modal content
  const ARTIST1_DATA = {
    name:    'Ndee Kundu',
    genre:   'Haryanvi · Singer',
    image:   'images/kundu_wide.png',
    desc:    'Ndee Kundu is bringing the raw Haryanvi heat to TRYST. With hard-hitting beats and unapologetic swagger, his sound is built to shake the stage. From viral anthems to crowd-charging energy. Every performance hits loud, real, and straight from the roots.',
    tracks: [
      {
        name:   'Naam Tera',
        album:  'Ndee Kundu (Lofi)',
        art:    'images/naam_tera.jpg',
        spotify: 'https://open.spotify.com/track/4rmiJ39A6d9OIRrL3xGmaD?autoplay=true'
      },
      {
        name:   'Rose Garden',
        album:  'Rose Garden Ft. Isha Sharma',
        art:    'images/rose_gardan.jpg',
        spotify: 'https://open.spotify.com/track/6T4BknLAQWUHWIqQ1lqN0z?autoplay=true'
      },
      {
        name:   'Desi Haan Ji',
        album:  'Desi Haan Ji Ft. Bintu Pabra',
        art:    'images/desi_haan_ji.jpg',
        spotify: 'https://open.spotify.com/track/1LXUJ62m2Ak7ZuXSxkftgW?autoplay=true'
      },
      {
        name:   'His Grace',
        album:  'His Grace Ft. Bintu Pabra, Shine',
        art:    'images/his_grace.jpg',
        spotify: 'https://open.spotify.com/track/332MWQx06lB5rX26awlEou?autoplay=true'
      },
      {
        name:   'Teri Rahungi',
        album:  'Teri Rahungi Ft. Pranjal Dahiya',
        art:    'images/teri_rahungi.jpg',
        spotify: 'https://open.spotify.com/track/0qODrCWk5G94S5aYOUgfJx?autoplay=true'
      }
    ]
  };
  // ── END ARTIST1_DATA ──────────────────────

  // ✏️ Edit here to update artist 2's modal content
  const ARTIST2_DATA = {
    name:  'BEINGKARUN',
    genre: 'Punjabi · Producer',
    image: 'images/karan_wide.jpeg',
    desc:  'Karun is bringing pure indie heat to the TRYST stage. With smooth vocals and late-night vibe tracks, his music hits straight in the feels. Blending chill beats with raw emotion, he creates a sound that just sticks. From underrated gems to viral moments, he is ready to set the stage and the vibe of TRYST 2026',
    tracks: [
      {
        name:    'Maharani ',
        album:   'Qabool Hai (Deluxe)',
        art:     'images/maharani.jpg',
        spotify: 'https://open.spotify.com/track/7unLxuzKpxbjASww1qi4br?autoplay=true'
      },
      {
        name:    'Classmate ',
        album:   'Naina',
        art:     'images/classmate.jpg',
        spotify: 'https://open.spotify.com/track/0xKEqBJh5uYsjM4yYRdmyJ?autoplay=true'
      },
      {
        name:    'Mrignaini',
        album:   'Ik Tera',
        art:     'images/mrignaini.jpg',
        spotify: 'https://open.spotify.com/track/1nZ2O25UgnTFcPz3QrEDwX?autoplay=true'
      },
      {
        name:    'Chaand',
        album:   'Ishq Nachave',
        art:     'images/chaand.jpg',
        spotify: 'https://open.spotify.com/track/4pEUHCSy67GlG0s8dzZBAj?autoplay=true'
      },
      {
        name:    'Heeriye ',
        album:   'Dhoop',
        art:     'images/Heeriye.jpg',
        spotify: 'https://open.spotify.com/track/05NPGDwIBKcbVr3b32TfKs?autoplay=true'
      }
    ]
  };
  // ───────────────────────────────────────────

  const revealBtn      = document.getElementById('revealBtn');
  const lockOverlay    = document.getElementById('lockOverlay');
  const mysteryLock    = document.getElementById('mysteryLock');
  const unlockHint     = document.getElementById('surpriseUnlockHint');
  if (!revealBtn) return;

  let isRevealed    = false;
  let timerInterval = null;

  /* ── Lock / Unlock logic ─────────────────── */
  function checkUnlockTime() {
    const now  = new Date();
    const diff = UNLOCK_TIME - now;

    if (diff <= 0) {
      if (mysteryLock) mysteryLock.classList.remove('locked');
      if (lockOverlay) {
        gsap.to(lockOverlay, {
          opacity: 0, duration: 0.5,
          onComplete: () => { lockOverlay.style.display = 'none'; }
        });
      }
      if (unlockHint) unlockHint.textContent = 'The mystery is ready to be unveiled!';
      clearInterval(timerInterval);
    } else {
      if (mysteryLock) mysteryLock.classList.add('locked');
      const days = Math.floor(diff / 86400000);
      const hrs  = Math.floor((diff / 3600000) % 24);
      const pad  = n => String(n).padStart(2, '0');
      if (unlockHint) {
        unlockHint.textContent = days > 0 ? `Unlocks in ${days}d` : `Unlocks in ${pad(hrs)}h`;
      }
    }
  }

  checkUnlockTime();
  timerInterval = setInterval(checkUnlockTime, 1000);

  /* ── Reveal sequence ─────────────────────── */
  revealBtn.addEventListener('click', () => {
    if (isRevealed) return;
    if (mysteryLock.classList.contains('locked')) return;
    isRevealed = true;

    // Artist 1
    const question1 = document.getElementById('surpriseQuestion1');
    const img1      = document.getElementById('surpriseImg1');
    const revealed1 = document.getElementById('surpriseRevealed1');
    const veil1     = document.getElementById('surpriseVeil1');
    const glow1     = document.getElementById('surpriseGlowRing1');
    const hint1     = document.getElementById('surpriseTapHint1');

    // Artist 2
    const frame2    = document.getElementById('surpriseFrame2');
    const question2 = document.getElementById('surpriseQuestion2');
    const img2      = document.getElementById('surpriseImg2');
    const revealed2 = document.getElementById('surpriseRevealed2');
    const veil2     = document.getElementById('surpriseVeil2');
    const glow2     = document.getElementById('surpriseGlowRing2');

    // Artist 3
    const frame3    = document.getElementById('surpriseFrame3');
    const question3 = document.getElementById('surpriseQuestion3');
    const img3      = document.getElementById('surpriseImg3');
    const revealed3 = document.getElementById('surpriseRevealed3');
    const veil3     = document.getElementById('surpriseVeil3');
    const glow3     = document.getElementById('surpriseGlowRing3');

    const stage = document.getElementById('surpriseStage');

    createParticleBurst(stage);

    const tl = gsap.timeline();

    // 1. Hide button
    tl.to(revealBtn, { opacity: 0, y: 8, duration: 0.22 });

    // 2. Reveal Artist 1
    tl.to(question1, { opacity: 0, scale: 1.12, duration: 0.3, ease: 'power2.in' }, '+=0.1')
      .set(question1, { visibility: 'hidden' })
      .to(veil1, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, '<')
      .call(() => { img1.classList.add('revealed'); glow1.classList.add('active'); })
      .to({}, { duration: 0.8 })
      .call(() => revealed1.classList.add('show'));

    // 3. Artist 2 slides out from behind Artist 1 (left side)
    tl.call(() => {
        frame2.classList.remove('surprise-frame--hidden');
        frame2.classList.add('revealed-card');
        gsap.set(frame2, { opacity: 0, scale: 0.72, x: -80, rotateY: -18 });
      })
      .to(frame2, {
        opacity: 1, scale: 1, x: 0, rotateY: 0,
        duration: 0.9, ease: 'expo.out', transformPerspective: 1200
      }, '+=0.2')
      .to(question2, { opacity: 0, scale: 1.12, duration: 0.3, ease: 'power2.in' }, '-=0.3')
      .set(question2, { visibility: 'hidden' })
      .to(veil2, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, '<')
      .call(() => { img2.classList.add('revealed'); glow2.classList.add('active'); })
      .to({}, { duration: 0.8 })
      .call(() => revealed2.classList.add('show'));

    // 4. Artist 3 BURSTS from the centre — scale(0) → 1 with a slight bounce
    tl.call(() => createParticleBurst(stage))
      .call(() => {
        // Remove absolute positioning so it flows into flex layout
        frame3.classList.remove('surprise-frame--hidden', 'surprise-frame--center');
        frame3.classList.add('revealed-card');
        // Start: dead centre, tiny
        gsap.set(frame3, {
          opacity: 0, scale: 0, rotateY: 0,
          transformOrigin: 'center center',
          transformPerspective: 1200
        });
      }, [], '+=0.15')
      .to(frame3, {
        opacity: 1, scale: 1,
        duration: 1.05,
        ease: 'back.out(1.5)'  // pop/spring feel
      }, '+=0.05')
      .to(question3, { opacity: 0, scale: 1.12, duration: 0.3, ease: 'power2.in' }, '-=0.4')
      .set(question3, { visibility: 'hidden' })
      .to(veil3, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, '<')
      .call(() => { img3.classList.add('revealed'); glow3.classList.add('active'); })
      .to({}, { duration: 0.8 })
      .call(() => revealed3.classList.add('show'));

    // 5. Final burst + activate tap on card 1 and card 2
    tl.call(() => {
      createParticleBurst(stage);
      // Enable tap on Artist 1 card
      const frame1 = document.getElementById('surpriseFrame1');
      if (frame1) {
        frame1.classList.add('is-tappable');
        frame1.addEventListener('click', openArtistDetailModal, { once: false });
      }
      if (hint1) hint1.classList.add('visible');
      // Enable tap on Artist 2 card
      const frame2 = document.getElementById('surpriseFrame2');
      const hint2  = document.getElementById('surpriseTapHint2');
      if (frame2) {
        frame2.classList.add('is-tappable');
        frame2.addEventListener('click', openArtist2DetailModal, { once: false });
      }
      if (hint2) hint2.classList.add('visible');
    });

  });

  /* ── Artist Detail Modal ─────────────────── */
  const sadOverlay = document.getElementById('sadOverlay');
  const sadModal   = document.getElementById('sadModal');
  const sadCard    = document.getElementById('sadCard');
  const sadClose   = document.getElementById('sadClose');

  function openArtistDetailModal() {
    openArtistDetailModalWithData(ARTIST1_DATA);
  }

  function openArtist2DetailModal() {
    openArtistDetailModalWithData(ARTIST2_DATA);
  }

  function openArtistDetailModalWithData(d) {
    const heroImg  = document.getElementById('sadHeroImg');
    const nameEl   = document.getElementById('sadArtistName');
    const genreEl  = document.getElementById('sadGenre');
    const descEl   = document.getElementById('sadDesc');
    const tracksEl = document.getElementById('sadTracks');

    if (heroImg) { heroImg.src = d.image; heroImg.alt = d.name; }
    if (nameEl)  nameEl.textContent  = d.name;
    if (genreEl) genreEl.textContent = d.genre;
    if (descEl)  descEl.textContent  = d.desc;

    if (tracksEl) {
      tracksEl.innerHTML = d.tracks.map((t, i) => `
        <div class="sad-track" role="listitem">
          <span class="sad-track-num font-rajdhani">${i + 1}</span>
          <div class="sad-track-thumb">
            <img class="sad-track-art"
                 src="${t.art}"
                 alt="${escapeHTML(t.name)}"
                 onerror="this.style.background='#0D1530';this.style.display='block'" />
            <a class="sad-track-play"
               href="${t.spotify}"
               target="_blank"
               rel="noopener noreferrer"
               aria-label="Play ${escapeHTML(t.name)} on Spotify"
               title="Open on Spotify">
              &#9654;
            </a>
            <div class="sad-track-spotify-badge" aria-hidden="true">♪</div>
          </div>
          <div class="sad-track-info">
            <span class="sad-track-name">${escapeHTML(t.name)}</span>
            <span class="sad-track-meta">${escapeHTML(t.album)}</span>
          </div>
          <a class="sad-track-play-right font-rajdhani"
             href="${t.spotify}"
             target="_blank"
             rel="noopener noreferrer"
             aria-label="Open on Spotify"
             style="color:#1DB954;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;flex-shrink:0;padding:4px 8px;border:1px solid rgba(29,185,84,0.35);border-radius:3px;transition:background 0.2s"
             onmouseenter="this.style.background='rgba(29,185,84,0.12)'"
             onmouseleave="this.style.background='transparent'">▶ Play</a>
        </div>`).join('');
    }

    // Scroll body to top
    const body = sadCard.querySelector('.sad-body');
    if (body) body.scrollTop = 0;

    // Show
    sadOverlay.classList.add('sad-open');
    sadModal.classList.add('sad-open');
    document.body.style.overflow = 'hidden';

    gsap.fromTo(sadCard,
      { opacity: 0, scale: 0.91, y: 18 },
      { opacity: 1, scale: 1, y: 0, duration: 0.38, ease: 'expo.out', clearProps: 'transform' }
    );
  }

  function closeArtistDetailModal() {
    gsap.to(sadCard, {
      opacity: 0, scale: 0.93, y: 12, duration: 0.24, ease: 'power3.in',
      onComplete: () => {
        sadOverlay.classList.remove('sad-open');
        sadModal.classList.remove('sad-open');
        document.body.style.overflow = '';
        gsap.set(sadCard, { clearProps: 'all' });
      }
    });
  }

  if (sadClose)   sadClose.addEventListener('click', closeArtistDetailModal);
  if (sadOverlay) sadOverlay.addEventListener('click', closeArtistDetailModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sadModal?.classList.contains('sad-open')) closeArtistDetailModal();
  });

  // Expose for external use
  window.openArtistDetailModal  = openArtistDetailModal;
  window.openArtist2DetailModal = openArtist2DetailModal;
  window.closeArtistDetailModal = closeArtistDetailModal;

  /* HTML-escape helper (locally scoped) */
  function escapeHTML(str) {
    return String(str || '').replace(/[&<>"']/g, c =>
      ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
    );
  }

})();

function createParticleBurst(parent) {
  if (!parent) return;
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    const angle = (i / 14) * 360;
    const dist  = 70 + Math.random() * 50;
    p.style.cssText = `position:absolute;top:50%;left:50%;width:${Math.random()*4+2}px;height:${Math.random()*4+2}px;background:var(--gold);border-radius:50%;pointer-events:none;z-index:20;transform:translate(-50%,-50%);`;
    parent.appendChild(p);
    const rad = (angle * Math.PI) / 180;
    gsap.to(p, {
      x: Math.cos(rad) * dist, y: Math.sin(rad) * dist,
      opacity: 0, scale: 0, duration: 0.9, ease: 'power3.out',
      delay: Math.random() * 0.12,
      onComplete: () => p.remove()
    });
  }
}

/* ═══════════════════════════════════════════════
   SCHEDULE TABS
═══════════════════════════════════════════════ */
document.querySelectorAll('.schedule-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const day        = tab.dataset.day;
    const currentDay = document.querySelector('.schedule-day.active');
    const nextDay    = document.querySelector(`.schedule-day[data-day="${day}"]`);
    if (currentDay === nextDay) return;

    document.querySelectorAll('.schedule-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    gsap.to(currentDay, {
      opacity: 0, y: -10, duration: 0.18, ease: 'power2.in',
      onComplete: () => {
        currentDay.classList.remove('active');
        nextDay.classList.add('active');
        gsap.fromTo(nextDay,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.28, ease: 'expo.out' }
        );
        nextDay.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
      }
    });
  });
});

/* ─── window.toggleEvent ──────────────────────────────────────────────
   Defined in § 20  TRYST Production System (see below).
   Clicking an event header opens the event-detail modal
   instead of the old inline accordion.
─────────────────────────────────────────────────────────────────── */

/* ═══════════════════════════════════════════════
   GALLERY LIGHTBOX
   Works with Pinterest column masonry layout.
   Clicking any .gallery-item opens full-screen view.
═══════════════════════════════════════════════ */
const galleryItems    = document.querySelectorAll('.gallery-item');
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxClose   = document.getElementById('lightboxClose');
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxPrev    = document.getElementById('lightboxPrev');
const lightboxNext    = document.getElementById('lightboxNext');

let currentGalleryIndex = 0;
const galleryImages = [...galleryItems].map(item => item.dataset.src);

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => { currentGalleryIndex = i; openLightbox(galleryImages[i]); });
});

function openLightbox(src) {
  lightbox.classList.add('active');
  lightboxImg.src = src;
  document.body.style.overflow = 'hidden';
  gsap.fromTo(lightboxImg, { scale: 0.93, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.26, ease: 'expo.out' });
}

function closeLightbox() {
  if (!lightbox.classList.contains('active')) return;
  gsap.to(lightboxImg, {
    scale: 0.94, opacity: 0, duration: 0.16, ease: 'power2.in',
    onComplete: () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; }
  });
}

lightboxClose.addEventListener('click',   closeLightbox);
lightboxOverlay.addEventListener('click', closeLightbox);

lightboxPrev.addEventListener('click', () => {
  currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
  transitionLightboxImg(galleryImages[currentGalleryIndex], 'prev');
});
lightboxNext.addEventListener('click', () => {
  currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
  transitionLightboxImg(galleryImages[currentGalleryIndex], 'next');
});

function transitionLightboxImg(src, dir) {
  const xFrom = dir === 'next' ? 36 : -36;
  gsap.to(lightboxImg, {
    x: -xFrom, opacity: 0, duration: 0.14, ease: 'power2.in',
    onComplete: () => {
      lightboxImg.src = src;
      gsap.fromTo(lightboxImg, { x: xFrom, opacity: 0 }, { x: 0, opacity: 1, duration: 0.22, ease: 'expo.out' });
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (!lightbox || !lightbox.classList.contains('active')) return;
  if (e.key === 'ArrowLeft')  lightboxPrev.click();
  if (e.key === 'ArrowRight') lightboxNext.click();
  if (e.key === 'Escape')     closeLightbox();
});

/* ═══════════════════════════════════════════════
   COUNTDOWN TIMER
═══════════════════════════════════════════════ */
function updateCountdown() {
  const diff = new Date('2026-04-28T08:00:00') - new Date();
  const pad  = n => String(Math.max(0, n)).padStart(2, '0');
  const set  = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = pad(v); };
  if (diff <= 0) { ['days','hours','mins','secs'].forEach(id => set(id, 0)); return; }
  set('days',  Math.floor(diff / 86400000));
  set('hours', Math.floor((diff / 3600000) % 24));
  set('mins',  Math.floor((diff / 60000)   % 60));
  set('secs',  Math.floor((diff / 1000)    % 60));
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ═══════════════════════════════════════════════
   SCROLL ANIMATIONS  (IntersectionObserver)
═══════════════════════════════════════════════ */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('visible'), parseInt(entry.target.dataset.delay) || 0);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => {
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains('fade-up'));
    el.dataset.delay = siblings.indexOf(el) * 60;
    observer.observe(el);
  });

  const rightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      rightObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in-right').forEach(el => rightObserver.observe(el));
}

/* ═══════════════════════════════════════════════
   GSAP SCROLL TRIGGERS
═══════════════════════════════════════════════ */

// Section title reveals
gsap.utils.toArray('.section-title').forEach(title => {
  gsap.from(title, {
    scrollTrigger: { trigger: title, start: 'top 90%', toggleActions: 'play none none none' },
    opacity: 0, y: 22, duration: 0.58, ease: 'expo.out'
  });
});

// Artist cards stagger
ScrollTrigger.create({
  trigger: '.artists-grid', start: 'top 84%', once: true,
  onEnter: () => gsap.from('.artist-card', { opacity: 0, y: 28, stagger: 0.06, duration: 0.55, ease: 'expo.out', clearProps: "transform" })
});

// Gallery stagger — works with column masonry (items vary in height)
ScrollTrigger.create({
  trigger: '.gallery-masonry', start: 'top 88%', once: true,
  onEnter: () => gsap.from('.gallery-item', { opacity: 0, y: 20, stagger: { each: 0.06, from: 'start' }, duration: 0.45, ease: 'expo.out' })
});

// Register pulse — only on desktop (continuous animation is costly on mobile)
if (!IS_MOBILE) {
  ScrollTrigger.create({
    trigger: '#register', start: 'top 74%', once: true,
    onEnter: () => gsap.to('.btn-register', { boxShadow: '0 0 35px rgba(201,168,76,0.28)', repeat: -1, yoyo: true, duration: 1.1, ease: 'sine.inOut' })
  });
}

// Surprise glow
ScrollTrigger.create({
  trigger: '#surprise', start: 'top 74%', once: true,
  onEnter: () => gsap.to('.surprise-frame', { boxShadow: '0 0 35px rgba(26,42,94,0.75), 0 0 70px rgba(0,102,204,0.18)', duration: 0.9, ease: 'power2.out' })
});

// About bg parallax — desktop only
if (!IS_MOBILE) {
  gsap.to('.about-bg-decor', {
    y: -70, ease: 'none',
    scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: 1.5 }
  });
}

/* ═══════════════════════════════════════════════
   SMOOTH SCROLL ANCHORS
═══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    gsap.to(window, { scrollTo: { y: target, offsetY: 76 }, duration: 0.85, ease: 'expo.inOut' });
  });
});

/* ═══════════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════════ */
const sendBtn = document.querySelector('.contact-send-btn');
if (sendBtn) {
  sendBtn.addEventListener('click', function () {
    const inputs = document.querySelectorAll('.form-input');
    let valid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = 'rgba(255,80,80,0.5)';
        gsap.fromTo(input, { x: -4 }, { x: 4, repeat: 4, yoyo: true, duration: 0.07 });
        setTimeout(() => input.style.borderColor = '', 2000);
      }
    });
    if (valid) {
      this.innerHTML = '<span class="btn-inner">✦ Message Sent ✦</span><span class="btn-glow"></span>';
      inputs.forEach(i => i.value = '');
    }
  });
}

/* ═══════════════════════════════════════════════
   REGISTRATION MODAL
   Completely isolated — uses .reg-active class,
   separate overlay, separate GSAP timeline.
   Does NOT touch openModal() / closeModal().
═══════════════════════════════════════════════ */

function toggleTask(card) {
  document.querySelectorAll('.task-card').forEach(c => {
    if (c !== card) c.classList.remove('active');
  });
  card.classList.toggle('active');
}

/* ══════════════════════════════════════════════
   FITPASS SPONSOR TASK POPUP
   Single task with Android / iOS options
   Collects: platform, review date, handle name, screenshot
══════════════════════════════════════════════ */
(function taskPopupSystem() {

  const overlay     = document.getElementById('taskPopupOverlay');
  const popup       = document.getElementById('taskPopup');
  const uploadZone  = document.getElementById('taskPopupUploadZone');
  const uploadPrev  = document.getElementById('taskPopupUploadPreview');
  const uploadPH    = document.getElementById('taskPopupUploadPlaceholder');
  const taskCard    = document.getElementById('zone-task-1');
  const dateInput   = document.getElementById('tp-review-date');
  const realInput   = document.getElementById('reg-sponsor-1');
  const platformHid = document.getElementById('reg-fitpass-platform');
  const dateHid     = document.getElementById('reg-fitpass-review-date');

  if (!overlay || !popup) return;

  function todayISO() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 10);
  }

  if (dateInput && !dateInput.max) {
    dateInput.max = todayISO();
  }

  function platformLabel(platform) {
    return platform === 'ios' ? 'iOS' : 'Android';
  }

  function activePlatform() {
    return popup.dataset.platform || platformHid?.value || 'android';
  }

  function formatReviewDate(value) {
    const parts = String(value || '').split('-');
    if (parts.length !== 3) return value || '';
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  // ── Tab switching ──────────────────────────────
  window.switchTaskTab = function(platform) {
    popup.dataset.platform = platform;
    document.querySelectorAll('.tp-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.platform === platform)
    );
    document.querySelectorAll('.tp-panel').forEach(p =>
      p.classList.toggle('active', p.id === 'tp-panel-' + platform)
    );
  };

  // ── Open popup ─────────────────────────────────
  window.openTaskPopup = function() {
    const savedPlatform = platformHid?.value || popup.dataset.platform || 'android';
    window.switchTaskTab(savedPlatform);

    // Restore previously typed values
    if (dateInput) {
      dateInput.max = todayISO();
      dateInput.value = dateHid?.value || todayISO();
    }

    // Restore screenshot preview if already uploaded
    const hasFile = realInput?.files?.length > 0;
    if (hasFile) {
      _showUploadDone(realInput.files[0].name);
    } else {
      uploadZone.classList.remove('tp-has-file');
      uploadPrev.innerHTML = '';
      if (uploadPH) uploadPH.style.display = '';
    }

    // Wire upload zone click to the hidden file input
    uploadZone.onclick = function(e) {
      e.stopPropagation();
      realInput?.click();
    };

    overlay.classList.add('tp-active');
    popup.classList.add('tp-active');
    document.body.style.overflow = 'hidden';
  };

  window.closeTaskPopup = function() {
    overlay.classList.remove('tp-active');
    popup.classList.remove('tp-active');
    document.body.style.overflow = '';
  };

  function handleTaskCardOpen(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    window.openTaskPopup();
  }

  window.confirmTaskPopup = function() {
    const platform = activePlatform();
    const reviewDate = dateInput?.value || todayISO();
    const hasFile = realInput?.files?.length > 0;

    // Validate screenshot
    if (!hasFile) {
      uploadZone.style.borderColor = 'rgba(255,80,80,0.55)';
      setTimeout(() => uploadZone.style.borderColor = '', 1800);
      return;
    }

    // Persist task data into hidden fields so submit payload picks it up
    if (platformHid) platformHid.value = platform;
    if (dateHid) dateHid.value = reviewDate;
    if (dateInput) dateInput.value = reviewDate;

    // Update base task card to show completion
    const baseZone = document.getElementById('zone-task-1');
    const basePrev = document.getElementById('preview-task-1');
    if (basePrev) {
      basePrev.innerHTML =
        `<span class="reg-upload-submitted-icon">✅</span>` +
        `<span class="reg-upload-submitted-label">Submitted</span>` +
        `<span class="reg-upload-submitted-name">${escHTMLglobal(platformLabel(platform))} • ${escHTMLglobal(formatReviewDate(reviewDate))}</span>`;
    }
    baseZone?.classList.add('reg-has-file');
    baseZone?.classList.remove('reg-error');

    closeTaskPopup();
  };

  // File input change → update popup preview
  realInput?.addEventListener('change', () => {
    const file = realInput.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      uploadZone.style.borderColor = 'rgba(255,80,80,0.55)';
      setTimeout(() => uploadZone.style.borderColor = '', 1800);
      return;
    }
    _showUploadDone(file.name);
  });

  function _showUploadDone(name) {
    uploadZone.classList.add('tp-has-file');
    if (uploadPH) uploadPH.style.display = 'none';
    uploadPrev.innerHTML =
      `<span style="font-size:22px;display:block;margin-bottom:4px;">✅</span>` +
      `<span style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,168,76,0.75);font-family:'Rajdhani',sans-serif;display:block;">Screenshot uploaded</span>` +
      `<span style="font-size:12px;color:#E5C97E;font-family:'Cormorant Garamond',serif;display:block;margin-top:2px;">${escHTMLglobal(truncateNameGlobal(name, 22))}</span>`;
  }

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && popup.classList.contains('tp-active')) closeTaskPopup();
  });

  taskCard?.addEventListener('click', handleTaskCardOpen);
  taskCard?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') handleTaskCardOpen(e);
  });

  // Prevent popup click from closing via overlay handler
  popup.addEventListener('click', e => e.stopPropagation());

  // Shared helpers
  window.escHTMLglobal = str =>
    String(str || '').replace(/[&<>"']/g, c =>
      ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
    );
  window.truncateNameGlobal = (name, max = 14) =>
    (name || '').length > max ? name.slice(0, max - 1) + '…' : (name || '');

})();

(function () {
  /* ── Elements ─────────────────────────────── */
  const regOverlay  = document.getElementById('registerOverlay');
  const regModal    = document.getElementById('registerModal');
  const regCard     = document.getElementById('registerCard');
  const regCloseBtn = document.getElementById('registerCloseBtn');
  const regForm     = document.getElementById('registrationForm');
  const regNowBtn   = document.getElementById('register-now-btn');

  if (!regOverlay || !regModal || !regCard) return; // guard

  /* ── Open ─────────────────────────────────── */
  function openRegisterModal() {
    regOverlay.classList.add('reg-active');
    regModal.classList.add('reg-active');
    document.body.style.overflow = 'hidden';

    // GSAP: fade + scale-in
    gsap.fromTo(regCard,
      { opacity: 0, scale: 0.91, y: 22 },
      { opacity: 1, scale: 1,    y: 0,
        duration: 0.42,
        ease: 'expo.out',
        clearProps: 'transform' }
    );
  }

  /* ── Close ────────────────────────────────── */
  function closeRegisterModal() {
    // GSAP: fade + scale-out
    gsap.to(regCard, {
      opacity: 0,
      scale: 0.93,
      y: 14,
      duration: 0.26,
      ease: 'power3.in',
      onComplete: () => {
        regOverlay.classList.remove('reg-active');
        regModal.classList.remove('reg-active');
        document.body.style.overflow = '';
        // reset GSAP inline styles so next open starts fresh
        gsap.set(regCard, { clearProps: 'all' });
      }
    });
  }

  /* ── Trigger: "Register Now" button ──────── */
  if (regNowBtn) {
    regNowBtn.addEventListener('click', (e) => {
      e.preventDefault(); // stop Instagram redirect
      openRegisterModal();
    });
  }

  /* ── Close: button ────────────────────────── */
  if (regCloseBtn) {
    regCloseBtn.addEventListener('click', closeRegisterModal);
  }

  /* ── Close: overlay click ─────────────────── */
  regOverlay.addEventListener('click', closeRegisterModal);

  /* ── Close: Escape key ────────────────────── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && regModal.classList.contains('reg-active')) {
      closeRegisterModal();
    }
  });

  /* ── Image upload preview ─────────────────── */
  const uploadFields = [
    { inputId: 'reg-college-id', previewId: 'preview-college-id', zoneId: 'zone-college-id' },
  ];

  uploadFields.forEach(({ inputId, previewId, zoneId }) => {
    const input   = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const zone    = document.getElementById(zoneId);

    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;

      // ✅ Show file name instead of preview
      preview.innerHTML = `✔ Added<br>${file.name}`;

      // Optional: style tweak (so it looks clean)
      preview.style.backgroundImage = 'none';
      preview.style.display = 'flex';
      preview.style.alignItems = 'center';
      preview.style.justifyContent = 'center';
      preview.style.fontSize = '12px';
      preview.style.color = '#C9A84C';
      preview.style.textAlign = 'center';
      preview.style.padding = '10px';

      // Mark as uploaded
      zone.classList.add('reg-has-file');

      // Gold animation (keep your existing feel)
      gsap.fromTo(zone,
        { boxShadow: '0 0 0 2px rgba(201,168,76,0.6)' },
        { boxShadow: '0 0 0 0px rgba(201,168,76,0)',
          duration: 0.8, ease: 'power2.out' }
      );
    });
  });

  /* ── Inline field validation helper ──────── */
  function validateField(input) {
    const isEmpty = !input.value.trim();
    if (isEmpty) {
      input.classList.add('reg-error');
      gsap.fromTo(input,
        { x: -5 },
        { x: 5, repeat: 4, yoyo: true, duration: 0.07,
          onComplete: () => { gsap.set(input, { x: 0 }); }
        }
      );
    } else {
      input.classList.remove('reg-error');
    }
    return !isEmpty;
  }

  /* ── Form submit handler ──────────────────── */
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fields = regForm.querySelectorAll('.reg-input');
      let allValid = true;

      fields.forEach(field => {
        if (!validateField(field)) allValid = false;
      });

      if (!allValid) return;

      // Collect all values
      const formData = {
        fullName:    document.getElementById('reg-name').value.trim(),
        email:       document.getElementById('reg-email').value.trim(),
        phone:       document.getElementById('reg-phone').value.trim(),
        college:     document.getElementById('reg-college').value.trim(),
        course:      document.getElementById('reg-course').value.trim(),
        year:        document.getElementById('reg-year').value,
        gender:      document.getElementById('reg-gender').value,
        collegeId:        document.getElementById('reg-college-id').files[0] || null,
        fitpassScreenshot: document.getElementById('reg-sponsor-1')?.files[0] || null,
        fitpassHandle:     document.getElementById('reg-fitpass-handle')?.value?.trim() || '',
      };

      // TODO: Replace with Firebase integration
      console.group('%cTRYST 2026 — Registration Submitted', 'color:#C9A84C;font-weight:bold;font-size:14px;');
      console.table({
        'Full Name':    formData.fullName,
        'Email':        formData.email,
        'Phone':        formData.phone,
        'College':      formData.college,
        'Course':       formData.course,
        'Year':         formData.year,
        'Gender':       formData.gender,
        'College ID':   formData.collegeId  ? formData.collegeId.name  : '—',
        'Fitpass Handle':     formData.fitpassHandle     || '—',
        'Fitpass Screenshot': formData.fitpassScreenshot ? formData.fitpassScreenshot.name : '—',
      });
      console.groupEnd();

      // Success state
      const submitBtn = document.getElementById('regSubmitBtn');
      submitBtn.classList.add('reg-loading');
      submitBtn.querySelector('.reg-submit-inner').textContent = '✦ Submitted! ✦';

      gsap.to(regCard, {
        boxShadow: '0 0 0 2px rgba(201,168,76,0.5), 0 8px 32px rgba(0,0,0,0.6), 0 0 60px rgba(201,168,76,0.12)',
        duration: 0.5, ease: 'power2.out',
        onComplete: () => {
          gsap.to(regCard, {
            boxShadow: '0 0 0 1px rgba(201,168,76,0.06), 0 8px 32px rgba(0,0,0,0.6)',
            duration: 1.5, delay: 1, ease: 'power2.in'
          });
        }
      });

      // Auto-close after 2s
      setTimeout(() => closeRegisterModal(), 2200);
    });
  }

  // Expose for external use if needed
  window.openRegisterModal  = openRegisterModal;
  window.closeRegisterModal = closeRegisterModal;

})();

/* ═══════════════════════════════════════════════
   CONSOLE SIGNATURE
═══════════════════════════════════════════════ */
console.log('%cTRYST 2026', 'font-family:serif;font-size:28px;color:#C9A84C;font-weight:bold;');
console.log('%cWhere Legends Are Born', 'font-family:serif;font-size:13px;color:#E5C97E;font-style:italic;');
console.log('%cKeshav Mahavidyalaya · March 20–21, 2026', 'font-family:monospace;font-size:10px;color:#666;');

/* ═══════════════════════════════════════════════════════════════════
   § 20  TRYST PRODUCTION SYSTEM
   ─────────────────────────────────────────────────────────────────
   Single self-contained IIFE.  Provides:
     · TRYST_EVENTS data map (rich format / rules / judging per event)
     · Utility helpers  ($, escapeHTML, listHTML, toBase64, postJSON …)
     · renderEventsModal()    — dynamically fills events modal by day
     · syncScheduleLabels()   — keeps venue labels synced on schedule rows
     · window.toggleEvent     — opens event-detail modal on row click
     · window.openEventDetail — opens detail from modal-events list
     · window.goToEvent       — navigates to schedule + opens detail
     · window.openEventDetailModal / closeEventDetailModal
     · Attendee form → Google Sheets (hidden iframe POST)
     · window.openEventRegModal / closeEventRegModal  (3-step flow)
═══════════════════════════════════════════════════════════════════ */

(function trystProductionSystem() {
  const POST_URL = 'https://script.google.com/macros/s/AKfycbziAlj2zqIrnktyPRolQ3i_zctCi9EMp0vfFay6l5gEsfDbXKNgzzQPbUaVBRZLSACI/exec';

  const commonRules = [
    'Participants must carry valid college ID cards.',
    'Report on time and follow organiser instructions.',
    'Unsafe props or inappropriate content can lead to disqualification.',
    'The judges decision will be final.'
  ];

  const commonJudging = [
    'Creativity and originality',
    'Execution and presentation',
    'Stage presence',
    'Overall impact'
  ];

  const TRYST_EVENTS = {
    'lamp-lighting': {
      day: '1',
      title: 'Lamp Lighting',
      society: 'TRYST Organising Committee',
      time: '10:00 AM',
      location: 'Main Auditorium',
      poster: 'images/posters/campus.webp',
      description: 'The ceremonial opening of TRYST 2026 with the organising team, faculty, guests, and student representatives. This sacred tradition marks the beginning of two days of cultural excellence, welcoming all participants and guests to the festival.',
      descriptionOnly: true
    },
    'dj-night': {
      day: '1',
      title: 'DJ Night',
      society: 'TRYST Organising Committee',
      time: '6:00 PM',
      location: 'Main Stage',
      poster: 'images/posters/campus.webp',
      description: "Get ready to end the day on a high note with an electrifying DJ Night at TRYST’26. As the sun sets, the campus transforms into a high-energy arena of music, lights, and unstoppable vibes. Featuring dynamic beats across genres — from Bollywood and commercial hits to EDM and techno — the night promises an immersive experience that keeps the crowd moving. With powerful sound, dazzling lighting, and a charged atmosphere, DJ Night is where the entire fest comes alive. Whether you're dancing with your friends, vibing with the crowd, or just soaking in the energy, this is the ultimate celebration you don’t want to miss.",
      descriptionOnly: true,
    },
    'star-night': {
      day: '1',
      title: 'Artist Night',
      society: 'TRYST Organising Committee',
      time: '6:00 PM',
      location: 'Main Stage',
      poster: 'images/posters/campus.webp',
      description: "Get ready for the most anticipated highlight of TRYST’26 — the Artist Special Performance. As the energy of the fest reaches its peak, the stage comes alive with a spectacular live act by a renowned artist, delivering an unforgettable musical experience. From chart-topping hits to crowd-favorite anthems, the performance promises a perfect blend of music, energy, and connection. With a massive crowd, powerful sound, and electrifying stage presence, this is where the entire fest unites to celebrate music at its finest.",
      descriptionOnly: true,
    },
    'inaayat': {
      contactOnly: true,
      day: '1',
      title: 'Inaayat',
      society: 'Advaitaa Dance Society',
      societyDesc: 'Established in 2012, Advaitaa, the Western Dance Society of Keshav Mahavidyalaya, has evolved into a high-energy powerhouse of rhythm, precision, and stage presence. Known for its avant-garde choreography and technical finesse, the society has consistently dominated the Delhi dance circuit. From prestigious stages like IIT Delhi, IIM Kashipur, and IIT Jodhpur to major inter-college competitions, Advaitaa has built a legacy of excellence with numerous top positions and accolades. Blending storytelling with explosive performances, the team continues to set benchmarks in Western dance while captivating audiences across platforms.',
      time: 'TBA',
      location: 'Auditorium',
      poster: 'images/posters/Inaayat.png',
      description: 'Inaayat is a Western Group Dance Competition featuring team performances in front of judges where synchronization, choreography, and stage presence define the performance.',
      format: [
        'Team performances in front of judges',
        'Performances will be judged and top teams will secure winning positions',
        'Time Limit: 6–8 minutes per team (strictly followed)',
        'Audio: Teams must bring their music in a pen drive'
      ],
      rules: [
        'Only college teams are allowed',
        'Minimum 5 members in each team',
        'Western dance styles should be the main focus',
        'Props are allowed but must be safe and manageable',
        'Any vulgar or inappropriate content will lead to disqualification',
        'Participants must carry their college ID cards',
        'Teams must follow the time limit strictly',
        'Judges’ decision will be final and binding'
      ],
      judging: [
        'Choreography and formations',
        'Synchronization and teamwork',
        'Energy and execution',
        'Creativity and originality',
        'Stage presence and crowd connection'
      ],
      supportSection: [
        'Vibhuti - 8700796359',
        'Pushkar - 8448935899'
      ],
      societyLink: '#student-union'
    },
    'aaghaaz': {
      contactOnly: true,
      day: '2',
      title: 'AAGHAZ',
      society: 'Advaitaa Dance Society',
      societyDesc: 'Established in 2012, Advaitaa, the Western Dance Society of Keshav Mahavidyalaya, has evolved into a high-energy powerhouse of rhythm, precision, and stage presence. Known for its avant-garde choreography and technical finesse, the society has consistently dominated the Delhi dance circuit. From prestigious stages like IIT Delhi, IIM Kashipur, and IIT Jodhpur to major inter-college competitions, Advaitaa has built a legacy of excellence with numerous top positions and accolades. Blending storytelling with explosive performances, the team continues to set benchmarks in Western dance while captivating audiences across platforms.',
      time: '2:00 PM - 3:00 PM',
      location: 'Auditorium',
      poster: 'images/posters/Aaghaaz.png',
      description: 'AAGHAZ is a street battle event — a collective test of synergy, power, and strategy featuring head-on, face-to-face battles and 1v1 solo battles where dancers adapt to DJ-selected tracks on the spot.',
      format: [
        'Crew vs Crew: Head-on, face-to-face battles with immediate knockout rounds until the final showdown',
        '1v1 Solo Battle: Prelims solo set followed by bracket-style knockout rounds until a champion is crowned',
        'Audio: Tracks are selected and played by the DJ on the spot'
      ],
      rules: [
        'Prepared sets and synchronized routines are permitted and encouraged for crew battles',
        'Freestyle is highly encouraged in both formats to show musical adaptability',
        'Use of inappropriate gestures, offensive signage, or derogatory behaviour will result in immediate disqualification',
        'Dancers must stay within the designated battle zone',
        'Participants must respect the exchange format (no interrupting an opponent’s round)',
        'Professionalism must be maintained throughout the event'
      ],
      judging: [
        'Precision and complexity of team routines',
        'Originality and creative innovation',
        'Musicality and accuracy in hitting beats',
        'Individuality and personal style',
        'Stage presence and crowd engagement'
      ],
      societyLink: '#student-union',
      supportSection: [
      'Vibhuti - 8700796359',
      'Pushkar - 8448935899'
    ],
    },
    'nocturne': {
      contactOnly: true,
      day: '1',
      title: 'Nocturne',
      society: 'Anhad – Western Music Society',
      societyDesc: 'Founded in 2014, Anhaad stands as the premier music society of Keshav Mahavidyalaya, celebrated for its versatility across Indian fusion, classical choir, and Western a cappella. With a legacy that began with a historic win at Antardhwani, the society has gone on to secure over 25 prestigious titles across institutions like NIT Delhi and LBSIM. Known for its refined compositions, vocal excellence, and musical depth, Anhaad continues to dominate the competitive circuit while pushing creative boundaries.',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Nocturne.png',
      description: 'Nocturne is an western competition that celebrates the art of vocal music in its purest form where teams create music using only their voices, blending harmonies, rhythm, and creativity to deliver impactful performances under the theme Scarlett — embodying boldness, passion, and powerful, unapologetic energy.',
      format: [
        'Online Round (Prelims): Submit a raw and unedited video of their performance',
        'Shortlisting based on vocal quality, creativity, and overall impact',
        'Offline Round (Finals): Shortlisted teams perform live'
      ],
      rules: [
        'Strictly no use of musical instruments or pre-recorded instrumental tracks',
        'Only vocal music is allowed (beatboxing/vocal percussion permitted)',
        'Time limit: 8–12 minutes',
        'Any inappropriate content will lead to disqualification',
        'Participants must carry valid college IDs',
        'The decision of the judges will be final and binding',
        'Participants will be disqualified if found not adhering to the rules and regulations'
      ],
      judging: [
        'Vocal quality',
        'Creativity',
        'Overall impact',
        'Harmony and rhythm',
        'Stage presence'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Priyanka Verma - 9463652044',
        'Vishishta - 8920704038'
      ],
    },
    'khayaal': {
      contactOnly: true,
      day: '1',
      title: 'Khayaal',
      society: 'Anhaad – Indian Music Society',
      societyDesc: 'Founded in 2014, Anhaad stands as the premier music society of Keshav Mahavidyalaya, celebrated for its versatility across Indian fusion, classical choir, and Western a cappella. With a legacy that began with a historic win at Antardhwani, the society has gone on to secure over 25 prestigious titles across institutions like NIT Delhi and LBSIM. Known for its refined compositions, vocal excellence, and musical depth, Anhaad continues to dominate the competitive circuit while pushing creative boundaries.',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Khayaal.png',
      description: 'Khayaal is an Indian classical choir competition that celebrates harmony, heritage, and collective musical expression where voices come together to present traditional compositions rooted in ragas and rhythm, creating a powerful and unified musical experience.',
      format: [
        'Online Round (Prelims): Teams submit a single-take, unedited performance video via Google Drive link',
        'Shortlisting based on musicality, harmony, and overall presentation',
        'Offline Round (Finals): Shortlisted teams perform live at the venue'
      ],
      rules: [
        'Only one entry per college is allowed',
        'Performance video must be recorded in a single take without edits',
        'Time limit for prelim video: 10 minutes',
        'Minimum 6 participants per team (excluding instrumentalists)',
        'Maximum 12 vocalists and 3 instrumentalists allowed',
        'Bollywood and semi-classical songs are strictly prohibited',
        'Participants must bring their own instruments (Electronic Tanpura allowed)',
        'All participants must carry valid college ID cards',
        'The decision of the judges will be final and binding'
      ],
      judging: [
        'Harmony and coordination',
        'Musicality and composition',
        'Authenticity of classical form',
        'Stage presentation'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Lavanya - 9871042278',
        'Karan - 9810237028'
      ],
    },
    'rebuttal': {
      contactOnly: true,
      day: '1',
      title: 'Rebuttal’26',
      society: 'Vagmitā – DebSoc',
      societyDesc: 'Vagmita DebSoc is one of the most accomplished debating societies at Keshav Mahavidyalaya, actively engaging in parliamentary debates, extempore, group discussions, and diverse debating formats in both English and Hindi. The society has earned significant recognition across the debating circuit, including the prestigious "Best Society" title by Education Tree. With consistent victories and "Best Speaker" awards across top institutions, Vagmita fosters a culture of critical thinking and meaningful discourse, where disagreement is embraced as a path to deeper understanding.',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Rebuttal’26.png',
      description: 'Rebuttal’26 is an English Debate Competition featuring conventional debate rounds where participants engage in structured arguments and rebuttals with motions revealed prior to each round.',
      format: [
        'Round 1: Conventional Debate (motion revealed 24 hours prior)',
        'Round 2: Conventional Debate (motion revealed 10 minutes prior)'
      ],
      rules: [
        'Open to undergraduate and postgraduate students',
        'The debate will be conducted strictly in English',
        'Each participant will have 3 minutes for speech and 1 minute for rebuttal/Q&A',
        'Registration is free; a ₹100 refundable security deposit applies',
        'Limited slots; final allocation at the discretion of the organizing committee'
      ],
      judging: [
        'Content and argument quality',
        'Rebuttal effectiveness',
        'Clarity and articulation',
        'Confidence and delivery',
        'Overall impact'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Komal - +91 74283 90075',
        'Rishita - +91 63888 03736'
      ],
    },
    'khandan': {
      contactOnly: true,
      day: '1',
      title: 'खंडन’26',
      backendTitle: "Khandan'26",  // used in sheet name, email pass, reg ID
      society: 'Vagmita – DebSoc',
      societyDesc: 'Vagmita DebSoc is one of the most accomplished debating societies at Keshav Mahavidyalaya, actively engaging in parliamentary debates, extempore, group discussions, and diverse debating formats in both English and Hindi. The society has earned significant recognition across the debating circuit, including the prestigious "Best Society" title by Education Tree. With consistent victories and "Best Speaker" awards across top institutions, Vagmita fosters a culture of critical thinking and meaningful discourse, where disagreement is embraced as a path to deeper understanding.',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/खंडन’26.png',
      description: 'खंडन’26 is a Hindi debate competition that challenges participants to present structured arguments, defend perspectives, and engage in critical discourse through clarity of thought and impactful delivery.',
      format: [
        'Round 1: Conventional debate (topic revealed 24 hours prior)',
        'Round 2: Conventional debate (topic revealed 10 minutes prior)'
      ],
      rules: [
        'Open to undergraduate and postgraduate students',
        'Debate will be conducted entirely in Hindi',
        'Each participant gets 3 minutes for speech and 1 minute for rebuttal/Q&A',
        'Limited slots; final selection at the discretion of the organizing committee',
        'The decision of the judges will be final and binding'
      ],
      judging: [
        'Content and clarity',
        'Argument strength',
        'Rebuttal ability',
        'Confidence and delivery'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Vaibhav - 9818834790',
        'Vanshika - 9871760966'
      ],
    },
    'jhalak': {
      day: '1',
      title: 'Jhalak',
      society: 'Illuminati – Photography Society',
      societyDesc: 'Formed on 19th August 2014, Illuminati is the Photography Society of Keshav Mahavidyalaya, dedicated to transforming passion into visual storytelling. With achievements ranging from top positions at SGND Khalsa College to national-level recognition, the society has built a strong reputation across the DU circuit. Illuminati focuses on both technical mastery and creative expression, empowering members to capture moments that are impactful, meaningful, and visually compelling.',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Jhalak.png',
      description: 'JHALAK is an on-the-spot photostory competition where participants are given a theme or subject and must capture a series of photographs within a limited time, weaving them into a cohesive and compelling visual narrative. The event tests creativity, storytelling, spontaneity, and a keen eye for detail.',
      format: [
        'Theme or subject is given on the spot',
        'Participants capture photographs within the given time',
        'Best shot is evaluated based on creativity and execution'
      ],
      rules: [
        'Participants must adhere to the given theme or subject',
        'Photos must be captured within the allotted time only',
        'Basic editing may be allowed unless specified otherwise',
        'Any form of plagiarism or use of old photos will lead to disqualification',
        'Participants must follow event guidelines and instructions'
      ],
      judging: [
        'Creativity and originality',
        'Eye for detail',
        'Composition and framing',
        'Relevance to theme',
        'Overall impact'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Viswajith P V - 9971284243',
        'Akansha Bisht - 9266869504'
      ],
    },
    'cinematica': {
      day: '1',
      title: 'Cinematica',
      society: 'Illuminati – Photography Society',
      societyDesc: 'Formed on 19th August 2014, Illuminati is the Photography Society of Keshav Mahavidyalaya, dedicated to transforming passion into visual storytelling. With achievements ranging from top positions at SGND Khalsa College to national-level recognition, the society has built a strong reputation across the DU circuit. Illuminati focuses on both technical mastery and creative expression, empowering members to capture moments that are impactful, meaningful, and visually compelling.',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Cinematica.png',
      description: 'Cinematica is an on-the-spot reel-making competition that challenges participants to create a complete visual story within 30 seconds, testing creativity, storytelling, and execution in real time.',
      format: [
        'Theme revealed on the spot at the venue',
        'Participants conceptualize, shoot, and edit within the given time',
        'Final reel submission at the venue'
      ],
      rules: [
        'Reel must be strictly 30 seconds long',
        'All content must be created on the spot — no pre-recorded footage allowed',
        'Participants must use their own devices',
        'Any inappropriate content will lead to disqualification',
        'The decision of the judges will be final and binding'
      ],
      judging: [
        'Storytelling',
        'Creativity and concept',
        'Editing and execution',
        'Originality'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Viswajith - 9971284243',
        'Akansha - 9266869504'
      ],
    },
    'pixel': {
      day: '1',
      title: 'Pixel 6.0',
      society: 'Illuminati – Photography Society',
      societyDesc: 'Formed on 19th August 2014, Illuminati is the Photography Society of Keshav Mahavidyalaya, dedicated to transforming passion into visual storytelling. With achievements ranging from top positions at SGND Khalsa College to national-level recognition, the society has built a strong reputation across the DU circuit. Illuminati focuses on both technical mastery and creative expression, empowering members to capture moments that are impactful, meaningful, and visually compelling.',
      time: 'TBA',
      location: 'Online',
      poster: 'images/posters/Pixel 6.0.png',
      description: 'PIXEL-6.0 is an online photography competition where participants submit a series of photographs that together narrate a compelling story, with each image building on the last to create a powerful visual narrative. Entries will be evaluated based on creativity, storytelling, composition, and overall impact.',
      format: [
        'Participants submit a series of photographs',
        'Images must collectively narrate a story',
        'Entries are evaluated as a complete visual narrative'
      ],
      rules: [
        'Photos must form a continuous and meaningful story',
        'Images must be original and captured by the participant',
        'Basic editing is allowed unless specified otherwise',
        'Any plagiarism will lead to disqualification',
        'Submission must follow the given guidelines and format'
      ],
      judging: [
        'Storytelling and narrative flow',
        'Creativity and originality',
        'Visual consistency',
        'Composition and technique',
        'Overall impact'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Viswajith P V - 9971284243',
        'Akansha Bisht - 9266869504'
      ],
    },
    'lenscraft': {
      day: '1',
      title: 'Lenscraft',
      society: 'Illuminati – Photography Society',
      societyDesc: 'Formed on 19th August 2014, Illuminati is the Photography Society of Keshav Mahavidyalaya, dedicated to transforming passion into visual storytelling. With achievements ranging from top positions at SGND Khalsa College to national-level recognition, the society has built a strong reputation across the DU circuit. Illuminati focuses on both technical mastery and creative expression, empowering members to capture moments that are impactful, meaningful, and visually compelling.',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Lenscraft.png',
      description: 'Lenscraft is a photography exhibition that showcases powerful visual narratives through landscapes, portraits, and creative compositions, celebrating the art of storytelling through still imagery. This is an open exhibition — no registration required.',
      descriptionOnly: true
    },
    'draped_duality': {
      day: '1',
      title: 'Draped Duality',
      society: 'Maniera – Fine Arts Society',
      societyDesc: 'Maniera, the Fine Arts Society of Keshav Mahavidyalaya, serves as a vibrant platform for artistic expression and creativity. From painting and sketching to installations and décor, the society nurtures diverse art forms while consistently winning accolades across competitions. Known for adding aesthetic value to college events through rangolis and creative designs, Maniera fosters a space where every artist can explore, experiment, and excel.',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Draped Duality.png',
      description: 'Draped Duality is a Newspaper Dressing Competition where teams transform everyday newspaper into extraordinary wearable art under the theme "Contrast of Two Things", embodying duality such as chaos and calm, tradition and modernity, strength and fragility.',
      format: [
        'Team of 3–4 members',
        'Newspapers are provided on the spot',
        'Duration: 4 hours to design, construct, and present the outfit',
        'Each team is assigned a random prop via lottery to be incorporated',
        'Presentation of the outfit concept is part of the event'
      ],
      rules: [
        'Only newspapers provided on the spot must be used',
        'Teams must incorporate the assigned random prop',
        'Outfit must reflect the theme "Contrast of Two Things"',
        'Participants must complete design and construction within 4 hours',
        'Presentation of concept is mandatory',
        'Open to all college students'
      ],
      judging: [
        'Creativity and concept of duality',
        'Innovation in use of newspaper',
        'Craftsmanship and construction',
        'Presentation and storytelling',
        'Overall visual impact'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Pariksha Negi - 9205845788',
        'Ahsan Raqeeb - 8700594375'
      ],
    },
    'reframe_the_fame': {
      day: '1',
      title: 'Reframe the Fame',
      society: 'Maniera – Fine Arts Society',
      societyDesc: 'Maniera, the Fine Arts Society of Keshav Mahavidyalaya, serves as a vibrant platform for artistic expression and creativity. From painting and sketching to installations and décor, the society nurtures diverse art forms while consistently winning accolades across competitions. Known for adding aesthetic value to college events through rangolis and creative designs, Maniera fosters a space where every artist can explore, experiment, and excel.',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Reframe the Fame.png',
      description: 'Reframe the Fame is a solo painting competition where the theme is revealed on the spot, giving participants an unscripted starting point to interpret and bring their vision to life.',
      format: [
        'Solo participation',
        'Theme revealed on the spot',
        'A3 sheet provided by organisers',
        'Participants bring their own art materials',
        'Duration: 2 hours'
      ],
      rules: [
        'Participants must bring their own art materials',
        'Artwork must be created within the given time',
        'Theme must be followed strictly',
        'Any plagiarism will lead to disqualification',
        'Open to all college students'
      ],
      judging: [
        'Creativity and interpretation of theme',
        'Artistic skills and technique',
        'Composition and use of space',
        'Originality',
        'Overall presentation'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Pariksha Negi - 9205845788',
        'Ahsan Raqeeb - 8700594375'
      ],
    },
    'syncstroke': {
      day: '2',
      title: 'SyncStroke',
      society: 'Maniera – Fine Arts Society',
      societyDesc: 'Maniera, the Fine Arts Society of Keshav Mahavidyalaya, serves as a vibrant platform for artistic expression and creativity. From painting and sketching to installations and décor, the society nurtures diverse art forms while consistently winning accolades across competitions. Known for adding aesthetic value to college events through rangolis and creative designs, Maniera fosters a space where every artist can explore, experiment, and excel.',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/SyncStroke.png',
      description: 'SyncStroke is a duo painting competition that tests artistic ability, intuition, adaptability, and unspoken connection where the canvas becomes a silent conversation between two artists.',
      format: [
        'Duo participation',
        'Theme announced on the spot',
        'Duration: 2.5 hours',
        'Member 1 paints solo for first 30 minutes while Member 2 observes',
        'Roles switch every 30 minutes with new surprise elements introduced',
        'Final 30 minutes: both members collaborate to complete the artwork'
      ],
      rules: [
        'Participants cannot communicate about the artwork during the competition',
        'Each 30-minute round must incorporate the surprise element',
        'Both members must follow the relay format strictly',
        'Artwork must be completed within 2.5 hours',
        'Open to all college students'
      ],
      judging: [
        'Coordination and synchrony',
        'Creativity and adaptability',
        'Incorporation of surprise elements',
        'Artistic quality and technique',
        'Final composition and impact'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Pariksha Negi - 9205845788',
        'Ahsan Raqeeb - 8700594375'
      ],
    },
    'envogue_group': {
      contactOnly: true,
      day: '1',
      title: 'Envogue – Group',
      society: 'Naksh – Fashion Society',
      societyDesc: 'Founded in 2014, Naksh is the Fashion Society of Keshav Mahavidyalaya, dedicated to celebrating style, creativity, and expression. The society has achieved remarkable success across prestigious institutions like NIT Delhi, MERI, and JIIMS, along with multiple runner-up finishes and individual awards. Naksh blends fashion with storytelling, using themes and performances to highlight social issues while showcasing talent through impactful runway presentations.',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/envogue_group.png',
      description: 'Envogue Group is a team-based fashion showcase where participants present a cohesive theme through choreography, styling, and stage presence, combining fashion with storytelling and performance.',
      format: [
        'Round 1 (Prelims): Submission of a previous performance video',
        'Shortlisting based on creativity, style, and execution',
        'Round 2 (Finals): Live stage performance at the venue',
        'Team size: 4–12 models plus up to 5 creative members',
        'Performance time: 8–12 minutes including setup'
      ],
      rules: [
        'No restriction on theme',
        'Participants must bring audio in a pen drive',
        'All participants must carry valid college ID',
        'Teams must bring their own props',
        'Any vulgarity or unfair practices will lead to disqualification',
        'The decision of the judges will be final and binding'
      ],
      judging: [
        'Costume and styling',
        'Theme interpretation',
        'Choreography',
        'Stage presence and walking stance',
        'Overall attitude and impact'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Sonia - 9953099058',
        'Vaibhav Nikhil - 9870733523'
      ],
    },
    'envogue_solo': {
      contactOnly: true,
      day: '1',
      title: 'Envogue – Solo',
      society: 'Naksh – Fashion Society',
      societyDesc: 'Founded in 2014, Naksh is the Fashion Society of Keshav Mahavidyalaya, dedicated to celebrating style, creativity, and expression. The society has achieved remarkable success across prestigious institutions like NIT Delhi, MERI, and JIIMS, along with multiple runner-up finishes and individual awards. Naksh blends fashion with storytelling, using themes and performances to highlight social issues while showcasing talent through impactful runway presentations.',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/envogue_solo.png',
      description: 'Envogue Solo is a fashion showcase where individuals express their style, creativity, and confidence through a solo ramp performance, highlighting personality, aesthetics, and stage presence.',
      format: [
        'Single round live performance at the venue',
        'Solo participation',
        'Performance time limit: up to 1 minute'
      ],
      rules: [
        'No restriction on theme',
        'Performance time limit: up to 1 minute',
        'Participants must carry their audio track in a pen drive',
        'Participants must carry valid college ID',
        'Any vulgarity or unfair practices will lead to disqualification',
        'The decision of the judges will be final and binding'
      ],
      judging: [
        'Outfit and styling',
        'Creativity',
        'Ramp walk and expressions',
        'Stage presence',
        'Overall impact'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Sonia - 9953099058',
        'Vaibhav Nikhil - 9870733523'
      ],
    },
    'mridang': {
      day: '1',
      title: 'Mridang',
      society: 'Nrityaang – Dance Society',
      societyDesc: "Since 2014, Nrityaang, the Indian Dance Society of Keshav Mahavidyalaya, has been committed to preserving and promoting India's rich cultural heritage through classical and folk dance forms. With performances at major institutions like AIIMS and various DU colleges, the society has captivated audiences with its grace and authenticity. Ranked among the top dance societies at Le Meandro University People's Choice Awards, Nrityaang continues to uphold tradition while delivering powerful stage performances.",
      time: 'TBA',
      location: 'Auditorium',
      poster: 'images/posters/mridang.png',
      description: 'MRIDANG is a solo classical dance competition featuring Indian classical dance forms such as Bharatanatyam, Kathak, Odissi where participants showcase technique, expression, and discipline across online prelims and on-campus finals.',
      format: [
        'Round 1: Preliminary Round (Online Mode) – Solo performance video submission (maximum 2 minutes)',
        'Maximum 3 entries per college',
        'Round 2: Finals (On-Campus) – Live stage performance',
        'Performance duration: 6–8 minutes with total 8 minutes including setup'
      ],
      rules: [
        'Only Indian classical dance forms are permitted',
        'Bollywood songs are strictly prohibited',
        'Music should be purely classical',
        'Use of flowers, colours, and smoke is strictly prohibited',
        'Participants must adhere to the time limits',
        'Judges decision will be final and binding'
      ],
      judging: [
        'Technique and form',
        'Expression and abhinaya',
        'Rhythm and musicality',
        'Stage presence',
        'Overall performance'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Tanishka - 9289390869',
        'Parita - 9012029878'
      ],
    },
    'uthaan': {
      day: '2',
      title: 'Uthaan',
      society: 'Nrityaang – Dance Society',
      societyDesc: "Since 2014, Nrityaang, the Indian Dance Society of Keshav Mahavidyalaya, has been committed to preserving and promoting India's rich cultural heritage through classical and folk dance forms. With performances at major institutions like AIIMS and various DU colleges, the society has captivated audiences with its grace and authenticity. Ranked among the top dance societies at Le Meandro University People's Choice Awards, Nrityaang continues to uphold tradition while delivering powerful stage performances.",
      time: 'TBA',
      location: 'Auditorium',
      poster: 'images/posters/uthaan.png',
      description: 'UTHAAN is a group folk dance competition where teams present traditional and authentic performances showcasing cultural richness, energy, and coordination across online prelims and on-campus finals.',
      format: [
        'Round 1: Preliminary Round (Online Mode) – Group performance video (3–4 minutes)',
        'Team size: minimum 6 members and maximum 12 members',
        'Round 2: Finals (On-Campus) – Live stage performance',
        'Performance duration: 7–10 minutes including setup with total 10 minutes allotted'
      ],
      rules: [
        'Music must be traditional and authentic',
        'Bollywood songs are not allowed',
        'Team size must be between 6 and 12 members',
        'Use of flowers, colours, and smoke is strictly prohibited',
        'Participants must adhere to the time limits',
        'Judges decision will be final and binding'
      ],
      judging: [
        'Coordination and synchronization',
        'Authenticity of folk style',
        'Energy and execution',
        'Choreography and formations',
        'Overall impact'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Tanishka - 9289390869',
        'Parita - 9012029878'
      ],
    },
    'evince': {
      contactOnly: true,
      day: '1',
      title: 'Evince',
      society: 'Vagmita – Poetry Society',
      societyDesc: "Established in 2012, Vagmita (Poetry) has carved a distinguished space in both the Delhi and national poetry circuits. The society actively participates in slam poetry, creative writing, kavi sammelans, and open mics, securing accolades at premier institutions like IIT Delhi, SRCC, DTU, and AIIMS. Known for its expressive depth and artistic excellence, Vagmita's poets are widely recognized as some of the finest voices in the contemporary poetry scene, using words as a medium to explore identity, emotion, and society.",
      time: '10:00 AM - 12:30 PM',
      location: 'Keshav Mahavidyalaya',
      poster: 'images/posters/Evince.png',
      description: 'Evince is the English Poetry Competition featuring two rounds where participants showcase creativity, content, and performance through written and live poetry.',
      format: [
        'Round 1: Call for entries via Google Forms and shortlisting participants',
        'Judgement based on creativity, content, and flow',
        'Round 2: Live Performance Round with shortlisted participants',
        'Venue: Keshav Mahavidyalaya'
      ],
      rules: [
        'Participants must submit original poetry',
        'Shortlisted participants will perform live',
        'Participants must adhere to the given format and guidelines',
        'Professionalism must be maintained throughout the event',
        'Judges decision will be final and binding'
      ],
      judging: [
        'Creativity and originality',
        'Content quality',
        'Flow and structure',
        'Performance and delivery',
        'Overall impact'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Shreeanshi - 7901832313',
        'Tanya - 9625240393'
      ],
    },
    'irshaad': {
      contactOnly: true,
      day: '1',
      title: 'Irshaad',
      society: 'Vagmita – Poetry Society',
      societyDesc: 'Established in 2012, Vagmita (Poetry) has carved a distinguished space in both the Delhi and national poetry circuits. The society actively participates in slam poetry, creative writing, kavi sammelans, and open mics, securing accolades at premier institutions like IIT Delhi, SRCC, DTU, and AIIMS. Known for its expressive depth and artistic excellence, Vagmita\'s poets are widely recognized as some of the finest voices in the contemporary poetry scene, using words as a medium to explore identity, emotion, and society.',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Irshaad.png',
      description: 'Irshaad is a Hindi/Urdu poetry competition where participants bring words to life through expressive performance, blending emotion, storytelling, and lyrical depth to create impactful poetic experiences.',
      format: [
        'Online Round (Prelims): Submission-based shortlisting',
        'Shortlisting based on creativity, content, and flow',
        'Offline Round (Finals): Live performance by shortlisted participants'
      ],
      rules: [
        'Original compositions only',
        'Participants must perform their own poetry',
        'Shortlisted participants will perform live',
        'Participants must carry valid college ID cards',
        'The decision of the judges will be final and binding'
      ],
      judging: [
        'Content and depth',
        'Flow and delivery',
        'Expression and stage presence',
        'Originality'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Shreeanshi - 7901832313',
        'Tanya - 9625240393'
      ],
    },
    'kaaghaz': {
      contactOnly: true,
      day: '2',
      title: 'Kaaghaz',
      society: 'Vagmita – Poetry Society',
      societyDesc: "Established in 2012, Vagmita (Poetry) has carved a distinguished space in both the Delhi and national poetry circuits. The society actively participates in slam poetry, creative writing, kavi sammelans, and open mics, securing accolades at premier institutions like IIT Delhi, SRCC, DTU, and AIIMS. Known for its expressive depth and artistic excellence, Vagmita's poets are widely recognized as some of the finest voices in the contemporary poetry scene, using words as a medium to explore identity, emotion, and society.",
      time: '1:00 PM - 2:30 PM',
      location: 'Keshav Mahavidyalaya',
      poster: 'images/posters/Kaaghaz.png',
      description: 'Kaaghaz is a bilingual creative writing competition where participants write entries on given prompts within a stipulated time, focusing on creativity and expression.',
      format: [
        'Single round competition',
        'Participants write on given prompts',
        'Duration: 1 hour + 15 minutes',
        'Venue: Keshav Mahavidyalaya'
      ],
      rules: [
        'Participants must write original content',
        'Entries must be completed within the given time',
        'Participants must adhere to the given prompts',
        'Professionalism must be maintained',
        'Judges decision will be final and binding'
      ],
      judging: [
        'Content quality',
        'Creativity',
        'Grammar and language',
        'Relevance to prompts',
        'Overall impact'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Shreeanshi - 7901832313',
        'Tanya - 9625240393'
      ],
    },
    'baithak_street': {
      day: '1',
      title: 'Baithak Street',
      society: 'Shades – Dramatics Society',
      societyDesc: 'Shades, the Theatre Society of Keshav Mahavidyalaya, is a dynamic collective dedicated to using performance as a medium for social change. With historic wins at Mood Indigo (IIT Bombay) and accolades from institutions like NSD, AIIMS, and IITs, the society has established itself as a powerhouse in street plays and mime. Beyond competitions, Shades actively collaborates on social awareness campaigns, proving that theatre is not just an art form, but a movement that inspires and transforms.',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Baithak Street.png',
      description: 'Baithak Street is a dynamic Nukkad Natak competition where teams compete and present performances rooted in tradition yet deeply relevant, using theatre to question, inform, and spark conversations on pressing social issues.',
      format: [
        'Nukkad Natak group performances',
        'Teams perform on topics of their choice',
        'Multiple teams compete against each other'
      ],
      rules: [
        'No team limit and no time limit',
        'Teams can perform on any topic of their choice',
        'No electronic instruments allowed',
        'Teams must carry their own instruments',
        'Participants must follow event guidelines'
      ],
      judging: [
        'Acting',
        'Clarity of the topic',
        'Direction'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Kajal - 9717335644',
        'Dhananjay - 8287244756'
      ],
    },
    'baithak_mime': {
      day: '2',
      title: 'Baithak Mime',
      society: 'Shades – Dramatics Society',
      societyDesc: 'Shades, the Theatre Society of Keshav Mahavidyalaya, is a dynamic collective dedicated to using performance as a medium for social change. With historic wins at Mood Indigo (IIT Bombay) and accolades from institutions like NSD, AIIMS, and IITs, the society has established itself as a powerhouse in street plays and mime. Beyond competitions, Shades actively collaborates on social awareness campaigns, proving that theatre is not just an art form, but a movement that inspires and transforms.',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Baithak Mime.png',
      description: 'Baithak Mime is a silent storytelling competition where participants use body language, expressions, and movement to communicate powerful narratives.',
      format: [
        'Mime group performances',
        'Expression through body language and movement only',
        'Sound will be provided at the venue'
      ],
      rules: [
        'Maximum 15 members per team',
        'Time limit: 15 minutes (no minimum time limit)',
        'No dialogues allowed',
        'Teams must carry their own makeup and costumes',
        'Teams must carry their own lights (no lighting setup will be provided)',
        'Participants must follow event guidelines'
      ],
      judging: [
        'Acting',
        'Clarity of the topic',
        'Direction',
        'Music and lighting',
        'Body language',
        'Makeup and costumes'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Kajal - 9717335644',
        'Dhananjay - 8287244756'
      ],
    }
  };

  const $ = id => document.getElementById(id);
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ── Frontend Reg ID generator ──────────────────────────────────
     Mirrors the Apps Script generateRegId() exactly:
       Attendee  → TRYST-{HHmmss}{mmm}{rand}
       Event     → TRYST-{sanitized_eventId}-{HHmmss}{mmm}{rand}
     Time is computed in IST (UTC+5:30) so IDs match the server format.
  ──────────────────────────────────────────────────────────────── */
  function generateRegId(eventId) {
    const now = new Date();
    // Shift to IST = UTC + 5h 30m
    const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    const hh  = String(ist.getUTCHours()).padStart(2, '0');
    const mm  = String(ist.getUTCMinutes()).padStart(2, '0');
    const ss  = String(ist.getUTCSeconds()).padStart(2, '0');
    const ms  = String(ist.getUTCMilliseconds()).padStart(3, '0');
    const rand = Math.floor(Math.random() * 10);
    const base = hh + mm + ss + ms + rand;
    if (eventId) {
      const safe = String(eventId).toLowerCase().replace(/[^a-z0-9_]/g, '_');
      return 'TRYST-' + safe + '-' + base;
    }
    return 'TRYST-' + base;
  }
  const listHTML = items => `<ul>${(Array.isArray(items) ? items : [items]).filter(Boolean).map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>`;
  const eventOrder = Array.from(new Set(
    Array.from(document.querySelectorAll('.schedule-day .event-header[data-event-id], .schedule-event[data-event-id]'))
      .map(el => el.dataset.eventId)
      .filter(Boolean)
  ));

  function attr(value) {
    return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  function eventHeader(id) {
    return document.querySelector(`.event-header[data-event-id="${attr(id)}"], .schedule-event[data-event-id="${attr(id)}"] .event-header`);
  }

  function eventRow(id) {
    const header = eventHeader(id);
    return header?.closest('.schedule-event') || document.querySelector(`.schedule-event[data-event-id="${attr(id)}"]`);
  }

  function eventModalItem(id) {
    return document.querySelector(`.events-modal-item[data-event-id="${attr(id)}"]`);
  }

  function posterForTag(tag) {
    const value = String(tag || '').toLowerCase();
    if (value.includes('music')) return 'images/posters/crowd.webp';
    if (value.includes('art') || value.includes('photo') || value.includes('media')) return 'images/posters/gallery.jpg';
    if (value.includes('theatre') || value.includes('debate') || value.includes('poetry') || value.includes('writing')) return 'images/posters/entry.webp';
    return 'images/posters/stage.webp';
  }

  function inferEventData(id) {
    const header = eventHeader(id);
    const item = eventModalItem(id);
    const title = header?.querySelector('.event-title')?.textContent.trim()
      || item?.querySelector('.events-modal-name')?.textContent.trim()
      || id.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    const tag = header?.querySelector('.event-tag')?.textContent.trim()
      || item?.querySelector('.events-modal-tag')?.textContent.trim()
      || 'Event';
    const row = eventRow(id);
    const dayPanel = row?.closest('.schedule-day') || item?.closest('.events-modal-day');
    const time = row?.querySelector('.event-time')?.textContent.trim() || '';
    const location = header?.dataset.location || tag;

    return {
      day: dayPanel?.dataset.day || dayPanel?.dataset.eventsDay || '1',
      title,
      society: `${tag} Society`,
      time,
      location,
      poster: posterForTag(tag),
      description: `${title} is a TRYST 2026 ${tag.toLowerCase()} event crafted for focused, high-energy participation.`,
      format: ['Register through the event form.', 'Participants perform or compete in the slot assigned by organisers.', 'Final round details will be shared by the organising society.'],
      rules: commonRules,
      judging: commonJudging,
      societyLink: '#student-union'
    };
  }

  function getEventData(id) {
    const inferred = inferEventData(id);
    const stored = TRYST_EVENTS[id] || {};
    return {
      ...inferred,
      ...stored,
      day: inferred.day || stored.day,
      title: inferred.title || stored.title,
      time: inferred.time || stored.time,
      location: inferred.location || stored.location
    };
  }

  function setStatus(el, message, type = '') {
    if (!el) return;
    el.textContent = message || '';
    el.classList.remove('is-success', 'is-error');
    if (type) el.classList.add(`is-${type}`);
  }

  function setButtonLoading(btn, loading, text) {
    if (!btn) return;
    const inner = btn.querySelector('.reg-submit-inner, .ed-register-inner') || btn;
    if (!btn.dataset.defaultText) btn.dataset.defaultText = inner.textContent;
    btn.classList.toggle('reg-loading', loading);
    btn.disabled = loading;
    inner.textContent = loading ? text : btn.dataset.defaultText;
  }

  function resetButtonText(btn) {
    if (!btn) return;
    const inner = btn.querySelector('.reg-submit-inner, .ed-register-inner') || btn;
    inner.textContent = btn.dataset.defaultText || inner.textContent;
    btn.disabled = false;
    btn.classList.remove('reg-loading');
  }

  // ─── Image compression ───────────────────────────────────────────────────
  // Resize & re-encode images to JPEG @ max 1200px / 0.78 quality before
  // base64 conversion. Reduces a 5 MB phone photo to ~180 KB, keeping the
  // total JSON payload well under Apps Script limits. PDFs are passed through.
  function fileToBase64(file) {
    if (!file) return Promise.resolve('');
    if (!file.type.startsWith('image/')) return fileToBase64Raw(file);
    return new Promise(resolve => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const MAX = 1200;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w >= h) { h = Math.round(h * MAX / w); w = MAX; }
          else        { w = Math.round(w * MAX / h); h = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      img.onerror = () => { URL.revokeObjectURL(url); fileToBase64Raw(file).then(resolve); };
      img.src = url;
    });
  }

  function fileToBase64Raw(file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve('');
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error('Could not read file.'));
      reader.readAsDataURL(file);
    });
  }

  const toBase64 = fileToBase64;
  window.toBase64 = toBase64;

  // ─── Submission via iframe form POST ────────────────────────────────────
  // Apps Script web app URLs return a 302 redirect. fetch() follows that
  // redirect but converts POST→GET (RFC 7231), so doPost() never fires.
  // The reliable, Google-documented approach for cross-origin Apps Script
  // calls is an HTML form targeting a hidden iframe — the browser follows
  // the redirect natively, preserves the POST body, and the iframe absorbs
  // the opaque response. Images are compressed before this call so the
  // payload stays well under form-field limits (~500 KB total).
  function postJSON(payload) {
    const withToken = Object.assign({ token: "TRYST2026" }, payload);
    const body = JSON.stringify(withToken);

    const form  = document.createElement('form');
    form.method = 'POST';
    form.action = POST_URL;
    form.target = 'hidden_iframe';

    const input = document.createElement('input');
    input.type  = 'hidden';
    input.name  = 'payload';
    input.value = body;

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();

    // Clean up the temporary form after it has been submitted
    setTimeout(() => { try { form.remove(); } catch (_) {} }, 5000);

    // Return optimistic success — response is opaque (cross-origin iframe)
    return Promise.resolve({ status: 'success', regId: 'SUBMITTED' });
  }

  function responseId(data) {
    return data?.regId || data?.registrationId || data?.id || data?.RegID || data?.regID || '';
  }

  function markInvalid(input) {
    if (!input) return;
    input.classList.add('reg-error');
    if (!window.gsap) return;
    gsap.fromTo(input, { x: -4 }, {
      x: 4,
      repeat: 4,
      yoyo: true,
      duration: 0.07,
      onComplete: () => gsap.set(input, { x: 0 })
    });
  }

  function validateRequired(inputs) {
    let valid = true;
    inputs.forEach(input => {
      const missingFile = input.type === 'file' && !input.files?.length;
      const missingValue = input.type !== 'file' && !String(input.value || '').trim();
      if ((input.required || input.dataset.required === 'true') && (missingFile || missingValue)) {
        valid = false;
        markInvalid(input);
      } else {
        input.classList.remove('reg-error');
      }
    });
    return valid;
  }

  function resetUploadZone(input) {
    const zone = input.closest('.reg-upload-zone');
    const preview = zone?.querySelector('.reg-upload-preview');
    if (preview) {
      preview.textContent = '';
      preview.innerHTML = '';
      preview.removeAttribute('style');
    }
    zone?.classList.remove('reg-has-file');
  }

  function truncateName(name, max = 14) {
    if (!name) return '';
    if (name.length <= max) return name;
    const ext = name.lastIndexOf('.') > 0 ? name.slice(name.lastIndexOf('.')) : '';
    return name.slice(0, max - ext.length - 1) + '…' + ext;
  }

  function markZoneSubmitted(zone, fileName) {
    if (!zone) return;
    const preview = zone.querySelector('.reg-upload-preview');
    if (!preview) return;
    preview.innerHTML =
      `<span class="reg-upload-submitted-icon">✅</span>` +
      `<span class="reg-upload-submitted-label">Submitted</span>` +
      `<span class="reg-upload-submitted-name">${escapeHTML(truncateName(fileName))}</span>`;
    zone.classList.add('reg-has-file');
  }

  function bindUploadLabel(input) {
    if (!input) return;
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      const zone = input.closest('.reg-upload-zone');
      if (!file || !zone) return;
      markZoneSubmitted(zone, file.name);
    });
  }

  document.querySelectorAll('.reg-file-input').forEach(bindUploadLabel);

  function renderEventsModal() {
    ['1', '2'].forEach(day => {
      const wrap = document.querySelector(`.events-modal-day[data-events-day="${day}"]`);
      if (!wrap) return;
      wrap.innerHTML = eventOrder
        .filter(id => getEventData(id).day === day)
        .map(id => {
          const event = getEventData(id);
          return `
            <div class="events-modal-item" data-event-id="${id}">
              <div class="events-modal-row" onclick="toggleEventsModalItem(this)">
                <div>
                  <span class="events-modal-tag">${escapeHTML(event.society)}</span>
                  <div class="events-modal-name">${escapeHTML(event.title)}</div>
                </div>
                <span class="events-modal-arrow">&rsaquo;</span>
              </div>
              <div class="events-modal-body">
                <p>${escapeHTML(event.description)}</p>
                <button class="know-more-btn" data-event-id="${id}" data-day="${event.day}" onclick="goToEvent(this)">Open Event</button>
              </div>
            </div>`;
        }).join('');
    });
  }

  function syncScheduleLabels() {
    eventOrder.forEach(id => {
      const tag = eventHeader(id)?.querySelector('.event-tag');
      if (tag) tag.textContent = getEventData(id).location;
    });
  }

  function setScheduleDay(day) {
    document.querySelectorAll('.schedule-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.day === day));
    document.querySelectorAll('.schedule-day').forEach(panel => {
      const active = panel.dataset.day === day;
      panel.classList.toggle('active', active);
      if (active) {
        panel.querySelectorAll('.fade-up').forEach(el => {
          el.classList.add('visible');
          el.style.opacity = 1;
          el.style.transform = 'none';
        });
      }
    });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  const edOverlay = $('edOverlay');
  const edModal = $('edModal');
  const edCard = $('edCard');
  const edCloseBtn = $('edCloseBtn');
  const edRegBtn = $('edRegisterBtn');

  function openEventDetailById(eventId) {
    const event = getEventData(eventId);
    if (event) window.openEventDetailModal({ ...event, eventId });
  }

  window.toggleEvent = function(header) {
    const id = header?.dataset?.eventId || header?.closest('.schedule-event')?.dataset?.eventId;
    if (id) openEventDetailById(id);
  };

  window.openEventDetail = function(source) {
    const eventId = source?.dataset?.eventId || source?.closest('[data-event-id]')?.dataset?.eventId;
    if (!eventId) return;
    if (source.closest('#modal-events')) {
      window.goToEvent({ dataset: { eventId, day: getEventData(eventId).day } });
      return;
    }
    openEventDetailById(eventId);
  };

  window.goToEvent = function(source) {
    const eventId = typeof source === 'string' ? source : source?.dataset?.eventId;
    if (!eventId) return;
    const event = getEventData(eventId);
    const day = typeof source === 'string' ? event?.day : source?.dataset?.day || event?.day;

    if (typeof window.closeModal === 'function') closeModal();
    setTimeout(() => {
      const schedule = $('schedule');
      if (!schedule) return;
      gsap.to(window, {
        scrollTo: { y: schedule, offsetY: 76 },
        duration: 0.85,
        ease: 'expo.inOut',
        onComplete: () => {
          setScheduleDay(day);
          const row = eventRow(eventId);
          if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => openEventDetailById(eventId), 320);
        }
      });
    }, 220);
  };

  window.openEventDetailModal = function(event) {
    const data = event.eventId ? getEventData(event.eventId) : event;
    if (!data || !edModal) return;

    $('edTag').textContent = data.society || 'Organising Society';
    $('edTitle').textContent = data.title || 'Event';
    $('edMeta').textContent = [data.time, data.location].filter(Boolean).join(' | ');
    $('edDesc').textContent = data.description || '';

    const isDescOnly    = !!data.descriptionOnly;
    const isContactOnly = !!data.contactOnly;

    // Format / Rules / Judging — hide for description-only events
    const formatSection = $('edFormat')?.closest('.ed-info-section');
    const rulesSection  = $('edRules')?.closest('.ed-info-section');
    const judgingSection= $('edJudging')?.closest('.ed-info-section');
    const supportSection= $('edSupport')?.closest('.ed-info-section');
    if (formatSection)  formatSection.style.display  = isDescOnly ? 'none' : '';
    if (rulesSection)   rulesSection.style.display   = isDescOnly ? 'none' : '';
    if (judgingSection) judgingSection.style.display = isDescOnly ? 'none' : '';
    if (supportSection) supportSection.style.display = isDescOnly ? 'none' : '';
    if (!isDescOnly) {
      $('edFormat').innerHTML  = listHTML(data.format);
      $('edRules').innerHTML   = listHTML(data.rules);
      $('edJudging').innerHTML = listHTML(data.judging);
      $('edSupport').innerHTML = listHTML(data.supportSection);
    }

    const poster = $('edPosterImg');
    if (poster) {
      poster.src = data.poster || '';
      poster.alt = data.title || 'Event poster';
    }

    // Register button — hide for description-only OR contact-only events
    const edActionRow = $('edActionRow');
    if (edActionRow) edActionRow.style.display = (isDescOnly || isContactOnly) ? 'none' : '';

    // Contact-only note — created once, shown/hidden dynamically
    let contactNote = $('edContactNote');
    if (!contactNote) {
      contactNote = document.createElement('p');
      contactNote.id = 'edContactNote';
      contactNote.style.cssText = [
        'font-family:"Cormorant Garamond","Georgia",serif',
        'font-size:0.95rem',
        'font-style:italic',
        'color:rgba(201,168,76,0.80)',
        'text-align:center',
        'border:1px solid rgba(201,168,76,0.28)',
        'border-radius:8px',
        'padding:14px 20px',
        'margin:12px 32px 20px',
        'line-height:1.6',
        'background:rgba(201,168,76,0.04)',
      ].join(';');
      edActionRow?.parentNode?.insertBefore(contactNote, edActionRow.nextSibling);
    }
    if (isContactOnly && data.supportSection?.length) {
      const contacts = data.supportSection.join(' &nbsp;·&nbsp; ');
      contactNote.innerHTML = '✦ &nbsp;Registrations for this event are managed independently. Kindly contact the support team.<br/><strong style="color:#E5C97E;font-style:normal;">' + contacts + '</strong>';
      contactNote.style.display = '';
    } else {
      if (contactNote) contactNote.style.display = 'none';
    }

    if (edRegBtn) {
      edRegBtn.dataset.eventId    = event.eventId || '';
      edRegBtn.dataset.eventTitle = data.title || 'Event';
    }

    // Scroll panels back to top on each open
    const panelsScroll = document.querySelector('.ed-panels-scroll');
    if (panelsScroll) panelsScroll.scrollTop = 0;

    edOverlay?.classList.add('ed-active');
    edModal.classList.add('ed-active');
    document.body.style.overflow = 'hidden';
    gsap.fromTo(edCard, { opacity: 0, scale: 0.91, y: 18 }, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.38,
      ease: 'expo.out',
      clearProps: 'transform'
    });
  };

  window.closeEventDetailModal = function() {
    if (!edModal?.classList.contains('ed-active')) return;
    gsap.to(edCard, {
      opacity: 0,
      scale: 0.93,
      y: 12,
      duration: 0.24,
      ease: 'power3.in',
      onComplete: () => {
        edOverlay?.classList.remove('ed-active');
        edModal.classList.remove('ed-active');
        document.body.style.overflow = '';
        gsap.set(edCard, { clearProps: 'all' });
      }
    });
  };

  edRegBtn?.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const title = edRegBtn.dataset.eventTitle || 'Event';
    const eid   = edRegBtn.dataset.eventId    || '';
    window.closeEventDetailModal();
    setTimeout(() => window.openEventRegModal?.(title, eid), 280);
  }, true);

  edCloseBtn?.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    window.closeEventDetailModal();
  }, true);

  edOverlay?.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    window.closeEventDetailModal();
  }, true);

  const attendeeForm = $('registrationForm');
  $('register-now-btn')?.addEventListener('click', () => {
    setStatus($('regStatus'), '');
    resetButtonText($('regSubmitBtn'));
  }, true);

  if (typeof window.openRegisterModal === 'function') {
    const openRegisterModalBase = window.openRegisterModal;
    window.openRegisterModal = function(...args) {
      setStatus($('regStatus'), '');
      resetButtonText($('regSubmitBtn'));
      return openRegisterModalBase.apply(this, args);
    };
  }

  attendeeForm?.addEventListener('submit', async event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const status = $('regStatus');
    const submitBtn = $('regSubmitBtn');
    setStatus(status, '');

    if (!validateRequired(attendeeForm.querySelectorAll('input[required], select[required]'))) {
      setStatus(status, 'Please complete all required fields and uploads.', 'error');
      return;
    }

    // Validate attendee tasks
    const taskMissing     = !$('reg-sponsor-1')?.files?.length;
    const instagramMissing = !$('reg-instagram-task')?.files?.length;
    const dateMissing     = !$('reg-fitpass-review-date')?.value;
    const platformMissing = !$('reg-fitpass-platform')?.value;
    if (taskMissing || instagramMissing || dateMissing || platformMissing) {
      document.getElementById('zone-task-1')?.classList.add('reg-error');
      if (instagramMissing) document.getElementById('zone-instagram-task')?.classList.add('reg-error');
      setStatus(status,
        'Please complete the Fitpass review task and upload the Instagram follow screenshot.',
        'error');
      return;
    }
    document.getElementById('zone-task-1')?.classList.remove('reg-error');
    document.getElementById('zone-instagram-task')?.classList.remove('reg-error');

    setButtonLoading(submitBtn, true, 'Submitting...');
    try {
      const reviewScreenshot = await toBase64($('reg-sponsor-1').files?.[0]);
      const instagramScreenshot = await toBase64($('reg-instagram-task').files?.[0]);
      const reviewPlatform   = $('reg-fitpass-platform')?.value || 'android';
      const reviewPostedOn   = $('reg-fitpass-review-date')?.value || '';

      // ── Generate Reg ID here so it is available for the PDF
      //    before the opaque iframe response returns. ──────────
      const cleanId = generateRegId();

      const payload = {
        formType: 'attendee',
        regId: cleanId,                    // ← pre-generated, sent to sheet
        name: $('reg-name').value.trim(),
        email: $('reg-email').value.trim(),
        phone: $('reg-phone').value.trim(),
        college: $('reg-college').value.trim(),
        course: $('reg-course').value.trim(),
        year: $('reg-year').value,
        gender: $('reg-gender').value,
        collegeId: await toBase64($('reg-college-id').files?.[0]),
        task1: reviewScreenshot,
        task2: instagramScreenshot,
        androidHandlerName: '',
        iosHandlerName: '',
        dateOfReviewPosting: reviewPostedOn,
        reviewContentScreenshot: reviewScreenshot,
        instagramFollowScreenshot: instagramScreenshot,
        reviewPlatform,
        reviewHandleName: '',
        reviewPostedOn,
        reviewScreenshot
      };

      await postJSON(payload);  // fire-and-forget (iframe is opaque)
      const attendeePassData = {
        regId: cleanId,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        college: payload.college,
        course: payload.course,
        year: payload.year,
        gender: payload.gender
      };
      window.__lastAttendeePassData = attendeePassData;
      setStatus(status, cleanId ? `Registration successful. Reg ID: ${cleanId}` : 'Registration successful.', 'success');
      if (typeof window.closeRegisterModal === 'function') window.closeRegisterModal();
      setTimeout(() => {
        if (typeof window.showAttendeeSuccessPopup === 'function') {
          window.showAttendeeSuccessPopup(cleanId, attendeePassData);
        }
      }, 320);
      attendeeForm.reset();
      attendeeForm.querySelectorAll('input[type="file"]').forEach(resetUploadZone);
      // Reset Fitpass task zone
      const zone1    = document.getElementById('zone-task-1');
      const prev1    = document.getElementById('preview-task-1');
      const zoneInstagram = document.getElementById('zone-instagram-task');
      const platformHid = document.getElementById('reg-fitpass-platform');
      const dateHid   = document.getElementById('reg-fitpass-review-date');
      const dateInp   = document.getElementById('tp-review-date');
      if (zone1)     zone1.classList.remove('reg-has-file', 'reg-error');
      if (prev1)     prev1.innerHTML = '';
      if (zoneInstagram) zoneInstagram.classList.remove('reg-has-file', 'reg-error');
      if (platformHid) platformHid.value = '';
      if (dateHid)   dateHid.value = '';
      if (dateInp)   dateInp.value = '';
      if (typeof window.switchTaskTab === 'function') window.switchTaskTab('android');
    } catch (error) {
      setStatus(status, error.message || 'Could not submit right now. Please try again.', 'error');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  }, true);

  // ═══════════════════════════════════════════════
  //  EVENT META — defines form type + conditional flags per event
  // ═══════════════════════════════════════════════
  const eventMeta = {
    mridang:        { formType: 'solo',  prelims: true                    },
    inaayat:        { formType: 'team',  audio: true                      },
    aaghaaz:        { formType: 'dynamic'                                  },
    nocturne:       { formType: 'team',  prelims: true                    },
    khayaal:        { formType: 'team',  prelims: true                    },
    pixel:          { formType: 'team',  prelims: true                    },
    syncstroke:     { formType: 'team',  lockedCount: 2                   },
    uthaan:         { formType: 'team',  minMembers: 6, maxMembers: 12    },
    envogue_group:  { formType: 'team',  prelims: true, minMembers: 4, maxMembers: 17 },
    envogue_solo:   { formType: 'solo'                                     },
    baithak_mime:   { formType: 'team',  maxMembers: 15                   },
    baithak_street: { formType: 'team'                                     },
    // newly added Day 1 events
    khandan:        { formType: 'solo'                                     },
    irshaad:        { formType: 'solo',  prelims: true                    },
    cinematica:     { formType: 'team'                                     },
    reframe:        { formType: 'solo'                                     },
    draped_duality: { formType: 'team'                                     },
    evince:         { formType: 'solo',  prelims: true                    },
    kaaghaz:        { formType: 'solo'                                     },
    jhalak:         { formType: 'solo'                                     },
    rebuttal:       { formType: 'solo'                                     },
  };

  // Team member limits per event
  const teamLimits = {
    inaayat:       { min: 5        },
    uthaan:        { min: 6, max: 12 },
    envogue_group: { min: 4, max: 17 },
    baithak_mime:  { max: 15       },
    draped_duality:{ min: 3, max: 4  },
    cinematica:    { min: 2, max: 5  },
    pixel:         { min: 2, max: 5  },
  };

  const eventReg = {
    currentEvent:  'Event Registration',
    currentEventId:'',
    formType:      'solo',   // 'solo' | 'team' | 'dynamic'
    selectedType:  '',       // for aaghaaz: 'solo' | 'crew'
    participantCount: 0,
    hasPrelims:    false,
    hasAudio:      false,
    lockedCount:   0,
    minMembers:    1,
    maxMembers:    50
  };

  const eventRegOverlay = $('eventRegOverlay');
  const eventRegModal   = $('eventRegModal');
  const eventRegCard    = $('eventRegCard');

  // ── Step visibility ─────────────────────────────────
  function showEventRegStep(step) {
    ['ereg-step-solo','ereg-step-team-1','ereg-step-team-2','ereg-step-aaghaaz','ereg-step-confirm'].forEach(id => {
      const el = $(id);
      if (el) el.style.display = 'none';
    });
    const map = {
      'solo-form':    'ereg-step-solo',
      'team-1':       'ereg-step-team-1',
      'team-2':       'ereg-step-team-2',
      'aaghaaz':      'ereg-step-aaghaaz',
      'confirm':      'ereg-step-confirm'
    };
    const id = map[step];
    if (id && $(id)) $(id).style.display = 'flex';
    if (eventRegCard) gsap.from(eventRegCard, { y: 6, duration: 0.22, ease: 'expo.out' });
  }

  function resetEventReg() {
    setStatus($('eventRegStatus'), '');
    ['ereg-solo-form','ereg-team-form-1','ereg-team-form-2'].forEach(fid => {
      const f = $(fid);
      if (f) {
        f.reset?.();
        f.querySelectorAll('input[type="file"]').forEach(resetUploadZone);
      }
    });
    if ($('ereg-members-wrap')) $('ereg-members-wrap').innerHTML = '';
    resetButtonText($('eregSoloSubmit'));
    resetButtonText($('eregTeamSubmit'));
    // eregFinalSubmit MUST also be reset — it is disabled on success and has
    // no finally block, so without this every registration after the first
    // silently fails (button is permanently disabled = no submit fires).
    resetButtonText($('eregFinalSubmit'));
  }

  window.openEventRegModal = function(eventTitle = 'Event Registration', eventId = '') {
    eventReg.currentEvent   = eventTitle;
    eventReg.currentEventId = eventId || eventTitle.toLowerCase().replace(/\s+/g, '_');
    resetEventReg();

    const meta = eventMeta[eventReg.currentEventId] || {};
    eventReg.formType    = meta.formType    || 'solo';
    eventReg.hasPrelims  = !!(meta.prelims || meta.audio);
    eventReg.hasAudio    = !!meta.audio;
    eventReg.lockedCount = meta.lockedCount || 0;

    const limits = teamLimits[eventReg.currentEventId] || {};
    eventReg.minMembers  = limits.min || 1;
    eventReg.maxMembers  = limits.max || 50;

    // Set event name in all hidden fields
    document.querySelectorAll('.ereg-event-name-field').forEach(el => el.value = eventTitle);
    document.querySelectorAll('.ereg-event-title-display').forEach(el => el.textContent = eventTitle);

    // Show/hide Drive Link field
    document.querySelectorAll('.ereg-drive-wrap').forEach(el => {
      el.style.display = eventReg.hasPrelims ? '' : 'none';
      el.querySelectorAll('input').forEach(i => {
        if (eventReg.hasPrelims) i.setAttribute('required',''); else i.removeAttribute('required');
      });
    });
    // Label: audio vs prelims
    document.querySelectorAll('.ereg-drive-label').forEach(el => {
      el.textContent = eventReg.hasAudio ? 'Audio / Drive Link *' : 'Prelims Drive Link *';
    });

    // Update modal header
    const eyebrow1 = document.querySelector('#ereg-step-solo .reg-eyebrow, #ereg-step-team-1 .reg-eyebrow, #ereg-step-aaghaaz .reg-eyebrow');
    document.querySelectorAll('.ereg-modal-eyebrow').forEach(el => el.textContent = `TRYST 2026 · ${eventTitle}`);

    eventRegOverlay?.classList.add('reg-active');
    eventRegModal?.classList.add('reg-active');
    document.body.style.overflow = 'hidden';
    gsap.fromTo(eventRegCard, { opacity: 0, scale: 0.91, y: 22 }, { opacity: 1, scale: 1, y: 0, duration: 0.42, ease: 'expo.out' });

    // Route to first step
    if (eventReg.formType === 'dynamic') {
      showEventRegStep('aaghaaz');
    } else if (eventReg.formType === 'solo') {
      showEventRegStep('solo-form');
    } else {
      // team
      if (eventReg.lockedCount) {
        $('ereg-member-count').value = eventReg.lockedCount;
        $('ereg-member-count').disabled = true;
      } else {
        $('ereg-member-count').disabled = false;
        $('ereg-member-count').value = '';
      }
      // Set min/max info display
      const hint = $('ereg-member-count-hint');
      if (hint) {
        if (eventReg.minMembers > 1 || eventReg.maxMembers < 50) {
          const parts = [];
          if (eventReg.minMembers > 1) parts.push(`min ${eventReg.minMembers}`);
          if (eventReg.maxMembers < 50) parts.push(`max ${eventReg.maxMembers}`);
          hint.textContent = `(${parts.join(', ')})`;
          hint.style.display = '';
        } else {
          hint.style.display = 'none';
        }
      }
      showEventRegStep('team-1');
    }
  };

  window.closeEventRegModal = function() {
    if (!eventRegModal?.classList.contains('reg-active')) return;
    gsap.to(eventRegCard, {
      opacity: 0, scale: 0.93, y: 14, duration: 0.26, ease: 'power3.in',
      onComplete: () => {
        eventRegOverlay?.classList.remove('reg-active');
        eventRegModal.classList.remove('reg-active');
        document.body.style.overflow = '';
        gsap.set(eventRegCard, { clearProps: 'all' });
        resetEventReg();
      }
    });
  };

  // ── AAGHAAZ type selection ─────────────────────────────
  document.querySelectorAll('.ereg-aaghaaz-btn').forEach(btn => {
    btn.addEventListener('click', ev => {
      ev.preventDefault(); ev.stopImmediatePropagation();
      const choice = btn.dataset.choice; // 'solo' or 'crew'
      eventReg.selectedType = choice;
      if (choice === 'solo') {
        eventReg.formType = 'solo';
        showEventRegStep('solo-form');
      } else {
        eventReg.formType = 'team';
        $('ereg-member-count').disabled = false;
        $('ereg-member-count').value = '';
        const hint = $('ereg-member-count-hint');
        if (hint) hint.style.display = 'none';
        showEventRegStep('team-1');
      }
    }, true);
  });

  // ── SOLO FORM — file uploads ───────────────────────────
  $('ereg-solo-form')?.querySelectorAll('.reg-file-input').forEach(bindUploadLabel);

  // ── SOLO FORM — submit / confirm ──────────────────────
  $('ereg-solo-review-btn')?.addEventListener('click', ev => {
    ev.preventDefault(); ev.stopImmediatePropagation();
    const form = $('ereg-solo-form');
    if (!validateRequired(form.querySelectorAll('input[required],select[required]'))) {
      setStatus($('eventRegStatus'), 'Please complete all required fields.', 'error');
      return;
    }
    setStatus($('eventRegStatus'), '');
    // Fill confirm
    $('confirm-event').textContent       = eventReg.currentEvent;
    $('confirm-type').textContent        = 'Solo';
    $('confirm-brand').textContent       = $('ereg-solo-name').value.trim();
    $('confirm-college').textContent     = $('ereg-solo-college').value.trim();
    $('confirm-contact').textContent     = `${$('ereg-solo-email').value.trim()} | ${$('ereg-solo-phone').value.trim()}`;
    $('confirm-count').textContent       = '1';
    const list = $('confirm-participants-list');
    if (list) {
      list.innerHTML = `<div class="ereg-confirm-participant">1. ${escapeHTML($('ereg-solo-name').value.trim())} — ${escapeHTML($('ereg-solo-course').value.trim())}, Year ${escapeHTML($('ereg-solo-year').value)}</div>`;
    }
    showEventRegStep('confirm');
  }, true);

  // ── TEAM PAGE 1 → PAGE 2 ─────────────────────────────
  $('ereg-team-next-btn')?.addEventListener('click', ev => {
    ev.preventDefault(); ev.stopImmediatePropagation();
    const form = $('ereg-team-form-1');
    if (!validateRequired(form.querySelectorAll('input[required],select[required]'))) {
      setStatus($('eventRegStatus'), 'Please complete all required team fields.', 'error');
      return;
    }
    const countVal = parseInt($('ereg-member-count').value, 10);
    if (!countVal || isNaN(countVal)) {
      markInvalid($('ereg-member-count'));
      setStatus($('eventRegStatus'), 'Please enter number of members.', 'error');
      return;
    }
    if (eventReg.minMembers > 1 && countVal < eventReg.minMembers) {
      markInvalid($('ereg-member-count'));
      setStatus($('eventRegStatus'), `Minimum ${eventReg.minMembers} members required for this event.`, 'error');
      return;
    }
    if (eventReg.maxMembers < 50 && countVal > eventReg.maxMembers) {
      markInvalid($('ereg-member-count'));
      setStatus($('eventRegStatus'), `Maximum ${eventReg.maxMembers} members allowed for this event.`, 'error');
      return;
    }
    setStatus($('eventRegStatus'), '');
    eventReg.participantCount = countVal;
    generateMemberFields(countVal);
    showEventRegStep('team-2');
  }, true);

  // ── TEAM PAGE 2 → CONFIRM ────────────────────────────
  $('ereg-team-review-btn')?.addEventListener('click', ev => {
    ev.preventDefault(); ev.stopImmediatePropagation();
    const form2 = $('ereg-team-form-2');
    if (!validateRequired(form2.querySelectorAll('input[required],select[required]'))) {
      setStatus($('eventRegStatus'), 'Please complete all member details.', 'error');
      return;
    }
    setStatus($('eventRegStatus'), '');
    // Fill confirm
    $('confirm-event').textContent   = eventReg.currentEvent;
    $('confirm-type').textContent    = 'Team';
    $('confirm-brand').textContent   = $('ereg-team-name').value.trim();
    $('confirm-college').textContent = $('ereg-team-college').value.trim();
    $('confirm-contact').textContent = `${$('ereg-team-email').value.trim()} | ${$('ereg-team-phone').value.trim()}`;
    $('confirm-count').textContent   = eventReg.participantCount;
    const list = $('confirm-participants-list');
    if (list) {
      list.innerHTML = '';
      for (let i = 1; i <= eventReg.participantCount; i++) {
        const div = document.createElement('div');
        div.className = 'ereg-confirm-participant';
        div.textContent = `${i}. ${form2.querySelector(`[name="m${i}_name"]`)?.value || ''} — ${form2.querySelector(`[name="m${i}_course"]`)?.value || ''}, Year ${form2.querySelector(`[name="m${i}_year"]`)?.value || ''}`;
        list.appendChild(div);
      }
    }
    showEventRegStep('confirm');
  }, true);

  // ── BACK BUTTONS ────────────────────────────────────
  $('ereg-solo-back-btn')?.addEventListener('click', ev => {
    ev.preventDefault(); ev.stopImmediatePropagation();
    if (eventReg.formType === 'dynamic') showEventRegStep('aaghaaz');
    else window.closeEventRegModal();
  }, true);

  $('ereg-team-back-btn')?.addEventListener('click', ev => {
    ev.preventDefault(); ev.stopImmediatePropagation();
    if (eventReg.formType === 'dynamic') showEventRegStep('aaghaaz');
    else window.closeEventRegModal();
  }, true);

  $('ereg-team-2-back-btn')?.addEventListener('click', ev => {
    ev.preventDefault(); ev.stopImmediatePropagation();
    showEventRegStep('team-1');
  }, true);

  $('ereg-confirm-back-btn')?.addEventListener('click', ev => {
    ev.preventDefault(); ev.stopImmediatePropagation();
    if (eventReg.formType === 'solo' || eventReg.selectedType === 'solo') {
      showEventRegStep('solo-form');
    } else {
      showEventRegStep('team-2');
    }
  }, true);

  // ── Generate member fields ────────────────────────────
  function generateMemberFields(count) {
    const wrap = $('ereg-members-wrap');
    if (!wrap) return;
    wrap.innerHTML = '';
    for (let i = 1; i <= count; i++) {
      const block = document.createElement('div');
      block.className = 'ereg-participant-block';
      block.innerHTML = `
        <div class="ereg-participant-num font-rajdhani">Member ${i}${i === 1 ? ' · Main Contact' : ''}</div>
        <div class="reg-form-row">
          <div class="reg-field">
            <label class="reg-label font-rajdhani">Full Name <span class="reg-required">*</span></label>
            <input type="text" name="m${i}_name" class="reg-input ereg-input" placeholder="Full name" required />
          </div>
          <div class="reg-field">
            <label class="reg-label font-rajdhani">Phone <span class="reg-required">*</span></label>
            <input type="tel" name="m${i}_phone" class="reg-input ereg-input" placeholder="+91 00000 00000" required />
          </div>
        </div>
        <div class="reg-form-row">
          <div class="reg-field">
            <label class="reg-label font-rajdhani">Email ${i === 1 ? '<span class="reg-required">*</span>' : ''}</label>
            <input type="email" name="m${i}_email" class="reg-input ereg-input" placeholder="email@example.com" ${i === 1 ? 'required' : ''} />
          </div>
          <div class="reg-field">
            <label class="reg-label font-rajdhani">Course / Year <span class="reg-required">*</span></label>
            <div style="display:flex;gap:6px">
              <input type="text" name="m${i}_course" class="reg-input ereg-input" placeholder="Course" required style="flex:2" />
              <select name="m${i}_year" class="reg-input reg-select ereg-input" required style="flex:1">
                <option value="" disabled selected>Yr</option>
                <option value="1">1st</option>
                <option value="2">2nd</option>
                <option value="3">3rd</option>
                <option value="4">4th</option>
              </select>
            </div>
          </div>
        </div>
        <label class="reg-upload-zone ereg-member-upload" for="m${i}_idFile">
          <div class="reg-upload-preview"></div>
          <div class="reg-upload-placeholder">
            <span class="reg-upload-label font-cinzel">College ID <span class="reg-required">*</span></span>
            <span class="reg-upload-hint font-cormorant">Tap to upload · image or PDF</span>
          </div>
          <input type="file" id="m${i}_idFile" name="m${i}_idFile" class="reg-file-input ereg-input" accept="image/*,.pdf" required />
        </label>`;
      wrap.appendChild(block);
      bindUploadLabel(block.querySelector('input[type="file"]'));
      gsap.from(block, { opacity: 0, y: 10, duration: 0.25, delay: i * 0.04, ease: 'expo.out' });
    }
  }

  // ── FINAL SUBMIT ─────────────────────────────────────
  $('eregFinalSubmit')?.addEventListener('click', async ev => {
    ev.preventDefault(); ev.stopImmediatePropagation();
    const status = $('eventRegStatus');
    const btn    = $('eregFinalSubmit');
    setStatus(status, '');
    setButtonLoading(btn, true, 'Submitting...');
    try {
      const payload = await buildNewEventPayload(); // regId already included
      await postJSON(payload);                       // fire-and-forget (iframe is opaque)
      const id      = payload.regId;                // use pre-generated ID directly
      const firstMember = payload.members?.[0] || {};
      const eventPassData = {
        regId: id || '',
        eventName: payload.event,
        teamName: payload.brand,
        college: payload.college || '',
        name: firstMember.name || payload.brand,
        members: payload.members || [],
        isSolo: payload.type === 'solo'
      };
      window.__lastEventPassData = eventPassData;
      setStatus(status, id && id !== 'SUBMITTED'
        ? `Registration successful! Reg ID: ${id}`
        : 'Registration submitted successfully!', 'success');
      btn.querySelector('.reg-submit-inner').textContent = 'Submitted ✓';
      setTimeout(() => {
        window.closeEventRegModal();
        setTimeout(() => {
          if (typeof window.showEventSuccessPopup === 'function') {
            window.showEventSuccessPopup(id || '', eventPassData);
          }
        }, 320);
      }, 280);
    } catch (err) {
      setStatus(status, err.message || 'Could not submit. Please try again.', 'error');
    } finally {
      // Always re-enable — resetEventReg also resets on next modal open,
      // but the finally ensures the button is never stuck disabled.
      setButtonLoading(btn, false);
    }
  }, true);

  async function buildNewEventPayload() {
    const isSolo = (eventReg.formType === 'solo') || (eventReg.selectedType === 'solo');
    const eventId = eventReg.currentEventId;
    // backendTitle lets an event display in Hindi/special chars on the site
    // while sending a clean ASCII name to the sheet, Drive, and email pass.
    const eventName = getEventData(eventId).backendTitle || eventReg.currentEvent;

    // ── Generate Reg ID now — used by PDF before server responds ──
    const regId = generateRegId(eventId);

    if (isSolo) {
      const f = $('ereg-solo-form');
      const idFileInput = f.querySelector('[name="solo_idFile"]');
      const driveInput  = f.querySelector('[name="solo_driveLink"]');
      return {
        formType:  'event',
        regId,
        eventId,
        event:     eventName,
        type:      'solo',
        brand:     $('ereg-solo-name').value.trim(),
        mainEmail: $('ereg-solo-email').value.trim(),
        mainPhone: $('ereg-solo-phone').value.trim(),
        college:   $('ereg-solo-college').value.trim(),
        driveLink: driveInput?.value.trim() || '',
        members: [{
          name:   $('ereg-solo-name').value.trim(),
          email:  $('ereg-solo-email').value.trim(),
          phone:  $('ereg-solo-phone').value.trim(),
          course: $('ereg-solo-course').value.trim(),
          year:   $('ereg-solo-year').value,
          idFile: await toBase64(idFileInput?.files?.[0])
        }]
      };
    } else {
      // team
      const f1 = $('ereg-team-form-1');
      const f2 = $('ereg-team-form-2');
      const driveInput = f1.querySelector('[name="team_driveLink"]');
      const members = [];
      for (let i = 1; i <= eventReg.participantCount; i++) {
        members.push({
          name:   f2.querySelector(`[name="m${i}_name"]`)?.value.trim()   || '',
          email:  f2.querySelector(`[name="m${i}_email"]`)?.value.trim()  || '',
          phone:  f2.querySelector(`[name="m${i}_phone"]`)?.value.trim()  || '',
          course: f2.querySelector(`[name="m${i}_course"]`)?.value.trim() || '',
          year:   f2.querySelector(`[name="m${i}_year"]`)?.value          || '',
          idFile: await toBase64(f2.querySelector(`[name="m${i}_idFile"]`)?.files?.[0])
        });
      }
      return {
        formType:  'event',
        regId,
        eventId,
        event:     eventName,
        type:      'team',
        brand:     $('ereg-team-name').value.trim(),
        mainEmail: $('ereg-team-email').value.trim(),
        mainPhone: $('ereg-team-phone').value.trim(),
        college:   $('ereg-team-college').value.trim(),
        driveLink: driveInput?.value.trim() || '',
        members
      };
    }
  }

  // ── Close button & overlay ────────────────────────────
  $('eventRegCloseBtn')?.addEventListener('click', ev => {
    ev.preventDefault(); ev.stopImmediatePropagation();
    window.closeEventRegModal();
  }, true);

  eventRegOverlay?.addEventListener('click', ev => {
    ev.preventDefault(); ev.stopImmediatePropagation();
    window.closeEventRegModal();
  }, true);

  renderEventsModal();
  syncScheduleLabels();
})();

/* =====================
   🔥 TRYST FORM PATCH
   Integrated into script.js after the production registration system
===================== */

/*
  ✅ §21 formIntegration — REMOVED (was duplicate of §20 handlers).
  §20's postJSON now correctly uses field name "payload" + token,
  so no secondary listeners are needed here.
*/

async function getLatestRegId(sheetName = "Attendees") {
  try {
    const res = await fetch(`${POST_URL}?sheet=${sheetName}`);
    const data = await res.json();

    if (data.status === "success") {
      return data.regId;
    }
  } catch (err) {
    console.error("Polling error:", err);
  }

  return null;
}
/* ═══════════════════════════════════════════════
   TRYST 2026 — ADDITIONS
   Tasks: 3 · 4 · 6+8 · 7 · 9
═══════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   DUAL SUCCESS POPUPS
   ─────────────────────────────────────────────
   Two separate popups — different messages,
   same visual style:

   showEventSuccessPopup(regId)
     → shown after event registration
     → reminds user to also register as attendee
     → has "Register as Attendee →" link to #register

   showAttendeeSuccessPopup(regId)
     → shown after attendee registration
     → explains entry rules (email + photo ID)

   Both accept an optional regId string.
───────────────────────────────────────────── */
(function dualSuccessPopups() {

  /* ── Shared factory: build open/close for one popup ── */
  function makePopup(overlayId, popupId, closeTriggerId) {
    const overlay = document.getElementById(overlayId);
    const popup   = document.getElementById(popupId);
    const closeBtn = document.getElementById(closeTriggerId);
    if (!overlay || !popup) return { open: () => {}, close: () => {} };

    function open(regId, regElId) {
      // Stamp reg ID if provided
      const regEl = regElId ? document.getElementById(regElId) : null;
      if (regEl) regEl.textContent = regId ? ('Reg ID: ' + regId) : '';

      overlay.classList.add('sp-active');
      document.body.style.overflow = 'hidden';

      gsap.fromTo(popup,
        { opacity: 0, scale: 0.88, y: 22, visibility: 'hidden' },
        { opacity: 1, scale: 1,    y: 0,  visibility: 'visible',
          duration: 0.38, ease: 'expo.out', clearProps: 'transform' }
      );
    }

    function close() {
      gsap.to(popup, {
        opacity: 0, scale: 0.93, y: 12,
        duration: 0.24, ease: 'power3.in',
        onComplete: () => {
          popup.style.visibility = 'hidden';
          overlay.classList.remove('sp-active');
          document.body.style.overflow = '';
          gsap.set(popup, { clearProps: 'all' });
        }
      });
    }

    // Wire close button
    if (closeBtn) closeBtn.addEventListener('click', close);
    // Wire overlay click
    overlay.addEventListener('click', close);
    // Wire Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('sp-active')) close();
    });

    return { open, close };
  }

  /* ── Event success popup ────────────────────── */
  const eventPopup = makePopup(
    'eventSuccessOverlay',
    'eventSuccessPopup',
    'eventSuccessClose'
  );

  // "Register as Attendee →" link: close popup + scroll to #register
  const eventRegLink = document.getElementById('eventSuccessRegLink');
  if (eventRegLink) {
    eventRegLink.addEventListener('click', e => {
      e.preventDefault();
      eventPopup.close();
      setTimeout(() => {
        const target = document.getElementById('register');
        if (target && window.gsap) {
          gsap.to(window, { scrollTo: { y: target, offsetY: 76 }, duration: 0.85, ease: 'expo.inOut' });
        }
      }, 280);
    });
  }

  // Dismiss button
  const eventDismiss = document.getElementById('eventSuccessDismiss');
  if (eventDismiss) eventDismiss.addEventListener('click', () => eventPopup.close());

  window.showEventSuccessPopup = (regId = '') =>
    eventPopup.open(regId, 'eventSuccessRegId');
  window.closeEventSuccessPopup = () => eventPopup.close();

  /* ── Attendee success popup ─────────────────── */
  const attendeePopup = makePopup(
    'attendeeSuccessOverlay',
    'attendeeSuccessPopup',
    'attendeeSuccessClose'
  );

  const attendeeDismiss = document.getElementById('attendeeSuccessDismiss');
  if (attendeeDismiss) attendeeDismiss.addEventListener('click', () => attendeePopup.close());

  window.showAttendeeSuccessPopup = (regId = '') =>
    attendeePopup.open(regId, 'attendeeSuccessRegId');
  window.closeAttendeeSuccessPopup = () => attendeePopup.close();

  /* Keep legacy shim so any old callers don't crash */
  window.showSuccessPopup   = window.showEventSuccessPopup;
  window.closeSuccessPopup  = window.closeEventSuccessPopup;

})();

/* ══════════════════════════════════════════════════════════════════
   PASS PDF GENERATOR
   Generates a styled registration pass PDF in-browser using jsPDF.
   Mirrors the email pass design: dark background, gold accents,
   header, fields, reg ID stamp, barcode strip, rules, stub.

   Called automatically when each success popup opens.
   Download triggered when user clicks the button.

   API:
     window.downloadAttendeePass()  — attendee entry pass
     window.downloadEventPass()     — event participant/team pass
══════════════════════════════════════════════════════════════════ */
(function passPDFSystem() {

  // Stored registration data — populated when popups open
  let _attendeeData = null;
  let _eventData    = null;

  /* ── Colour constants matching the email exactly ── */
  const NAVY   = [6,  11, 23];     // #060B17
  const CARD   = [10, 15, 30];     // #0A0F1E
  const HEADER = [13, 21, 48];     // #0D1530
  const GOLD   = [201,168,76];     // #C9A84C
  const GOLD_L = [229,201,126];    // #E5C97E
  const WHITE  = [255,255,255];
  const DIM    = [255,255,255];    // used with opacity via fillColor alpha trick

  /* ── Page dimensions (A4 portrait) ── */
  const PW = 210, PH = 297;        // mm
  const ML = 18,  MR = 18;         // left/right margin
  const CW = PW - ML - MR;         // content width

  /* ─────────────────────────────────────────────
     CORE PDF BUILDER
     type: 'attendee' | 'participant' | 'team'
     data: { name, email, college, course, year,
             eventName, teamName, members[] }
     regId: string
  ─────────────────────────────────────────────── */
  function buildPassPDF(type, data, regId) {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) { alert('PDF library not loaded. Please check your connection.'); return null; }

    const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    let y = 0;   // cursor

    /* ── Background ── */
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, PW, PH, 'F');

    /* ── Card ── */
    const cardX = ML, cardY = 20, cardW = CW, cardH = PH - 40;
    _roundRect(doc, cardX, cardY, cardW, cardH, 6, CARD);

    /* ── Gold corner ornaments ── */
    _cornerMark(doc, cardX + 4, cardY + 4, 'tl');
    _cornerMark(doc, cardX + cardW - 4, cardY + 4, 'tr');

    /* ── Header band ── */
    const headerH = 46;
    _roundRect(doc, cardX, cardY, cardW, headerH, 6, HEADER, true, true);   // top rounded only
    _goldBorder(doc, cardX, cardY, cardW, headerH, 0.3);

    // Pass type label
    y = cardY + 14;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...GOLD);
    doc.text(_passTypeLabel(type), PW / 2, y, { align: 'center' });

    // Subtitle
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...GOLD);
    doc.setCharSpace(1.5);
    doc.text('TRYST 2026  ·  KESHAV MAHAVIDYALAYA', PW / 2, y, { align: 'center' });
    doc.setCharSpace(0);

    // Thin gold line under header
    y = cardY + headerH;
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.2);
    doc.line(cardX, y, cardX + cardW, y);

    /* ── PRE-TEAR section: greeting + fields ── */
    y += 10;
    const ix = cardX + 12;   // inner x

    // Greeting
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255, 0.7);
    doc.setTextColor(210, 210, 210);
    doc.text(_greeting(type, data), ix, y);

    y += 5;
    doc.setFontSize(9);
    doc.setTextColor(170, 170, 170);
    doc.text(_greeting2(type, data), ix, y);

    // Thin divider
    y += 7;
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.15);
    doc.setLineDashPattern([0.5, 0.5], 0);
    doc.line(ix, y, cardX + cardW - 12, y);
    doc.setLineDashPattern([], 0);

    // Fields
    y += 8;
    const fields = _buildFields(type, data);
    const colW   = (CW - 24) / 2;

    for (let i = 0; i < fields.length; i += 2) {
      const left  = fields[i];
      const right = fields[i + 1];
      _field(doc, ix,           y, colW, left.label,  left.value);
      if (right) _field(doc, ix + colW + 4, y, colW, right.label, right.value);
      y += 14;
    }

    // Team roster (for team type)
    if (type === 'team' && data.members && data.members.length > 0) {
      y += 2;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(...GOLD);
      doc.setCharSpace(1.5);
      doc.text('ROSTER', ix, y);
      doc.setCharSpace(0);
      y += 5;

      data.members.forEach((m, idx) => {
        const num = String(idx + 1).padStart(2, '0');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(...WHITE);
        doc.text(`${num}  ${m.name || '—'}`, ix + 4, y);
        if (m.email) {
          doc.setFontSize(7);
          doc.setTextColor(160, 160, 160);
          doc.text(m.email, ix + 40, y);
        }
        y += 6;
        // Page overflow guard
        if (y > cardY + cardH - 50) { y = cardY + cardH - 50; }
      });
      y += 2;
    }

    /* ── TEAR LINE ── */
    y += 4;
    _tearLine(doc, cardX, cardX + cardW, y);
    y += 10;

    /* ── REG ID STAMP ── */
    const stampH = 28;
    _roundRect(doc, ix, y, cardW - 24, stampH, 4, NAVY);
    _goldBorder(doc, ix, y, cardW - 24, stampH, 0.25);

    // "Registration ID" label
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...GOLD);
    doc.setCharSpace(2);
    doc.text('REGISTRATION ID', PW / 2, y + 8, { align: 'center' });
    doc.setCharSpace(0);

    // Reg ID value
    doc.setFont('courier', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...GOLD_L);
    doc.text(regId || 'TRYST-PENDING', PW / 2, y + 16, { align: 'center' });

    // Barcode strip
    _barcodeStrip(doc, PW / 2, y + 23);
    y += stampH + 8;

    /* ── RULES ── */
    const rules = _buildRules(type);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...GOLD);
    doc.setCharSpace(2);
    doc.text('IMPORTANT', ix, y);
    doc.setCharSpace(0);

    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.15);
    doc.line(ix, y + 2, cardX + cardW - 12, y + 2);
    y += 7;

    rules.forEach(rule => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...GOLD);
      doc.text('◆', ix, y);
      doc.setTextColor(200, 200, 200);
      const lines = doc.splitTextToSize(rule, cardW - 30);
      doc.text(lines, ix + 6, y);
      y += lines.length * 4.5 + 1;
    });

    /* ── STUB ── */
    const stubY = cardY + cardH - 18;
    doc.setFillColor(...HEADER);
    doc.rect(cardX, stubY, cardW, 18, 'F');
    _goldBorder(doc, cardX, stubY, cardW, 18, 0.2);
    _cornerMark(doc, cardX + 4, stubY + 14, 'bl');
    _cornerMark(doc, cardX + cardW - 4, stubY + 14, 'br');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...GOLD);
    doc.setCharSpace(1.2);
    doc.text('APRIL 28 – 29, 2026', PW / 2, stubY + 7, { align: 'center' });
    doc.setCharSpace(0);
    doc.setFontSize(6.5);
    doc.setTextColor(160, 160, 160);
    doc.text('Keshav Mahavidyalaya  ·  University of Delhi', PW / 2, stubY + 13, { align: 'center' });

    /* ── Footer outside card ── */
    doc.setFontSize(6);
    doc.setTextColor(80, 80, 80);
    doc.setCharSpace(1);
    doc.text('✦  TRYST 2026  ·  KMV DELHI  ✦', PW / 2, PH - 10, { align: 'center' });
    doc.setCharSpace(0);
    doc.setFontSize(5.5);
    doc.text('Automated confirmation — please do not reply.', PW / 2, PH - 6, { align: 'center' });

    return doc;
  }

  /* ─────────────────────────────────────────────
     DRAWING HELPERS
  ─────────────────────────────────────────────── */
  function _roundRect(doc, x, y, w, h, r, fillColor, topOnly, bottomOnly) {
    doc.setFillColor(...fillColor);
    doc.roundedRect(x, y, w, h, r, r, 'F');
  }

  function _goldBorder(doc, x, y, w, h, lw) {
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(lw || 0.25);
    doc.roundedRect(x, y, w, h, 4, 4, 'S');
  }

  function _cornerMark(doc, x, y, corner) {
    const s = 4;  // size of L-mark
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.5);
    if (corner === 'tl') {
      doc.line(x, y, x + s, y);
      doc.line(x, y, x, y + s);
    } else if (corner === 'tr') {
      doc.line(x, y, x - s, y);
      doc.line(x, y, x, y + s);
    } else if (corner === 'bl') {
      doc.line(x, y, x + s, y);
      doc.line(x, y, x, y - s);
    } else if (corner === 'br') {
      doc.line(x, y, x - s, y);
      doc.line(x, y, x, y - s);
    }
  }

  function _tearLine(doc, x1, x2, y) {
    // dashed line
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.3);
    doc.setLineDashPattern([1, 1.5], 0);
    doc.line(x1 + 6, y, x2 - 6, y);
    doc.setLineDashPattern([], 0);
    // diamond
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...GOLD);
    doc.text('◆', PW / 2, y + 1.5, { align: 'center' });
  }

  function _barcodeStrip(doc, cx, y) {
    const pattern = [2,1,3,1,2,1,1,3,2,1,2,2,1,3,1,2,1,3,1,2,2,1,1,2,3,1,2,1,3,1,2,1,1,2,3,1,2,1];
    const scale = 0.8, barH = 5;
    const totalW = pattern.reduce((a, b) => a + b, 0) * scale;
    let bx = cx - totalW / 2;
    pattern.forEach((w, i) => {
      const bw = w * scale;
      if (i % 2 === 0) {
        doc.setFillColor(201, 168, 76, 0.5);
        doc.setFillColor(150, 120, 50);   // gold bars
        doc.rect(bx, y - barH, bw, barH, 'F');
      }
      bx += bw;
    });
  }

  function _field(doc, x, y, w, label, value) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(...GOLD);
    doc.setCharSpace(1.8);
    doc.text((label || '').toUpperCase(), x, y);
    doc.setCharSpace(0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...WHITE);
    const lines = doc.splitTextToSize(value || '—', w);
    doc.text(lines, x, y + 4.5);
  }

  /* ─────────────────────────────────────────────
     DATA HELPERS
  ─────────────────────────────────────────────── */
  function _passTypeLabel(type) {
    return { attendee: 'ENTRY PASS', participant: 'PARTICIPANT PASS', team: 'TEAM PASS' }[type] || 'REGISTRATION PASS';
  }

  function _greeting(type, data) {
    if (type === 'attendee')    return `Welcome to the realm, ${data.name || 'Guest'}.`;
    if (type === 'participant') return `Your participation in ${data.eventName || 'the event'} is confirmed.`;
    if (type === 'team')        return `${data.teamName || 'Your team'} is registered for ${data.eventName || 'the event'}.`;
    return 'Registration confirmed.';
  }

  function _greeting2(type, data) {
    if (type === 'attendee')    return 'Your entry to TRYST 2026 has been confirmed.';
    if (type === 'participant') return `Represent your team with pride, ${data.name || ''}.`;
    if (type === 'team')        return 'May your performance be legendary.';
    return '';
  }

  function _buildFields(type, data) {
    if (type === 'attendee') return [
      { label: 'Full Name', value: data.name    || '—' },
      { label: 'College',   value: data.college || '—' },
      { label: 'Course',    value: data.course  || '—' },
      { label: 'Year',      value: data.year    || '—' },
    ];
    if (type === 'participant') return [
      { label: 'Participant',  value: data.name      || '—' },
      { label: data.isSolo ? 'Solo Name' : 'Team Name', value: data.teamName || '—' },
      { label: 'Event',        value: data.eventName || '—' },
      { label: 'College',      value: data.college   || '—' },
    ];
    if (type === 'team') return [
      { label: 'Event',        value: data.eventName || '—' },
      { label: 'Team Name',    value: data.teamName  || '—' },
      { label: 'College',      value: data.college   || '—' },
      { label: 'Participants', value: String((data.members || []).length) + ' member' + ((data.members||[]).length !== 1 ? 's' : '') },
    ];
    return [];
  }

  function _buildRules(type) {
    const common = [
      'Entry via Gate 1 only',
      'Carry a valid photo identity proof',
      'Report to the venue 30 minutes early',
    ];
    if (type === 'attendee') return [
      ...common,
      'Present this pass or your confirmation email on arrival',
    ];
    if (type === 'team') return [
      'Entry via Gate 1 only — all members must show their individual passes',
      'Captain must report to the venue 30 minutes early for check-in',
      'Carry valid photo identity proof',
      'Individual passes have been sent to each participant',
    ];
    return [
      ...common,
      'This pass is personal and non-transferable',
    ];
  }

  /* ─────────────────────────────────────────────
     PUBLIC API
     Called from popup buttons in index.html
  ─────────────────────────────────────────────── */
  window.downloadAttendeePass = function() {
    const btn = document.getElementById('attendeePassDownloadBtn');
    if (!_attendeeData) { _showPassError(btn); return; }
    _triggerDownload(btn, () =>
      buildPassPDF('attendee', _attendeeData, _attendeeData.regId),
      `TRYST2026-Entry-Pass-${_attendeeData.regId || 'pass'}.pdf`
    );
  };

  window.downloadEventPass = function() {
    const btn = document.getElementById('eventPassDownloadBtn');
    if (!_eventData) { _showPassError(btn); return; }
    const type = _eventData.isSolo ? 'participant' : 'team';
    _triggerDownload(btn, () =>
      buildPassPDF(type, _eventData, _eventData.regId),
      `TRYST2026-${_eventData.eventName || 'Event'}-Pass-${_eventData.regId || 'pass'}.pdf`
    );
  };

  function _triggerDownload(btn, buildFn, filename) {
    if (btn) { btn.classList.add('pdf-generating'); btn.querySelector('span').textContent = 'Generating…'; }
    try {
      const doc = buildFn();
      if (doc) doc.save(filename);
    } catch(e) {
      console.error('Pass PDF error:', e);
      alert('Could not generate PDF. Please screenshot this page as a backup.');
    } finally {
      if (btn) {
        setTimeout(() => {
          btn.classList.remove('pdf-generating');
          btn.querySelector('span').textContent = '⬇ Download Pass PDF';
        }, 1200);
      }
    }
  }

  function _showPassError(btn) {
    if (btn) {
      btn.querySelector('span').textContent = 'No data — submit first';
      setTimeout(() => btn.querySelector('span').textContent = '⬇ Download Pass PDF', 2000);
    }
  }

  /* ─────────────────────────────────────────────
     HOOKS — intercept showXxxSuccessPopup to
     capture registration data for the PDF
  ─────────────────────────────────────────────── */

  // Wrap showAttendeeSuccessPopup to capture attendee data
  const _origAttendee = window.showAttendeeSuccessPopup;
  window.showAttendeeSuccessPopup = function(regId, extraData) {
    // extraData is passed from the submit handler when available
    _attendeeData = extraData ? { ...extraData, regId } : _scrapeAttendeeForm(regId);
    if (_origAttendee) _origAttendee(regId);
  };

  // Wrap showEventSuccessPopup to capture event data
  const _origEvent = window.showEventSuccessPopup;
  window.showEventSuccessPopup = function(regId, extraData) {
    _eventData = extraData ? { ...extraData, regId } : _scrapeEventForm(regId);
    if (_origEvent) _origEvent(regId);
  };

  // Scrape attendee form values when no extraData is passed
  function _scrapeAttendeeForm(regId) {
    const $ = id => document.getElementById(id);
    return {
      regId,
      name:    $('reg-name')?.value?.trim()    || '',
      email:   $('reg-email')?.value?.trim()   || '',
      phone:   $('reg-phone')?.value?.trim()   || '',
      college: $('reg-college')?.value?.trim() || '',
      course:  $('reg-course')?.value?.trim()  || '',
      year:    $('reg-year')?.value            || '',
      gender:  $('reg-gender')?.value          || '',
    };
  }

  // Scrape event form values when no extraData is passed
  function _scrapeEventForm(regId) {
    const $ = id => document.getElementById(id);
    // Try solo form first, fall back to team form
    const soloName    = $('ereg-solo-name')?.value?.trim();
    const teamName    = $('ereg-team-name')?.value?.trim();
    const eventTitle  = document.getElementById('confirm-event')?.textContent?.trim()
                     || document.getElementById('eregEventTitle')?.textContent?.trim()
                     || '';
    const isSolo      = !!soloName && !teamName;

    return {
      regId,
      name:       soloName || $('ereg-solo-name')?.value?.trim() || '',
      teamName:   soloName || teamName || '',
      eventName:  eventTitle,
      college:    $('ereg-solo-college')?.value?.trim() || $('ereg-team-college')?.value?.trim() || '',
      isSolo,
      members:    _scrapeMembers(),
    };
  }

  function _scrapeMembers() {
    const members = [];
    // The confirm participants list has text like "1. Name — Course, Year"
    document.querySelectorAll('.ereg-confirm-participant').forEach(el => {
      const text = el.textContent || '';
      const match = text.match(/^\d+\.\s+(.+?)(?:\s+—\s+(.+))?$/);
      if (match) members.push({ name: match[1]?.trim() || text, email: '' });
    });
    return members;
  }

})();

/* ─────────────────────────────────────────────
   TASK 4 — Form Reset After Submission
───────────────────────────────────────────── */
(function passPDFMailTemplateOverride() {
  let attendeePassData = null;
  let eventPassData = null;
  const LOGO_SRC = 'images/logo.jpg';

  const previousAttendeePopup = window.showAttendeeSuccessPopup;
  window.showAttendeeSuccessPopup = function(regId, extraData) {
    attendeePassData = extraData
      ? { ...extraData, regId: regId || extraData.regId || '' }
      : (window.__lastAttendeePassData ? { ...window.__lastAttendeePassData, regId: regId || window.__lastAttendeePassData.regId || '' } : null);
    if (typeof previousAttendeePopup === 'function') previousAttendeePopup(regId, extraData);
  };

  const previousEventPopup = window.showEventSuccessPopup;
  window.showEventSuccessPopup = function(regId, extraData) {
    eventPassData = extraData
      ? { ...extraData, regId: regId || extraData.regId || '' }
      : (window.__lastEventPassData ? { ...window.__lastEventPassData, regId: regId || window.__lastEventPassData.regId || '' } : null);
    if (typeof previousEventPopup === 'function') previousEventPopup(regId, extraData);
  };

  window.downloadAttendeePass = function() {
    const btn = document.getElementById('attendeePassDownloadBtn');
    if (!attendeePassData) return showPassError(btn);
    triggerPassDownload(btn, 'attendee', attendeePassData, attendeePassData.regId, `TRYST2026-Entry-Pass-${safeFileName(attendeePassData.regId || 'pass')}.pdf`);
  };

  window.downloadEventPass = function() {
    const btn = document.getElementById('eventPassDownloadBtn');
    if (!eventPassData) return showPassError(btn);
    const passType = eventPassData.isSolo ? 'participant' : 'team';
    triggerPassDownload(btn, passType, eventPassData, eventPassData.regId, `TRYST2026-${safeFileName(eventPassData.eventName || 'Event')}-Pass-${safeFileName(eventPassData.regId || 'pass')}.pdf`);
  };

  async function triggerPassDownload(btn, passType, data, regId, filename) {
    const label = btn?.querySelector('span');
    if (btn) btn.classList.add('pdf-generating');
    if (label) label.textContent = 'Generating...';
    try {
      const doc = await buildPassPdfFromHtml(passType, data, regId);
      if (doc) doc.save(filename);
    } catch (error) {
      console.error('Pass PDF error:', error);
      alert('Could not generate the pass PDF right now.');
    } finally {
      if (btn) btn.classList.remove('pdf-generating');
      if (label) label.textContent = 'Download Pass PDF';
    }
  }

  async function buildPassPdfFromHtml(passType, data, regId) {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF || !window.html2canvas) throw new Error('PDF libraries not loaded.');

    const mount = document.createElement('div');
    mount.style.position = 'fixed';
    mount.style.left = '-200vw';
    mount.style.top = '0';
    mount.style.width = '624px';
    mount.style.pointerEvents = 'none';
    mount.style.opacity = '0';
    mount.innerHTML = buildPassHtml(passType, data, regId);
    document.body.appendChild(mount);

    const root = mount.firstElementChild;
    await waitForImages(root);
    const canvas = await window.html2canvas(root, {
      backgroundColor: '#060B17',
      scale: 2,
      useCORS: true,
      logging: false
    });
    mount.remove();

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const pageW = 210;
    const pageH = 297;
    const margin = 10;
    const ratio = Math.min((pageW - margin * 2) / canvas.width, (pageH - margin * 2) / canvas.height);
    const imgW = canvas.width * ratio;
    const imgH = canvas.height * ratio;
    const x = (pageW - imgW) / 2;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', x, margin, imgW, imgH, undefined, 'FAST');
    return pdf;
  }

  function buildPassHtml(passType, data, regId) {
    if (passType === 'attendee') return buildAttendeePassHtml(data, regId);
    if (passType === 'team') return buildTeamPassHtml(data, regId);
    return buildParticipantPassHtml(data, regId);
  }

  function buildAttendeePassHtml(data, regId) {
    const name = escapePassHtml(data.name || 'Participant');
    const college = escapePassHtml(data.college || '-');
    const course = escapePassHtml(data.course || '-');
    const year = escapePassHtml(data.year || '-');
    return wrapEmail(
      buildHeader('Entry Pass', 'Attendee &nbsp;&middot;&nbsp; TRYST 2026'),
      buildGreeting('Welcome to the realm, ' + name + '.') +
      buildGreeting2('Your entry to TRYST 2026 has been confirmed.') +
      buildDivider() +
      buildFieldsRow(buildField('Full Name', name), buildField('College', college)) +
      buildFieldsRow(buildField('Course', course), buildField('Year', year)),
      buildRegStamp(regId) +
      buildRules([
        'Entry via <b style="color:#E5C97E;">Gate 1 only</b>',
        'Present this email on arrival &mdash; digital copy accepted',
        'Carry a valid <b style="color:#E5C97E;">photo identity proof</b>',
        'Screenshots and printouts will <i>not</i> be accepted',
        'Arrive at least <b style="color:#E5C97E;">30 minutes</b> before your event'
      ]),
      buildStub('April 28 &ndash; 29, 2026', 'Keshav Mahavidyalaya &nbsp;&middot;&nbsp; University of Delhi')
    );
  }

  function buildParticipantPassHtml(data, regId) {
    const name = escapePassHtml(data.name || 'Participant');
    const college = escapePassHtml(data.college || '-');
    const eventName = escapePassHtml(data.eventName || 'Event');
    const teamName = escapePassHtml(data.teamName || 'Team');
    return wrapEmail(
      buildHeader('Participant Pass', eventName + ' &nbsp;&middot;&nbsp; TRYST 2026'),
      buildGreeting('Your participation in <b style="color:#E5C97E;font-style:normal;">' + eventName + '</b> is confirmed.') +
      buildGreeting2('Represent your team with pride, ' + name + '.') +
      buildDivider() +
      buildFieldsRow(buildField('Participant', name), buildField(data.isSolo ? 'Solo Name' : 'Team / Solo Name', teamName)) +
      buildFieldsRow(buildField('Event', eventName), buildField('College', college)),
      buildRegStamp(regId) +
      buildRules([
        'Entry via <b style="color:#E5C97E;">Gate 1 only</b> &mdash; show this pass',
        'Carry a valid <b style="color:#E5C97E;">photo identity proof</b>',
        'Report to the venue <b style="color:#E5C97E;">30 minutes</b> early',
        'This pass is personal and non-transferable'
      ]),
      buildStub('April 28 &ndash; 29, 2026', 'Keshav Mahavidyalaya &nbsp;&middot;&nbsp; University of Delhi')
    );
  }

  function buildTeamPassHtml(data, regId) {
    const eventName = escapePassHtml(data.eventName || 'Event');
    const teamName = escapePassHtml(data.teamName || 'Team');
    const college = escapePassHtml(data.college || '-');
    const members = Array.isArray(data.members) ? data.members : [];
    const count = members.length + ' member' + (members.length !== 1 ? 's' : '');
    const rosterRows = members.map((member, index) => {
      const num = String(index + 1).padStart(2, '0');
      const email = member.email ? ' &nbsp;<span style="font-size:11px;color:rgba(255,255,255,0.35);font-family:Arial,sans-serif;">' + escapePassHtml(member.email) + '</span>' : '';
      return '<tr><td style="padding:6px 0;border-bottom:1px solid rgba(201,168,76,0.08);"><span style="font-size:10px;color:rgba(201,168,76,0.4);font-family:Arial,sans-serif;margin-right:10px;">' + num + '</span><span style="font-size:13px;color:#ffffff;font-family:Georgia,serif;">' + escapePassHtml(member.name || '-') + '</span>' + email + '</td></tr>';
    }).join('');
    return wrapEmail(
      buildHeader('Team Pass', eventName + ' &nbsp;&middot;&nbsp; TRYST 2026'),
      buildGreeting('<b style="color:#E5C97E;font-style:normal;">' + teamName + '</b> is officially registered for <b style="color:#E5C97E;font-style:normal;">' + eventName + '</b>.') +
      buildGreeting2('May your performance be legendary.') +
      buildDivider() +
      buildFieldsRow(buildField('Event', eventName), buildField('Team Name', teamName)) +
      buildFieldsRow(buildField('College', college), buildField('Participants', count)) +
      buildDivider() +
      '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:4px;"><tr><td style="padding-bottom:10px;"><span style="font-size:9px;letter-spacing:0.38em;text-transform:uppercase;color:rgba(201,168,76,0.52);font-family:Arial,sans-serif;">Roster</span></td></tr>' + rosterRows + '</table>',
      buildRegStamp(regId) +
      buildRules([
        'Entry via <b style="color:#E5C97E;">Gate 1 only</b> &mdash; all members must show their individual passes',
        'Captain must report to the venue <b style="color:#E5C97E;">30 minutes</b> early for check-in',
        'Carry valid <b style="color:#E5C97E;">photo identity proof</b>',
        'Individual passes have been sent to each participant'
      ]),
      buildStub('April 28 &ndash; 29, 2026', 'Keshav Mahavidyalaya &nbsp;&middot;&nbsp; University of Delhi')
    );
  }

  function wrapEmail(headerHtml, preHtml, postHtml, stubHtml) {
    return '<div style="width:600px;max-width:600px;background:#060B17;padding:28px 12px 24px;box-sizing:border-box;">' +
      '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;margin:0 auto 10px;"><tr><td align="center" style="padding-bottom:10px;"><p style="margin:0;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:rgba(201,168,76,0.45);font-family:Arial,sans-serif;">Keshav Mahavidyalaya &nbsp;&middot;&nbsp; University of Delhi</p></td></tr></table>' +
      '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0A0F1E;border:1px solid rgba(201,168,76,0.28);border-radius:14px;overflow:hidden;"><tr><td width="28" style="padding:14px 0 0 14px;vertical-align:top;"><table cellpadding="0" cellspacing="0" border="0"><tr><td style="width:14px;height:14px;border-top:1.5px solid #C9A84C;border-left:1.5px solid #C9A84C;font-size:0;line-height:0;">&nbsp;</td></tr></table></td><td style="padding:0;">&nbsp;</td><td width="28" style="padding:14px 14px 0 0;vertical-align:top;"><table cellpadding="0" cellspacing="0" border="0" align="right"><tr><td style="width:14px;height:14px;border-top:1.5px solid #C9A84C;border-right:1.5px solid #C9A84C;font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>' +
      headerHtml +
      '<tr><td colspan="3" style="padding:26px 32px 10px;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td>' + preHtml + '</td></tr></table></td></tr>' +
      '<tr><td colspan="3" style="padding:0;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1.5px dashed rgba(201,168,76,0.38);line-height:0;font-size:0;">&nbsp;</td><td width="32" align="center" style="color:#C9A84C;font-size:15px;font-family:Arial,sans-serif;padding:10px 0;">&#9670;</td><td style="border-top:1.5px dashed rgba(201,168,76,0.38);line-height:0;font-size:0;">&nbsp;</td></tr></table></td></tr>' +
      '<tr><td colspan="3" style="padding:16px 32px 0;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td>' + postHtml + '</td></tr></table></td></tr>' +
      stubHtml +
      '</table>' +
      '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;margin:16px auto 0;"><tr><td align="center" style="padding-bottom:6px;"><p style="margin:0;font-size:10px;letter-spacing:0.3em;color:rgba(201,168,76,0.28);font-family:Arial,sans-serif;text-transform:uppercase;">&#10022; &nbsp; TRYST 2026 &nbsp;&middot;&nbsp; Apr 28&ndash;29, KMV Delhi &nbsp; &#10022;</p></td></tr><tr><td align="center"><p style="margin:0;font-size:10px;color:rgba(255,255,255,0.18);font-family:Arial,sans-serif;">Automated confirmation &mdash; please do not reply.</p></td></tr></table>' +
      '</div>';
  }

  function buildHeader(passType, subtitle) {
    return '<tr><td colspan="3" align="center" style="background:#0D1530;border-bottom:1px solid rgba(201,168,76,0.22);padding:22px 20px 20px;"><table cellpadding="0" cellspacing="0" border="0" align="center"><tr><td align="center" style="width:46px;height:46px;border-radius:50%;border:1.5px solid rgba(201,168,76,0.35);background:#0A0F1E;text-align:center;vertical-align:middle;padding:0;"><img src="' + LOGO_SRC + '" width="38" height="38" alt="TRYST" style="display:block;border:0;margin:4px auto;border-radius:50%;object-fit:cover;"/></td></tr></table><div style="height:10px;"></div><span style="font-size:20px;font-weight:700;color:#C9A84C;letter-spacing:0.18em;text-transform:uppercase;font-family:Georgia,Times New Roman,serif;display:block;line-height:1.25;">' + passType + '</span><span style="font-size:10px;color:rgba(201,168,76,0.55);letter-spacing:0.38em;text-transform:uppercase;font-family:Arial,sans-serif;display:block;margin-top:6px;">' + subtitle + '</span></td></tr>';
  }

  function buildGreeting(html) {
    return '<p style="margin:0 0 8px;font-size:16px;font-style:italic;color:rgba(255,255,255,0.65);line-height:1.55;font-family:Georgia,Times New Roman,serif;">' + html + '</p>';
  }

  function buildGreeting2(html) {
    return '<p style="margin:0 0 18px;font-size:15px;font-style:italic;color:rgba(255,255,255,0.55);line-height:1.5;font-family:Georgia,Times New Roman,serif;">' + html + '</p>';
  }

  function buildDivider() {
    return '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:18px;"><tr><td style="border-top:1px solid rgba(201,168,76,0.14);font-size:0;line-height:0;">&nbsp;</td></tr></table>';
  }

  function buildFieldsRow(leftHtml, rightHtml) {
    return '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="50%" style="padding:0 12px 16px 0;vertical-align:top;">' + leftHtml + '</td><td width="50%" style="padding:0 0 16px 0;vertical-align:top;">' + rightHtml + '</td></tr></table>';
  }

  function buildField(label, value) {
    return '<span style="display:block;font-size:9px;letter-spacing:0.38em;text-transform:uppercase;color:rgba(201,168,76,0.52);font-family:Arial,sans-serif;margin-bottom:4px;">' + label + '</span><span style="display:block;font-size:14px;color:#ffffff;font-family:Georgia,Times New Roman,serif;line-height:1.3;">' + value + '</span>';
  }

  function buildRegStamp(regId) {
    return '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#060B17;border:1px solid rgba(201,168,76,0.32);border-radius:8px;margin:16px 0 20px;"><tr><td align="center" style="padding:16px 20px 10px;"><span style="display:block;font-size:9px;letter-spacing:0.4em;text-transform:uppercase;color:rgba(201,168,76,0.48);font-family:Arial,sans-serif;margin-bottom:7px;">Registration ID</span><span style="display:block;font-size:14px;font-weight:700;letter-spacing:0.14em;color:#E5C97E;font-family:Courier New,Courier,monospace;word-break:break-all;">' + escapePassHtml(regId || 'TRYST-PENDING') + '</span></td></tr><tr><td align="center" style="padding:4px 20px 14px;">' + buildBars() + '</td></tr></table>';
  }

  function buildRules(rules) {
    const items = rules.map(rule => '<tr><td style="padding:3px 0;"><table cellpadding="0" cellspacing="0" border="0"><tr><td style="color:#C9A84C;font-size:10px;padding-right:8px;vertical-align:top;padding-top:3px;font-family:Arial,sans-serif;">&#9670;</td><td style="font-size:14px;color:rgba(255,255,255,0.70);line-height:1.45;font-family:Georgia,Times New Roman,serif;">' + rule + '</td></tr></table></td></tr>').join('');
    return '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid rgba(201,168,76,0.14);padding-top:16px;margin-bottom:22px;"><tr><td style="padding-bottom:12px;"><span style="font-size:9px;letter-spacing:0.38em;text-transform:uppercase;color:rgba(201,168,76,0.52);font-family:Arial,sans-serif;">Important</span></td></tr>' + items + '</table>';
  }

  function buildStub(dateLine, venueLine) {
    return '<tr><td colspan="3" style="background:#0D1530;border-top:1px solid rgba(201,168,76,0.18);padding:14px 18px;border-radius:0 0 14px 14px;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="14" style="vertical-align:bottom;"><table cellpadding="0" cellspacing="0" border="0"><tr><td style="width:12px;height:12px;border-bottom:1.5px solid rgba(201,168,76,0.45);border-left:1.5px solid rgba(201,168,76,0.45);font-size:0;line-height:0;">&nbsp;</td></tr></table></td><td style="padding:0 14px;vertical-align:middle;"><span style="display:block;font-size:11px;color:#C9A84C;letter-spacing:0.22em;text-transform:uppercase;font-family:Georgia,Times New Roman,serif;">' + dateLine + '</span><span style="display:block;font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:0.18em;margin-top:4px;font-family:Arial,sans-serif;">' + venueLine + '</span></td><td width="14" align="right" style="vertical-align:bottom;"><table cellpadding="0" cellspacing="0" border="0" align="right"><tr><td style="width:12px;height:12px;border-bottom:1.5px solid rgba(201,168,76,0.45);border-right:1.5px solid rgba(201,168,76,0.45);font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr></table></td></tr>';
  }

  function buildBars() {
    const pattern = [2,1,3,1,2,1,1,3,2,1,2,2,1,3,1,2,1,3,1,2,2,1,1,2,3,1,2,1,3,1,2,1,1,2,3,1,2,1];
    return '<table cellpadding="0" cellspacing="0" border="0" style="display:inline-table;height:22px;"><tr>' +
      pattern.map((width, index) => '<td style="width:' + (width * 3) + 'px;background:' + (index % 2 === 0 ? 'rgba(201,168,76,0.50)' : 'transparent') + ';height:22px;font-size:0;line-height:0;">&nbsp;</td>').join('') +
      '</tr></table>';
  }

  function escapePassHtml(value) {
    return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  async function waitForImages(root) {
    const images = Array.from(root.querySelectorAll('img'));
    await Promise.all(images.map(image => new Promise(resolve => {
      if (image.complete) return resolve();
      image.onload = resolve;
      image.onerror = resolve;
    })));
  }

  function showPassError(btn) {
    const label = btn?.querySelector('span');
    if (!label) return;
    label.textContent = 'No pass data yet';
    setTimeout(() => { label.textContent = 'Download Pass PDF'; }, 1200);
  }

  function safeFileName(value) {
    return String(value || 'pass').replace(/[^\w-]+/g, '-');
  }
})();

function resetAttendeeForm() {
  const form = document.getElementById('registrationForm');
  if (!form) return;

  // Reset all text / select fields
  form.reset();

  // Clear upload previews and has-file states
  ['zone-college-id', 'zone-task-1', 'zone-instagram-task'].forEach(zoneId => {
    const zone    = document.getElementById(zoneId);
    const preview = zone?.querySelector('.reg-upload-preview');
    if (zone)    zone.classList.remove('reg-has-file');
    if (preview) { preview.innerHTML = ''; preview.style = ''; }
  });

  const taskPopupPreview = document.getElementById('taskPopupUploadPreview');
  const taskUploadZone = document.getElementById('taskPopupUploadZone');
  const taskUploadPlaceholder = document.getElementById('taskPopupUploadPlaceholder');
  const dateInput = document.getElementById('tp-review-date');
  const platformHidden = document.getElementById('reg-fitpass-platform');
  const dateHidden = document.getElementById('reg-fitpass-review-date');

  if (taskPopupPreview) taskPopupPreview.innerHTML = '';
  if (taskUploadZone) taskUploadZone.classList.remove('tp-has-file');
  if (taskUploadPlaceholder) taskUploadPlaceholder.style.display = '';
  if (dateInput) dateInput.value = '';
  if (platformHidden) platformHidden.value = '';
  if (dateHidden) dateHidden.value = '';
  if (typeof window.switchTaskTab === 'function') window.switchTaskTab('android');

  // Reset task cards to collapsed
  document.querySelectorAll('.task-card').forEach(c => c.classList.remove('active'));

  // Scroll form body back to top
  const body = document.querySelector('#registerCard .register-card-body');
  if (body) body.scrollTop = 0;
}

/* ─────────────────────────────────────────────
   TASK 6+8 — Student Union Swipe Carousel
───────────────────────────────────────────── */
(function suCarousel() {
  document.querySelectorAll('.su-swipe-card').forEach(card => {
    const track   = card.querySelector('.su-swipe-track');
    const dots    = card.querySelectorAll('.su-dot');
    const btnPrev = card.querySelector('.su-arrow-prev');
    const btnNext = card.querySelector('.su-arrow-next');
    let current   = 0;
    const total   = dots.length;

    // Set track + page widths to match page count (supports any N)
    track.style.width = (total * 100) + '%';
    track.querySelectorAll('.su-swipe-page').forEach(p => {
      p.style.width = (100 / total) + '%';
    });

    let touchStartX = 0, touchDeltaX = 0;

    function updateArrows() {
      if (btnPrev) btnPrev.classList.toggle('su-arrow--hidden', current === 0);
      if (btnNext) btnNext.classList.toggle('su-arrow--hidden', current === total - 1);
    }

    function goTo(index) {
      current = Math.max(0, Math.min(total - 1, index));
      track.style.transform = `translateX(-${(current / total) * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
      updateArrows();
    }

    // Arrow button clicks
    if (btnPrev) btnPrev.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); });
    if (btnNext) btnNext.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); });

    // Dot click
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    // Touch swipe
    card.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX; touchDeltaX = 0;
    }, { passive: true });
    card.addEventListener('touchmove', e => {
      touchDeltaX = e.touches[0].clientX - touchStartX;
    }, { passive: true });
    card.addEventListener('touchend', () => {
      if (touchDeltaX < -40) goTo(current + 1);
      if (touchDeltaX >  40) goTo(current - 1);
      touchDeltaX = 0;
    });

    // Mouse drag (desktop)
    let mouseStartX = 0, dragging = false;
    card.addEventListener('mousedown', e => { dragging = true; mouseStartX = e.clientX; });
    card.addEventListener('mousemove', e => { if (dragging) touchDeltaX = e.clientX - mouseStartX; });
    card.addEventListener('mouseup', () => {
      if (!dragging) return; dragging = false;
      if (touchDeltaX < -40) goTo(current + 1);
      if (touchDeltaX >  40) goTo(current - 1);
      touchDeltaX = 0;
    });
    card.addEventListener('mouseleave', () => { dragging = false; touchDeltaX = 0; });

    goTo(0); // initialise
  });
})();
/* ─────────────────────────────────────────────
   EVENT MODAL — Society / Event Panel Toggle
   ─────────────────────────────────────────────
   Uses CSS animation class (.ed-panel-entering) instead of
   GSAP to avoid conflicts with the card's own GSAP tween.
───────────────────────────────────────────── */
(function edSocietyToggle() {
  let societyVisible = false;

  function showPanel(panelToShow, panelToHide, btn) {
    // Hide outgoing panel
    panelToHide.style.display = 'none';
    panelToHide.classList.remove('ed-panel-entering');

    // Show incoming panel with CSS animation
    panelToShow.style.display = 'block';
    // Force reflow so animation restarts cleanly
    void panelToShow.offsetWidth;
    panelToShow.classList.add('ed-panel-entering');

    // Scroll panel area to top
    const scroll = document.querySelector('.ed-panels-scroll');
    if (scroll) scroll.scrollTop = 0;
  }

  window.toggleEdSociety = function() {
    const eventPanel   = document.getElementById('edEventPanel');
    const societyPanel = document.getElementById('edSocietyPanel');
    const btn          = document.getElementById('edSocietyToggleBtn');
    if (!eventPanel || !societyPanel || !btn) return;

    societyVisible = !societyVisible;

    if (societyVisible) {
      btn.textContent = 'About the Event';
      btn.classList.add('society-active');
      showPanel(societyPanel, eventPanel, btn);
    } else {
      btn.textContent = 'About the Society';
      btn.classList.remove('society-active');
      showPanel(eventPanel, societyPanel, btn);
    }
  };

  // ── Wrap openEventDetailModal to reset toggle + populate society data ──
  const origOpen = window.openEventDetailModal;
  window.openEventDetailModal = function(data) {
    // Reset state before opening
    societyVisible = false;

    const eventPanel   = document.getElementById('edEventPanel');
    const societyPanel = document.getElementById('edSocietyPanel');
    const btn          = document.getElementById('edSocietyToggleBtn');

    // Reset panels: show event, hide society — no animation on reset
    if (eventPanel)   { eventPanel.style.display = 'block'; eventPanel.classList.remove('ed-panel-entering'); }
    if (societyPanel) { societyPanel.style.display = 'none'; societyPanel.classList.remove('ed-panel-entering'); }
    if (btn) {
      btn.textContent = 'About the Society';
      btn.classList.remove('society-active');
    }

    // Populate society panel
    // ─── To update: edit the `societyDesc` key in TRYST_EVENTS in script.js ───
    const societyName = document.getElementById('edSocietyName');
    const societyBody = document.getElementById('edSocietyBody');
    if (societyName) societyName.textContent = data?.society || '';
    if (societyBody) {
      societyBody.textContent = data?.societyDesc
        || 'This society organises some of the most energetic and celebrated events at TRYST. Rooted in passion for their craft, they work year-round to create competitions and showcases that inspire students from across Delhi and beyond. Reach out to them via the Student Union for collaborations or queries.';
    }

    // Call original modal open (runs its own GSAP on edCard — panels are untouched)
    if (origOpen) origOpen(data);
  };

})();

/* ─────────────────────────────────────────────
   TASK 9 — FAQ Accordion
───────────────────────────────────────────── */
window.toggleFaq = function(btn) {
  const item   = btn.closest('.faq-item');
  const isOpen = item.classList.contains('faq-open');

  // Close all
  document.querySelectorAll('.faq-item.faq-open').forEach(i => {
    i.classList.remove('faq-open');
  });

  if (!isOpen) {
    item.classList.add('faq-open');
    // Subtle GSAP entrance for the answer
    const answer = item.querySelector('.faq-answer p');
    if (answer) gsap.from(answer, { opacity: 0, y: -6, duration: 0.22, ease: 'expo.out' });
  }
};
/* ═══════════════════════════════════════════════════════════════════
   ─────────────────────────────────────────────────────────────────

   § A  REGISTRATION STATUS FLAG
        ┌──────────────────────────────────────────────────────┐
        │  Set REGISTRATION_OPEN = true  → registrations work  │
        │  Set REGISTRATION_OPEN = false → show "coming soon"  │
        └──────────────────────────────────────────────────────┘
   § B  REGISTRATION CLOSED POPUP  (3-second auto-dismiss + manual)
   § C  EVENTS MENU MODAL  (new interactive card matching screenshot)

═══════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   § A — REGISTRATION STATUS FLAG
   ✏️  CHANGE THIS ONE VALUE TO OPEN/CLOSE REGISTRATIONS
───────────────────────────────────────────── */
const REGISTRATION_OPEN = true;   // ← true = open | false = show "coming soon"

/* ─────────────────────────────────────────────
   § B — REGISTRATION CLOSED POPUP
───────────────────────────────────────────── */
(function registrationGate() {
  const rcOverlay = document.getElementById('regClosedOverlay');
  const rcPopup   = document.getElementById('regClosedPopup');
  const rcTimer   = document.getElementById('regClosedTimer');
  const rcDismiss = document.getElementById('regClosedDismiss');

  if (!rcPopup) return;

  let timerInterval = null;

  /* Open popup with 3-second countdown */
  function openRegClosedPopup() {
    rcOverlay.classList.add('rc-active');
    rcPopup.classList.add('rc-active');
    document.body.style.overflow = 'hidden';

    gsap.fromTo(rcPopup,
      { opacity: 0, scale: 0.88, y: 20, visibility: 'hidden' },
      { opacity: 1, scale: 1,    y: 0,  visibility: 'visible',
        duration: 0.36, ease: 'expo.out' }
    );

    // Countdown
    let seconds = 5;
    if (rcTimer) rcTimer.textContent = `Closing in ${seconds}s`;

    timerInterval = setInterval(() => {
      seconds--;
      if (seconds > 0) {
        if (rcTimer) rcTimer.textContent = `Closing in ${seconds}s`;
      } else {
        clearInterval(timerInterval);
        if (rcTimer) rcTimer.textContent = '';
        closeRegClosedPopup();
      }
    }, 1000);
  }

  function closeRegClosedPopup() {
    clearInterval(timerInterval);
    gsap.to(rcPopup, {
      opacity: 0, scale: 0.93, y: 12, duration: 0.22, ease: 'power3.in',
      onComplete: () => {
        rcOverlay.classList.remove('rc-active');
        rcPopup.classList.remove('rc-active');
        rcPopup.style.visibility = 'hidden';
        document.body.style.overflow = '';
        gsap.set(rcPopup, { clearProps: 'all' });
      }
    });
  }

  /* Dismiss button */
  if (rcDismiss) rcDismiss.addEventListener('click', closeRegClosedPopup);
  /* Overlay click */
  if (rcOverlay) rcOverlay.addEventListener('click', closeRegClosedPopup);
  /* Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && rcOverlay?.classList.contains('rc-active')) closeRegClosedPopup();
  });

  /* ── Intercept ALL registration triggers ──────────────────────
     When REGISTRATION_OPEN = false, intercept:
       • #register-now-btn  (hero + register section)
       • any .btn-register  click
       • openRegisterModal() calls
       • openEventRegModal() calls
  ─────────────────────────────────────────────────────────────── */

  if (!REGISTRATION_OPEN) {
    // Override openRegisterModal before the IIFE defines it
    const _origOpenReg = window.openRegisterModal;
    window.openRegisterModal = function() { openRegClosedPopup(); };

    const _origOpenEventReg = window.openEventRegModal;
    window.openEventRegModal = function() { openRegClosedPopup(); };

    // Button listeners (capture phase so we get them before existing handlers)
    document.addEventListener('click', function(e) {
      const btn = e.target.closest('#register-now-btn, .btn-register, [id="edRegisterBtn"], .ed-register-btn, .ereg-type-btn');
      if (btn) {
        e.preventDefault();
        e.stopImmediatePropagation();
        openRegClosedPopup();
      }
    }, true);
  }

  // Expose so other code can call it if needed
  window.openRegClosedPopup  = openRegClosedPopup;
  window.closeRegClosedPopup = closeRegClosedPopup;

})();

/* ─────────────────────────────────────────────
   § C — EVENTS MENU MODAL
   Interactive card matching the screenshot:
     • Society name as eyebrow (small caps)
     • Event name as main title (Cinzel)
     • Arrow on right
     • Click → close modal + scroll to schedule
       + switch day tab + open event detail modal
───────────────────────────────────────────── */
(function eventsMenuModal() {

  const evOverlay = document.getElementById('evMenuOverlay');
  const evModal   = document.getElementById('evMenuModal');
  const evCard    = document.getElementById('evMenuCard');
  const evClose   = document.getElementById('evMenuClose');

  if (!evModal) return;

  /* ── Open / Close ─────────────────────────── */
  function openEvMenu() {
    buildEvMenu();   // populate rows fresh each open
    evOverlay.classList.add('evm-active');
    evModal.classList.add('evm-active');
    document.body.style.overflow = 'hidden';
    gsap.fromTo(evCard,
      { opacity: 0, scale: 0.91, y: 18 },
      { opacity: 1, scale: 1,    y: 0,
        duration: 0.38, ease: 'expo.out', clearProps: 'transform' }
    );
  }

  function closeEvMenu() {
    gsap.to(evCard, {
      opacity: 0, scale: 0.93, y: 12, duration: 0.24, ease: 'power3.in',
      onComplete: () => {
        evOverlay.classList.remove('evm-active');
        evModal.classList.remove('evm-active');
        document.body.style.overflow = '';
        gsap.set(evCard, { clearProps: 'all' });
      }
    });
  }

  window.openEventsMenu  = openEvMenu;
  window.closeEventsMenu = closeEvMenu;

  /* ── Build event rows from TRYST_EVENTS data ─
     Falls back to reading from DOM if production
     system data isn't available yet.
  ─────────────────────────────────────────────── */
  function buildEvMenu() {
    buildDay('1', document.getElementById('evMenuDay1'));
    buildDay('2', document.getElementById('evMenuDay2'));
  }

  function buildDay(day, wrap) {
    if (!wrap) return;
    wrap.innerHTML = '';

    // Try production system data first
    const productionData = getEventsForDay(day);
    if (productionData.length) {
      productionData.forEach(({ id, title, society }) => {
        wrap.appendChild(makeRow(id, title, society, day));
      });
      return;
    }

    // Fallback: read from existing schedule DOM
    const scheduleDay = document.querySelector(`.schedule-day[data-day="${day}"]`);
    if (!scheduleDay) return;
    scheduleDay.querySelectorAll('.schedule-event').forEach(ev => {
      const id      = ev.dataset.eventId || ev.querySelector('[data-event-id]')?.dataset.eventId || '';
      const title   = ev.querySelector('.event-title')?.textContent?.trim() || '—';
      const society = ev.querySelector('.event-tag')?.textContent?.trim() || '';
      wrap.appendChild(makeRow(id, title, society, day));
    });
  }

  /* Pull from TRYST_EVENTS if available (loaded by production system) */
  function getEventsForDay(day) {
    // Access the production system's TRYST_EVENTS via window if exposed
    // It isn't directly exposed, so we collect from the rendered events-modal
    const items = document.querySelectorAll(
      `.events-modal-day[data-events-day="${day}"] .events-modal-item`
    );
    const results = [];
    items.forEach(item => {
      const id      = item.dataset.eventId || '';
      const title   = item.querySelector('.events-modal-name')?.textContent?.trim() || '';
      const society = item.querySelector('.events-modal-tag')?.textContent?.trim() || '';
      if (title) results.push({ id, title, society });
    });
    return results;
  }

  function makeRow(eventId, title, society, day) {
    const row = document.createElement('div');
    row.className   = 'evmenu-row';
    row.setAttribute('role', 'button');
    row.setAttribute('tabindex', '0');
    row.innerHTML = `
      <div class="evmenu-row-left">
        <span class="evmenu-society font-rajdhani">${escHTML(society)}</span>
        <span class="evmenu-name font-cinzel">${escHTML(title)}</span>
      </div>
      <span class="evmenu-arrow">›</span>`;

    function handleActivate() {
      closeEvMenu();
      // After modal closes (~280ms), scroll to schedule + open event detail
      setTimeout(() => {
        if (typeof window.goToEvent === 'function') {
          window.goToEvent({ dataset: { eventId, day } });
        } else {
          // Fallback: just scroll to schedule
          const schedule = document.getElementById('schedule');
          if (schedule && window.gsap) {
            gsap.to(window, { scrollTo: { y: schedule, offsetY: 76 }, duration: 0.85, ease: 'expo.inOut' });
          }
        }
      }, 280);
    }

    row.addEventListener('click', handleActivate);
    row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') handleActivate(); });
    return row;
  }

  // Escape-safe HTML helper (scoped — does not conflict)
  function escHTML(str) {
    return String(str || '').replace(/[&<>"']/g, c =>
      ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
    );
  }

  /* ── Wire day tabs ────────────────────────── */
  document.querySelectorAll('.evmenu-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const day = tab.dataset.evmenuDay;
      document.querySelectorAll('.evmenu-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.evmenu-day').forEach(d => d.classList.remove('active'));
      const panel = document.querySelector(`.evmenu-day[data-evmenu-day="${day}"]`);
      if (panel) {
        panel.classList.add('active');
        gsap.from(panel, { opacity: 0, y: 8, duration: 0.22, ease: 'expo.out' });
      }
    });
  });

  /* ── Close triggers ───────────────────────── */
  if (evClose)   evClose.addEventListener('click', closeEvMenu);
  if (evOverlay) evOverlay.addEventListener('click', closeEvMenu);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && evModal?.classList.contains('evm-active')) closeEvMenu();
  });

  /* ── Hook nav card click ─────────────────────
     The card now has data-modal="evmenu".
     Patch into the existing nav card handler.
  ─────────────────────────────────────────────── */
  document.querySelectorAll('.nav-card[data-modal="evmenu"]').forEach(card => {
    card.addEventListener('click', () => openEvMenu());
  });

})();
/* ═══════════════════════════════════════════════
   POSTER ZOOM LIGHTBOX
   Opens when mobile user taps the poster area in
   the event detail card (.ed-poster-col).
   Also works on desktop (click-to-enlarge).
═══════════════════════════════════════════════ */
(function posterZoom() {
  const plb      = document.getElementById('posterLightbox');
  const plbImg   = document.getElementById('posterLightboxImg');
  const plbClose = document.getElementById('posterLightboxClose');
  if (!plb || !plbImg || !plbClose) return;

  function openPosterLightbox(src, alt) {
    if (!src) return;
    plbImg.src = src;
    plbImg.alt = alt || 'Event poster';
    plb.classList.add('plb-active');
    document.body.style.overflow = 'hidden';
  }

  function closePosterLightbox() {
    plb.classList.remove('plb-active');
    document.body.style.overflow = '';
  }

  // Tap/click on poster column opens zoom
  // We delegate from document so it works even after modal re-opens
  document.addEventListener('click', e => {
    const posterCol = e.target.closest('.ed-poster-col');
    if (posterCol) {
      const img = posterCol.querySelector('.ed-poster-img');
      if (img && img.src && !img.src.endsWith('/')) {
        openPosterLightbox(img.src, img.alt);
      }
    }
  });

  plbClose.addEventListener('click', closePosterLightbox);

  // Click backdrop (not the image) to close
  plb.addEventListener('click', e => {
    if (e.target === plb) closePosterLightbox();
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && plb.classList.contains('plb-active')) {
      closePosterLightbox();
    }
  });
})();