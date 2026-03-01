/* =========================================
   NSKi — Time-based Theme & Weather Widget
   Adapts subtle background tint by hour
   Fetches weather for Oberá, Misiones
   API Key: OpenWeatherMap
   ========================================= */

(function () {
  'use strict';

  // ── Time-based tint ──
  var hour = new Date().getHours();
  var tint;

  if (hour >= 6 && hour < 12) {
    // Morning: neutral
    tint = '0, 0, 0';
  } else if (hour >= 12 && hour < 17) {
    // Afternoon: warm
    tint = '20, 10, 0';
  } else if (hour >= 17 && hour < 20) {
    // Sunset: golden
    tint = '30, 15, 0';
  } else {
    // Night: pure black
    tint = '0, 0, 0';
  }

  document.documentElement.style.setProperty('--bg-tint', tint);

  // ── Weather Widget ──
  var API_KEY = 'a91702df203fd66ba899b141d2c60965';
  var CITY = 'Obera';
  var COUNTRY = 'AR';
  var UNITS = 'metric';
  var LANG = 'es';

  var weatherWidget = document.getElementById('weather-widget');
  var weatherText = document.getElementById('weather-text');
  var weatherDesc = document.getElementById('weather-desc');

  if (!weatherWidget || !weatherText || !weatherDesc) return;

  var url = 'https://api.openweathermap.org/data/2.5/weather'
    + '?q=' + CITY + ',' + COUNTRY
    + '&units=' + UNITS
    + '&lang=' + LANG
    + '&appid=' + API_KEY;

  fetch(url)
    .then(function (res) {
      if (!res.ok) throw new Error('Weather API error');
      return res.json();
    })
    .then(function (data) {
      var temp = Math.round(data.main.temp);
      var description = data.weather[0].description;
      var humidity = data.main.humidity;

      // Capitalize first letter
      description = description.charAt(0).toUpperCase() + description.slice(1);

      weatherText.textContent = temp + '°C · ' + description;
      weatherDesc.textContent = 'Humedad: ' + humidity + '%';

      // Show widget
      weatherWidget.classList.remove('hidden');
      weatherWidget.classList.add('visible');
    })
    .catch(function (err) {
      // Silently fail — widget stays hidden
      console.warn('Weather fetch failed:', err.message);
    });
})();
