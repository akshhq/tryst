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
  cardsTrack.scrollLeft = scrollLeftStart - (x - startX) * 1.2;
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
cardsTrack.addEventListener('touchstart', (e) => {
  startX = e.touches[0].pageX;
  scrollLeftStart = cardsTrack.scrollLeft;
  velocity = 0;
}, { passive: true });

cardsTrack.addEventListener('touchmove', (e) => {
  const x = e.touches[0].pageX;
  velocity = x - startX;
  cardsTrack.scrollLeft = scrollLeftStart - (x - startX);
}, { passive: true });

cardsTrack.addEventListener('touchend', () => applyInertia());

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
   SURPRISE ARTIST REVEAL
═══════════════════════════════════════════════ */
let isRevealed = false;

const revealBtn = document.getElementById('revealBtn');
if (revealBtn) {
  revealBtn.addEventListener('click', () => {
    if (isRevealed) return;
    isRevealed = true;

    const img      = document.getElementById('surpriseImg');
    const question = document.getElementById('surpriseQuestion');
    const revealed = document.getElementById('surpriseRevealed');
    const veil     = document.getElementById('surpriseVeil');
    const glowRing = document.getElementById('surpriseGlowRing');

    gsap.timeline()
      .to(question,  { opacity: 0, scale: 1.12, duration: 0.32, ease: 'power2.in' })
      .set(question, { visibility: 'hidden' })
      .to(revealBtn, { opacity: 0, y: 7, duration: 0.22 }, '<')
      .to(veil,      { opacity: 0, duration: 0.65, ease: 'power2.inOut' }, '-=0.1')
      .call(() => { img.classList.add('revealed'); glowRing.classList.add('active'); })
      .to({}, { duration: 0.75 })
      .call(() => revealed.classList.add('show'));

    createParticleBurst(document.getElementById('surpriseStage'));
  });
}

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
  const diff = new Date('2026-03-20T10:00:00') - new Date();
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
   CONSOLE SIGNATURE
═══════════════════════════════════════════════ */
console.log('%cTRYST 2026', 'font-family:serif;font-size:28px;color:#C9A84C;font-weight:bold;');
console.log('%cWhere Legends Are Born', 'font-family:serif;font-size:13px;color:#E5C97E;font-style:italic;');
console.log('%cKeshav Mahavidyalaya · March 20–21, 2026', 'font-family:monospace;font-size:10px;color:#666;');