/* ═══════════════════════════════════════════════
   TRYST 2026 — Master Script
   GSAP · Animations · Interactions
═══════════════════════════════════════════════ */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

/* ═══ LOADER ═══ */
window.addEventListener('load', () => {
  initHeroAnimations();
  initStars();
});

/* ═══ CUSTOM CURSOR ═══ */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

// Guard: only run mystery lock logic if the element exists
const mysteryWrapper = document.getElementById("mysteryLock");
if (mysteryWrapper) {
  mysteryWrapper.classList.add("locked");
}

function unlockMystery() {
  const wrapper = document.getElementById("mysteryLock");
  if (!wrapper) return;
  const overlay = wrapper.querySelector(".lock-overlay");
  const btn = document.getElementById("revealBtnLocked");
  wrapper.classList.remove("locked");
  if (overlay) overlay.remove();
  if (btn) {
    btn.classList.remove("locked-btn");
    btn.style.pointerEvents = "auto";
  }
}

function animateFollower() {
  followerX += (mouseX - followerX) * 0.14;
  followerY += (mouseY - followerY) * 0.14;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor expand on interactive elements
document.querySelectorAll('a, button, .nav-card, .artist-card, .gallery-item, .schedule-tab, .event-header, [data-modal]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursorFollower.style.width = '60px';
    cursorFollower.style.height = '60px';
    cursorFollower.style.borderColor = 'rgba(201, 168, 76, 0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    cursorFollower.style.width = '36px';
    cursorFollower.style.height = '36px';
    cursorFollower.style.borderColor = 'rgba(201, 168, 76, 0.5)';
  });
});

