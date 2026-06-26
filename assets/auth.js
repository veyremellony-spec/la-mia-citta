/* Gestion d'état d'authentification factice (démo statique).
   - data-account : icône compte → onboarding si déconnecté, compte si connecté.
   - data-login   : déclencheurs « créer / se connecter » → marquent l'utilisateur connecté.
   - data-logout  : « se déconnecter » → efface l'état.
   L'état est persisté dans localStorage (clé mc_logged). */
(function () {
  var KEY = 'mc_logged';
  function isLogged() {
    try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }

  // Route l'icône compte vers la bonne page selon l'état.
  document.querySelectorAll('[data-account]').forEach(function (a) {
    a.setAttribute('href', isLogged() ? 'compte.html' : 'onboarding.html');
  });

  // Connexion / création de compte → marque l'état + capture le nom du formulaire.
  document.querySelectorAll('[data-login]').forEach(function (el) {
    el.addEventListener('click', function () {
      try {
        localStorage.setItem(KEY, '1');
        var fn = document.getElementById('su-firstname');
        var ln = document.getElementById('su-lastname');
        var em = document.getElementById('su-email');
        if (fn && fn.value.trim()) localStorage.setItem('mc_firstname', fn.value.trim());
        if (ln && ln.value.trim()) localStorage.setItem('mc_lastname', ln.value.trim());
        if (em && em.value.trim()) localStorage.setItem('mc_email', em.value.trim());
      } catch (e) {}
    });
  });

  // Page compte : liste des utilisateurs bloqués (avec « Débloquer »).
  (function () {
    var list = document.querySelector('[data-blocked-list]');
    if (!list) return;
    var empty = document.querySelector('[data-blocked-empty]');
    var lng = 'fr'; try { lng = localStorage.getItem('mc_lang') || 'fr'; } catch (e) {}
    var UNBLOCK = { fr: 'Débloquer', en: 'Unblock', it: 'Sblocca' }[lng] || 'Débloquer';
    var USER = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>';
    function get() { try { return JSON.parse(localStorage.getItem('mc_blocked') || '[]'); } catch (e) { return []; } }
    function set(a) { try { localStorage.setItem('mc_blocked', JSON.stringify(a)); } catch (e) {} }
    function render() {
      var arr = get();
      list.innerHTML = '';
      if (empty) empty.hidden = arr.length > 0;
      arr.forEach(function (name) {
        var li = document.createElement('li');
        li.className = 'mc-ac-blocked__item';
        li.innerHTML = '<span class="mc-ac-blocked__av">' + USER + '</span>' +
          '<span class="mc-ac-blocked__name"></span>' +
          '<button type="button" class="mc-ac-blocked__btn">' + UNBLOCK + '</button>';
        li.querySelector('.mc-ac-blocked__name').textContent = name;
        li.querySelector('.mc-ac-blocked__btn').addEventListener('click', function () {
          set(get().filter(function (n) { return n !== name; }));
          render();
        });
        list.appendChild(li);
      });
    }
    render();
  })();

  // Page compte : affiche le nom/email saisis à l'inscription, s'ils existent.
  (function () {
    var nameEl = document.querySelector('[data-profile-name]');
    if (!nameEl) return;
    try {
      var fn = localStorage.getItem('mc_firstname') || '';
      var ln = localStorage.getItem('mc_lastname') || '';
      var em = localStorage.getItem('mc_email');
      var full = (fn + ' ' + ln).trim();
      if (full) nameEl.textContent = full;
      var emailEl = document.querySelector('[data-profile-email]');
      if (emailEl && em) emailEl.textContent = em;
    } catch (e) {}
  })();

  // Déconnexion → efface l'état avant de naviguer.
  document.querySelectorAll('[data-logout]').forEach(function (el) {
    el.addEventListener('click', function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
    });
  });

  /* ---------------------------------------------------------------
     Menu mobile (hamburger + drawer). Injecté ici pour rester DRY :
     un seul source pour toutes les pages. Visible uniquement < 680px
     (piloté par le CSS). Toggle JS (ouvre/ferme), sans dépendance.
     --------------------------------------------------------------- */
  (function buildDrawer() {
    var nav = document.querySelector('.mc-nav');
    if (!nav) return;
    var actions = nav.querySelector('.mc-nav__actions');
    if (!actions || actions.querySelector('.mc-nav__burger')) return;

    // Bouton hamburger
    var burger = document.createElement('button');
    burger.type = 'button';
    burger.className = 'mc-nav__burger';
    burger.setAttribute('aria-label', 'Ouvrir le menu');
    burger.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    actions.appendChild(burger);

    // Liens du menu
    var links = [
      ['index.html', 'Accueil'],
      ['programme.html', 'Programme'],
      ['caffe26.html', 'CAFFÈ26'],
      ['carte.html', 'Carte interactive']
    ];
    var here = location.pathname.split('/').pop() || 'index.html';
    if (here === '') here = 'index.html';

    var linksHtml = links.map(function (l) {
      var cur = l[0] === here ? ' aria-current="page"' : '';
      return '<a href="' + l[0] + '"' + cur + '><span class="mc-drawer__label">' + l[1] + '</span></a>';
    }).join('');

    var footHtml = isLogged()
      ? '<a class="mc-drawer__login" href="compte.html">Mon espace</a>'
        + '<a class="mc-drawer__signup" data-logout href="onboarding.html"><span class="mc-grad-text">Se déconnecter</span></a>'
      : '<a class="mc-drawer__login" href="onboarding.html">Se connecter</a>'
        + '<a class="mc-drawer__signup" href="onboarding.html#ob-signup"><span class="mc-grad-text">Créer un compte</span></a>';

    // Sélecteur de langue (sur mobile le drapeau de la barre est masqué ; on le
    // retrouve ici, sous forme de menu déroulant — exactement comme le desktop —
    // pour laisser « La Mia Città » entier dans le header).
    var LANG_FLAGS = (window.mcI18n && window.mcI18n.FLAGS) || { fr: 'assets/img/flag-fr.svg', en: 'assets/img/flag-gb.svg', it: 'assets/img/flag-it.svg' };
    var LANG_LABELS = (window.mcI18n && window.mcI18n.LABELS) || { fr: 'Français', en: 'English', it: 'Italiano' };
    var LANG_ORDER = (window.mcI18n && window.mcI18n.ORDER) || ['fr', 'en', 'it'];
    var curLang = (function () { try { return localStorage.getItem('mc_lang') || 'fr'; } catch (e) { return 'fr'; } })();
    var chevron = '<svg class="mc-drawer__langchev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
    var langHtml = '<div class="mc-drawer__lang">'
      + '<span class="mc-drawer__langlabel">Langue</span>'
      + '<details class="mc-drawer__langsel">'
      +   '<summary class="mc-drawer__langsummary">'
      +     '<img src="' + LANG_FLAGS[curLang] + '" alt="" class="mc-drawer__langflag" />'
      +     '<span class="mc-drawer__langcur">' + LANG_LABELS[curLang] + '</span>' + chevron
      +   '</summary>'
      +   '<div class="mc-drawer__langmenu" role="menu">'
      +   LANG_ORDER.map(function (l) {
            return '<button type="button" class="mc-drawer__langopt' + (l === curLang ? ' is-active' : '')
              + '" role="menuitemradio" aria-checked="' + (l === curLang) + '" data-lang="' + l + '">'
              + '<img src="' + LANG_FLAGS[l] + '" alt="" class="mc-drawer__langflag" />' + LANG_LABELS[l] + '</button>';
          }).join('')
      +   '</div>'
      + '</details></div>';

    var scrim = document.createElement('div');
    scrim.className = 'mc-drawer-scrim';

    var drawer = document.createElement('aside');
    drawer.className = 'mc-drawer';
    drawer.setAttribute('aria-label', 'Menu de navigation');
    drawer.innerHTML =
      '<div class="mc-drawer__head"><span class="mc-drawer__brand">La Mia Città</span>'
      + '<button type="button" class="mc-drawer__close" aria-label="Fermer le menu">✕</button></div>'
      + '<hr class="mc-drawer__rule" />'
      + '<nav class="mc-drawer__links">' + linksHtml + '</nav>'
      + langHtml
      + '<div class="mc-drawer__foot">' + footHtml + '</div>';

    document.body.appendChild(scrim);
    document.body.appendChild(drawer);

    // Traduit le menu injecté (liens, « Langue »…) dans la langue courante, puis
    // restaure les noms de langues en autonyme (Français/English/Italiano) pour
    // le sélecteur — ils ne doivent pas être traduits.
    if (window.mcI18n && typeof window.mcI18n.apply === 'function') {
      window.mcI18n.apply(drawer);
      var cur = drawer.querySelector('.mc-drawer__langcur');
      if (cur) cur.textContent = LANG_LABELS[curLang];
      drawer.querySelectorAll('.mc-drawer__langopt').forEach(function (opt) {
        var l = opt.getAttribute('data-lang');
        var img = opt.querySelector('img');
        opt.textContent = ''; if (img) opt.appendChild(img);
        opt.appendChild(document.createTextNode(LANG_LABELS[l]));
      });
    }

    function open() { document.body.classList.add('mc-drawer-open'); }
    function close() { document.body.classList.remove('mc-drawer-open'); }
    burger.addEventListener('click', open);
    scrim.addEventListener('click', close);
    drawer.querySelector('.mc-drawer__close').addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    // Déconnexion depuis le drawer
    drawer.querySelectorAll('[data-logout]').forEach(function (el) {
      el.addEventListener('click', function () { try { localStorage.removeItem(KEY); } catch (e) {} });
    });

    // Changement de langue depuis le drawer → on stocke et on recharge la
    // page courante (pas de redirection vers l'accueil).
    drawer.querySelectorAll('.mc-drawer__langopt').forEach(function (opt) {
      opt.addEventListener('click', function () {
        var l = opt.getAttribute('data-lang');
        try { localStorage.setItem('mc_lang', l); } catch (e) {}
        location.reload();
      });
    });
  })();
})();
