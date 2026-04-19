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
   SURPRISE ARTIST — DUAL CARD + TIMER LOCK
   ─────────────────────────────────────────────
   CONFIGURATION: Set UNLOCK_TIME to the exact
   datetime when the button becomes active.
   Format: 'YYYY-MM-DDTHH:MM:SS'  (local time)
═══════════════════════════════════════════════ */
(function surpriseArtistSystem() {

  // ── CONFIG ─────────────────────────────────
  const UNLOCK_TIME = new Date('2026-04-27T17:00:00'); // ← change this date/time
  // ───────────────────────────────────────────

  const revealBtn      = document.getElementById('revealBtn');
  const lockOverlay    = document.getElementById('lockOverlay');
  const mysteryLock    = document.getElementById('mysteryLock');
  const unlockHint     = document.getElementById('surpriseUnlockHint');
  if (!revealBtn) return;

  let isRevealed   = false;
  let timerInterval = null;

  /* ── Lock / Unlock logic ─────────────────── */
  function checkUnlockTime() {
    const now  = new Date();
    const diff = UNLOCK_TIME - now;

    if (diff <= 0) {
      // Unlock!
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
      // Still locked — show countdown
      if (mysteryLock) mysteryLock.classList.add('locked');
      const days  = Math.floor(diff / 86400000);
      const hrs   = Math.floor((diff / 3600000) % 24);
      const mins  = Math.floor((diff / 60000) % 60);
      const secs  = Math.floor((diff / 1000) % 60);
      const pad   = n => String(n).padStart(2, '0');
      if (unlockHint) {
        unlockHint.textContent = days > 0
          ? `Unlocks in ${days}d`
          : `Unlocks in ${pad(hrs)}h`;
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

    const question1 = document.getElementById('surpriseQuestion1');
    const img1      = document.getElementById('surpriseImg1');
    const revealed1 = document.getElementById('surpriseRevealed1');
    const veil1     = document.getElementById('surpriseVeil1');
    const glow1     = document.getElementById('surpriseGlowRing1');

    const frame2    = document.getElementById('surpriseFrame2');
    const question2 = document.getElementById('surpriseQuestion2');
    const img2      = document.getElementById('surpriseImg2');
    const revealed2 = document.getElementById('surpriseRevealed2');
    const veil2     = document.getElementById('surpriseVeil2');
    const glow2     = document.getElementById('surpriseGlowRing2');

    // Particle burst on stage
    createParticleBurst(document.getElementById('surpriseStage'));

    // ── TIMELINE ────────────────────────────
    const tl = gsap.timeline();

    // 1. Hide the button
    tl.to(revealBtn, { opacity: 0, y: 8, duration: 0.22 });

    // 2. Reveal Artist 1
    tl.to(question1, { opacity: 0, scale: 1.12, duration: 0.3, ease: 'power2.in' }, '+=0.1')
      .set(question1, { visibility: 'hidden' })
      .to(veil1, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, '<')
      .call(() => { img1.classList.add('revealed'); glow1.classList.add('active'); })
      .to({}, { duration: 0.8 }) // let blur transition breathe
      .call(() => revealed1.classList.add('show'));

    // 3. Animate Artist 2 out from behind Artist 1
    //    Step: make frame2 position:relative, then slide/scale in
    tl.call(() => {
        frame2.classList.remove('surprise-frame--hidden');
        frame2.classList.add('revealed-card');
        // Start from behind / overlapping with frame1
        gsap.set(frame2, { opacity: 0, scale: 0.7, x: -60, rotateY: -15 });
      })
      .to(frame2, {
        opacity: 1, scale: 1, x: 0, rotateY: 0,
        duration: 0.9,
        ease: 'expo.out',
        transformPerspective: 1200,
      }, '+=0.2')

    // 4. Reveal Artist 2
      .to(question2, { opacity: 0, scale: 1.12, duration: 0.3, ease: 'power2.in' }, '-=0.3')
      .set(question2, { visibility: 'hidden' })
      .to(veil2, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, '<')
      .call(() => { img2.classList.add('revealed'); glow2.classList.add('active'); })
      .to({}, { duration: 0.8 })
      .call(() => revealed2.classList.add('show'));

    // 5. Second particle burst for drama
    tl.call(() => createParticleBurst(document.getElementById('surpriseStage')));
  });

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
  const diff = new Date('2026-04-27T08:00:00') - new Date();
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
    { inputId: 'reg-sponsor-1',  previewId: 'preview-sponsor-1',  zoneId: 'zone-sponsor-1'  },
    { inputId: 'reg-sponsor-2',  previewId: 'preview-sponsor-2',  zoneId: 'zone-sponsor-2'  },
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
        collegeId:   document.getElementById('reg-college-id').files[0] || null,
        sponsorTask1: document.getElementById('reg-sponsor-1').files[0]  || null,
        sponsorTask2: document.getElementById('reg-sponsor-2').files[0]  || null,
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
        'Sponsor 1':    formData.sponsorTask1 ? formData.sponsorTask1.name : '—',
        'Sponsor 2':    formData.sponsorTask2 ? formData.sponsorTask2.name : '—',
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
     · syncScheduleLabels()   — stamps society names onto schedule rows
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
    'inaayat': {
      day: '1',
      title: 'Inaayat',
      society: 'Advaitaa Dance Society',
      societyDesc: 'Advaitaa is the Western Dance Society of Keshav Mahavidyalaya. Founded with a passion for movement and expression, Advaitaa has consistently delivered electrifying performances and competitions at TRYST. From contemporary to hip-hop, the society celebrates every form of Western dance with energy, precision, and artistry. Reach out to them for collaborations, auditions, or queries.',
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
      day: '2',
      title: 'AAGHAZ',
      society: 'Advaitaa Dance Society',
      societyDesc: 'Advaitaa is the Western Dance Society of Keshav Mahavidyalaya. Founded with a passion for movement and expression, Advaitaa has consistently delivered electrifying performances and competitions at TRYST. From contemporary to hip-hop, the society celebrates every form of Western dance with energy, precision, and artistry. Reach out to them for collaborations, auditions, or queries.',
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
      day: '1',
      title: 'Nocturne',
      society: 'Anhad – Western Music Society',
      societyDesc: 'Anhad is the Western Music Society of Keshav Mahavidyalaya, dedicated to celebrating the art of vocal and instrumental performance. From acappella to bands, Anhad creates spaces for musicians to experiment, collaborate, and shine. Their events at TRYST are known for high production quality and a deep love for music in all its forms.',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Nocturne.png',
      description: 'Slaycappella is an acappella competition that celebrates the art of vocal music in its purest form where teams create music using only their voices, blending harmonies, rhythm, and creativity to deliver impactful performances under the theme Scarlett — embodying boldness, passion, and powerful, unapologetic energy.',
      format: [
        'Online Round (Prelims): Teams submit a raw and unedited video of their acappella performance',
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
        'Lavanya - 9871042278',
        'Karan - 9810237028'
      ],
    },
    'khayaal': {
      day: '2',
      title: 'Khayaal',
      society: 'ANHAD – The Indian Music Society',
      societyDesc: 'ANHAD — The Indian Music Society of Keshav Mahavidyalaya — is a collective of students passionate about the vast heritage of Indian classical and folk music. The society hosts workshops, rehearsals, and competitions that keep classical traditions alive among young minds. Their events showcase the depth of ragas, talas, and the timeless beauty of Indian vocal traditions.',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Khayaal.png',
      description: 'KHAYAAL is the Indian Classical Choir Competition — a celebration of harmony, heritage, and heart where voices come together from ragas to rhythms, showcasing unity and musical depth.',
      format: [
        'Preliminary Round (Online): One entry per college submitted via Google Drive link',
        'Performance video must be within 10 minutes and recorded in a single take without edits',
        'Final Round (Offline): 10 minutes performance + 2 minutes sound check per team'
      ],
      rules: [
        'Each college can submit only one entry',
        'Google Drive link must be accessible without restrictions',
        'Performance must be recorded in a single take with no edits or modification',
        'Maximum 12 vocalists and 3 instrumentalists allowed',
        'Minimum 6 participants required (excluding instrumentalists)',
        'Bollywood and semi-classical songs are strictly prohibited',
        'Participants must bring their own instruments',
        'Use of Electronic Tanpura is allowed',
        'All participants must carry valid college ID card',
        'Judges decision will be final and binding'
      ],
      judging: [
        'Harmony and coordination',
        'Understanding of ragas and classical elements',
        'Vocal quality and expression',
        'Discipline and composition',
        'Overall presentation'
      ],
      societyLink: '#student-union',
      supportSection: [
        'XXX - XXX',
        'XXX - XXX'
      ],
    },
    'rebuttal': {
      day: '1',
      title: 'Rebuttal’26',
      society: 'Vagmitā – DebSoc',
      societyDesc: 'Vagmitā is the Debate Society of Keshav Mahavidyalaya, fostering critical thinking, eloquent expression, and intellectual courage. The society runs English and Hindi debate events, nurturing students who argue persuasively on any topic.',
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
      day: '2',
      title: 'खंडन’26',
      society: 'वाग्मिता – DebSoc',
      societyDesc: 'वाग्मिता — केशव महाविद्यालय की वाद-विवाद समिति — आलोचनात्मक सोच और प्रभावशाली अभिव्यक्ति को बढ़ावा देती है। समिति अंग्रेज़ी और हिंदी दोनों वाद-विवाद आयोजित करती है।',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/खंडन’26.png',
      description: 'खंडन’26 एक हिंदी वाद-विवाद प्रतियोगिता है जिसमें प्रतिभागी पारंपरिक वाद-विवाद प्रारूप में तर्क और प्रत्युत्तर प्रस्तुत करते हैं, जहाँ विषय प्रत्येक चरण से पहले घोषित किया जाता है।',
      format: [
        'चरण 1: पारंपरिक वाद-विवाद (विषय 24 घंटे पूर्व घोषित किया जाएगा)',
        'चरण 2: पारंपरिक वाद-विवाद (विषय 10 मिनट पूर्व घोषित किया जाएगा)'
      ],
      rules: [
        'स्नातक एवं स्नातकोत्तर छात्रों के लिए खुला',
        'वाद-विवाद पूर्णतः हिंदी भाषा में आयोजित होगा',
        'प्रत्येक प्रतिभागी को 3 मिनट वक्तव्य और 1 मिनट प्रत्युत्तर/प्रश्नोत्तर के लिए मिलेगा',
        'पंजीकरण निःशुल्क है; ₹100 की वापसी योग्य सुरक्षा राशि लागू होगी',
        'सीमित स्थान; अंतिम चयन आयोजन समिति के विवेक पर निर्भर करेगा'
      ],
      judging: [
        'तर्क और विषयवस्तु की गुणवत्ता',
        'प्रत्युत्तर की प्रभावशीलता',
        'स्पष्टता और अभिव्यक्ति',
        'आत्मविश्वास और प्रस्तुति',
        'समग्र प्रभाव'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Vaibhav - +91 98188 34790',
        'Vanshika - +91 98717 60966'
      ],
    },
    'jhalak': {
      day: '1',
      title: 'Jhalak',
      society: 'Illuminati – Photography Society',
      societyDesc: 'Illuminati is the Photography Society of Keshav Mahavidyalaya. Passionate about visual storytelling, the society nurtures talent in photography, filmmaking, and digital media. From on-the-spot competitions to curated exhibitions, Illuminati creates spaces for visual artists to push creative boundaries.',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Jhalak.png',
      description: 'JHALAK is an on-the-spot photography competition where participants are given a theme or subject on the spot and must capture the best possible shot within the given time, testing eye for detail, spontaneity, and creativity behind the lens.',
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
      day: '2',
      title: 'Cinematica',
      society: 'Illuminati – Photography Society',
      societyDesc: 'Illuminati is the Photography Society of Keshav Mahavidyalaya. Passionate about visual storytelling, the society nurtures talent in photography, filmmaking, and digital media. From on-the-spot competitions to curated exhibitions, Illuminati creates spaces for visual artists to push creative boundaries.',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Cinematica.png',
      description: 'CINEMATICA is an on-the-spot reel making competition that challenges participants to unleash their storytelling skills within just 30 seconds where everything from concept to execution happens in real time.',
      format: [
        'On-the-spot reel making competition',
        'Participants create a reel within 30 seconds duration',
        'Concept, shooting, and execution happen in real time'
      ],
      rules: [
        'Reel must be created within the given time frame',
        'Duration must not exceed 30 seconds',
        'Content must be original and created on the spot',
        'Any inappropriate content will lead to disqualification',
        'Participants must follow event guidelines'
      ],
      judging: [
        'Storytelling and concept',
        'Creativity and originality',
        'Execution and editing',
        'Engagement and impact',
        'Overall presentation'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Viswajith P V - 9971284243',
        'Akansha Bisht - 9266869504'
      ],
    },
    'pixel': {
      day: '1',
      title: 'Pixel 6.0',
      society: 'Illuminati – Photography Society',
      societyDesc: 'Illuminati is the Photography Society of Keshav Mahavidyalaya. Passionate about visual storytelling, the society nurtures talent in photography, filmmaking, and digital media. From on-the-spot competitions to curated exhibitions, Illuminati creates spaces for visual artists to push creative boundaries.',
      time: 'TBA',
      location: 'Online',
      poster: 'images/posters/Pixel 6.0.png',
      description: 'PIXEL-6.0 is an online photo story competition where participants submit a series of photographs that together narrate a compelling story, with each image building on the last to create a powerful visual narrative.',
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
      day: '2',
      title: 'Lenscraft',
      society: 'Illuminati – Photography Society',
      societyDesc: 'Illuminati is the Photography Society of Keshav Mahavidyalaya. Passionate about visual storytelling, the society nurtures talent in photography, filmmaking, and digital media. From on-the-spot competitions to curated exhibitions, Illuminati creates spaces for visual artists to push creative boundaries.',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Lenscraft.png',
      description: 'LENSCRAFT is an exclusive photography exhibition showcasing stunning visuals, breathtaking landscapes, intimate portraits, and thought-provoking compositions, celebrating the art of photography and creative perspectives.',
      format: [
        'Photography exhibition showcasing selected works',
        'Display of landscapes, portraits, and conceptual compositions',
        'Open viewing for audience'
      ],
      rules: [
        'Exhibited works must be original',
        'Selected entries will be curated by the organizing team',
        'Any inappropriate or plagiarized content will be disqualified',
        'Participants must follow exhibition guidelines'
      ],
      judging: [
        'Visual appeal and aesthetics',
        'Creativity and perspective',
        'Technical excellence',
        'Concept and depth',
        'Overall presentation'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Viswajith P V - 9971284243',
        'Akansha Bisht - 9266869504'
      ],
    },
    'draped_duality': {
      day: '1',
      title: 'Draped Duality',
      society: 'Maniera – Fashion & Art Society',
      societyDesc: 'Maniera is the Fashion and Art Society of Keshav Mahavidyalaya. The society blends aesthetics, creativity, and craftsmanship to host competitions that celebrate wearable art, painting, and collaborative visual expression. Maniera events at TRYST are known for their conceptual depth and stunning visual impact.',
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
      society: 'Maniera – Fashion & Art Society',
      societyDesc: 'Maniera is the Fashion and Art Society of Keshav Mahavidyalaya. The society blends aesthetics, creativity, and craftsmanship to host competitions that celebrate wearable art, painting, and collaborative visual expression. Maniera events at TRYST are known for their conceptual depth and stunning visual impact.',
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
      society: 'Maniera – Fashion & Art Society',
      societyDesc: 'Maniera is the Fashion and Art Society of Keshav Mahavidyalaya. The society blends aesthetics, creativity, and craftsmanship to host competitions that celebrate wearable art, painting, and collaborative visual expression. Maniera events at TRYST are known for their conceptual depth and stunning visual impact.',
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
      day: '1',
      title: 'Envogue - Group',
      society: 'Naksh – Fashion Society',
      societyDesc: 'Naksh is the Fashion Society of Keshav Mahavidyalaya. With a flair for style and creative expression, Naksh organises fashion shows, ramp walks, and design challenges that celebrate personal aesthetic and cutting-edge fashion. Their ENVOGUE events are among the most anticipated spectacles at TRYST.',

      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/envogue_group.png',
      description: 'ENVOGUE is the flagship fashion event presented by Naksh featuring a group competition conducted in two rounds where teams showcase creativity, style, and execution through choreographed performances.',
      format: [
        'Round 1: Teams submit a video of any previous performance with complete choreography',
        'Shortlisting based on creativity, style, and execution',
        'Round 2: Shortlisted teams perform live on stage',
        'Team size: 4–12 models with up to 5 creative members',
        'Performance time limit: 8–12 minutes (inclusive of setup)'
      ],
      rules: [
        'No restrictions on theme',
        'Participants must carry their audio tracks on a pen drive',
        'Participants must have valid student IDs',
        'Teams must bring their own props and are responsible for their belongings',
        'Any vulgarity, obscenity, or unfair practices will lead to immediate disqualification',
        'Participants grant permission for use of performance videos for promotional purposes',
        'Judges decision will be final and binding'
      ],
      judging: [
        'Costumes and styling',
        'Theme interpretation',
        'Choreography',
        'Stage presence',
        'Walking stance and attitude',
        'Overall impact'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Sonia - 9953099058',
        'Vaibhav Nikhil - 9870733523'
      ],
    },
    'envogue_solo': {
      day: '2',
      title: 'Envogue - Solo',
      society: 'Naksh – Fashion Society',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/envogue_solo.png',
      description: 'ENVOGUE Solo Competition features individual participants performing live on stage where creativity, ramp walk, and expressions define their presence and impact.',
      format: [
        'Single round live performance at college premises',
        'Solo participation',
        'Performance time limit: up to 1 minute'
      ],
      rules: [
        'No restrictions on theme',
        'Participants must carry their audio track on a pen drive',
        'Participants must have a valid student ID',
        'Participants must bring their own props and are responsible for their belongings',
        'Any vulgarity, obscenity, or unfair practices will lead to immediate disqualification',
        'Participants grant permission for use of performance videos for promotional purposes',
        'Judges decision will be final and binding'
      ],
      judging: [
        'Outfit and styling',
        'Creativity',
        'Ramp walk',
        'Expressions',
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
      societyDesc: 'Nrityaang is the Indian Classical and Folk Dance Society of Keshav Mahavidyalaya. Dedicated to preserving the richness of Indian dance traditions, Nrityaang trains and showcases performers in classical forms like Bharatanatyam and Kathak, as well as vibrant folk dances from across India.',
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
      societyDesc: 'Nrityaang is the Indian Classical and Folk Dance Society of Keshav Mahavidyalaya. Dedicated to preserving the richness of Indian dance traditions, Nrityaang trains and showcases performers in classical forms like Bharatanatyam and Kathak, as well as vibrant folk dances from across India.',
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
      day: '1',
      title: 'Evince',
      society: 'Vagmita – Poetry Society',
      societyDesc: 'Vagmita is the Poetry Society of Keshav Mahavidyalaya, dedicated to the art of the written and spoken word. The society celebrates both English and Hindi/Urdu poetry through readings, competitions, and open mic sessions. Their events at TRYST bring together voices that move, provoke, and inspire.',
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
      day: '2',
      title: 'Irshaad',
      society: 'Vagmita – Poetry Society',
      societyDesc: 'Vagmita is the Poetry Society of Keshav Mahavidyalaya, dedicated to the art of the written and spoken word. The society celebrates both English and Hindi/Urdu poetry through readings, competitions, and open mic sessions. Their events at TRYST bring together voices that move, provoke, and inspire.',
      time: '3:00 PM - 4:30 PM',
      location: 'Keshav Mahavidyalaya',
      poster: 'images/posters/Irshaad.png',
      description: 'Irshaad is the Hindi/Urdu Poetry Competition featuring two rounds where participants present their poetry through written submissions and live performance.',
      format: [
        'Round 1: Call for entries via Google Forms and shortlisting participants',
        'Judgement based on creativity, content, and flow',
        'Round 2: Live Performance Round with shortlisted participants',
        'Venue: Keshav Mahavidyalaya'
      ],
      rules: [
        'Participants must submit original poetry in Hindi/Urdu',
        'Shortlisted participants will perform live',
        'Participants must adhere to the given format and guidelines',
        'Professionalism must be maintained throughout the event',
        'Judges decision will be final and binding'
      ],
      judging: [
        'Creativity and originality',
        'Content quality',
        'Flow and expression',
        'Performance and delivery',
        'Overall impact'
      ],
      societyLink: '#student-union',
      supportSection: [
        'Shreeanshi - 7901832313',
        'Tanya - 9625240393'
      ],
    },
    'kaaghaz': {
      day: '2',
      title: 'Kaaghaz',
      society: 'Vagmita – Poetry Society',
      societyDesc: 'Vagmita is the Poetry Society of Keshav Mahavidyalaya, dedicated to the art of the written and spoken word. The society celebrates both English and Hindi/Urdu poetry through readings, competitions, and open mic sessions. Their events at TRYST bring together voices that move, provoke, and inspire.',
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
      societyDesc: 'Shades is the Dramatics Society of Keshav Mahavidyalaya. From Nukkad Natak to mime and theatrical performances, Shades uses the power of storytelling to spark conversations about society, culture, and identity. Their events at TRYST consistently captivate audiences with powerful performances.',
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
      societyDesc: 'Shades is the Dramatics Society of Keshav Mahavidyalaya. From Nukkad Natak to mime and theatrical performances, Shades uses the power of storytelling to spark conversations about society, culture, and identity. Their events at TRYST consistently captivate audiences with powerful performances.',
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
  const listHTML = items => `<ul>${(Array.isArray(items) ? items : [items]).filter(Boolean).map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>`;
  const eventOrder = Array.from(new Set(
    Array.from(document.querySelectorAll('.event-header[data-event-id], .events-modal-item[data-event-id]'))
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

    return {
      day: dayPanel?.dataset.day || dayPanel?.dataset.eventsDay || '1',
      title,
      society: `${tag} Society`,
      time,
      location: 'TRYST 2026 Venue',
      poster: posterForTag(tag),
      description: `${title} is a TRYST 2026 ${tag.toLowerCase()} event crafted for focused, high-energy participation.`,
      format: ['Register through the event form.', 'Participants perform or compete in the slot assigned by organisers.', 'Final round details will be shared by the organising society.'],
      rules: commonRules,
      judging: commonJudging,
      societyLink: '#student-union'
    };
  }

  function getEventData(id) {
    return { ...inferEventData(id), ...(TRYST_EVENTS[id] || {}) };
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

  function bindUploadLabel(input) {
    if (!input) return;
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      const zone = input.closest('.reg-upload-zone');
      const preview = zone?.querySelector('.reg-upload-preview');
      if (!file || !zone || !preview) return;
      preview.innerHTML = `Added<br>${escapeHTML(file.name)}`;
      preview.style.backgroundImage = 'none';
      preview.style.display = 'flex';
      preview.style.alignItems = 'center';
      preview.style.justifyContent = 'center';
      preview.style.fontSize = '12px';
      preview.style.color = '#C9A84C';
      preview.style.textAlign = 'center';
      preview.style.padding = '10px';
      zone.classList.add('reg-has-file');
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
      if (tag) tag.textContent = getEventData(id).society;
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

    const isDescOnly = !!data.descriptionOnly;

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

    // Register button + toggle — hide for description-only events
    const edActionRow = $('edActionRow');
    if (edActionRow) edActionRow.style.display = isDescOnly ? 'none' : '';

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

    setButtonLoading(submitBtn, true, 'Submitting...');
    try {
      const payload = {
        formType: 'attendee',
        name: $('reg-name').value.trim(),
        email: $('reg-email').value.trim(),
        phone: $('reg-phone').value.trim(),
        college: $('reg-college').value.trim(),
        course: $('reg-course').value.trim(),
        year: $('reg-year').value,
        gender: $('reg-gender').value,
        collegeId: await toBase64($('reg-college-id').files[0]),
        task1: await toBase64($('reg-sponsor-1').files[0]),
        task2: await toBase64($('reg-sponsor-2').files[0])
      };

      const result = await postJSON(payload);
      const id = responseId(result);
      setStatus(status, id ? `Registration successful. Reg ID: ${id}` : 'Registration successful.', 'success');
      attendeeForm.reset();
      attendeeForm.querySelectorAll('input[type="file"]').forEach(resetUploadZone);
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
    mridang:        { formType: 'solo',    prelims: true,  audio: true },
    uthaan:         { formType: 'team',    prelims: true,  audio: true, minMembers: 6, maxMembers: 12 },
    inaayat:        { formType: 'team',    audio: true,    minMembers: 5 },
    aaghaaz:        { formType: 'dynamic' },
    nocturne:       { formType: 'team',    prelims: true },
    khayaal:        { formType: 'team',    prelims: true, minMembers: 6, maxMembers: 15 },
    jhalak:         { formType: 'solo' },
    cinematica:     { formType: 'solo' },
    pixel:          { formType: 'solo',    prelims: true },
    lenscraft:      { formType: 'solo' }, // exhibition
    draped_duality: { formType: 'team',    minMembers: 3, maxMembers: 4 },
    reframe_the_fame:{ formType: 'solo' },
    syncstroke:     { formType: 'team',    lockedCount: 2 },
    envogue_group:  { formType: 'team',    minMembers: 4, maxMembers: 12 },
    envogue_solo:   { formType: 'solo' },
    rebuttal:       { formType: 'solo' },
    khandan:        { formType: 'solo' },
    evince:         { formType: 'solo',    prelims: true },
    irshaad:        { formType: 'solo',    prelims: true },
    kaaghaz:        { formType: 'solo' },
    baithak_street: { formType: 'team' },
    baithak_mime:   { formType: 'team',    maxMembers: 15 }
  };

  // Team member limits per event
  const teamLimits = {
    inaayat:        { min: 5 },
    uthaan:         { min: 6, max: 12 },
    khayaal:        { min: 6, max: 15 },
    draped_duality: { min: 3, max: 4 },
    envogue_group:  { min: 4, max: 12 },
    baithak_mime:   { max: 15 }
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
      const payload = await buildNewEventPayload();
      const result  = await postJSON(payload);
      const id      = responseId(result);
      setStatus(status, id && id !== 'SUBMITTED'
        ? `Registration successful! Reg ID: ${id}`
        : 'Registration submitted successfully!', 'success');
      btn.querySelector('.reg-submit-inner').textContent = 'Submitted ✓';
      setTimeout(() => window.closeEventRegModal(), 2400);
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

    if (isSolo) {
      const f = $('ereg-solo-form');
      const idFileInput = f.querySelector('[name="solo_idFile"]');
      const driveInput  = f.querySelector('[name="solo_driveLink"]');
      return {
        formType:  'event',
        eventId,
        event:     eventReg.currentEvent,
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
        eventId,
        event:     eventReg.currentEvent,
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
   Add this at the END of tryst-production.js
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

  /* ─────────────────────────────────────────────
     HOOK 1 — Event reg final submit
     The production system's eregFinalSubmit fires
     in the capture phase and calls closeEventRegModal
     after 2.4s. We listen (non-capture, passive) and
     show the event popup when the status turns success.
     We use a MutationObserver on #eventRegStatus so we
     fire only on actual success, not validation errors.
  ─────────────────────────────────────────────── */
  const eventRegStatus = document.getElementById('eventRegStatus');
  if (eventRegStatus) {
    const mo = new MutationObserver(() => {
      // The production system sets class 'status-success' on success
      if (eventRegStatus.classList.contains('status-success') ||
          eventRegStatus.textContent.toLowerCase().includes('success')) {
        // Extract reg ID if present in the status text
        const match = eventRegStatus.textContent.match(/TRYST[-\w]+/i);
        window.showEventSuccessPopup(match ? match[0] : '');
      }
    });
    mo.observe(eventRegStatus, { childList: true, subtree: true, characterData: true, attributes: true });
  }

  // Fallback: also hook the submit button directly (passive, fires after production handler)
  const eregBtn = document.getElementById('eregFinalSubmit');
  if (eregBtn) {
    eregBtn.addEventListener('click', () => {
      // Wait for the production system to complete + close the modal
      setTimeout(() => {
        if (!document.getElementById('eventRegModal')?.classList.contains('reg-active')) {
          // Modal closed = submit was successful
          window.showEventSuccessPopup('');
        }
      }, 2600);   // production system closes modal after 2400ms
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────
     HOOK 2 — Attendee form submit
     The formIntegration IIFE (§ 21) submits via
     iframe and calls alert(). We suppress the alert
     and show the attendee popup instead.
  ─────────────────────────────────────────────── */

  // Override window.alert only during attendee form submission
  const origAlert = window.alert;
  const attendeeForm = document.getElementById('registrationForm');
  if (attendeeForm) {
    attendeeForm.addEventListener('submit', () => {
      // Temporarily replace alert so the old code's alert() becomes a no-op
      window.alert = () => {};
      // Show popup after iframe POST fires
      setTimeout(() => {
        window.alert = origAlert;  // restore
        window.showAttendeeSuccessPopup('');
        resetAttendeeForm();
      }, 2000);
    }, false);
  }

  /* Keep legacy shim so any old callers don't crash */
  window.showSuccessPopup   = window.showEventSuccessPopup;
  window.closeSuccessPopup  = window.closeEventSuccessPopup;

})();

/* ─────────────────────────────────────────────
   TASK 4 — Form Reset After Submission
───────────────────────────────────────────── */
function resetAttendeeForm() {
  const form = document.getElementById('registrationForm');
  if (!form) return;

  // Reset all text / select fields
  form.reset();

  // Clear upload previews and has-file states
  ['zone-college-id', 'zone-sponsor-1', 'zone-sponsor-2'].forEach(zoneId => {
    const zone    = document.getElementById(zoneId);
    const preview = zone?.querySelector('.reg-upload-preview');
    if (zone)    zone.classList.remove('reg-has-file');
    if (preview) { preview.innerHTML = ''; preview.style = ''; }
  });

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
    const track  = card.querySelector('.su-swipe-track');
    const dots   = card.querySelectorAll('.su-dot');
    let current  = 0;
    const total  = dots.length;

    // Touch state
    let touchStartX = 0;
    let touchDeltaX = 0;

    function goTo(index) {
      current = (index + total) % total;
      // Slide the track: each page is 50% of the 200%-wide track
      // → offset = current * (100% / total) expressed on the track itself
      // Since track is 200% wide and pages are 50% each:
      // page 0 → translateX(0%), page 1 → translateX(-50%)
      track.style.transform = `translateX(-${current * 50}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    // Dot click
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goTo(i));
    });

    // Touch swipe (text area only — image stays fixed)
    card.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
    }, { passive: true });

    card.addEventListener('touchmove', e => {
      touchDeltaX = e.touches[0].clientX - touchStartX;
    }, { passive: true });

    card.addEventListener('touchend', () => {
      if (touchDeltaX < -40) goTo(current + 1); // swipe left → next
      if (touchDeltaX >  40) goTo(current - 1); // swipe right → prev
      touchDeltaX = 0;
    });

    // Mouse drag support (desktop)
    let mouseStartX = 0;
    let dragging    = false;
    card.addEventListener('mousedown', e => { dragging = true; mouseStartX = e.clientX; });
    card.addEventListener('mousemove', e => { if (dragging) touchDeltaX = e.clientX - mouseStartX; });
    card.addEventListener('mouseup',   () => {
      if (!dragging) return;
      dragging = false;
      if (touchDeltaX < -40) goTo(current + 1);
      if (touchDeltaX >  40) goTo(current - 1);
      touchDeltaX = 0;
    });
    card.addEventListener('mouseleave', () => { dragging = false; touchDeltaX = 0; });
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