/* ═══ STARS GENERATOR ═══ */
function initStars() {
  const starsContainer = document.getElementById('stars');
  if (!starsContainer) return;

  const count = 120;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    const size = Math.random() * 2.5 + 0.5;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dur = (Math.random() * 4 + 2).toFixed(1);
    const delay = (Math.random() * 5).toFixed(1);
    const opacity = (Math.random() * 0.7 + 0.2).toFixed(2);

    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      top: ${y}%;
      --dur: ${dur}s;
      --delay: ${delay}s;
      --opacity: ${opacity};
      animation-delay: ${delay}s;
    `;
    starsContainer.appendChild(star);
  }
}

/* ═══ HERO ANIMATIONS ═══ */
function initHeroAnimations() {
  // Reveal navbar after hero loads
  setTimeout(() => {
    const nb = document.getElementById('navbar');
    if (nb) nb.classList.add('visible');
  }, 1400);

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  tl
    .to('.hero-badge',     { opacity: 1, y: 0, duration: 0.6, delay: 0.05 })
    .to('.hero-logo-wrap', { opacity: 1, y: 0, duration: 0.65 }, '-=0.35')
    .to('.hero-title',     { opacity: 1, duration: 0.9 }, '-=0.4')
    .from('.hero-title-tryst', {
      y: 60,
      clipPath: 'inset(100% 0 0 0)',
      duration: 0.9,
      ease: 'expo.out'
    }, '<')
    .from('.hero-title-year', {
      y: 40,
      clipPath: 'inset(100% 0 0 0)',
      duration: 0.75,
      ease: 'expo.out'
    }, '-=0.6')
    .to('.hero-line',     { opacity: 1, duration: 0.45 }, '-=0.3')
    .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.55 }, '-=0.25')
    .to('.hero-date',     { opacity: 1, y: 0, duration: 0.45 }, '-=0.3')
    .to('.hero-cta',      { opacity: 1, y: 0, duration: 0.55 }, '-=0.25')
    .to('#scroll-hint',   { opacity: 0.6, y: 0, duration: 0.45 }, '-=0.2');

  // Hero mouse parallax
  document.addEventListener('mousemove', (e) => {
    const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
    const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

    gsap.to('#hero-bg-img', {
      x: xPercent * -15,
      y: yPercent * -10,
      duration: 1.2,
      ease: 'power2.out'
    });

    gsap.to('.hero-content', {
      x: xPercent * 5,
      y: yPercent * 3,
      duration: 1.2,
      ease: 'power2.out'
    });
  });

  // Scroll parallax for hero bg
  gsap.to('#hero-bg-img', {
    y: '30%',
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });
}

/* ═══ NAVBAR SCROLL ═══ */

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;

  if (scrollY > 80) {
    // Show navbar
    navbar.classList.add('visible');
    navbar.classList.add('scrolled');
  } else {
    // Hide navbar at top
    navbar.classList.remove('visible');
    navbar.classList.remove('scrolled');
  }
});

/* ═══ MOBILE MENU ═══ */
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const menuClose = document.getElementById('menu-close');

menuToggle.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
  gsap.fromTo('.mobile-link',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.07, duration: 0.4, ease: 'expo.out', delay: 0.05 }
  );
});

menuClose.addEventListener('click', closeMobileMenu);

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

function closeMobileMenu() {
  gsap.to('.mobile-link', { y: 14, opacity: 0, stagger: 0.04, duration: 0.22, ease: 'power2.in' });
  setTimeout(() => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }, 280);
}

/* ═══ HORIZONTAL CARDS (Drag Scroll + Inertia) ═══ */
const cardsTrack = document.getElementById('cardsTrack');
let isDragging = false;
let startX = 0;
let scrollLeftStart = 0;
let velocity = 0;
let lastMouseX = 0;
let rafId = null;

cardsTrack.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.pageX - cardsTrack.offsetLeft;
  scrollLeftStart = cardsTrack.scrollLeft;
  lastMouseX = e.pageX;
  cardsTrack.classList.add('grabbing');
  cancelAnimationFrame(rafId);
});

cardsTrack.addEventListener('mouseleave', endDrag);
cardsTrack.addEventListener('mouseup', endDrag);

cardsTrack.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - cardsTrack.offsetLeft;
  const walk = (x - startX) * 1.2;
  cardsTrack.scrollLeft = scrollLeftStart - walk;
  velocity = e.pageX - lastMouseX;
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
}, { passive: true });

cardsTrack.addEventListener('touchmove', (e) => {
  const x = e.touches[0].pageX;

  const walk = (x - startX); // ❌ no multiplier

  cardsTrack.scrollLeft = scrollLeftStart - walk;
}, { passive: true });

if (window.innerWidth > 768) {
  // your existing mouse drag + inertia code
}
/* ═══ CARD 3D TILT ═══ */
document.querySelectorAll('.nav-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * -8;
    const rotateY = (x - centerX) / centerX * 8;

    gsap.to(card, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      duration: 0.25,
      ease: 'power2.out'
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'expo.out'
    });
  });
});

/* ═══ NAV CARD SCROLL ═══ */
document.querySelectorAll('.nav-card').forEach(card => {
  card.addEventListener('click', () => {
    const targetSelector = card.getAttribute('data-target');
    if (!targetSelector) return;
    const target = document.querySelector(targetSelector);
    if (!target) return;

    gsap.to(window, {
      scrollTo: { y: target, offsetY: 80 },
      duration: 0.9,
      ease: 'expo.inOut'
    });
  });
});

/* ═══ CARD MODAL TRIGGERS ═══ */
document.querySelectorAll('[data-modal]').forEach(card => {
  card.addEventListener('click', () => {
    const modalId = card.dataset.modal;
    const modalMap = {
      'about': 'modal-about',
      'events': 'modal-events',
      'surprise': 'modal-surprise',
      'performers': 'modal-performers',
      'schedule-modal': null,
      'register-modal': null,
      'gallery-modal': null,
      'contact-modal': null
    };

    const scrollMap = {
      'schedule-modal': '#schedule',
      'register-modal': '#register',
      'gallery-modal': '#gallery',
      'contact-modal': '#contact'
    };

    let isScrolling = false;

    function scrollToSection(target) {
      if (isScrolling) return;

      isScrolling = true;

      gsap.to(window, {
        scrollTo: {
          y: target,
          offsetY: 80
        },
        duration: 0.32,
        ease: "power2.out",
        onComplete: () => {
          isScrolling = false;
        }
      });
    }

    const targetModal = modalMap[modalId];
    if (targetModal) openModal(targetModal);
  });
});

/* ═══ MODAL SYSTEM ═══ */
function openModal(modalId) {
  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById(modalId);

  if (!modal) return;

  overlay.classList.add('active');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.body.classList.add('modal-open');
  document.getElementById(id).classList.add('active');
}

function closeModal() {
  document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
  document.getElementById('modal-overlay').classList.remove('active');
  document.body.style.overflow = '';
  document.body.classList.remove('modal-open');
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
}

window.closeModal = closeModal;

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* ═══ SURPRISE ARTIST REVEAL ═══ */
let isRevealed = false;

document.getElementById('revealBtn').addEventListener('click', () => {
  if (isRevealed) return;
  isRevealed = true;

  const img = document.getElementById('surpriseImg');
  const question = document.getElementById('surpriseQuestion');
  const revealed = document.getElementById('surpriseRevealed');
  const veil = document.getElementById('surpriseVeil');
  const glowRing = document.getElementById('surpriseGlowRing');
  const btn = document.getElementById('revealBtn');

  const tl = gsap.timeline();

  tl
    .to(question, { opacity: 0, scale: 1.15, duration: 0.35, ease: 'power2.in' })
    .set(question, { visibility: 'hidden' })
    .to(btn,  { opacity: 0, y: 8, duration: 0.25 }, '<')
    .to(veil, { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, '-=0.2')
    .call(() => {
      img.classList.add('revealed');
      glowRing.classList.add('active');
    })
    .to({}, { duration: 0.8 }) // let CSS blur transition breathe
    .call(() => { revealed.classList.add('show'); });

  createParticleBurst(document.getElementById('surpriseStage'));
});

function createParticleBurst(parent) {
  for (let i = 0; i < 16; i++) {
    const particle = document.createElement('div');
    const angle = (i / 16) * 360;
    const distance = 80 + Math.random() * 60;

    particle.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: ${Math.random() * 4 + 2}px;
      height: ${Math.random() * 4 + 2}px;
      background: var(--gold);
      border-radius: 50%;
      pointer-events: none;
      z-index: 20;
      transform: translate(-50%, -50%);
    `;
    parent.appendChild(particle);

    const radian = (angle * Math.PI) / 180;
    gsap.to(particle, {
      x: Math.cos(radian) * distance,
      y: Math.sin(radian) * distance,
      opacity: 0,
      scale: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: Math.random() * 0.2,
      onComplete: () => particle.remove()
    });
  }
}

