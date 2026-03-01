/* =========================================
   NSKi — V3 Main JavaScript
   Lenis smooth scroll, GSAP pro animations,
   custom cursor, particles, weather, nav
   ========================================= */

(function () {
  'use strict';

  // ══════════════════════════════════════
  // 0. LOADER
  // ══════════════════════════════════════

  var loader = document.getElementById('loader');

  window.addEventListener('load', function () {
    setTimeout(function () {
      if (loader) loader.classList.add('hidden');
      // Trigger hero after loader fades
      setTimeout(function () {
        var hero = document.getElementById('hero');
        if (hero) hero.classList.add('loaded');
      }, 100);
    }, 800);
  });

  // ══════════════════════════════════════
  // 1. LENIS SMOOTH SCROLL
  // ══════════════════════════════════════

  var lenis = null;

  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: 'vertical',
      smoothWheel: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // ══════════════════════════════════════
  // 2. CUSTOM CURSOR
  // ══════════════════════════════════════

  var cursor = document.getElementById('cursor');
  var cursorDot = document.getElementById('cursor-dot');

  if (cursor && cursorDot && window.innerWidth >= 768) {
    document.documentElement.classList.add('has-cursor');

    var mouseX = 0, mouseY = 0;
    var cursorX = 0, cursorY = 0;
    var dotX = 0, dotY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      // Smooth follow for outer circle
      cursorX += (mouseX - cursorX) * 0.12;
      cursorY += (mouseY - cursorY) * 0.12;
      cursor.style.transform = 'translate(' + (cursorX - 10) + 'px, ' + (cursorY - 10) + 'px)';

      // Fast follow for dot
      dotX += (mouseX - dotX) * 0.5;
      dotY += (mouseY - dotY) * 0.5;
      cursorDot.style.transform = 'translate(' + (dotX - 3) + 'px, ' + (dotY - 3) + 'px)';

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on links and buttons
    var hoverTargets = document.querySelectorAll('a, button, .project-item, input, textarea');
    hoverTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.classList.add('hovering');
        cursorDot.classList.add('hovering');
      });
      el.addEventListener('mouseleave', function () {
        cursor.classList.remove('hovering');
        cursorDot.classList.remove('hovering');
      });
    });
  }

  // ══════════════════════════════════════
  // 3. NAVIGATION
  // ══════════════════════════════════════

  var navbar = document.getElementById('navbar');
  var menuToggle = document.getElementById('menu-toggle');
  var menuOverlay = document.getElementById('menu-overlay');
  var menuLinks = document.querySelectorAll('.menu-link');
  var body = document.body;

  // Hamburger
  if (menuToggle && menuOverlay) {
    menuToggle.addEventListener('click', function () {
      if (menuOverlay.classList.contains('active')) {
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
    if (lenis) lenis.stop();
  }

  function closeMenu() {
    menuOverlay.classList.remove('active');
    menuToggle.classList.remove('active');
    body.style.overflow = '';
    if (lenis) lenis.start();
  }

  // Close on link click
  menuLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      closeMenu();
      var targetId = this.getAttribute('href');
      var target = document.querySelector(targetId);
      if (target) {
        setTimeout(function () {
          if (lenis) {
            lenis.scrollTo(target, { offset: -80 });
          } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      }
    });
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuOverlay && menuOverlay.classList.contains('active')) {
      closeMenu();
    }
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      // Skip if already handled by menu-link
      if (this.classList.contains('menu-link')) return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(target, { offset: -80 });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Navbar scroll behavior
  var scrollThreshold = 80;
  window.addEventListener('scroll', function () {
    if (window.pageYOffset > scrollThreshold) {
      navbar.classList.add('nav-solid');
    } else {
      navbar.classList.remove('nav-solid');
    }
  }, { passive: true });

  // ══════════════════════════════════════
  // 4. GSAP ANIMATIONS
  // ══════════════════════════════════════

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // ── Section reveals ──
    gsap.utils.toArray('.section-reveal').forEach(function (el) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: function () {
            el.classList.add('revealed');
          }
        }
      });
    });

    // ── Project items — staggered reveal ──
    gsap.utils.toArray('.project-item').forEach(function (item, i) {
      gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        delay: i * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          once: true,
          onEnter: function () {
            item.classList.add('revealed');
          }
        }
      });
    });

    // ── Image reveals (curtain effect) ──
    gsap.utils.toArray('.img-reveal').forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          el.classList.add('revealed');
        }
      });
    });

    // ── Process steps stagger ──
    var processSteps = gsap.utils.toArray('.process-step');
    if (processSteps.length) {
      processSteps.forEach(function (step, i) {
        gsap.to(step, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 85%',
            once: true,
            onEnter: function () {
              step.classList.add('revealed');
            }
          }
        });
      });
    }

    // ── Parallax on philosophy background ──
    var parallaxBg = document.querySelector('.parallax-bg img');
    if (parallaxBg) {
      gsap.to(parallaxBg, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: '#filosofia',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    // ── Project image parallax (subtle) ──
    gsap.utils.toArray('.project-item .img-reveal img').forEach(function (img) {
      gsap.to(img, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.project-item'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });

    // ── Material images parallax ──
    gsap.utils.toArray('.material-block .img-reveal img').forEach(function (img) {
      gsap.to(img, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.material-block'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });

    // ── Footer fade ──
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
    // Fallback if GSAP not loaded
    document.querySelectorAll('.section-reveal, .project-item, .process-step').forEach(function (el) {
      el.classList.add('revealed');
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    document.querySelectorAll('.img-reveal').forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  // ══════════════════════════════════════
  // 5. tsParticles
  // ══════════════════════════════════════

  if (window.innerWidth >= 768 && typeof tsParticles !== 'undefined') {
    tsParticles.load('tsparticles', {
      fullScreen: { enable: false },
      fpsLimit: 60,
      particles: {
        color: { value: ['#C4562A', '#C4933A', '#F5C518'] },
        number: { value: 30, density: { enable: true, area: 1000 } },
        opacity: {
          value: { min: 0.08, max: 0.25 },
          animation: { enable: true, speed: 0.3, minimumValue: 0.08, sync: false }
        },
        size: { value: { min: 1, max: 2.5 } },
        move: {
          enable: true,
          speed: 0.3,
          direction: 'none',
          random: true,
          straight: false,
          outModes: { default: 'out' }
        },
        links: {
          enable: true,
          color: '#C4562A',
          opacity: 0.06,
          distance: 160,
          width: 1
        }
      },
      interactivity: {
        detectsOn: 'canvas',
        events: {
          onHover: { enable: true, mode: 'grab' },
          resize: true
        },
        modes: {
          grab: {
            distance: 200,
            links: { opacity: 0.2, color: '#F5C518' }
          }
        }
      },
      detectRetina: true
    }).catch(function (err) {
      console.warn('tsParticles error:', err);
    });
  }

  // ══════════════════════════════════════
  // 6. WEATHER WIDGET
  // ══════════════════════════════════════

  var API_KEY = 'a91702df203fd66ba899b141d2c60965';
  var weatherWidget = document.getElementById('weather-widget');
  var weatherText = document.getElementById('weather-text');
  var weatherDesc = document.getElementById('weather-desc');

  if (weatherWidget && weatherText && weatherDesc) {
    var url = 'https://api.openweathermap.org/data/2.5/weather'
      + '?q=Obera,AR&units=metric&lang=es&appid=' + API_KEY;

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Weather API error');
        return res.json();
      })
      .then(function (data) {
        var temp = Math.round(data.main.temp);
        var desc = data.weather[0].description;
        desc = desc.charAt(0).toUpperCase() + desc.slice(1);
        weatherText.textContent = temp + '°C · ' + desc;
        weatherDesc.textContent = 'Humedad: ' + data.main.humidity + '%';
        weatherWidget.classList.remove('hidden');
        weatherWidget.classList.add('visible');
      })
      .catch(function () {
        // Silent fail
      });
  }

  // ══════════════════════════════════════
  // 7. LAZY LOAD FALLBACK
  // ══════════════════════════════════════

  if (!('loading' in HTMLImageElement.prototype)) {
    document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
      img.src = img.src;
    });
  }

})();
