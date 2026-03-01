/* =========================================
   NSKi — Process Slider
   Before/After comparison with clip-path
   ========================================= */

(function () {
  'use strict';

  var slider = document.getElementById('process-slider');
  var afterImage = document.getElementById('process-after');
  var sliderLine = document.getElementById('slider-line');
  var phaseText = document.getElementById('phase-text');

  if (!slider || !afterImage || !sliderLine) return;

  var phases = [
    {
      range: [0, 33],
      text: 'El terreno antes de intervenir. Vegetación subtropical, topografía natural y el potencial de lo que vendrá.'
    },
    {
      range: [34, 66],
      text: 'La estructura toma forma. Hormigón armado, encofrado artesanal y la mano del oficio en cada detalle.'
    },
    {
      range: [67, 100],
      text: 'El proyecto terminado. Materiales, luz y espacio dialogando con el entorno misionero.'
    }
  ];

  function updateSlider(value) {
    var percent = parseInt(value, 10);

    // Update clip-path — reveal from left
    afterImage.style.clipPath = 'inset(0 ' + (100 - percent) + '% 0 0)';

    // Update slider line position
    sliderLine.style.left = percent + '%';

    // Update phase text
    for (var i = 0; i < phases.length; i++) {
      if (percent >= phases[i].range[0] && percent <= phases[i].range[1]) {
        if (phaseText.textContent !== phases[i].text) {
          phaseText.style.opacity = '0';
          setTimeout(function (txt) {
            phaseText.textContent = txt;
            phaseText.style.opacity = '1';
          }.bind(null, phases[i].text), 150);
        }
        break;
      }
    }
  }

  // Listen for input
  slider.addEventListener('input', function (e) {
    updateSlider(e.target.value);
  });

  // Smooth transition on phase text
  phaseText.style.transition = 'opacity 0.15s ease';

  // Initialize at 50%
  updateSlider(50);
})();
