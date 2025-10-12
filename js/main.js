// Enhanced JS with GSAP and Swiper
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // Preloader
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    gsap.to(preloader, { opacity: 0, duration: 1, onComplete: () => preloader.style.display = 'none' });
  });

  // Navbar Scroll
  window.addEventListener('scroll', () => {
    document.querySelector('.navbar').classList.toggle('scrolled', window.scrollY > 50);
  });

  // AOS Init
  AOS.init({ duration: 1000, once: true });

  // GSAP Animations
  gsap.from('.hero-title', { opacity: 0, y: 50, duration: 1, delay: 0.5 });
  gsap.from('.hero-subtitle', { opacity: 0, y: 30, duration: 1, delay: 0.7 });
  gsap.from('.hero-actions .btn', { opacity: 0, y: 30, duration: 1, delay: 0.9, stagger: 0.2 });

  // Stats Counter
  const stats = document.querySelectorAll('.stat-number');
  const animateStats = () => {
    stats.forEach(stat => {
      const target = parseInt(stat.dataset.target);
      gsap.to(stat, {
        innerHTML: target,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => stat.innerHTML = Math.ceil(stat.innerHTML)
      });
    });
  };
  ScrollTrigger.create({
    trigger: '.stats-section',
    start: 'top 80%',
    onEnter: animateStats
  });

  // Parallax
  gsap.to('.program-image img', {
    yPercent: -20,
    ease: "none",
    scrollTrigger: {
      trigger: '.programs-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });

  // Swiper for Testimonials
  new Swiper('.testimonial-swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    autoplay: { delay: 5000 },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  });

  // Donate Modal Amounts
  document.querySelectorAll('.donate-amount-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.donate-amount-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (btn.dataset.amount === 'custom') {
        document.getElementById('customAmount').style.display = 'block';
      } else {
        document.getElementById('customAmount').style.display = 'none';
      }
    });
  });

  // Dark Mode Toggle
  const toggle = document.getElementById('darkModeToggle');
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = toggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
  });

  // Form Submission
  document.querySelector('.donate-form').addEventListener('submit', e => {
    e.preventDefault();
    alert('Thank you for your generous donation! We\'ll process it shortly.');
    bootstrap.Modal.getInstance(document.getElementById('donateModal')).hide();
  });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    gsap.to(window, { duration: 1, scrollTo: target });
  });
});
