// =============================================
// Main JavaScript - Redesigned
// =============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100
    });
  }

  // Initialize Bootstrap components
  initializeBootstrapComponents();
  
  // Initialize custom functionality
  initializeCustomFeatures();
});

// =============================================
// Bootstrap Components Initialization
// =============================================
function initializeBootstrapComponents() {
  // Initialize carousels
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach(carousel => {
    if (typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
      new bootstrap.Carousel(carousel, {
        interval: 5000,
        wrap: true,
        touch: true
      });
    }
  });

  // Initialize dropdowns
  const dropdowns = document.querySelectorAll('.dropdown-toggle');
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', function(e) {
      if (window.innerWidth < 992) {
        e.preventDefault();
        const dropdownMenu = this.nextElementSibling;
        dropdownMenu.classList.toggle('show');
      }
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.matches('.dropdown-toggle')) {
      const dropdowns = document.querySelectorAll('.dropdown-menu');
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
      });
    }
  });
}

// =============================================
// Custom Features Initialization
// =============================================
function initializeCustomFeatures() {
  // Preloader
  initializePreloader();
  
  // Navigation scroll effect
  initializeNavbarScroll();
  
  // Animated counters
  initializeCounters();
  
  // Back to top button
  initializeBackToTop();
  
  // Smooth scrolling for anchor links
  initializeSmoothScrolling();
  
  // Lazy loading for images
  initializeLazyLoading();
  
  // Newsletter form handling
  initializeNewsletterForm();
}

// =============================================
// Preloader
// =============================================
function initializePreloader() {
  const preloader = document.querySelector('.preloader');
  
  if (preloader) {
    // Hide preloader when page is fully loaded
    window.addEventListener('load', function() {
      setTimeout(function() {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
      }, 500);
    });
  }
}

// =============================================
// Navbar Scroll Effect
// =============================================
function initializeNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
    
    // Trigger on load in case page is scrolled
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    }
  }
}

// =============================================
// Animated Counters
// =============================================
function initializeCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  if (counters.length > 0) {
    // Create Intersection Observer to trigger animation when in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-count'));
          const duration = 2000; // 2 seconds
          const step = target / (duration / 16); // 60fps
          let current = 0;
          
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
          }, 16);
          
          // Stop observing after animation starts
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
      observer.observe(counter);
    });
  }
}

// =============================================
// Back to Top Button
// =============================================
function initializeBackToTop() {
  const backToTopButton = document.getElementById('backToTop');
  
  if (backToTopButton) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
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
}

// =============================================
// Smooth Scrolling for Anchor Links
// =============================================
function initializeSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#" or empty
      if (href === '#' || href === '') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        // Calculate offset for fixed navbar
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without jumping
        if (history.pushState) {
          history.pushState(null, null, href);
        } else {
          location.hash = href;
        }
      }
    });
  });
}

// =============================================
// Lazy Loading for Images
// =============================================
function initializeLazyLoading() {
  // Check if browser supports Intersection Observer
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for older browsers
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
  }
}

// =============================================
// Newsletter Form Handling
// =============================================
function initializeNewsletterForm() {
  const newsletterForm = document.querySelector('.newsletter-form');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      
      if (validateEmail(email)) {
        // Simulate form submission
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Subscribing...';
        submitButton.disabled = true;
        
        // In a real implementation, you would send the data to your server here
        setTimeout(() => {
          // Show success message
          showNotification('Thank you for subscribing to our newsletter!', 'success');
          emailInput.value = '';
          submitButton.innerHTML = originalText;
          submitButton.disabled = false;
        }, 1500);
      } else {
        showNotification('Please enter a valid email address.', 'error');
      }
    });
  }
}

// =============================================
// Utility Functions
// =============================================

// Email validation
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Notification system
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${getNotificationIcon(type)} me-2"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close" aria-label="Close notification">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Add styles if not already added
  if (!document.querySelector('#notification-styles')) {
    const styles = document.createElement('style');
    styles.id = 'notification-styles';
    styles.textContent = `
      .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 1rem 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 400px;
        z-index: 9999;
        transform: translateX(120%);
        transition: transform 0.3s ease;
      }
      .notification.show {
        transform: translateX(0);
      }
      .notification-success {
        border-left: 4px solid #28a745;
      }
      .notification-error {
        border-left: 4px solid #dc3545;
      }
      .notification-info {
        border-left: 4px solid #17a2b8;
      }
      .notification-content {
        display: flex;
        align-items: center;
        margin-right: 1rem;
      }
      .notification-close {
        background: none;
        border: none;
        color: #6c757d;
        cursor: pointer;
        padding: 0;
        font-size: 0.875rem;
      }
      .notification-close:hover {
        color: #343a40;
      }
    `;
    document.head.appendChild(styles);
  }
  
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    hideNotification(notification);
  }, 5000);
  
  // Close button event
  const closeButton = notification.querySelector('.notification-close');
  closeButton.addEventListener('click', () => {
    hideNotification(notification);
  });
}

function hideNotification(notification) {
  notification.classList.remove('show');
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

function getNotificationIcon(type) {
  switch (type) {
    case 'success': return 'check-circle';
    case 'error': return 'exclamation-circle';
    default: return 'info-circle';
  }
}

// =============================================
// Performance Optimization
// =============================================

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function() {
  // Any scroll-dependent functions can go here
}, 100));

// =============================================
// Error Handling
// =============================================
window.addEventListener('error', function(e) {
  console.error('Error occurred:', e.error);
});

// =============================================
// Export for potential module usage
// =============================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeBootstrapComponents,
    initializeCustomFeatures,
    validateEmail
  };
}
