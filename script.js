/* ============================================
   MAIN JAVASCRIPT - Blur-free Version
   ============================================ */

// Navigation
function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setActiveNav(sectionId) {
  document.querySelectorAll('.nav-link').forEach((button) => {
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

// Scroll effects - SIMPLE only, no blur
function handleScrollEffects() {
  const scrollY = window.scrollY;
  const navbar = document.querySelector('.navbar');
  
  if (navbar) {
    if (scrollY > 20) {
      navbar.style.background = 'rgba(20, 12, 8, 0.98)';
    } else {
      navbar.style.background = 'rgba(20, 12, 8, 0.92)';
    }
  }
}

// Gallery carousel
function initGalleryCarousel() {
  const carousel = document.querySelector('.gallery-carousel');
  if (!carousel) return;
  
  carousel.querySelectorAll('.card').forEach((card, idx) => {
    card.style.animationDelay = `${idx * 0.08}s`;
  });
}

// Image modal
function initImageModal() {
  const modal = document.getElementById('image-modal');
  if (!modal) return;
  
  const modalSlider = modal.querySelector('.modal-slider');
  const closeButton = modal.querySelector('.modal-close');
  const prevButton = modal.querySelector('.modal-nav.prev');
  const nextButton = modal.querySelector('.modal-nav.next');
  if (!modalSlider || !closeButton) return;

  const galleries = {};
  const photos = document.querySelectorAll('.gallery-photo[data-gallery]');

  photos.forEach((photo) => {
    const group = photo.dataset.gallery;
    if (!group) return;
    if (!galleries[group]) galleries[group] = [];
    
    photo.dataset.galleryStart = galleries[group].length;
    
    const imgs = photo.classList.contains('collage')
      ? photo.querySelectorAll('img')
      : [photo.querySelector('img')];
    
    imgs.forEach((img) => {
      const src = img.dataset.viewSrc || img.src;
      if (src) galleries[group].push(src);
    });
  });

  let currentGroup = null;
  let currentIndex = 0;

  function showSlide(group, index) {
    const slides = galleries[group] || [];
    if (!slides.length) return;
    currentGroup = group;
    currentIndex = (index + slides.length) % slides.length;
    modalSlider.innerHTML = `<img src="${slides[currentIndex]}" alt="Gallery photo" />`;
    modal.classList.add('active');
  }

  photos.forEach((photo) => {
    photo.addEventListener('click', (event) => {
      const group = photo.dataset.gallery;
      const start = parseInt(photo.dataset.galleryStart) || 0;
      showSlide(group, start);
    });
  });

  closeButton.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  if (prevButton) prevButton.addEventListener('click', () => {
    if (currentGroup) showSlide(currentGroup, currentIndex - 1);
  });

  if (nextButton) nextButton.addEventListener('click', () => {
    if (currentGroup) showSlide(currentGroup, currentIndex + 1);
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.classList.remove('active');
  });

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('active')) return;
    if (event.key === 'Escape') modal.classList.remove('active');
    if (event.key === 'ArrowLeft' && currentGroup) showSlide(currentGroup, currentIndex - 1);
    if (event.key === 'ArrowRight' && currentGroup) showSlide(currentGroup, currentIndex + 1);
  });
}

// Scroll reveal - CSS-based only
function observeElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
      }
    });
  }, { threshold: 0.15 });
  
  document.querySelectorAll('.card, .page-section h2, .info-box, .gallery-photo').forEach(el => {
    observer.observe(el);
  });
}

// Footer + Booking
function initFooterAndBookings() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (!form || form.id !== 'booking-form') return;
    e.preventDefault();
    const data = new FormData(form);
    alert(`Salamat ${data.get('name')}! Natanggap ang booking mo para sa ${data.get('date')} ${data.get('time')}.`);
    form.reset();
  });
}

/* ============================================
   SIMPLE FADE-IN - No blur, no GSAP
   ============================================ */

function initFadeIn() {
  // Simple CSS-based fade in - walang blur
  const heroText = document.querySelector('.hero-text');
  const heroVisual = document.querySelector('.hero-visual');
  const heroCta = document.querySelector('.hero-cta');
  
  // Fade in hero text
  if (heroText) {
    heroText.style.opacity = '0';
    heroText.style.transition = 'opacity 0.6s ease';
    setTimeout(() => {
      heroText.style.opacity = '1';
    }, 100);
  }
  
  // Fade in hero visual
  if (heroVisual) {
    heroVisual.style.opacity = '0';
    heroVisual.style.transition = 'opacity 0.6s ease';
    setTimeout(() => {
      heroVisual.style.opacity = '1';
    }, 300);
  }
  
  // Fade in CTA buttons
  if (heroCta) {
    const buttons = heroCta.querySelectorAll('button, a');
    buttons.forEach((btn, i) => {
      btn.style.opacity = '0';
      btn.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        btn.style.opacity = '1';
      }, 500 + (i * 100));
    });
  }
}

/* ============================================
   INITIALIZE
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav('home');
  initSectionObserver();
  initGalleryCarousel();
  initImageModal();
  initFooterAndBookings();
  observeElements();
  
  // Simple scroll handler
  window.addEventListener('scroll', handleScrollEffects, { passive: true });
  
  // Click handler
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-page]');
    if (!target) return;
    const page = target.dataset.page;
    setActiveNav(page);
    scrollToSection(page);
  });
  
  // Fade in on load
  initFadeIn();
});

/**
 * 3D Coffee Background - Super Smooth & No Lag!
 * Add this to your existing website
 */

