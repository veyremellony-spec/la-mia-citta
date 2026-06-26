/* Confettis sur la carte interactive — petite explosion au clic d'un pin. */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var colors = ['#c0163e', '#9c2b5c', '#74437e', '#3a65ae', '#58918c', '#76bc6b', '#ffb114'];

  function burst(x, y) {
    for (var i = 0; i < 26; i++) {
      var p = document.createElement('span');
      p.className = 'mc-confetti';
      p.style.left = (x - 4) + 'px';
      p.style.top = (y - 4) + 'px';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      if (Math.random() < 0.5) p.style.borderRadius = '50%';
      document.body.appendChild(p);

      var ang = Math.random() * Math.PI * 2;
      var dist = 40 + Math.random() * 80;
      var dx = Math.cos(ang) * dist;
      var dy = Math.sin(ang) * dist - 50;            // biais vers le haut
      var rot = Math.random() * 720 - 360;
      (function (el, tx, ty, r) {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            el.style.transform = 'translate(' + tx + 'px,' + ty + 'px) rotate(' + r + 'deg)';
            el.style.opacity = '0';
          });
        });
        setTimeout(function () { el.remove(); }, 950);
      })(p, dx, dy, rot);
    }
  }

  /* Uniquement sur la vue 3D / street view (photo de Milan) : le point d'intérêt
     ambré déclenche les confettis quand on débloque le collectible. */
  [].forEach.call(document.querySelectorAll('.mc-street__poi'), function (poi) {
    poi.addEventListener('click', function () {
      var r = poi.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2);
    });
  });
})();
