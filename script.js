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
  const count = IS_MOBILE ? 40 : 80;
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
      about: 'modal-about',
      events: 'modal-events',
      surprise: 'modal-surprise',
      performers: 'modal-performers'
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

/* ═══════════════════════════════════════════════
   KNOW MORE → Jump to schedule + expand event
═══════════════════════════════════════════════ */
window.goToEvent = function(btn) {
  const eventId = btn.dataset.eventId;
  const day     = btn.dataset.day;

  closeModal();

  setTimeout(() => {
    // 1. Scroll to schedule
    const scheduleSection = document.getElementById('schedule');
    if (!scheduleSection) return;

    gsap.to(window, {
      scrollTo: { y: scheduleSection, offsetY: 76 },
      duration: 0.85, ease: 'expo.inOut',
      onComplete: () => {
        // 2. Switch to correct day tab
        const tab = document.querySelector(`.schedule-tab[data-day="${day}"]`);
        if (tab) {
          document.querySelectorAll('.schedule-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const currentDay = document.querySelector('.schedule-day.active');
          const nextDay    = document.querySelector(`.schedule-day[data-day="${day}"]`);
          if (currentDay !== nextDay) {
            currentDay.classList.remove('active');
            nextDay.classList.add('active');

            // 🔥 FORCE VISIBILITY RESET
            nextDay.querySelectorAll('.fade-up').forEach(el => {
              el.classList.add('visible');

              // remove GSAP hidden state
              el.style.opacity = 1;
              el.style.transform = 'none';
            });

            // 🔥 Refresh ScrollTrigger (important)
            ScrollTrigger.refresh();
          }
        }

        // 3. Find event row and expand it
        setTimeout(() => {
          const eventRow = document.querySelector(`.schedule-event[data-event-id="${eventId}"] .event-header`);
          if (eventRow) {
            // Close any open
            document.querySelectorAll('.event-body.open').forEach(b => {
              b.classList.remove('open');
              b.previousElementSibling?.querySelector('.event-toggle')?.classList.remove('open');
            });
            const body   = eventRow.parentElement.querySelector('.event-body');
            const toggle = eventRow.querySelector('.event-toggle');
            if (body && toggle) {
              body.classList.add('open');
              toggle.classList.add('open');
              gsap.from(body, { opacity: 0, y: -5, duration: 0.2, ease: 'expo.out' });

              // Scroll into view
              eventRow.closest('.schedule-event').scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }, 120);
      }
    });
  }, 300); // wait for modal close transition
};

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

/* ═══════════════════════════════════════════════
   EVENT ACCORDION  (schedule section)
═══════════════════════════════════════════════ */
window.toggleEvent = function(header) {
  const body   = header.parentElement.querySelector('.event-body');
  const toggle = header.querySelector('.event-toggle');
  const isOpen = body.classList.contains('open');

  // Close all open events
  document.querySelectorAll('.event-body.open').forEach(b => {
    b.classList.remove('open');
    b.previousElementSibling?.querySelector('.event-toggle')?.classList.remove('open');
  });

  if (!isOpen) {
    body.classList.add('open');
    toggle.classList.add('open');
    gsap.from(body, { opacity: 0, y: -5, duration: 0.2, ease: 'expo.out' });
  }
};

/* ═══════════════════════════════════════════════
   GALLERY LIGHTBOX
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

// Gallery stagger
ScrollTrigger.create({
  trigger: '.gallery-masonry', start: 'top 84%', once: true,
  onEnter: () => gsap.from('.gallery-item', { opacity: 0, scale: 0.95, stagger: 0.035, duration: 0.4, ease: 'expo.out' })
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
/* ═══════════════════════════════════════════════
   EVENT REGISTRATION MODAL
═══════════════════════════════════════════════ */
(function eventRegSystem() {
  const overlay  = document.getElementById('eventRegOverlay');
  const modal    = document.getElementById('eventRegModal');
  const card     = document.getElementById('eventRegCard');
  const closeBtn = document.getElementById('eventRegCloseBtn');
  if (!modal) return;

  let selectedType     = '';
  let participantCount = 1;

  function open() {
    overlay.classList.add('reg-active');
    modal.classList.add('reg-active');
    document.body.style.overflow = 'hidden';
    gsap.fromTo(card,
      { opacity: 0, scale: 0.91, y: 22 },
      { opacity: 1, scale: 1,    y: 0, duration: 0.42, ease: 'expo.out' }
    );
  }

  function close() {
    gsap.to(card, {
      opacity: 0, scale: 0.93, y: 14, duration: 0.26, ease: 'power3.in',
      onComplete: () => {
        overlay.classList.remove('reg-active');
        modal.classList.remove('reg-active');
        document.body.style.overflow = '';
        gsap.set(card, { clearProps: 'all' });
        resetToStep1();
      }
    });
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('reg-active')) close();
  });

  function showStep(n) {
    [1, 2, 3].forEach(i => {
      const s = document.getElementById(`eventRegStep${i}`);
      if (s) s.style.display = (i === n) ? 'flex' : 'none';
    });
    gsap.from(card, { y: 6, duration: 0.22, ease: 'expo.out' });
  }

  function resetToStep1() {
    selectedType = '';
    document.querySelectorAll('.ereg-type-btn').forEach(b => b.classList.remove('selected'));
    const wrap = document.getElementById('eregParticipantsWrap');
    if (wrap) wrap.innerHTML = '';
    const brand = document.getElementById('ereg-brand');
    if (brand) brand.value = '';
    const gc = document.getElementById('ereg-group-count');
    if (gc) gc.value = '';
    showStep(1);
  }

  /* ── Step 1: Type selection ─────────────── */
  document.querySelectorAll('.ereg-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedType = btn.dataset.type;
      document.querySelectorAll('.ereg-type-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      const heading = document.querySelector('.ereg-type-heading');
      if (heading) heading.textContent =
        selectedType.charAt(0).toUpperCase() + selectedType.slice(1) + ' Registration';

      const groupWrap = document.querySelector('.ereg-group-size-wrap');
      if (groupWrap) groupWrap.style.display = (selectedType === 'group') ? 'block' : 'none';

      const autoCount = selectedType === 'solo' ? 1 : selectedType === 'duo' ? 2 : 0;
      participantCount = autoCount;
      if (autoCount > 0) generateParticipantFields(autoCount);

      setTimeout(() => showStep(2), 140);
    });
  });

  /* ── Group: generate fields button ─────── */
  const genBtn = document.getElementById('eregGenBtn');
  if (genBtn) {
    genBtn.addEventListener('click', () => {
      const n = parseInt(document.getElementById('ereg-group-count').value);
      if (!n) return;
      participantCount = n;
      generateParticipantFields(n);
    });
  }

  function generateParticipantFields(n) {
    const wrap = document.getElementById('eregParticipantsWrap');
    if (!wrap) return;
    wrap.innerHTML = '';
    for (let i = 1; i <= n; i++) {
      const block = document.createElement('div');
      block.className = 'ereg-participant-block';
      block.innerHTML = `
        <div class="ereg-participant-num">Participant ${i}</div>
        <div class="reg-form-row">
          <div class="reg-field">
            <label class="reg-label font-rajdhani">Name <span class="reg-required">*</span></label>
            <input type="text" name="p${i}_name" class="reg-input ereg-input" placeholder="Full name" required />
          </div>
          <div class="reg-field">
            <label class="reg-label font-rajdhani">Phone <span class="reg-required">*</span></label>
            <input type="tel" name="p${i}_phone" class="reg-input ereg-input" placeholder="+91 00000 00000" required />
          </div>
        </div>`;
      wrap.appendChild(block);
      gsap.from(block, { opacity: 0, y: 10, duration: 0.25, delay: i * 0.06, ease: 'expo.out' });
    }
  }

  /* ── Back: step 2 → 1 ───────────────────── */
  const backBtn = document.getElementById('eregBackBtn');
  if (backBtn) backBtn.addEventListener('click', () => showStep(1));

  /* ── Next: step 2 → 3 (with validation) ── */
  const toStep3 = document.getElementById('eregToStep3Btn');
  if (toStep3) {
    toStep3.addEventListener('click', () => {
      const inputs = document.querySelectorAll('#eventRegForm .ereg-input');
      let valid = true;
      inputs.forEach(inp => {
        if (!inp.value.trim()) {
          valid = false;
          inp.classList.add('reg-error');
          gsap.fromTo(inp,
            { x: -4 },
            { x: 4, repeat: 4, yoyo: true, duration: 0.07,
              onComplete: () => gsap.set(inp, { x: 0 }) }
          );
        } else {
          inp.classList.remove('reg-error');
        }
      });
      if (!valid) return;

      // Populate confirmation screen
      const brand = document.getElementById('ereg-brand').value;
      document.getElementById('confirm-brand').textContent = brand;
      document.getElementById('confirm-type').textContent =
        selectedType.charAt(0).toUpperCase() + selectedType.slice(1);
      document.getElementById('confirm-count').textContent = participantCount;

      const list = document.getElementById('confirm-participants-list');
      list.innerHTML = '';
      for (let i = 1; i <= participantCount; i++) {
        const nameInp = document.querySelector(`[name="p${i}_name"]`);
        if (!nameInp) continue;
        const div = document.createElement('div');
        div.className = 'ereg-confirm-participant';
        div.textContent = `${i}. ${nameInp.value}`;
        list.appendChild(div);
      }

      showStep(3);
    });
  }

  /* ── Back: step 3 → 2 ───────────────────── */
  const backToStep2 = document.getElementById('eregBackToStep2Btn');
  if (backToStep2) backToStep2.addEventListener('click', () => showStep(2));

  /* ── Final submit ───────────────────────── */
  const finalBtn = document.getElementById('eregFinalSubmit');
  if (finalBtn) {
    finalBtn.addEventListener('click', () => {
      const brand = document.getElementById('ereg-brand').value;
      const participants = [];
      for (let i = 1; i <= participantCount; i++) {
        const n = document.querySelector(`[name="p${i}_name"]`);
        const p = document.querySelector(`[name="p${i}_phone"]`);
        if (n) participants.push({ name: n.value, phone: p ? p.value : '' });
      }

      // TODO: Replace with Firebase integration
      console.group('%cTRYST 2026 — Event Registration', 'color:#C9A84C;font-weight:bold;font-size:14px;');
      console.log(`Brand: ${brand} | Type: ${selectedType} | Members: ${participantCount}`);
      console.table(participants);
      console.groupEnd();

      // Success feedback
      const inner = finalBtn.querySelector('.reg-submit-inner');
      if (inner) inner.textContent = '✦ Entry Submitted! ✦';
      finalBtn.style.pointerEvents = 'none';

      gsap.to(card, {
        boxShadow: '0 0 0 2px rgba(201,168,76,0.5), 0 8px 32px rgba(0,0,0,0.6), 0 0 60px rgba(201,168,76,0.12)',
        duration: 0.4, ease: 'power2.out',
        onComplete: () => gsap.to(card, {
          boxShadow: '0 0 0 1px rgba(201,168,76,0.06), 0 8px 32px rgba(0,0,0,0.6)',
          duration: 1.2, delay: 0.8
        })
      });

      setTimeout(() => close(), 2200);
    });
  }

  /* ── Expose globally ────────────────────── */
  window.openEventRegModal  = open;
  window.closeEventRegModal = close;

})();
/* ═══════════════════════════════════════════════
   EVENT DETAIL MODAL
   ─────────────────────────────────────────────
   • Overrides toggleEvent() — click opens popup
     instead of inline accordion expand.
   • Rich data per event via EVENT_DATA map.
   • Register button passes event title into the
     existing eventRegModal (step 1 title update).
   • Fully GSAP animated open/close.
═══════════════════════════════════════════════ */