(function() {
  'use strict';
  
  // Prevent multiple instances
  if (document.getElementById('coffee3D-canvas')) return;
  
  // Configuration
  const config = {
    particleCount: 150,
    beanCount: 25,
    steamCount: 50,
    colors: {
      dark: 0x2b1f16,
      medium: 0x5a3f33,
      light: 0x7b563f,
      accent: 0xd4a373,
      cream: 0xf3ece6
    },
    speed: 0.0008,
    mouseSensitivity: 0.0003
  };
  
  // Setup
  const canvas = document.createElement('canvas');
  canvas.id = 'coffee3D-canvas';
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
  `;
  
  document.body.insertBefore(canvas, document.body.firstChild);
  
  // Three.js Setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 15;
  
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  
  // Lighting
  const ambientLight = new THREE.AmbientLight(config.colors.accent, 0.6);
  scene.add(ambientLight);
  
  const pointLight1 = new THREE.PointLight(config.colors.accent, 0.8, 50);
  pointLight1.position.set(10, 10, 10);
  scene.add(pointLight1);
  
  const pointLight2 = new THREE.PointLight(config.colors.cream, 0.4, 50);
  pointLight2.position.set(-10, -10, 10);
  scene.add(pointLight2);
  
  // Create coffee particles (using Points for performance)
  function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const colorArray = [
      new THREE.Color(config.colors.dark),
      new THREE.Color(config.colors.medium),
      new THREE.Color(config.colors.light),
      new THREE.Color(config.colors.accent),
      new THREE.Color(0x8b6914)
    ];
    
    for (let i = 0; i < config.particleCount; i++) {
      positions.push(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30 - 10
      );
      
      const color = colorArray[Math.floor(Math.random() * colorArray.length)];
      colors.push(color.r, color.g, color.b);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });
    
    return new THREE.Points(geometry, material);
  }
  
  // Create floating coffee beans
  function createCoffeeBeans() {
    const beans = [];
    const geometry = new THREE.CapsuleGeometry(0.06, 0.15, 4, 6);
    
    for (let i = 0; i < config.beanCount; i++) {
      const material = new THREE.MeshStandardMaterial({
        color: [config.colors.dark, config.colors.medium, config.colors.light][Math.floor(Math.random() * 3)],
        roughness: 0.85,
        metalness: 0.05
      });
      
      const bean = new THREE.Mesh(geometry, material);
      bean.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 20 - 8
      );
      bean.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      bean.userData = {
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.008,
          y: (Math.random() - 0.5) * 0.008,
          z: (Math.random() - 0.5) * 0.008
        },
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.003 + Math.random() * 0.004
      };
      
      beans.push(bean);
    }
    
    return beans;
  }
  
  // Create subtle steam
  function createSteam() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    
    for (let i = 0; i < config.steamCount; i++) {
      positions.push(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15 - 5
      );
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.3,
      color: config.colors.cream,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending
    });
    
    return new THREE.Points(geometry, material);
  }
  
  // Create subtle coffee splash/ripple effect
  function createRipples() {
    const geometry = new THREE.RingGeometry(0.1, 0.15, 32);
    const material = new THREE.MeshBasicMaterial({
      color: config.colors.accent,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    
    const ripples = [];
    for (let i = 0; i < 8; i++) {
      const ripple = new THREE.Mesh(geometry, material.clone());
      ripple.position.set(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 20,
        -15
      );
      ripple.rotation.x = -Math.PI / 2;
      ripple.userData = {
        scale: 0.5 + Math.random() * 0.5,
        speed: 0.002 + Math.random() * 0.003,
        offset: Math.random() * Math.PI * 2,
        maxScale: 2 + Math.random() * 2
      };
      ripples.push(ripple);
    }
    return ripples;
  }
  
  // Add objects to scene
  const particles = createParticles();
  scene.add(particles);
  
  const steam = createSteam();
  scene.add(steam);
  
  const coffeeBeans = createCoffeeBeans();
  coffeeBeans.forEach(bean => scene.add(bean));
  
  const ripples = createRipples();
  ripples.forEach(ripple => scene.add(ripple));
  
  // Mouse tracking
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  
  // Animation
  let time = 0;
  
  function animate() {
    requestAnimationFrame(animate);
    time += 1;
    
    // Smooth mouse follow
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;
    
    camera.position.x += (targetX * 2 - camera.position.x) * 0.04;
    camera.position.y += (-targetY * 2 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);
    
    // Rotate particles
    particles.rotation.y += config.speed;
    particles.rotation.x += config.speed * 0.5;
    
    // Animate steam
    const steamPositions = steam.geometry.attributes.position.array;
    for (let i = 0; i < steamPositions.length; i += 3) {
      steamPositions[i + 1] += 0.015;
      if (steamPositions[i + 1] > 10) {
        steamPositions[i + 1] = -10;
      }
    }
    steam.geometry.attributes.position.needsUpdate = true;
    steam.rotation.y += config.speed * 0.3;
    
    // Animate coffee beans
    coffeeBeans.forEach(bean => {
      const data = bean.userData;
      bean.rotation.x += data.rotSpeed.x;
      bean.rotation.y += data.rotSpeed.y;
      bean.rotation.z += data.rotSpeed.z;
      bean.position.y += Math.sin(time * data.floatSpeed + data.floatOffset) * 0.003;
    });
    
    // Animate ripples
    ripples.forEach(ripple => {
      const data = ripple.userData;
      const scale = data.scale + Math.sin(time * data.speed + data.offset) * 0.3;
      const limitedScale = Math.min(scale, data.maxScale);
      ripple.scale.set(limitedScale, limitedScale, 1);
      ripple.material.opacity = 0.15 * (1 - limitedScale / data.maxScale);
    });
    
    renderer.render(scene, camera);
  }
  
  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  // Start
  animate();
  console.log('☕ 3D Coffee Background Loaded - Smooth!');
  
})();