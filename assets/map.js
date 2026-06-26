/* Carte interactive : zoom + déplacement (pan), plein écran.
   - L'élément .mc-carte__map (qui contient l'image ET les pins) est transformé
     en bloc → les pins restent collés à la carte au zoom/déplacement.
   - Molette (desktop), pincement (mobile), double-clic, boutons +/−/reset.
   Aucune dépendance. */
(function () {
  var carte = document.querySelector('.mc-carte');
  var map = document.querySelector('.mc-carte__map');
  if (!carte || !map) return;

  var scale = 1, tx = 0, ty = 0;
  var MIN = 1, MAX = 4.5;

  // Borne le déplacement pour qu'aucun vide n'apparaisse (la carte couvre l'écran).
  function clampPan() {
    var r = carte.getBoundingClientRect();
    var mw = map.offsetWidth * scale, mh = map.offsetHeight * scale;
    var maxX = Math.max(0, (mw - r.width) / 2);
    var maxY = Math.max(0, (mh - r.height) / 2);
    tx = Math.max(-maxX, Math.min(maxX, tx));
    ty = Math.max(-maxY, Math.min(maxY, ty));
  }
  function apply() {
    clampPan();
    map.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
  }

  // Zoome en gardant fixe le point (cx, cy) écran.
  function zoomAt(cx, cy, next) {
    next = Math.max(MIN, Math.min(MAX, next));
    var r = carte.getBoundingClientRect();
    var ox = cx - r.left - r.width / 2;
    var oy = cy - r.top - r.height / 2;
    var px = (ox - tx) / scale, py = (oy - ty) / scale;
    tx = ox - px * next; ty = oy - py * next;
    scale = next; apply();
  }

  // Molette
  carte.addEventListener('wheel', function (e) {
    e.preventDefault();
    zoomAt(e.clientX, e.clientY, scale * (e.deltaY < 0 ? 1.12 : 1 / 1.12));
  }, { passive: false });

  // Déplacement à un doigt / souris
  var dragging = false, sx = 0, sy = 0, moved = false;
  map.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'touch' && e.isPrimary === false) return;
    dragging = true; moved = false; sx = e.clientX; sy = e.clientY;
    try { map.setPointerCapture(e.pointerId); } catch (err) {}
    map.classList.add('is-grabbing');
  });
  map.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
    tx += dx; ty += dy; sx = e.clientX; sy = e.clientY; apply();
  });
  function endDrag() { dragging = false; map.classList.remove('is-grabbing'); }
  map.addEventListener('pointerup', endDrag);
  map.addEventListener('pointercancel', endDrag);
  // Empêche la navigation d'un pin si on a glissé (drag, pas clic).
  map.addEventListener('click', function (e) {
    if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
  }, true);

  // Pincement (2 doigts)
  var pinchDist = 0, pinchScale = 1, midX = 0, midY = 0;
  carte.addEventListener('touchstart', function (e) {
    if (e.touches.length === 2) {
      dragging = false; map.classList.remove('is-grabbing');
      var a = e.touches[0], b = e.touches[1];
      pinchDist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      pinchScale = scale; midX = (a.clientX + b.clientX) / 2; midY = (a.clientY + b.clientY) / 2;
    }
  }, { passive: false });
  carte.addEventListener('touchmove', function (e) {
    if (e.touches.length === 2 && pinchDist) {
      e.preventDefault();
      var a = e.touches[0], b = e.touches[1];
      var d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      zoomAt(midX, midY, pinchScale * (d / pinchDist));
    }
  }, { passive: false });
  carte.addEventListener('touchend', function (e) { if (e.touches.length < 2) pinchDist = 0; });

  // Double-clic / double-tap : bascule zoom
  map.addEventListener('dblclick', function (e) {
    e.preventDefault();
    zoomAt(e.clientX, e.clientY, scale > 1.5 ? 1 : 2.6);
  });

  // Boutons +/−/reset
  document.querySelectorAll('[data-zoom]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var k = btn.getAttribute('data-zoom');
      var r = carte.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (k === 'in') zoomAt(cx, cy, scale * 1.35);
      else if (k === 'out') zoomAt(cx, cy, scale / 1.35);
      else { scale = 1; tx = 0; ty = 0; apply(); }
    });
  });

  window.addEventListener('resize', apply);
  apply();
})();