/* ── Event data map ─────────────────────────────
   Keys match data-event-id on .schedule-event.
   Add / edit here to update modal content.
─────────────────────────────────────────────── */
const EVENT_DATA = {
  'lamp-lighting': {
    title:    'Lamp Lighting',
    tag:      'Opening Ceremony',
    time:     '10:00 AM',
    location: '📍 Main Auditorium',
    poster:   'images/posters/campus.webp',
    desc:     'The grand opening ceremony of TRYST 2026 begins with a traditional Pooja and the sacred lighting of the ceremonial lamp. This ritual marks the official commencement of the festival, symbolising the illumination of knowledge, creativity, and cultural unity. Faculty, student leaders, and special guests gather to inaugurate two extraordinary days of performances, competitions, and celebrations.'
  },
  'nrityaang': {
    title:    'Nrityaang – Mridang',
    tag:      'Dance',
    time:     '10:00 AM – 11:20 AM',
    location: '📍 Auditorium',
    poster:   'images/posters/stage.webp',
    desc:     'Nrityaang – Mridang is a prestigious Solo Classical Dance competition that invites performers to showcase the depth and grace of India\'s classical dance traditions. Whether it be Bharatanatyam, Kathak, Odissi, or Kuchipudi, each performance is an offering of devotion and artistry. Judges evaluate technique, expression (abhinaya), rhythm, and stage presence. Open to solo participants from any college.'
  },
  'uthaan': {
    title:    'Uthaan',
    tag:      'Dance',
    time:     '11:30 AM – 1:30 PM',
    location: '📍 Auditorium',
    poster:   'images/posters/crowd.webp',
    desc:     'Uthaan is a vibrant Group Folk Dance competition celebrating the rich tapestry of India\'s regional dance heritage. Teams perform folk forms from across the country — from the energetic Bhangra and Giddha to the graceful Garba and the rhythmic Lavani. The competition rewards authenticity, synchronisation, and the infectious joy that folk dance brings. Teams of 6–12 members are welcome.'
  },
  'inaayat': {
    title:    'Inaayat',
    tag:      'Dance',
    time:     '1:30 PM – 6:30 PM',
    location: '📍 Auditorium',
    poster:   'images/posters/entry.webp',
    desc:     'Inaayat is TRYST\'s flagship Western Group Dance competition — a high-energy, cinematic battle of choreography, style, and synchronisation.<br><br>' +

              '<b>I. Competition Format – Western Group Dance Competition</b><br>' +
              'A platform for teams to showcase coordination, creativity, and power.<br><br>' +

              '• Format: Team performances in front of judges<br>' +
              '• Structure: Performances will be judged and top teams will secure winning positions<br>' +
              '• Time Limit: 6–8 minutes per team (strictly followed)<br>' +
              '• Audio: Teams must bring their music in a pen drive<br><br>' +

              '<b>II. Rules & Conduct</b><br>' +
              '• Only college teams are allowed<br>' +
              '• Minimum 5 members in each team<br>' +
              '• Western dance styles should be the main focus<br>' +
              '• Props are allowed but must be safe and manageable<br>' +
              '• Any vulgar or inappropriate content will lead to disqualification<br>' +
              '• Participants must carry their college ID cards<br>' +
              '• Teams must follow the time limit strictly<br>' +
              '• Judges’ decision will be final and binding<br><br>' +

              '<b>III. Judging Criteria</b><br>' +
              '• Choreography and formations<br>' +
              '• Synchronization and teamwork<br>' +
              '• Energy and execution<br>' +
              '• Creativity and originality<br>' +
              '• Stage presence and crowd connection'
  },
  'advaitaa': {
    title:    'Advaitaa – Nazaat',
    tag:      'Dance',
    time:     '2:00 PM – 3:00 PM',
    location: '📍 Auditorium',
    poster:   'images/posters/artist.webp',
    desc:     'Advaitaa – Nazaat is a Western Solo Dance competition designed for individual performers who command the stage alone. From neo-classical to street-style, participants express their unique voice through movement. The competition rewards technical proficiency, personal style, musicality, and the ability to hold an audience captive for an entire performance. Solo entries from all colleges welcome.'
  },
  'performance-showcase': {
    title:    'Performance Showcase',
    tag:      'Showcase',
    time:     '2:00 PM – 4:30 PM',
    location: '📍 Amphitheatre',
    poster:   'images/posters/support.webp',
    desc:     'The Performance Showcase is an open platform for talent without boundaries. Set against the open sky of the Amphitheatre, this showcase invites students to present acts in any performance art form — spoken word, stand-up comedy, acrobatics, juggling, magic, or any creative expression that defies categorisation. No competition, no pressure — just pure artistry shared with an enthusiastic crowd.'
  },
  'illuminati': {
    title:    'Illuminati',
    tag:      'Competition',
    time:     '9:00 AM – 5:00 PM',
    location: '📍 Lecture Hall-2',
    poster:   'images/posters/stage.webp',
    desc:     'Illuminati is TRYST\'s ultimate knowledge competition — a rigorous intellectual challenge spanning disciplines from science and technology to literature, history, and pop culture. Participants are tested across multiple rounds including written qualifiers, rapid-fire buzzer rounds, and a grand finale. This is a competition for the curious, the widely-read, and the quick-witted. Open to solo or duo entries.'
  },
  'anhad': {
    title:    'Anhad – Slaycapella',
    tag:      'Music',
    time:     '10:00 AM – 2:00 PM',
    location: '📍 Reading Room',
    poster:   'images/posters/crowd.webp',
    desc:     'Anhad – Slaycapella is an a cappella competition where voice is the only instrument. Groups perform entirely without musical backing — every beat, every melody, every harmonic texture is produced by human voice alone. The event celebrates the power of the human voice in its most authentic form. Judges assess vocal quality, arrangement creativity, synchronisation, and performance energy. Groups of 4–12 members.'
  },
  'baithak': {
    title:    'Baithak + Vagmita Debsoc',
    tag:      'Theatre & Debate',
    time:     '10:00 AM – 5:00 PM',
    location: '📍 Shades Lawn / Seminar Room',
    poster:   'images/posters/entry.webp',
    desc:     'Two powerful events running in parallel: Baithak brings the drama of street theatre and nukkad natak to the Shades Lawn, where teams enact socially relevant narratives for an open-air audience. Simultaneously, Vagmita Debsoc hosts a formal parliamentary debate competition in the Seminar Room. Together these events represent the full spectrum of spoken word — from passionate street performance to measured intellectual argument.'
  },
  'vagmita-poetry': {
    title:    'Vagmita Poetry – Irshaad',
    tag:      'Literary',
    time:     '11:00 AM – 1:00 PM',
    location: '📍 LT-4',
    poster:   'images/posters/artist.webp',
    desc:     'Irshaad is an open mic poetry competition where words become worlds. Participants bring original compositions in Hindi, Urdu, or English — spoken word, shayari, poetry slams — and perform them live. The event celebrates raw emotion, linguistic beauty, and the power of language to move people. Poems may address love, society, identity, resistance, or any theme the poet chooses. Open to all, every voice welcome.'
  },
  'maniera': {
    title:    'Maniera: Atrang Rangmanch',
    tag:      'Exhibition',
    time:     '11:00 AM – 3:00 PM',
    location: '📍 Parking Area, Near Gill\'s Hostel',
    poster:   'images/posters/campus.webp',
    desc:     'Atrang Rangmanch is a vibrant outdoor art exhibition and street art installation event celebrating colour, form, and creative expression. Artists transform the festival space with murals, installations, live painting sessions, and mixed-media works. The exhibition is open for all attendees to experience, interact with, and be inspired by. Part showcase, part community art space — Atrang Rangmanch is where TRYST becomes a canvas.'
  },
  'chitrakala': {
    title:    'Maniera: Chitrakala / Kala Sangini',
    tag:      'Art',
    time:     '11:00 AM – 2:00 PM',
    location: '📍 LT-1 and LT-3',
    poster:   'images/posters/support.webp',
    desc:     'Chitrakala is a fine arts competition inviting participants to express their vision through painting, sketching, watercolour, and mixed media. Kala Sangini runs alongside as a rangoli and traditional art competition celebrating India\'s classical decorative traditions. Both events provide a quiet, focused space for artists to create under time constraints, with judges evaluating technique, originality, and artistic expression.'
  }
};

