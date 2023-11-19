(function () {
    'use strict';

    var main = document.getElementById('main') != null;
    
  document.addEventListener('DOMContentLoaded', function () {
    var contrast = localStorage.getItem('high-contrast');

    if (contrast) switchMode('high-contrast', 'sajat', main);
  });

  document.getElementById('activate-high-contrast').addEventListener('click', function () {
    switchMode('high-contrast', 'sajat', main);
    localStorage.setItem('high-contrast', 'true');
  });

  document.getElementById('activate-normal').addEventListener('click', function () {
    switchMode('sajat', 'high-contrast', main);
    localStorage.removeItem('high-contrast');
  });

  function switchMode(newMode, prevMode, main) {
    var link = document.querySelector('link[rel=stylesheet][href*="' + prevMode + '"]');
    link.parentNode.removeChild(link);

    link = document.createElement('link')

    link.type = 'text/css'
    link.rel = 'stylesheet'
    if(main){
      link.href = 'css/' + newMode + '.css'
    }else{
      link.href = '../css/' + newMode + '.css'
    }

    document.head.appendChild(link)
  }
})();


