function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setActiveNav(sectionId) {
  const buttons = document.querySelectorAll('.nav-link');
  buttons.forEach((button) => {
    button.classList.toggle('active', button.dataset.page === sectionId);
  });
}

function initSectionObserver() {
  const sections = document.querySelectorAll('#home, #about, #menu, #gallery, #contact');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveNav(entry.target.id);
      }
    });
  }, { threshold: 0.35 });
  sections.forEach((section) => observer.observe(section));
}

function scrollToContent() {
  const content = document.getElementById('home');
  if (!content) return;
  content.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

window.addEventListener("DOMContentLoaded", () => {
  setActiveNav('home');
  initSectionObserver();
  window.addEventListener('scroll', handleScrollEffects, { passive: true });
});

// Hook CTAs in hero and nav buttons
document.addEventListener('click', (e) => {
  const t = e.target;
  if (!t.matches || !t.matches('[data-page]')) return;
  const page = t.dataset.page;
  setActiveNav(page);
  scrollToSection(page);
});

// Scroll reveal with IntersectionObserver
function observeElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.card, .page-section h2, .info-box, .gallery-photo').forEach(el => {
    observer.observe(el);
  });
}

// Smooth scroll effects on page
function handleScrollEffects() {
  const scrollY = window.scrollY;
  const navbar = document.querySelector('.navbar');
  
  if (navbar) {
    if (scrollY > 10) {
      navbar.style.boxShadow = '0 10px 50px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.1)';
      navbar.style.background = 'linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))';
    } else {
      navbar.style.boxShadow = '0 10px 40px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.1)';
      navbar.style.background = 'linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))';
    }
  }
}

// 3D tilt on hero visual
function initHeroTilt() {
  const scene = document.getElementById('hero-visual');
  if (!scene) return;
  const heroItem = scene.querySelector('.cup') || scene.querySelector('.logo-scene');
  if (!heroItem) return;
  let mouseX = 0, mouseY = 0;
  let targetRotX = 0, targetRotY = 0;
  let currentRotX = 0, currentRotY = 0;

  scene.addEventListener('mousemove', (ev) => {
    const r = scene.getBoundingClientRect();
    mouseX = (ev.clientX - r.left) / r.width - 0.5;
    mouseY = (ev.clientY - r.top) / r.height - 0.5;
    targetRotX = -mouseY * 6;
    targetRotY = mouseX * 8;
  });

  scene.addEventListener('mouseleave', () => {
    targetRotX = 0;
    targetRotY = 0;
  });

  function animate() {
    currentRotX += (targetRotX - currentRotX) * 0.12;
    currentRotY += (targetRotY - currentRotY) * 0.12;
    heroItem.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
    requestAnimationFrame(animate);
  }
  animate();
}

// Gallery carousel with smooth scrolling
function initGalleryCarousel() {
  const galleryStrips = document.querySelectorAll('.gallery-strip');
  galleryStrips.forEach(strip => {
    const carousel = strip.querySelector('.gallery-carousel');
    const cards = carousel.querySelectorAll('.card');
    
    cards.forEach((card, idx) => {
      card.style.animationDelay = `${idx * 0.1}s`;
    });

  });
}

// Light 3D card hover
function initCard3D() {
  const cards = document.querySelectorAll('.card:not(.netflix)');
  cards.forEach(card => {
    card.addEventListener('mousemove', (ev) => {
      const rect = card.getBoundingClientRect();
      const x = (ev.clientX - rect.left) / rect.width - 0.5;
      const y = (ev.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--rotX', `${y * 4}deg`);
      card.style.setProperty('--rotY', `${x * 4}deg`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rotX', '0deg');
      card.style.setProperty('--rotY', '0deg');
    });
  });
}

// Image modal with smooth transitions
function initImageModal() {
  const modal = document.getElementById('image-modal');
  const modalSlider = modal.querySelector('.modal-slider');
  const closeButton = modal.querySelector('.modal-close');
  const prevButton = modal.querySelector(':scope > .modal-nav.prev');
  const nextButton = modal.querySelector(':scope > .modal-nav.next');
  if (!modal || !modalSlider || !closeButton || !prevButton || !nextButton) return;

  const galleries = {};
  const photos = Array.from(document.querySelectorAll('.gallery-photo[data-gallery]'));

  photos.forEach((photo) => {
    const group = photo.dataset.gallery;
    if (!group) return;
    if (!galleries[group]) galleries[group] = [];

    photo.dataset.galleryStart = String(galleries[group].length);

    const imgs = photo.classList.contains('collage')
      ? Array.from(photo.querySelectorAll('img'))
      : [photo.querySelector('img')].filter(Boolean);

    imgs.forEach((img) => {
      const src = img.dataset.viewSrc || img.getAttribute('src');
      if (src) galleries[group].push(src);
    });
  });

  let currentGroup = null;
  let currentIndex = 0;

  const showSlide = (group, index) => {
    const slides = galleries[group] || [];
    if (!slides.length) return;
    currentGroup = group;
    currentIndex = (index + slides.length) % slides.length;
    modalSlider.innerHTML = `<img src="${slides[currentIndex]}" alt="Gallery photo ${currentIndex + 1}" />`;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    if (prevButton) prevButton.disabled = slides.length <= 1;
    if (nextButton) nextButton.disabled = slides.length <= 1;
  };

  photos.forEach((photo) => {
    photo.addEventListener('click', (event) => {
      const group = photo.dataset.gallery;
      const start = Number(photo.dataset.galleryStart || 0);
      let offset = 0;

      if (photo.classList.contains('collage')) {
        const clickedImg = event.target.closest('img');
        if (clickedImg) {
          const imgs = Array.from(photo.querySelectorAll('img'));
          const idx = imgs.indexOf(clickedImg);
          if (idx >= 0) offset = idx;
        }
      }

      showSlide(group, start + offset);
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    modalSlider.innerHTML = '';
  };

  const prevSlide = () => {
    if (!currentGroup) return;
    showSlide(currentGroup, currentIndex - 1);
  };

  const nextSlide = () => {
    if (!currentGroup) return;
    showSlide(currentGroup, currentIndex + 1);
  };

  closeButton.addEventListener('click', closeModal);
  prevButton.addEventListener('click', prevSlide);
  nextButton.addEventListener('click', nextSlide);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('active')) return;
    if (event.key === 'ArrowLeft') prevSlide();
    if (event.key === 'ArrowRight') nextSlide();
    if (event.key === 'Escape') closeModal();
  });
}

function initPageFeatures() {
  initGalleryCarousel();
  initCard3D();
  initImageModal();
}

window.addEventListener('load', () => {
  initHeroTilt();
  initPageFeatures();
  observeElements();
});

// Footer year + booking form handler
function initFooterAndBookings(){
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Booking form (delegated in case page content is dynamic)
  document.addEventListener('submit', (e) => {
    const form = e.target;
    if(!form || form.id !== 'booking-form') return;
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const date = data.get('date');
    const time = data.get('time');
    const size = data.get('size');
    const contact = data.get('contact');

    // Simple client-side confirmation — replace with server call when available
    alert(`Salamat ${name}! Natanggap na ang booking request para sa ${date} ${time} para sa ${size} tao. Magbibigay kami ng confirmation sa ${contact}.`);
    form.reset();
  });
}

// initialize footer/bookings when page loads
window.addEventListener('DOMContentLoaded', () => {
  initFooterAndBookings();
});
