(function () {
    'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var contrast = localStorage.getItem('high-contrast');

    if (contrast) switchMode('high-contrast', 'sajat');
  });

  document.getElementById('activate-high-contrast').addEventListener('click', function () {
    switchMode('high-contrast', 'sajat');
    localStorage.setItem('high-contrast', 'true');
  });

  document.getElementById('activate-normal').addEventListener('click', function () {
    switchMode('sajat', 'high-contrast');
    localStorage.removeItem('high-contrast');
  });

  function switchMode(newMode, prevMode) {
    var link = document.querySelector('link[rel=stylesheet][href*="' + prevMode + '"]');
    link.parentNode.removeChild(link);

    link = document.createElement('link')

    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = 'css/' + newMode + '.css'

    document.head.appendChild(link)
  }
})();


