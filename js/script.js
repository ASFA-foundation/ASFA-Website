/**
 * ASFA Foundation - Main JavaScript
 * Modern, performant, and accessible interactions
 */

document.addEventListener('DOMContentLoaded', function() {
  // =============================================
  // Core Utilities
  // =============================================
  
  // Set current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
  }

  // =============================================
  // Preloader
  // =============================================
  
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', function() {
      // Add fade-out class to preloader
      preloader.classList.add('preloader-fade');
      
      // Remove preloader from DOM after animation completes
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    });
  }

  // =============================================
  // Navigation
  // =============================================
  
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    });
    
    // Mobile menu close on click
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
          bootstrap.Collapse.getInstance(navbarCollapse).hide();
        }
      });
    });
  }

  // =============================================
  // Hero Carousel
  // =============================================
  
  const heroCarousel = document.getElementById('heroCarousel');
  if (heroCarousel) {
    const carousel = new bootstrap.Carousel(heroCarousel, {
      interval: 7000,
      pause: 'hover',
      wrap: true,
      touch: true
    });

    // Keyboard navigation for carousel
    heroCarousel.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        carousel.prev();
      } else if (e.key === 'ArrowRight') {
        carousel.next();
      }
    });

    // Pause carousel when not in viewport
    const carouselObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          carousel.cycle();
        } else {
          carousel.pause();
        }
      });
    }, { threshold: 0.5 });

    carouselObserver.observe(heroCarousel);
  }

  // =============================================
  // Smooth Scrolling
  // =============================================
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without jumping
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          window.location.hash = targetId;
        }
      }
    });
  });

  // =============================================
  // Scroll To Top Button
  // =============================================
  
  const backToTopButton = document.querySelector('.back-to-top');
  if (backToTopButton) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }
    });
    
    backToTopButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // =============================================
  // Animated Counter
  // =============================================
  
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    const animateCounters = () => {
      statNumbers.forEach(stat => {
        const target = +stat.getAttribute('data-count');
        const duration = 2000; // Animation duration in ms
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        
        const updateCounter = () => {
          const current = +stat.textContent;
          if (current < target) {
            stat.textContent = Math.ceil(current + increment);
            requestAnimationFrame(updateCounter);
          } else {
            stat.textContent = target;
          }
        };
        
        // Only animate when in viewport
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              updateCounter();
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.5 });
        
        observer.observe(stat);
      });
    };
    
    // Wait for fonts to load to avoid layout shifts
    document.fonts.ready.then(() => {
      animateCounters();
    });
  }

  // =============================================
  // Newsletter Form
  // =============================================
  
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      
      // Validate email
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailInput.classList.add('is-invalid');
        return;
      }
      
      // Remove error state
      emailInput.classList.remove('is-invalid');
      
      // Create success message
      const successMessage = document.createElement('div');
      successMessage.className = 'alert alert-success mt-3';
      successMessage.setAttribute('role', 'alert');
      successMessage.innerHTML = `
        <div class="d-flex align-items-center">
          <i class="fas fa-check-circle me-2"></i>
          <div>Thank you for subscribing! We'll keep you updated.</div>
        </div>
      `;
      
      // Insert after form
      this.parentNode.insertBefore(successMessage, this.nextSibling);
      
      // Reset form
      this.reset();
      
      // Remove message after 5 seconds
      setTimeout(() => {
        successMessage.classList.add('fade');
        setTimeout(() => {
          successMessage.remove();
        }, 300);
      }, 5000);
    });
  });

  // =============================================
  // Cookie Consent
  // =============================================
  
  const cookieConsent = document.getElementById('cookieConsent');
  if (cookieConsent) {
    // Check if consent already given
    if (!localStorage.getItem('cookieConsent')) {
      // Show after slight delay
      setTimeout(() => {
        cookieConsent.classList.add('show');
      }, 1000);
    }
    
    // Accept cookies
    document.getElementById('acceptCookies').addEventListener('click', function() {
      localStorage.setItem('cookieConsent', 'true');
      cookieConsent.classList.remove('show');
    });
    
    // Decline cookies
    document.getElementById('declineCookies').addEventListener('click', function() {
      localStorage.setItem('cookieConsent', 'false');
      cookieConsent.classList.remove('show');
    });
  }

  // =============================================
  // Lazy Loading Images
  // =============================================
  
  if ('IntersectionObserver' in window) {
    const lazyImages = [].slice.call(document.querySelectorAll('img.lazy-load'));
    
    if (lazyImages.length > 0) {
      const lazyObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.add('loaded');
            lazyObserver.unobserve(lazyImage);
          }
        });
      }, {
        rootMargin: '200px 0px' // Load images 200px before they enter viewport
      });
      
      lazyImages.forEach(lazyImage => {
        lazyObserver.observe(lazyImage);
      });
    }
  }

  // =============================================
  // Program Cards Animation
  // =============================================
  
  const programCards = document.querySelectorAll('.program-card');
  programCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      const icon = this.querySelector('.program-icon');
      if (icon) {
        icon.style.transform = 'translateY(-5px) rotate(5deg)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      const icon = this.querySelector('.program-icon');
      if (icon) {
        icon.style.transform = '';
      }
    });
  });

  // =============================================
  // Tooltips Initialization
  // =============================================
  
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl, {
      trigger: 'hover focus'
    });
  });

  // =============================================
  // Story Card Hover Effect
  // =============================================
  
  const storyCards = document.querySelectorAll('.story-card');
  storyCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      const badge = this.querySelector('.story-badge');
      if (badge) {
        badge.style.transform = 'translateY(-5px)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      const badge = this.querySelector('.story-badge');
      if (badge) {
        badge.style.transform = '';
      }
    });
  });

  // =============================================
  // Contact Form Validation
  // =============================================
  
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      const requiredFields = this.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('is-invalid');
          isValid = false;
        } else {
          field.classList.remove('is-invalid');
        }
      });
      
      if (isValid) {
        // Form is valid - you would typically submit via AJAX here
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = `
          <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Sending...
        `;
        
        // Simulate AJAX submission
        setTimeout(() => {
          // Show success message
          const successAlert = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
              <div class="d-flex align-items-center">
                <i class="fas fa-check-circle me-2"></i>
                <div>Your message has been sent successfully!</div>
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          `;
          
          this.insertAdjacentHTML('beforebegin', successAlert);
          
          // Reset form
          this.reset();
          submitButton.innerHTML = originalText;
          submitButton.disabled = false;
        }, 1500);
      }
    });
  }
});

// =============================================
// Window Load Event
// =============================================

window.addEventListener('load', function() {
  // Initialize any plugins or scripts that need full page load
});

// =============================================
// Resize Event Debouncer
// =============================================

(function() {
  const resizeTimeout = {};
  
  window.addEventListener('resize', function() {
    // Clear the timeout if it exists
    if (resizeTimeout.id) {
      clearTimeout(resizeTimeout.id);
    }
    
    // Set new timeout
    resizeTimeout.id = setTimeout(function() {
      // Handle resize operations here
      // This ensures they only run once after resize completes
    }, 250);
  });
})();
