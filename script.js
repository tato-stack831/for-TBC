/**
 * AstroWatch - Interactive Landing Page JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initStarFieldCanvas();
  initNavigation();
  initScrollSpy();
  initContactForm();
  initCardInteractions();
});

/* ==========================================================================
   1. Dynamic Cosmic Starfield Canvas
   ========================================================================== */
function initStarFieldCanvas() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let stars = [];
  const STAR_COUNT = Math.floor((width * height) / 4500); // Responsive star density

  class Star {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.8 + 0.3;
      this.alpha = Math.random() * 0.7 + 0.2;
      this.twinkleSpeed = (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1);
      // Subtle cyan/blue/white tint
      const colors = ['#ffffff', '#bae6fd', '#7dd3fc', '#c7d2fe'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.alpha += this.twinkleSpeed;
      if (this.alpha <= 0.1) {
        this.alpha = 0.1;
        this.twinkleSpeed = -this.twinkleSpeed;
      } else if (this.alpha >= 0.95) {
        this.alpha = 0.95;
        this.twinkleSpeed = -this.twinkleSpeed;
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = this.size > 1.2 ? 6 : 0;
      ctx.shadowColor = '#38bdf8';
      ctx.fill();
      ctx.restore();
    }
  }

  // Populate stars
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push(new Star());
  }

  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(star => {
      star.update();
      star.draw();
    });
    animationFrameId = requestAnimationFrame(animate);
  }
  animate();

  // Resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      stars = [];
      const newCount = Math.floor((width * height) / 4500);
      for (let i = 0; i < newCount; i++) {
        stars.push(new Star());
      }
    }, 150);
  });
}

/* ==========================================================================
   2. Navbar Scroll State & Mobile Menu Toggle
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-btn');

  // Sticky navbar shadow & blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-active');
      menuToggle.classList.toggle('is-active');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-active');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ==========================================================================
   3. Scroll Spy for Active Navigation Link
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });
}

/* ==========================================================================
   4. Contact Form Validation & Submission Handling
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');

  const submitBtn = document.getElementById('form-submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');
  const btnIcon = submitBtn.querySelector('.btn-send-icon');
  const successAlert = document.getElementById('form-success-alert');

  // Input listener to remove errors as user types
  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group) group.classList.remove('has-error');
    });
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      nameInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    // Validate Email
    if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
      emailInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      messageInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    if (!isValid) return;

    // Loading State
    submitBtn.disabled = true;
    btnText.textContent = 'იგზავნება...';
    btnLoader.style.display = 'inline-block';
    btnIcon.style.display = 'none';

    // Simulate async API sending
    setTimeout(() => {
      submitBtn.disabled = false;
      btnText.textContent = 'გაგზავნა';
      btnLoader.style.display = 'none';
      btnIcon.style.display = 'inline-block';

      // Show success alert
      form.reset();
      successAlert.style.display = 'flex';

      // Auto-hide alert after 6 seconds
      setTimeout(() => {
        successAlert.style.display = 'none';
      }, 6000);
    }, 1200);
  });
}

/* ==========================================================================
   5. Card Hover & Dynamic Glow
   ========================================================================== */
function initCardInteractions() {
  const cards = document.querySelectorAll('.feature-card, .about-card-inner');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.transform = `translate(${x - rect.width / 2}px, ${y - rect.height / 2}px)`;
        glow.style.opacity = '0.85';
      }
    });

    card.addEventListener('mouseleave', () => {
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.transform = '';
        glow.style.opacity = '0.5';
      }
    });
  });
}
