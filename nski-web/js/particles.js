/* =========================================
   NSKi — tsParticles Configuration
   Terracotta particles on hero section
   Disabled on mobile for performance
   ========================================= */

(function () {
  'use strict';

  // Skip on mobile
  if (window.innerWidth < 768) return;

  // Check if tsParticles is available
  if (typeof tsParticles === 'undefined') {
    console.warn('tsParticles not loaded');
    return;
  }

  tsParticles.load('tsparticles', {
    fullScreen: { enable: false },
    fpsLimit: 60,
    particles: {
      color: {
        value: ['#C4562A', '#C4933A', '#F5C518']
      },
      number: {
        value: 35,
        density: {
          enable: true,
          area: 900
        }
      },
      opacity: {
        value: { min: 0.1, max: 0.3 },
        animation: {
          enable: true,
          speed: 0.3,
          minimumValue: 0.1,
          sync: false
        }
      },
      size: {
        value: { min: 1, max: 3 }
      },
      move: {
        enable: true,
        speed: 0.4,
        direction: 'none',
        random: true,
        straight: false,
        outModes: {
          default: 'out'
        }
      },
      links: {
        enable: true,
        color: '#C4562A',
        opacity: 0.08,
        distance: 150,
        width: 1
      }
    },
    interactivity: {
      detectsOn: 'canvas',
      events: {
        onHover: {
          enable: true,
          mode: 'grab'
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 180,
          links: {
            opacity: 0.25,
            color: '#F5C518'
          }
        }
      }
    },
    detectRetina: true
  }).catch(function (err) {
    console.warn('tsParticles init error:', err);
  });
})();
