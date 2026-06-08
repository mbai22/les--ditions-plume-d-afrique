/* ============================================
   LES ÉDITIONS PLUME D'AFRIQUE
   Main JavaScript — Interactions & Animations
   ============================================ */

'use strict';

// ====== DOM READY ======
document.addEventListener('DOMContentLoaded', () => {

  // --- Preloader ---
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 800);
  });

  // Fallback: hide preloader after 4s max
  setTimeout(() => {
    if (!preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
    }
  }, 4000);

  // ====== HEADER SCROLL EFFECT ======
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = scrollY;
  });

  // ====== MOBILE MENU ======
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-link');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
    });
  });

  // ====== ACTIVE NAV LINK ON SCROLL ======
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // ====== HERO PARTICLES ======
  const heroParticles = document.getElementById('heroParticles');

  function createParticles() {
    const count = window.innerWidth < 768 ? 30 : 60;
    heroParticles.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
      particle.style.animationDelay = `${Math.random() * 10}s`;
      particle.style.opacity = Math.random() * 0.5 + 0.1;
      heroParticles.appendChild(particle);
    }
  }

  createParticles();
  window.addEventListener('resize', createParticles);

  // ====== SCROLL REVEAL ======
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ====== ANIMATED COUNTERS ======
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');

    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const duration = 2000;
      const step = Math.max(1, Math.floor(target / 60));
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current >= target) {
          current = target;
          counter.textContent = current;
          return;
        }
        counter.textContent = current;
        requestAnimationFrame(() => setTimeout(updateCounter, 30));
      };

      updateCounter();
    });
  }

  // Trigger counters when stats section is visible
  const statsBanner = document.querySelector('.stats-banner');
  if (statsBanner) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(statsBanner);
  }

  // ====== TESTIMONIALS CAROUSEL ======
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  let currentTestimonial = 0;
  let testimonialInterval;

  function showTestimonial(index) {
    testimonialCards.forEach(card => card.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));

    testimonialCards[index].classList.add('active');
    testimonialDots[index].classList.add('active');
    currentTestimonial = index;
  }

  function nextTestimonial() {
    const next = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(next);
  }

  function startTestimonialAuto() {
    testimonialInterval = setInterval(nextTestimonial, 5000);
  }

  function stopTestimonialAuto() {
    clearInterval(testimonialInterval);
  }

  testimonialDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index);
      showTestimonial(index);
      stopTestimonialAuto();
      startTestimonialAuto();
    });
  });

  if (testimonialCards.length > 0) {
    showTestimonial(0);
    startTestimonialAuto();
  }

  // ====== AUTEURS SLIDER ======
  const auteursGrid = document.querySelector('.auteurs-slider');
  const auteursPrev = document.querySelector('.auteurs-prev');
  const auteursNext = document.querySelector('.auteurs-next');
  const auteursDotsContainer = document.querySelector('.auteurs-dots');

  if (auteursGrid && auteursPrev && auteursNext) {
    const cards = auteursGrid.querySelectorAll('.auteur-card');
    const cardsPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : window.innerWidth < 1200 ? 3 : 5;
    const totalSlides = Math.ceil(cards.length / cardsPerView);
    let currentSlide = 0;

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('auteurs-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      auteursDotsContainer.appendChild(dot);
    }

    const dotElements = auteursDotsContainer.querySelectorAll('.auteurs-dot');

    function updateSlider() {
      cards.forEach((card, i) => {
        const start = currentSlide * cardsPerView;
        const end = start + cardsPerView;
        card.style.display = (i >= start && i < end) ? 'block' : 'none';
      });

      dotElements.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    function goToSlide(index) {
      currentSlide = index;
      updateSlider();
    }

    auteursNext.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlider();
    });

    auteursPrev.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateSlider();
    });

    updateSlider();

    window.addEventListener('resize', () => {
      const newCardsPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : window.innerWidth < 1200 ? 3 : 5;
      // Recalculate if needed
      location.reload();
    });
  }

  // ====== CONTACT FORM ======
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const consentInput = document.getElementById('consent');

    // Real-time validation
    nameInput.addEventListener('blur', () => validateField(nameInput, 'Veuillez entrer votre nom'));
    emailInput.addEventListener('blur', () => validateEmail(emailInput));
    messageInput.addEventListener('blur', () => validateField(messageInput, 'Veuillez entrer votre message'));

    nameInput.addEventListener('input', () => clearError(nameInput));
    emailInput.addEventListener('input', () => clearError(emailInput));
    messageInput.addEventListener('input', () => clearError(messageInput));

    function validateField(input, errorMsg) {
      const error = input.parentElement.querySelector('.form-error');
      if (!input.value.trim()) {
        input.classList.add('error');
        error.textContent = errorMsg;
        return false;
      }
      input.classList.remove('error');
      error.textContent = '';
      return true;
    }

    function validateEmail(input) {
      const error = input.parentElement.querySelector('.form-error');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!input.value.trim()) {
        input.classList.add('error');
        error.textContent = 'Veuillez entrer votre email';
        return false;
      }

      if (!emailRegex.test(input.value.trim())) {
        input.classList.add('error');
        error.textContent = 'Format d\'email invalide';
        return false;
      }

      input.classList.remove('error');
      error.textContent = '';
      return true;
    }

    function clearError(input) {
      input.classList.remove('error');
      const error = input.parentElement.querySelector('.form-error');
      if (error) error.textContent = '';
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, 'Veuillez entrer votre nom');
      const isEmailValid = validateEmail(emailInput);
      const isMessageValid = validateField(messageInput, 'Veuillez entrer votre message');

      if (!consentInput.checked) {
        consentInput.style.outline = '2px solid #e74c3c';
        setTimeout(() => { consentInput.style.outline = 'none'; }, 2000);
        return;
      }

      if (isNameValid && isEmailValid && isMessageValid) {
        const submitBtn = contactForm.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Envoi en cours...</span><i class="fas fa-spinner fa-spin"></i>';

        setTimeout(() => {
          contactForm.reset();
          formSuccess.classList.add('show');
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Envoyer le message</span><i class="fas fa-paper-plane"></i>';

          setTimeout(() => {
            formSuccess.classList.remove('show');
          }, 5000);
        }, 1500);
      }
    });
  }

  // ====== NEWSLETTER FORM ======
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!input.value.trim() || !emailRegex.test(input.value.trim())) {
        input.style.borderColor = '#e74c3c';
        setTimeout(() => { input.style.borderColor = ''; }, 2000);
        return;
      }

      const btn = newsletterForm.querySelector('.btn');
      btn.innerHTML = 'Merci ! <i class="fas fa-check"></i>';
      input.value = '';

      setTimeout(() => {
        btn.innerHTML = "S'abonner";
      }, 3000);
    });
  }

  // ====== BACK TO TOP ======
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ====== SMOOTH SCROLL FOR ANCHOR LINKS (fallback) ======
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ====== PARALLAX EFFECT ON HERO ======
  window.addEventListener('scroll', () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && window.scrollY < window.innerHeight) {
      const offset = window.scrollY * 0.3;
      heroContent.style.transform = `translateY(${offset}px)`;
      heroContent.style.opacity = 1 - (window.scrollY / (window.innerHeight * 0.8));
    }
  });

}); // End DOMContentLoaded
