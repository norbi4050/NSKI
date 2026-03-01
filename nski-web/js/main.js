/* =========================================
   NSKi — Main JavaScript
   Navigation, GSAP ScrollTrigger, Init
   ========================================= */

(function () {
  'use strict';

  // ── Elements ──
  var navbar = document.getElementById('navbar');
  var menuToggle = document.getElementById('menu-toggle');
  var menuOverlay = document.getElementById('menu-overlay');
  var menuLinks = document.querySelectorAll('.menu-link');
  var hero = document.getElementById('hero');
  var body = document.body;

  // ══════════════════════════════════════
  // 1. NAVIGATION
  // ══════════════════════════════════════

  // Hamburger toggle
  if (menuToggle && menuOverlay) {
    menuToggle.addEventListener('click', function () {
      var isActive = menuOverlay.classList.contains('active');

      if (isActive) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  function openMenu() {
    menuOverlay.classList.add('active');
    menuToggle.classList.add('active');
    body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuOverlay.classList.remove('active');
    menuToggle.classList.remove('active');
    body.style.overflow = '';
  }

  // Close menu on link click + smooth scroll
  menuLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      closeMenu();

      var targetId = this.getAttribute('href');
      var target = document.querySelector(targetId);

      if (target) {
        setTimeout(function () {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    });
  });

  // Close menu on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
      closeMenu();
    }
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ══════════════════════════════════════
  // 2. NAVBAR SCROLL BEHAVIOR
  // ══════════════════════════════════════

  var lastScroll = 0;
  var scrollThreshold = 80;

  window.addEventListener('scroll', function () {
    var currentScroll = window.pageYOffset;

    // Add solid background after threshold
    if (currentScroll > scrollThreshold) {
      navbar.classList.add('nav-solid');
    } else {
      navbar.classList.remove('nav-solid');
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // ══════════════════════════════════════
  // 3. HERO ENTRANCE ANIMATION
  // ══════════════════════════════════════

  // Trigger hero animations after a short delay
  if (hero) {
    setTimeout(function () {
      hero.classList.add('loaded');
    }, 200);
  }

  // ══════════════════════════════════════
  // 4. GSAP SCROLL ANIMATIONS
  // ══════════════════════════════════════

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // ── Section headers reveal ──
    gsap.utils.toArray('.section-header').forEach(function (header) {
      gsap.to(header, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          once: true,
          onEnter: function () {
            header.classList.add('revealed');
          }
        }
      });
    });

    // ── Project cards stagger ──
    var projectCards = gsap.utils.toArray('.project-card');
    if (projectCards.length) {
      gsap.from(projectCards, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.projects-grid',
          start: 'top 80%',
          once: true
        }
      });
    }

    // ── Material cards stagger ──
    var materialCards = gsap.utils.toArray('.material-card');
    if (materialCards.length) {
      gsap.from(materialCards, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: materialCards[0].parentElement,
          start: 'top 80%',
          once: true
        }
      });
    }

    // ── Process section reveal ──
    var processReveal = document.querySelector('.process-reveal');
    if (processReveal) {
      gsap.from(processReveal, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: processReveal,
          start: 'top 85%',
          once: true
        }
      });
    }

    // ── Footer fade in ──
    var footer = document.querySelector('footer');
    if (footer) {
      gsap.from(footer, {
        opacity: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: footer,
          start: 'top 95%',
          once: true
        }
      });
    }

  } else {
    // Fallback: just show everything if GSAP not loaded
    document.querySelectorAll('.section-header').forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  // ══════════════════════════════════════
  // 5. LAZY LOAD CHECK
  // ══════════════════════════════════════

  // Native lazy loading is handled by HTML loading="lazy" attributes
  // This is just a safety fallback for older browsers
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading — nothing to do
  } else {
    // Fallback: load all images immediately
    document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
      img.src = img.src;
    });
  }

})();
