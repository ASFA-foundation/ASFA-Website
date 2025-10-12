document.addEventListener('DOMContentLoaded', function() {
  // Preloader Enhanced
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', function() {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 600);
    });
  }

  // Navbar Scroll Effect Enhanced
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    function updateNavbar() {
      if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', debounce(updateNavbar, 10));
    updateNavbar();
  }

  // Smooth Scrolling Enhanced
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = targetElement.offsetTop - navbarHeight - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  // Back to Top Enhanced
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', throttle(function() {
      if (window.scrollY > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }, 100));
    
    backToTop.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Counter Animation Enhanced with Easing
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const countTo = parseInt(target.getAttribute('data-count'), 10);
          const duration = 2500;
          const startTime = performance.now();
          
          const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          
          const animateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutQuad(progress);
            const value = Math.floor(easedProgress * countTo);
            
            target.textContent = value.toLocaleString();
            
            if (progress < 1) {
              requestAnimationFrame(animateCount);
            }
          };
          
          requestAnimationFrame(animateCount);
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.6 });
    
    statNumbers.forEach(number => observer.observe(number));
  }

  // Particles.js for Hero Background
  if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: ['#FFD700', '#4ECDC4', '#FF6B6B'] },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: '#00AEEF', opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
        modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
      },
      retina_detect: true
    });
  }

  // Cookie Consent Enhanced
  const cookieConsent = document.getElementById('cookieConsent');
  if (cookieConsent) {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (cookiesAccepted !== 'true') {
      setTimeout(() => {
        cookieConsent.classList.add('show');
      }, 3000);
    }
    
    document.getElementById('acceptCookies')?.addEventListener('click', function() {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieConsent.classList.remove('show');
    });
    
    document.getElementById('declineCookies')?.addEventListener('click', function() {
      cookieConsent.classList.remove('show');
    });
  }

  // Current Year
  const currentYear = document.getElementById('currentYear');
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Bootstrap Initialization Enhanced
  if (typeof bootstrap !== 'undefined') {
    // Tooltips and Popovers
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

    // Carousels Enhanced
    const carousels = document.querySelectorAll('.carousel');
    [...carousels].map(carouselEl => new bootstrap.Carousel(carouselEl, {
      interval: 6000,
      pause: 'hover',
      wrap: true,
      touch: true
    }));

    // Dropdowns
    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    [...dropdowns].map(dropdown => new bootstrap.Dropdown(dropdown));
  }

  // Form Validation Enhanced
  const forms = document.querySelectorAll('.needs-validation, .newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', function(event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });

  // Newsletter Submission Enhanced
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        // Simulate API call
        setTimeout(() => {
          alert('Thank you for subscribing! Welcome to the family.');
          emailInput.value = '';
          this.classList.remove('was-validated');
        }, 500);
      }
    });
  }

  // AOS Initialization Enhanced
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
      offset: 120,
      disable: 'mobile'
    });
  }

  // Lazy Loading Enhanced
  function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });
      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      lazyImages.forEach(img => {
        img.src = img.dataset.src || img.src;
      });
    }
  }
  lazyLoadImages();

  // Parallax Effect for Images (Simple)
  window.addEventListener('scroll', throttle(function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelectorAll('.program-image img, .story-image img, .mission-image img');
    parallax.forEach(el => {
      const speed = 0.5;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }, 16));
});

// Utility Functions Enhanced
function debounce(func, wait = 20, immediate = true) {
  let timeout;
  return function executedFunction(...args) {
    const context = this;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function throttle(func, limit = 16) {
  let lastFunc;
  let lastRan;
  return function() {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

// Intersection Observer Polyfill if needed (modern browsers have it)

// Load event for additional initializations
window.addEventListener('load', function() {
  // Trigger AOS refresh
  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }
});