/* ═══ SCHEDULE TABS ═══ */
document.querySelectorAll('.schedule-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const day = tab.dataset.day;

    document.querySelectorAll('.schedule-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const currentDay = document.querySelector('.schedule-day.active');
    const nextDay = document.querySelector(`.schedule-day[data-day="${day}"]`);

    if (currentDay === nextDay) return;

    gsap.to(currentDay, {
      opacity: 0,
      y: -12,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        currentDay.classList.remove('active');
        nextDay.classList.add('active');
        gsap.fromTo(nextDay,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'expo.out' }
        );
        nextDay.querySelectorAll('.fade-up').forEach(el => {
          el.classList.add('visible');
        });
      }
    });
  });
});

/* ═══ EVENT ACCORDION ═══ */
window.toggleEvent = function(header) {
  const card = header.parentElement;
  const body = card.querySelector('.event-body');
  const toggle = header.querySelector('.event-toggle');

  const isOpen = body.classList.contains('open');

  // Close all open
  document.querySelectorAll('.event-body.open').forEach(b => {
    b.classList.remove('open');
    b.previousElementSibling?.querySelector('.event-toggle')?.classList.remove('open');
  });

  if (!isOpen) {
    body.classList.add('open');
    toggle.classList.add('open');

    gsap.from(body, {
      opacity: 0,
      y: -6,
      duration: 0.22,
      ease: 'expo.out'
    });
  }
};

/* ═══ GALLERY LIGHTBOX ═══ */
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentGalleryIndex = 0;
const galleryImages = [...galleryItems].map(item => item.dataset.src);

galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    currentGalleryIndex = index;
    openLightbox(galleryImages[index]);
  });
});

function openLightbox(src) {
  lightbox.classList.add('active');
  lightboxImg.src = src;
  document.body.style.overflow = 'hidden';

  gsap.fromTo(lightboxImg,
    { scale: 0.92, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.3, ease: 'expo.out' }
  );
}

