/**
 * ASFA - Smooth Scroll JavaScript - Optimized
 * Provides smooth scrolling functionality for anchor links
 */

class SmoothScroll {
  constructor() {
    this.config = {
      selector: 'a[href^="#"]',
      offset: 90,
      speed: 800,
      easing: 'easeInOutCubic',
      updateURL: true
    };

    this.easingFunctions = {
      easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
      easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
      easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t
    };

    this.init();
  }

  init() {
    // Check if prefers-reduced-motion is enabled
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Add event listeners to all anchor links
    document.querySelectorAll(this.config.selector).forEach(anchor => {
      // Skip if link has no href or is a different origin
      if (!anchor.getAttribute('href') || anchor.origin !== window.location.origin) {
        return;
      }

      // Skip if link is for a tab or modal
      if (anchor.hasAttribute('data-toggle') || anchor.getAttribute('role') === 'tab') {
        return;
      }

      anchor.addEventListener('click', e => this.handleClick(e));
    });
  }

  handleClick(e) {
    const targetId = this.getTargetId(e.currentTarget);
    if (!targetId) return;

    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    e.preventDefault();
    this.scrollToElement(targetElement);
  }

  getTargetId(anchor) {
    const href = anchor.getAttribute('href');
    return href === '#' ? null : href.substring(1);
  }

  scrollToElement(target) {
    const startPosition = window.pageYOffset;
    const targetPosition = target.getBoundingClientRect().top + startPosition - this.config.offset;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();
    const duration = Math.min(Math.abs(distance) * 2, this.config.speed);

    const animateScroll = currentTime => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeProgress = this.easingFunctions[this.config.easing](progress);

      window.scrollTo(0, startPosition + distance * easeProgress);

      if (progress < 1) {
        window.requestAnimationFrame(animateScroll);
      } else {
        this.updateURL(target.id);
      }
    };

    window.requestAnimationFrame(animateScroll);
  }

  updateURL(targetId) {
    if (!this.config.updateURL) return;

    const url = new URL(window.location);
    if (targetId === 'top') {
      url.hash = '';
    } else {
      url.hash = targetId;
    }

    window.history.replaceState(null, null, url.toString());
  }
}

// Initialize SmoothScroll when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SmoothScroll();
});
