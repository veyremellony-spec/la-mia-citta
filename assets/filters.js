/* Filtrage des épreuves (programme.html) — sans dépendance.
   Les filtres sports/sites cochent des options ; « Appliquer » filtre la liste.
   Le calendrier sélectionne une date. Le matching se fait sur le texte des cartes
   (nom de l'épreuve + métadonnées), donc aucune donnée dupliquée. */
(function () {
  var day = document.querySelector('.mc-pr-day');
  if (!day) return;

  var dayDate = day.getAttribute('data-date');            // "2026-02-06"
  var events = [].slice.call(day.querySelectorAll('.mc-pr-ev'));
  var slots = [].slice.call(day.querySelectorAll('.mc-pr-slot'));
  var empty = day.querySelector('.mc-pr-empty');
  var sub = day.querySelector('.mc-pr-day__sub');
  if (sub) sub.setAttribute('data-default', sub.textContent);

  var state = { sport: [], site: [], date: null };

  function labelOf(input) { return input.parentNode.textContent.trim(); }

  /* Cohérence des cases « Tous » ↔ options individuelles */
  [].forEach.call(document.querySelectorAll('.mc-filter[data-group]'), function (det) {
    var all = det.querySelector('.mc-filter__opt--all input');
    var items = [].slice.call(det.querySelectorAll('.mc-filter__opt:not(.mc-filter__opt--all) input'));
    if (!all) return;
    all.addEventListener('change', function () {
      if (all.checked) items.forEach(function (i) { i.checked = false; });
      else if (!items.some(function (i) { return i.checked; })) all.checked = true;
    });
    items.forEach(function (it) {
      it.addEventListener('change', function () {
        if (it.checked) all.checked = false;
        if (!items.some(function (i) { return i.checked; })) all.checked = true;
      });
    });
  });

  function applyGroup(det) {
    var group = det.getAttribute('data-group');           // "sport" | "site"
    var items = [].slice.call(det.querySelectorAll('.mc-filter__opt:not(.mc-filter__opt--all) input'));
    var chosen = items.filter(function (i) { return i.checked; });
    state[group] = chosen.map(function (i) { return (i.value || '').toLowerCase(); });

    var span = det.querySelector('.mc-filter__btn > span');
    var allLabel = group === 'sport' ? 'Tous les sports' : 'Tous les sites';
    if (!span) return;
    if (chosen.length === 0) span.textContent = allLabel;
    else if (chosen.length === 1) span.textContent = labelOf(chosen[0]);
    else span.textContent = chosen.length + (group === 'sport' ? ' sports' : ' sites');
  }

  function matches(ev) {
    var name = (ev.querySelector('.mc-pr-ev__name').textContent || '').toLowerCase();
    var meta = (ev.querySelector('.mc-pr-ev__meta').textContent || '').toLowerCase();
    var okSport = state.sport.length === 0 || state.sport.some(function (s) { return name.indexOf(s) >= 0; });
    var okSite = state.site.length === 0 || state.site.some(function (s) { return meta.indexOf(s) >= 0; });
    var okDate = !state.date || state.date === dayDate;
    return okSport && okSite && okDate;
  }

  function render() {
    var visible = 0;
    events.forEach(function (ev) { var m = matches(ev); ev.hidden = !m; if (m) visible++; });

    // Masque les en-têtes de créneau (MATIN/APRÈS-MIDI/SOIRÉE) sans épreuve visible
    slots.forEach(function (slot) {
      var n = 0, el = slot.nextElementSibling;
      while (el && !el.classList.contains('mc-pr-slot')) {
        if (el.classList.contains('mc-pr-ev') && !el.hidden) n++;
        el = el.nextElementSibling;
      }
      slot.hidden = n === 0;
    });

    if (empty) empty.hidden = visible > 0;
    if (sub) {
      var filtered = state.sport.length || state.site.length || state.date;
      sub.textContent = filtered
        ? (visible + (visible > 1 ? ' épreuves affichées' : ' épreuve affichée'))
        : sub.getAttribute('data-default');
    }
  }

  /* Boutons « Appliquer » */
  [].forEach.call(document.querySelectorAll('.mc-filter[data-group]'), function (det) {
    var btn = det.querySelector('.mc-filter__apply');
    if (btn) btn.addEventListener('click', function () { applyGroup(det); det.open = false; render(); });
  });

  /* Calendrier : clic sur un jour actif = sélection d'une date */
  var cal = document.querySelector('.mc-filter[data-cal]');
  if (cal) {
    var days = [].slice.call(cal.querySelectorAll('.mc-cal__day:not(.mc-cal__day--empty):not(.mc-cal__day--muted)'));
    days.forEach(function (d) {
      d.addEventListener('click', function () {
        days.forEach(function (x) { x.classList.remove('mc-cal__day--sel'); x.classList.add('mc-cal__day--range'); });
        d.classList.remove('mc-cal__day--range');
        d.classList.add('mc-cal__day--sel');
        var num = parseInt(d.textContent, 10);
        state.date = '2026-02-' + (num < 10 ? '0' : '') + num;
        var span = cal.querySelector('.mc-filter__btn > span');
        if (span) span.textContent = num + ' Fév 2026';
        cal.open = false;
        render();
      });
    });
  }
})();
