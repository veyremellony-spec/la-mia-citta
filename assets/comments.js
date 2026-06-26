/* Menu d'options par commentaire : « Signaler » et « Bloquer ».
   S'applique aux commentaires du forum (.mc-cf-comment) et au chat (.mc-live__msg).
   Auto-suffisant et multilingue (lit mc_lang). */
(function () {
  var lang = 'fr';
  try { lang = localStorage.getItem('mc_lang') || 'fr'; } catch (e) {}
  var STR = {
    fr: { report: 'Signaler le commentaire', block: "Bloquer l'utilisateur", reported: 'Commentaire signalé. Merci !', blocked: 'Utilisateur bloqué.', opts: 'Options' },
    en: { report: 'Report comment', block: 'Block user', reported: 'Comment reported. Thanks!', blocked: 'User blocked.', opts: 'Options' },
    it: { report: 'Segnala il commento', block: 'Blocca utente', reported: 'Commento segnalato. Grazie!', blocked: 'Utente bloccato.', opts: 'Opzioni' }
  };
  var T = STR[lang] || STR.fr;

  var ICON_FLAG = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4h11l-1.5 3.5L16 11H5"/></svg>';
  var ICON_BLOCK = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>';

  var toastEl = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'mc-cmt-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove('is-show'); }, 2400);
  }

  function wire(trigger, comment) {
    if (!trigger || trigger.closest('.mc-cmt-wrap')) return;
    var wrap = document.createElement('span');
    wrap.className = 'mc-cmt-wrap';
    trigger.parentNode.insertBefore(wrap, trigger);
    wrap.appendChild(trigger);

    var menu = document.createElement('div');
    menu.className = 'mc-cmt-menu';
    menu.setAttribute('role', 'menu');
    menu.innerHTML =
      '<button type="button" class="mc-cmt-menu__opt" data-act="report">' + ICON_FLAG + ' ' + T.report + '</button>' +
      '<button type="button" class="mc-cmt-menu__opt mc-cmt-menu__opt--danger" data-act="block">' + ICON_BLOCK + ' ' + T.block + '</button>';
    wrap.appendChild(menu);

    trigger.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      var open = wrap.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('.mc-cmt-menu__opt').forEach(function (opt) {
      opt.addEventListener('click', function (e) {
        e.stopPropagation();
        wrap.classList.remove('is-open');
        if (opt.getAttribute('data-act') === 'report') {
          toast(T.reported);
        } else {
          if (comment) {
            // Mémorise l'utilisateur bloqué (visible ensuite sur le profil).
            var nameEl = comment.querySelector('.mc-cf-comment__name, .mc-live__name');
            var name = nameEl ? nameEl.textContent.trim() : null;
            if (name) {
              try {
                var b = JSON.parse(localStorage.getItem('mc_blocked') || '[]');
                if (b.indexOf(name) < 0) { b.push(name); localStorage.setItem('mc_blocked', JSON.stringify(b)); }
              } catch (e) {}
            }
            comment.style.transition = 'opacity .25s ease';
            comment.style.opacity = '0';
            setTimeout(function () { comment.style.display = 'none'; }, 260);
          }
          toast(T.blocked);
        }
      });
    });
    document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) wrap.classList.remove('is-open'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') wrap.classList.remove('is-open'); });
  }

  // Forum : ajoute un déclencheur « ⋯ » dans la barre méta de chaque commentaire.
  document.querySelectorAll('.mc-cf-comment').forEach(function (c) {
    var meta = c.querySelector('.mc-cf-comment__meta');
    if (!meta) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mc-cmt-more';
    btn.setAttribute('aria-label', T.opts);
    btn.setAttribute('aria-haspopup', 'true');
    btn.innerHTML = '⋯';
    meta.appendChild(btn);
    wire(btn, c);
  });

  // Chat (direct / watchparty) : réutilise le bouton « ⋯ » existant.
  document.querySelectorAll('.mc-live__msg').forEach(function (m) {
    var more = m.querySelector('.mc-live__more');
    if (more) wire(more, m);
  });
})();