/* ── DOM refs ────────────────────────────────── */
const edOverlay    = document.getElementById('edOverlay');
const edModal      = document.getElementById('edModal');
const edCard       = document.getElementById('edCard');
const edCloseBtn   = document.getElementById('edCloseBtn');
const edRegBtn     = document.getElementById('edRegisterBtn');

const edTagEl      = document.getElementById('edTag');
const edTitleEl    = document.getElementById('edTitle');
const edMetaEl     = document.getElementById('edMeta');
const edDescEl     = document.getElementById('edDesc');
const edPosterImg  = document.getElementById('edPosterImg');

/* ── Override toggleEvent ────────────────────────
   Called from onclick="toggleEvent(this)" on
   every .event-header. We intercept and open the
   detail modal instead.
─────────────────────────────────────────────── */
window.toggleEvent = function(header) {
  // Get event data from parent .schedule-event
  const scheduleEvent = header.closest('.schedule-event');
  if (!scheduleEvent) return;

  const eventId = scheduleEvent.dataset.eventId;
  const data    = EVENT_DATA[eventId];

  // Fallback: read from DOM if not in map
  const title   = data?.title    || header.querySelector('.event-title')?.textContent  || 'Event';
  const tag     = data?.tag      || header.querySelector('.event-tag')?.textContent    || '';
  const time    = data?.time     || scheduleEvent.querySelector('.event-time')?.textContent || '';
  const location = data?.location || scheduleEvent.querySelector('.event-meta-row')?.textContent || '';
  const desc    = data?.desc     || scheduleEvent.querySelector('.event-details p')?.textContent || '';
  const poster  = data?.poster   || scheduleEvent.querySelector('.event-poster')?.src  || '';

  openEventDetailModal({ title, tag, time, location, desc, poster, eventId });
};

