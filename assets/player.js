/* Lecteur du direct — lecture/pause + plein écran (masque le header). */
(function () {
  var video = document.querySelector('.mc-live__video');
  if (!video) return;
  // Cible plein écran : .mc-live (page direct) ou .mc-wp-player (page watchparty),
  // sinon le conteneur direct de la vidéo.
  var live = document.querySelector('.mc-live') || document.querySelector('.mc-wp-player') || video.parentElement;
  var pauseBtn = document.querySelector('.mc-live__ctrl[aria-label="Pause"]');
  var fsBtn = document.querySelector('.mc-live__ctrl[aria-label="Plein écran"]');

  var PAUSE = '<svg viewBox="0 0 24 24" width="18" height="18" fill="#fff"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
  var PLAY = '<svg viewBox="0 0 24 24" width="18" height="18" fill="#fff"><path d="M7 5v14l12-7z"/></svg>';

  function sync() {
    if (!pauseBtn) return;
    pauseBtn.innerHTML = video.paused ? PLAY : PAUSE;
    pauseBtn.setAttribute('aria-label', video.paused ? 'Lecture' : 'Pause');
  }
  if (pauseBtn) {
    pauseBtn.addEventListener('click', function () {
      if (video.paused) video.play(); else video.pause();
    });
  }
  video.addEventListener('play', sync);
  video.addEventListener('pause', sync);
  sync();

  // Plein écran : on bascule la classe mc-fs (le CSS masque la nav)
  if (fsBtn) {
    fsBtn.addEventListener('click', function () {
      var fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      if (fsEl) {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else {
        var req = live.requestFullscreen || live.webkitRequestFullscreen;
        if (req) req.call(live);
      }
    });
  }
  function onFsChange() {
    var active = !!(document.fullscreenElement || document.webkitFullscreenElement);
    document.body.classList.toggle('mc-fs', active);
  }
  document.addEventListener('fullscreenchange', onFsChange);
  document.addEventListener('webkitfullscreenchange', onFsChange);
})();