function closeLightbox() {
  gsap.to(lightboxImg, {
    scale: 0.94, opacity: 0, duration: 0.2, ease: 'power2.in',
    onComplete: () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

lightboxClose.addEventListener('click', closeLightbox);
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
  const xFrom = dir === 'next' ? 40 : -40;
  gsap.to(lightboxImg, {
    x: -xFrom, opacity: 0, duration: 0.15, ease: 'power2.in',
    onComplete: () => {
      lightboxImg.src = src;
      gsap.fromTo(lightboxImg,
        { x: xFrom, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.25, ease: 'expo.out' }
      );
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'ArrowLeft') lightboxPrev.click();
  if (e.key === 'ArrowRight') lightboxNext.click();
  if (e.key === 'Escape') closeLightbox();
});

/* ═══ COUNTDOWN TIMER ═══ */
function updateCountdown() {
  const target = new Date('2026-03-20T10:00:00');
  const now = new Date();
  const diff = target - now;

  if (diff <= 0) {
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('mins').textContent = '00';
    document.getElementById('secs').textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('mins').textContent = String(mins).padStart(2, '0');
  document.getElementById('secs').textContent = String(secs).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ═══ SCROLL ANIMATIONS ═══ */
function initScrollAnimations() {
  const fadeUpElements = document.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(entry.target.dataset.delay) || 0);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeUpElements.forEach((el) => {
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains('fade-up'));
    const index = siblings.indexOf(el);
    el.dataset.delay = index * 70; // tighter stagger
    observer.observe(el);
  });

  const fadeRightElements = document.querySelectorAll('.fade-in-right');
  const rightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        rightObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeRightElements.forEach(el => rightObserver.observe(el));
}

initScrollAnimations();

/* ═══ GSAP SCROLL TRIGGERS ═══ */

// Section title reveal
gsap.utils.toArray('.section-title').forEach(title => {
  gsap.from(title, {
    scrollTrigger: {
      trigger: title,
      start: 'top 88%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 28,
    duration: 0.65,
    ease: 'expo.out'
  });
});

// Stats counter animation
ScrollTrigger.create({
  trigger: '.stats-row',
  start: 'top 82%',
  onEnter: () => {
    gsap.to('.stat-num', {
      opacity: 1,
      y: 0,
      stagger: 0.08,
      duration: 0.5,
      ease: 'expo.out'
    });
  },
  once: true
});

// Artist cards stagger
ScrollTrigger.create({
  trigger: '.artists-grid',
  start: 'top 82%',
  onEnter: () => {
    gsap.from('.artist-card', {
      opacity: 0,
      y: 35,
      stagger: 0.07,
      duration: 0.6,
      ease: 'expo.out'
    });
  },
  once: true
});

// Gallery items stagger
ScrollTrigger.create({
  trigger: '.gallery-masonry',
  start: 'top 82%',
  onEnter: () => {
    gsap.from('.gallery-item', {
      opacity: 0,
      scale: 0.94,
      stagger: 0.04,
      duration: 0.45,
      ease: 'expo.out'
    });
  },
  once: true
});

// Register section — pulsing button glow
ScrollTrigger.create({
  trigger: '#register',
  start: 'top 72%',
  onEnter: () => {
    gsap.to('.btn-register', {
      boxShadow: '0 0 40px rgba(201, 168, 76, 0.3)',
      repeat: -1,
      yoyo: true,
      duration: 1.2,
      ease: 'sine.inOut'
    });
  },
  once: true
});

// Surprise section ambient glow
ScrollTrigger.create({
  trigger: '#surprise',
  start: 'top 72%',
  onEnter: () => {
    gsap.to('.surprise-frame', {
      boxShadow: '0 0 40px rgba(26, 42, 94, 0.8), 0 0 80px rgba(0, 102, 204, 0.2)',
      duration: 1.0,
      ease: 'power2.out'
    });
  },
  once: true
});

// Parallax for decorative sections
gsap.to('.about-bg-decor', {
  y: -80,
  ease: 'none',
  scrollTrigger: {
    trigger: '#about',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1.5
  }
});

/* ═══ SMOOTH SCROLL ANCHOR LINKS ═══ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();

    gsap.to(window, {
      scrollTo: { y: target, offsetY: 80 },
      duration: 0.9,
      ease: 'expo.inOut'
    });
  });
});

/* ═══ CONTACT FORM ═══ */
document.querySelector('.btn-primary:last-of-type')?.addEventListener('click', function() {
  const inputs = document.querySelectorAll('.form-input');
  let valid = true;
  inputs.forEach(input => {
    if (!input.value.trim()) {
      valid = false;
      gsap.fromTo(input, { x: -5 }, { x: 5, repeat: 5, yoyo: true, duration: 0.08 });
      input.style.borderColor = 'rgba(255, 100, 100, 0.5)';
      setTimeout(() => input.style.borderColor = '', 2000);
    }
  });

  if (valid) {
    this.innerHTML = '<span class="btn-inner">✦ Message Sent ✦</span><span class="btn-glow"></span>';
    inputs.forEach(input => input.value = '');
  }
});

/* ═══ PRELOAD HERO IMAGES ═══ */
const criticalImages = [
  'images/posters/bg.png',
  'tryst_logo.png'
];

criticalImages.forEach(src => {
  const img = new Image();
  img.src = src;
});

/* ═══ INIT LOG ═══ */
console.log('%cTRYST 2026', 'font-family: serif; font-size: 32px; color: #C9A84C; font-weight: bold;');
console.log('%cWhere Legends Are Born', 'font-family: serif; font-size: 14px; color: #E5C97E; font-style: italic;');
console.log('%cIIT Delhi · March 20–22, 2026', 'font-family: monospace; font-size: 10px; color: #666;');