/* ── Open modal ──────────────────────────────── */
function openEventDetailModal({ title, tag, time, location, desc, poster, eventId }) {
  // Populate content
  edTagEl.textContent     = tag;
  edTitleEl.textContent   = title;
  edMetaEl.textContent    = [time, location].filter(Boolean).join('  ·  ');
  edDescEl.textContent    = desc;
  edPosterImg.src         = poster;
  edPosterImg.alt         = title;

  // Store event id on register button for context
  edRegBtn.dataset.eventId = eventId || '';
  edRegBtn.dataset.eventTitle = title;

  // Reset desc scroll position
  const scrollWrap = document.querySelector('.ed-desc-scroll');
  if (scrollWrap) scrollWrap.scrollTop = 0;

  // Show
  edOverlay.classList.add('ed-active');
  edModal.classList.add('ed-active');
  document.body.style.overflow = 'hidden';

  // GSAP: fade + scale in
  gsap.fromTo(edCard,
    { opacity: 0, scale: 0.91, y: 18 },
    { opacity: 1, scale: 1,    y: 0,
      duration: 0.38,
      ease: 'expo.out',
      clearProps: 'transform'
    }
  );
}

/* ── Close modal ─────────────────────────────── */
function closeEventDetailModal() {
  gsap.to(edCard, {
    opacity: 0, scale: 0.93, y: 12,
    duration: 0.24, ease: 'power3.in',
    onComplete: () => {
      edOverlay.classList.remove('ed-active');
      edModal.classList.remove('ed-active');
      document.body.style.overflow = '';
      gsap.set(edCard, { clearProps: 'all' });
    }
  });
}

/* ── Event listeners ─────────────────────────── */
if (edCloseBtn)  edCloseBtn.addEventListener('click', closeEventDetailModal);
if (edOverlay)   edOverlay.addEventListener('click',  closeEventDetailModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && edModal?.classList.contains('ed-active')) {
    closeEventDetailModal();
  }
});

/* ── Register button inside event detail modal ──
   Pre-fills event title in eventRegModal title,
   then opens the existing 3-step event reg flow.
─────────────────────────────────────────────── */
if (edRegBtn) {
  edRegBtn.addEventListener('click', () => {
    const eventTitle = edRegBtn.dataset.eventTitle || 'Event';

    // Update the event reg modal title with the event name
    const eregTitleEl = document.getElementById('eventRegTitle');
    if (eregTitleEl) eregTitleEl.textContent = eventTitle;

    const eregEyebrow = document.querySelector('#eventRegStep1 .reg-eyebrow');
    if (eregEyebrow) eregEyebrow.textContent = `TRYST 2026 · ${eventTitle}`;

    // Close event detail modal first, then open event reg modal
    closeEventDetailModal();
    setTimeout(() => {
      if (typeof window.openEventRegModal === 'function') {
        window.openEventRegModal();
      }
    }, 280);
  });
}

/* ── Expose globally ─────────────────────────── */
window.openEventDetailModal  = openEventDetailModal;
window.closeEventDetailModal = closeEventDetailModal;