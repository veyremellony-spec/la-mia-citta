/* Internationalisation FR ↔ EN ↔ IT (démo statique).
   Clic sur le drapeau de la nav → cycle Français → English → Italiano → Français.
   La langue est mémorisée (localStorage mc_lang). Le FR est la version d'origine du
   HTML ; pour EN/IT on remplace le texte des nœuds via un dictionnaire FR→[EN, IT].
   Les clés et le texte des pages sont normalisés (apostrophes droites) avant lookup. */
(function () {
  var KEY = 'mc_lang';
  var ORDER = ['fr', 'en', 'it'];
  var LABELS = { fr: 'Français', en: 'English', it: 'Italiano' };
  var FLAGS = { fr: 'assets/img/flag-fr.svg', en: 'assets/img/flag-gb.svg', it: 'assets/img/flag-it.svg' };

  function getLang() { try { return localStorage.getItem(KEY) || 'fr'; } catch (e) { return 'fr'; } }
  function setLang(l) { try { localStorage.setItem(KEY, l); } catch (e) {} }
  function norm(s) { return s.replace(/[’ʼ]/g, "'"); }

  // FR → [EN, IT]
  var DICT = {
    // ----- Navigation / footer / menu -----
    'Programme': ['Schedule', 'Programma'], 'Carte': ['Map', 'Mappa'],
    'Carte interactive': ['Interactive map', 'Mappa interattiva'], 'Carte Interactive': ['Interactive Map', 'Mappa Interattiva'],
    'Accueil': ['Home', 'Home'], 'Fonctionnalités': ['Features', 'Funzionalità'], 'À propos': ['About', 'Chi siamo'],
    'Partenaires': ['Partners', 'Partner'], 'Crédits': ['Credits', 'Crediti'], 'Mentions Légales': ['Legal Notice', 'Note legali'],
    'Conception & réalisation': ['Design & development', 'Progettazione & realizzazione'],
    'Ressources & outils': ['Resources & tools', 'Risorse & strumenti'], 'Mentions': ['Notices', 'Note'],
    'Accessibilité': ['Accessibility', 'Accessibilità'], 'Politique des cookies': ['Cookie Policy', 'Politica dei cookie'],
    'Paramètres de cookies': ['Cookie Settings', 'Impostazioni cookie'],
    'Politique de Confidentialité': ['Privacy Policy', 'Informativa sulla privacy'],
    "Conditions d'Utilisations": ['Terms of Use', 'Termini di utilizzo'],
    "L'application compagnon officielle des Jeux Olympiques d'hiver Milano Cortina 2026.":
      ['The official companion app of the Milano Cortina 2026 Olympic Winter Games.',
       "L'app companion ufficiale dei Giochi Olimpici Invernali di Milano Cortina 2026."],
    'Se connecter': ['Sign in', 'Accedi'], 'Créer un compte': ['Create account', 'Crea un account'],
    'Créer un compte gratuitement': ['Create a free account', 'Crea un account gratis'],
    'Mon espace': ['My space', 'Il mio spazio'], 'Se déconnecter': ['Sign out', 'Esci'],

    // ----- Accueil -----
    'Vivez Milano Cortina': ['Experience Milano Cortina', 'Vivi Milano Cortina'],
    'Où que vous soyez': ['Wherever you are', 'Ovunque tu sia'],
    'Regardez les épreuves en watchparty, échangez sur les forums, vibrez avec la communauté Milano Cortina 2026.':
      ['Watch the events in watchparties, chat on the forums, and feel the thrill with the Milano Cortina 2026 community.',
       'Guarda le gare in watchparty, scambia sui forum, vibra con la community di Milano Cortina 2026.'],
    'Rejoindre le Village': ['Join the Village', 'Entra nel Villaggio'], 'Le CAFFÈ26': ['The CAFFÈ26', 'Il CAFFÈ26'],
    'Rejoignez des millions de fans du monde entier. Participez à des watchparties virtuelles, partagez vos réactions et revivez les meilleurs moments ensemble.':
      ['Join millions of fans worldwide. Take part in virtual watchparties, share your reactions and relive the best moments together.',
       'Unisciti a milioni di fan da tutto il mondo. Partecipa a watchparty virtuali, condividi le tue reazioni e rivivi insieme i momenti migliori.'],
    'Watchparties Virtuelles': ['Virtual Watchparties', 'Watchparty Virtuali'],
    'Regardez les épreuves en direct avec des fans du monde entier':
      ['Watch events live with fans from around the world', 'Guarda le gare in diretta con fan di tutto il mondo'],
    'Réactions en Live': ['Live Reactions', 'Reazioni in Diretta'],
    'Partagez vos émotions instantanément avec la communauté':
      ['Share your emotions instantly with the community', 'Condividi le tue emozioni istantaneamente con la community'],
    'Rediffusions commentées': ['Commented Replays', 'Repliche commentate'],
    'Revivez les moments forts avec les commentaires de la communauté':
      ["Relive the highlights with the community commentary", 'Rivivi i momenti salienti con i commenti della community'],
    'Rejoindre le CAFFÈ26': ['Join the CAFFÈ26', 'Entra nel CAFFÈ26'],
    'Quelle descente incroyable ! Les derniers virages étaient à couper le souffle !':
      ['What an incredible run! The final turns were breathtaking!', 'Che discesa incredibile! Le ultime curve erano mozzafiato!'],
    "Forza Italia ! Médaille d'or pour notre équipe !":
      ['Forza Italia! Gold medal for our team!', "Forza Italia! Medaglia d'oro per la nostra squadra!"],
    "Je regarde depuis Toronto ! L'ambiance ici est électrique !":
      ['Watching from Toronto! The atmosphere here is electric!', "Sto guardando da Toronto! L'atmosfera qui è elettrica!"],
    'Traduire': ['Translate', 'Traduci'], 'Traduction activée': ['Translation on', 'Traduzione attiva'],
    'Il y a 2 minutes': ['2 minutes ago', '2 minuti fa'], 'Il y a 5 minutes': ['5 minutes ago', '5 minuti fa'],
    'Il y a 8 minutes': ['8 minutes ago', '8 minuti fa'], 'Il y a 12 minutes': ['12 minutes ago', '12 minuti fa'],
    'Il y a 18 minutes': ['18 minutes ago', '18 minuti fa'], 'Il y a 25 minutes': ['25 minutes ago', '25 minuti fa'],
    'Explorez Milano Cortina': ['Explore Milano Cortina', 'Esplora Milano Cortina'],
    'Explorez la carte interactive': ['Explore the interactive map', 'Esplora la mappa interattiva'],
    'Anecdotes & Fun Facts': ['Trivia & Fun Facts', 'Curiosità & Fun Facts'],
    'Secrets et curiosités de chaque site': ['Secrets and curiosities of each venue', 'Segreti e curiosità di ogni sede'],
    'Itinéraires Virtuels': ['Virtual Tours', 'Itinerari Virtuali'],
    'Explorez les lieux en 360°': ['Explore the venues in 360°', 'Esplora i luoghi a 360°'],
    'La Mia Città, votre maison le temps des Jeux': ['La Mia Città, your home during the Games', 'La Mia Città, la tua casa durante i Giochi'],
    "Du 6 au 22 février 2026, Milan et Cortina d'Ampezzo accueillent le monde. Mais les Jeux n'appartiennent pas qu'à ceux qui ont un billet.":
      ["From 6 to 22 February 2026, Milan and Cortina d'Ampezzo welcome the world. But the Games don't belong only to those with a ticket.",
       "Dal 6 al 22 febbraio 2026, Milano e Cortina d'Ampezzo accolgono il mondo. Ma i Giochi non appartengono solo a chi ha un biglietto."],
    "La Mia Città est une application compagnon conçue pour celles et ceux qui suivent les JO depuis leur salon, leur bureau, ou n'importe où ailleurs. Chaque descente, chaque triple axel, chaque médaille vécus avec la même intensité que dans les tribunes, depuis là où tu es.":
      ["La Mia Città is a companion app for those following the Games from their living room, office, or anywhere else. Every downhill, every triple axel, every medal lived with the same intensity as in the stands, from wherever you are.",
       "La Mia Città è un'app companion pensata per chi segue le Olimpiadi dal salotto, dall'ufficio o da qualsiasi altro luogo. Ogni discesa, ogni triplo axel, ogni medaglia vissuti con la stessa intensità delle tribune, da dove ti trovi."],
    '90+ pays dans la communauté': ['90+ countries in the community', '90+ paesi nella community'],
    '1 village, partout dans le monde': ['1 village, all around the world', '1 villaggio, in tutto il mondo'],
    '15 disciplines partagées en direct': ['15 disciplines shared live', '15 discipline condivise in diretta'],
    'Prêts à vivre Milano Cortina ?': ['Ready to experience Milano Cortina?', 'Pronti a vivere Milano Cortina?'],
    "Téléchargez La Mia Città et rejoignez des millions de fans du monde entier. L'émotion olympique accessible à tous, où que vous soyez.":
      ['Download La Mia Città and join millions of fans worldwide. Olympic emotion for everyone, wherever you are.',
       "Scarica La Mia Città e unisciti a milioni di fan da tutto il mondo. L'emozione olimpica accessibile a tutti, ovunque tu sia."],
    'Télécharger sur': ['Download on', 'Scarica su'],
    'Utilisateurs actifs': ['Active users', 'Utenti attivi'], 'Note moyenne': ['Average rating', 'Valutazione media'],
    'Pays représentés': ['Countries represented', 'Paesi rappresentati'],
    'Anecdote': ['Trivia', 'Curiosità'], 'Le saviez-vous ?': ['Did you know?', 'Lo sapevi?'],

    // ----- CAFFÈ26 -----
    'Vivez les Jeux ensemble, de partout.': ['Live the Games together, from anywhere.', 'Vivi i Giochi insieme, ovunque.'],
    "Le coin où les fans du monde entier refont les Jeux. Regardez en direct, réagissez en temps réel, débattez avec des milliers de supporters de 150 nations. Ici, pas besoin de billet pour vivre l'émotion.":
      ['The place where fans from all over the world relive the Games. Watch live, react in real time, debate with thousands of supporters from 150 nations. Here, no ticket needed to feel the emotion.',
       "Il posto dove i fan di tutto il mondo rivivono i Giochi. Guarda in diretta, reagisci in tempo reale, discuti con migliaia di tifosi di 150 nazioni. Qui non serve un biglietto per vivere l'emozione."],
    'Fans connectés': ['Connected fans', 'Fan connessi'], 'Watchparties': ['Watchparties', 'Watchparty'], 'live': ['live', 'live'],
    'Nations': ['Nations', 'Nazioni'], 'représentées': ['represented', 'rappresentate'],
    'En ce moment': ['Right now', 'In questo momento'],
    'Hommes Équipes': ['Men Teams', 'Uomini Squadre'], 'Hommes Bob à 4': ['Men 4-Man Bob', 'Uomini Bob a 4'],
    'Descente Hommes': ['Men Downhill', 'Discesa Uomini'],
    'Rejoindre la Watchparty': ['Join the Watchparty', 'Entra nella Watchparty'], 'Accéder au direct': ['Watch live', 'Vai alla diretta'],
    'La Place Publique': ['The Public Square', 'La Piazza Pubblica'], 'Tout': ['All', 'Tutto'],
    'Ski alpin': ['Alpine skiing', 'Sci alpino'], 'Patinage Artistique': ['Figure skating', 'Pattinaggio artistico'],
    'Hockey': ['Hockey', 'Hockey'], 'Ski Alpin': ['Alpine Skiing', 'Sci Alpino'],
    "Mon cœur s'arrête à chaque virage sérieusement": ['My heart stops at every turn seriously', 'Il cuore mi si ferma a ogni curva sul serio'],
    'Watchparty & Rediffusions': ['Watchparty & Replays', 'Watchparty & Repliche'], 'Rediffusions': ['Replays', 'Repliche'],
    'Créer une Watchparty': ['Create a Watchparty', 'Crea una Watchparty'],
    'Invitez vos amis et regardez ensemble': ['Invite your friends and watch together', 'Invita i tuoi amici e guardate insieme'],
    'Choisissez une épreuve ou une rediffusion': ['Choose an event or a replay', 'Scegli una gara o una replica'],
    "Invitez jusqu'à 50 amis par lien ou pseudo": ['Invite up to 50 friends by link or username', 'Invita fino a 50 amici tramite link o nickname'],
    'Chattez et réagissez ensemble en temps réel': ['Chat and react together in real time', 'Chatta e reagisci insieme in tempo reale'],
    'Votre passeport olympique': ['Your Olympic passport', 'Il tuo passaporto olimpico'],
    "Connectez-vous ou créez un profil afin d'accéder à toutes les personnalisations du Village Digital !":
      ['Sign in or create a profile to access all the customizations of the Digital Village!',
       'Accedi o crea un profilo per accedere a tutte le personalizzazioni del Villaggio Digitale!'],
    'Créer mon profil →': ['Create my profile →', 'Crea il mio profilo →'],
    'Tendances de la Place Publique': ['Public Square Trends', 'Tendenze della Piazza Pubblica'],
    'Prochaines Watchparty': ['Upcoming Watchparties', 'Prossime Watchparty'], '↪ Rejoindre une party': ['↪ Join a party', '↪ Entra in una party'],
    'Sécurité': ['Safety', 'Sicurezza'], '⚑ Signaler un abus': ['⚑ Report abuse', '⚑ Segnala un abuso'],
    'Vous avez vu quelque chose de problématique dans le forum ou une watchparty ?':
      ['Did you see something problematic in the forum or a watchparty?', 'Hai visto qualcosa di problematico nel forum o in una watchparty?'],

    // ----- Programme -----
    'Calendrier des Épreuves': ['Events Calendar', 'Calendario delle Gare'], 'Épreuves': ['Events', 'Gare'],
    'Sports': ['Sports', 'Sport'], 'Médailles': ['Medals', 'Medaglie'],
    "Toutes les épreuves de Milano Cortina 2026, jour par jour. Repérez ce qui passe en direct, filtrez par sport ou par site, et rejoignez une watchparty pour vibrer à chaque finale avec d'autres passionnés.":
      ['All the events of Milano Cortina 2026, day by day. Spot what is live, filter by sport or venue, and join a watchparty to feel the thrill of every final with other fans.',
       "Tutte le gare di Milano Cortina 2026, giorno per giorno. Individua cosa è in diretta, filtra per sport o sede, e unisciti a una watchparty per vibrare a ogni finale con altri appassionati."],
    'Filtres :': ['Filters:', 'Filtri:'], 'Réinitialiser': ['Reset', 'Reimposta'],
    'Tous les sports': ['All sports', 'Tutti gli sport'], 'Tous les sites': ['All venues', 'Tutte le sedi'],
    'Sélectionner une période': ['Select a period', 'Seleziona un periodo'], 'Appliquer': ['Apply', 'Applica'], 'Sites': ['Venues', 'Sedi'],
    'Patinage artistique': ['Figure skating', 'Pattinaggio artistico'], 'Hockey sur glace': ['Ice hockey', 'Hockey su ghiaccio'],
    'Patinage vitesse': ['Speed skating', 'Pattinaggio di velocità'], 'Milan': ['Milan', 'Milano'],
    'Jeudi 6 Février 2026': ['Thursday 6 February 2026', 'Giovedì 6 Febbraio 2026'],
    '14 épreuves · 5 sports · 3 sites': ['14 events · 5 sports · 3 venues', '14 gare · 5 sport · 3 sedi'],
    'En direct : 2 épreuves': ['Live: 2 events', 'In diretta: 2 gare'],
    'MATIN': ['MORNING', 'MATTINA'], 'APRÈS-MIDI': ['AFTERNOON', 'POMERIGGIO'], 'SOIRÉE': ['EVENING', 'SERA'],
    'EN DIRECT': ['LIVE', 'IN DIRETTA'], 'Finale': ['Final', 'Finale'], 'Demi-finales': ['Semi-finals', 'Semifinali'],
    '○ À venir': ['○ Upcoming', '○ In arrivo'],
    'Ski Alpin (Descente Hommes)': ['Alpine Skiing (Men Downhill)', 'Sci Alpino (Discesa Uomini)'],
    'Biathlon (Relais Mixte 4×6km)': ['Biathlon (Mixed Relay 4×6km)', 'Biathlon (Staffetta Mista 4×6km)'],
    'Snowboard (Halfpipe Femmes)': ['Snowboard (Women Halfpipe)', 'Snowboard (Halfpipe Donne)'],
    'Patinage de Vitesse (500m Femmes)': ['Speed Skating (Women 500m)', 'Pattinaggio di Velocità (500m Donne)'],
    '78 athlètes': ['78 athletes', '78 atleti'], '20 équipes': ['20 teams', '20 squadre'],
    '32 athlètes': ['32 athletes', '32 atleti'], '16 athlètes': ['16 athletes', '16 atleti'],
    'Détails': ['Details', 'Dettagli'], 'Me rappeler': ['Remind me', 'Ricordamelo'],
    'Résumé du jour': ['Day summary', 'Riepilogo del giorno'], "Sites actifs aujourd'hui": ['Venues active today', 'Sedi attive oggi'],
    '6 épreuves': ['6 events', '6 gare'], '5 épreuves': ['5 events', '5 gare'], '3 épreuves': ['3 events', '3 gare'],
    'Voir la carte interactive': ['View interactive map', 'Vedi la mappa interattiva'],
    '46 utilisateurs regardent en ce moment': ['46 users watching right now', '46 utenti stanno guardando ora'],
    'Rejoindre une party': ['Join a party', 'Entra in una party'],
    'Aucune épreuve ne correspond à ces filtres.': ['No event matches these filters.', 'Nessuna gara corrisponde a questi filtri.'],

    // ----- Direct / Watchparty -----
    'Chat du direct': ['Live chat', 'Chat della diretta'], '847 en ligne': ['847 online', '847 online'],
    'Réagis en direct…': ['React live…', 'Reagisci in diretta…'],
    "Incroyable descente, il n'a fait aucune erreur !": ['Incredible run, he made no mistakes!', 'Discesa incredibile, non ha fatto errori!'],
    "Allez Pinturault !! 2e pour l'instant !!": ['Go Pinturault!! 2nd for now!!', 'Forza Pinturault!! 2° per ora!!'],
    'La piste est terrible ce matin': ['The course is brutal this morning', 'La pista è tremenda stamattina'],
    'Suivre': ['Follow', 'Segui'], 'Partager': ['Share', 'Condividi'],
    'Résultats en direct': ['Live results', 'Risultati in diretta'], 'Détails épreuve': ['Event details', 'Dettagli gara'],
    'Classement en temps réel': ['Live standings', 'Classifica in tempo reale'], 'en piste': ['on course', 'in pista'],

    // ----- Compte -----
    'Bienvenue aux Jeux Olympiques !': ['Welcome to the Olympic Games!', 'Benvenuto ai Giochi Olimpici!'],
    "Ton espace olympique personnel. Retrouve tes épreuves favorites, tes badges, tes collectibles et tes watchparties d'un seul coup d'œil.":
      ['Your personal Olympic space. Find your favorite events, badges, collectibles and watchparties at a glance.',
       "Il tuo spazio olimpico personale. Ritrova le tue gare preferite, i tuoi badge, i tuoi collectible e le tue watchparty con un solo sguardo."],
    'Nom prénom': ['Full name', 'Nome cognome'], 'ID Passport :': ['Passport ID:', 'ID Passaporto:'], 'Progression': ['Progress', 'Progressi'],
    'Niveau 4 (Aventurier)': ['Level 4 (Adventurer)', 'Livello 4 (Avventuriero)'], 'Statistiques': ['Statistics', 'Statistiche'],
    'Watchtime': ['Watchtime', 'Tempo di visione'], '12 heures': ['12 hours', '12 ore'], 'Epreuves': ['Events', 'Gare'],
    'Watchparty': ['Watchparty', 'Watchparty'], 'Collectibles': ['Collectibles', 'Collectible'], 'Favoris': ['Favorites', 'Preferiti'],
    'Notifications': ['Notifications', 'Notifiche'], 'Paramètres de notifications →': ['Notification settings →', 'Impostazioni notifiche →'],
    'Sécurité & RSE': ['Safety & CSR', 'Sicurezza & RSI'],
    'Utilisateurs bloqués': ['Blocked users', 'Utenti bloccati'], 'Aucun utilisateur bloqué.': ['No blocked users.', 'Nessun utente bloccato.'], '? Accessibilité': ['? Accessibility', '? Accessibilità'],
    "? Centre d'aide": ['? Help center', "? Centro assistenza"],
    'Points obtenus': ['Points earned', 'Punti ottenuti'], 'Comment obtenir des points ?': ['How to earn points?', 'Come ottenere punti?'],
    'Tu as exploré Anterselva sur la carte': ['You explored Anterselva on the map', 'Hai esplorato Anterselva sulla mappa'],
    'Tu as rejoint la watchparty Descente Hommes': ['You joined the Men Downhill watchparty', 'Sei entrato nella watchparty Discesa Uomini'],
    'Badge débloqué · Citoyen du Monde': ['Badge unlocked · Citizen of the World', 'Badge sbloccato · Cittadino del Mondo'],
    'Programme libre dames ajouté en favori': ['Women free skate added to favorites', 'Programma libero donne aggiunto ai preferiti'],
    'Badges obtenus': ['Badges earned', 'Badge ottenuti'], 'Voir tous les badges →': ['See all badges →', 'Vedi tutti i badge →'],
    'Citoyen du Monde': ['Citizen of the World', 'Cittadino del Mondo'], 'Ambassadeur': ['Ambassador', 'Ambasciatore'],
    'Collectibles du Village': ['Village Collectibles', 'Collectible del Villaggio'], 'Explorer la carte →': ['Explore the map →', 'Esplora la mappa →'],
    'Progression de la collection': ['Collection progress', 'Progressi della collezione'],
    'Les Dolomites': ['The Dolomites', 'Le Dolomiti'], 'La Capitale du Nord': ['The Northern Capital', 'La Capitale del Nord'],
    'Gagne des points en vivant les Jeux et grimpe les niveaux du Village Digital.':
      ['Earn points by living the Games and climb the levels of the Digital Village.',
       'Guadagna punti vivendo i Giochi e scala i livelli del Villaggio Digitale.'],
    'Explorer un lieu sur la carte interactive': ['Explore a place on the interactive map', 'Esplora un luogo sulla mappa interattiva'],
    'Rejoindre une watchparty en direct': ['Join a live watchparty', 'Entra in una watchparty in diretta'],
    'Collecter un souvenir du Village': ['Collect a Village souvenir', 'Colleziona un souvenir del Villaggio'],
    'Débloquer un badge': ['Unlock a badge', 'Sblocca un badge'], 'Ajouter une épreuve en favori': ['Add an event to favorites', 'Aggiungi una gara ai preferiti'],
    'Réagir sur la Place Publique': ['React on the Public Square', 'Reagisci sulla Piazza Pubblica'],
    "L'anecdote": ['The trivia', 'La curiosità'], 'Pourquoi ce badge ?': ['Why this badge?', 'Perché questo badge?'],

    // ----- Onboarding -----
    'Accès au Village Digital': ['Access to the Digital Village', 'Accesso al Villaggio Digitale'],
    "Rejoignez l'expérience olympique": ['Join the Olympic experience', "Unisciti all'esperienza olimpica"],
    "Connectez-vous pour accéder à vos favoris, notifications et à l'expérience personnalisée.":
      ['Sign in to access your favorites, notifications and personalized experience.',
       "Accedi per visualizzare i tuoi preferiti, le notifiche e l'esperienza personalizzata."],
    '→ Connexion': ['→ Sign in', '→ Accedi'], 'Bon retour !': ['Welcome back!', 'Bentornato!'],
    'Connectez-vous pour accéder à votre espace personnalisé.': ['Sign in to access your personalized space.', 'Accedi per accedere al tuo spazio personalizzato.'],
    'Continuer avec Google': ['Continue with Google', 'Continua con Google'], 'Continuer avec Apple': ['Continue with Apple', 'Continua con Apple'],
    'ou par email': ['or by email', 'o tramite email'], 'Adresse email': ['Email address', 'Indirizzo email'], 'Mot de passe': ['Password', 'Password'],
    'Se souvenir de moi': ['Remember me', 'Ricordami'], 'Mot de passe oublié ?': ['Forgot password?', 'Password dimenticata?'],
    '→ Se connecter': ['→ Sign in', '→ Accedi'], 'Pas encore de compte ?': ['No account yet?', 'Non hai ancora un account?'],
    'Favoris & notifications synchronisés': ['Synced favorites & notifications', 'Preferiti e notifiche sincronizzati'], 'Commencer →': ['Get started →', 'Inizia →'],
    "Accédez à l'expérience complète avec favoris, alertes et suivi personnalisé.":
      ['Access the full experience with favorites, alerts and personalized tracking.',
       'Accedi all\'esperienza completa con preferiti, avvisi e monitoraggio personalizzato.'],
    'ou remplissez le formulaire': ['or fill in the form', 'o compila il modulo'], 'Prénom': ['First name', 'Nome'], 'Nom': ['Last name', 'Cognome'],
    'Min. 8 caractères': ['Min. 8 characters', 'Min. 8 caratteri'], 'Force : Modérée': ['Strength: Moderate', 'Sicurezza: Media'],
    'Langue préférée': ['Preferred language', 'Lingua preferita'], 'Français': ['French', 'Francese'], 'Italiano': ['Italian', 'Italiano'], 'English': ['English', 'Inglese'],
    'Recevoir des notifications pour mes épreuves suivies et mes alertes personnalisées':
      ['Receive notifications for my followed events and personalized alerts',
       'Ricevi notifiche per le gare che seguo e i miei avvisi personalizzati'],
    "J'accepte les CGU et la Politique de confidentialité de La Mia Città":
      ['I accept the Terms and the Privacy Policy of La Mia Città', "Accetto i Termini e l'Informativa sulla privacy di La Mia Città"],
    'Créer mon compte': ['Create my account', 'Crea il mio account'],

    // ----- Carte / street view -----
    'Milan · La Capitale du Nord': ['Milan · The Northern Capital', 'Milano · La Capitale del Nord'],
    '✦ Collectible débloqué': ['✦ Collectible unlocked', '✦ Collectible sbloccato'],
    'Vue 360°': ['360° view', 'Vista 360°'], 'Réinitialiser le zoom': ['Reset zoom', 'Reimposta zoom'],

    // ----- Menu mobile (hamburger) -----
    'Langue': ['Language', 'Lingua'],

    // ----- Watchparty privée -----
    'Votre watchparty privée est prête': ['Your private watchparty is ready', 'La tua watchparty privata è pronta'],
    'Seuls les amis que vous invitez peuvent rejoindre ce salon.':
      ['Only the friends you invite can join this room.', 'Solo gli amici che inviti possono entrare in questa stanza.'],
    'SALON PRIVÉ': ['PRIVATE ROOM', 'STANZA PRIVATA'], 'Inviter': ['Invite', 'Invita'],
    'Inviter vos amis': ['Invite your friends', 'Invita i tuoi amici'],
    'Partagez ce lien, jusqu\'à 50 amis peuvent rejoindre votre salon.':
      ['Share this link, up to 50 friends can join your room.', 'Condividi questo link, fino a 50 amici possono entrare nella tua stanza.'],
    'Copier le lien': ['Copy link', 'Copia link'], 'Lien copié ✓': ['Link copied ✓', 'Link copiato ✓'],
    'Dans le salon ·': ['In the room ·', 'Nella stanza ·'], 'Hôte': ['Host', 'Host'],
    '● En ligne': ['● Online', '● Online'], '● Invitée': ['● Invited', '● Invitata'],
    'Chat du salon': ['Room chat', 'Chat della stanza'], '4 amis': ['4 friends', '4 amici'],
    'Écrire au salon…': ['Message the room…', 'Scrivi alla stanza…'],

    // ----- Overlays villes (chips + anecdotes) -----
    'Hockey sur glace': ['Ice hockey', 'Hockey su ghiaccio'], 'Descente alpine': ['Alpine downhill', 'Discesa libera'], 'Cérémonies': ['Ceremonies', 'Cerimonie'],
    'Cross-Country Ski': ['Cross-Country Skiing', 'Sci di fondo'], 'Saut de ski': ['Ski jumping', 'Salto con gli sci'], 'Biathlon': ['Biathlon', 'Biathlon'],
    'Snowboard': ['Snowboard', 'Snowboard'], 'Curling': ['Curling', 'Curling'], 'Bobsleigh': ['Bobsleigh', 'Bob'],
    "Les Milanais ont une obsession quasi-religieuse pour le spritz, mais ils le font avec du Campari (pas de l'Aperol, c'est une affaire sérieuse). Des bars du centre ont littéralement perdu des clients en leur servant la mauvaise version. Pour eux, c'est à peu près aussi grave qu'une faute de goût en fashion week.":
      ["Milanese people have an almost religious obsession with spritz, but they make it with Campari (not Aperol, it's a serious matter). Some downtown bars have literally lost customers for serving the wrong version. To them, it's about as serious as a fashion faux pas during fashion week.",
       "I milanesi hanno un'ossessione quasi religiosa per lo spritz, ma lo fanno col Campari (non l'Aperol, è una cosa seria). Alcuni bar del centro hanno letteralmente perso clienti servendo la versione sbagliata. Per loro è grave più o meno come una gaffe di stile durante la fashion week."],
    "Cortina d'Ampezzo se prend tellement au sérieux en tant que « reine des Dolomites » que la ville a officiellement refusé plusieurs fois d'être associée à des projets jugés « pas assez chics ». Il y a quelques années, une enseigne de fast-food a tenté de s'installer en centre-ville et s'est fait poliment mais fermement éconduire. À Cortina, même les chiens de traîneau portent probablement du Canada Goose.":
      ["Cortina d'Ampezzo takes its status as the 'queen of the Dolomites' so seriously that the town has officially refused several times to be associated with projects deemed 'not chic enough'. A few years ago, a fast-food chain tried to open downtown and was politely but firmly turned away. In Cortina, even the sled dogs probably wear Canada Goose.",
       "Cortina d'Ampezzo si prende così sul serio come « regina delle Dolomiti » che la città ha rifiutato ufficialmente più volte di essere associata a progetti giudicati « non abbastanza chic ». Qualche anno fa una catena di fast-food ha provato a aprire in centro ed è stata respinta con gentilezza ma fermezza. A Cortina, persino i cani da slitta probabilmente indossano Canada Goose."],
    "L'Arena di Verona, amphithéâtre romain construit en l'an 30 apr. J.-C., accueillera les cérémonies de remise des médailles des JO 2026. L'une des arènes antiques les mieux conservées au monde, elle peut accueillir jusqu'à 22 000 spectateurs sous les étoiles.":
      ['The Arena di Verona, a Roman amphitheatre built in 30 AD, will host the medal ceremonies of the 2026 Games. One of the best-preserved ancient arenas in the world, it can hold up to 22,000 spectators under the stars.',
       "L'Arena di Verona, anfiteatro romano costruito nel 30 d.C., ospiterà le cerimonie di premiazione dei Giochi 2026. Una delle arene antiche meglio conservate al mondo, può accogliere fino a 22.000 spettatori sotto le stelle."],
    "La Stelvio est l'une des pistes les plus redoutées du circuit : 3,3 km de descente, 1 000 m de dénivelé et des passages à 65 % de pente. Elle accueille la Coupe du Monde depuis 1985 et voit les athlètes dépasser les 130 km/h.":
      ['The Stelvio is one of the most feared courses on the circuit: 3.3 km of descent, 1,000 m of vertical drop and sections with a 65% gradient. It has hosted the World Cup since 1985 and sees athletes exceed 130 km/h.',
       "La Stelvio è una delle piste più temute del circuito: 3,3 km di discesa, 1.000 m di dislivello e tratti con pendenza del 65%. Ospita la Coppa del Mondo dal 1985 e vede gli atleti superare i 130 km/h."],
    "Tesero est un village de 3 000 habitants dans la vallée de Fiemme, et il a produit un nombre absurde de champions olympiques de ski de fond. Le ratio médailles/habitants y est tellement délirant que les habitants ont fini par appeler leur vallée « la vallée des champions » complètement sérieusement, sans ironie.":
      ["Tesero is a village of 3,000 people in the Fiemme valley, and it has produced an absurd number of Olympic cross-country champions. The medals-to-residents ratio is so insane that locals ended up calling their valley 'the valley of champions' completely seriously, without irony.",
       "Tesero è un paese di 3.000 abitanti nella val di Fiemme, e ha prodotto un numero assurdo di campioni olimpici di sci di fondo. Il rapporto medaglie/abitanti è così folle che gli abitanti hanno finito per chiamare la loro valle « la valle dei campioni » in modo del tutto serio, senza ironia."],
    "Predazzo abrite le musée géologique des Dolomites, parce que c'est ici qu'au XIXe siècle des géologues ont compris que les Dolomites étaient d'anciens récifs coralliens. Ce qui voulait dire que ces montagnes spectaculaires étaient autrefois au fond d'une mer tropicale. Personne n'a voulu les croire au départ.":
      ["Predazzo is home to the Dolomites geological museum, because it's here that, in the 19th century, geologists realised the Dolomites were ancient coral reefs. Which meant these spectacular mountains once lay at the bottom of a tropical sea. At first, nobody wanted to believe them.",
       "Predazzo ospita il museo geologico delle Dolomiti, perché è qui che nel XIX secolo i geologi capirono che le Dolomiti erano antiche barriere coralline. Il che significava che queste montagne spettacolari un tempo erano sul fondo di un mare tropicale. All'inizio nessuno volle crederci."],
    "Anterselva possède un lac glaciaire à 1 642 mètres d'altitude qui gèle si régulièrement et si parfaitement en hiver que les habitants s'en servaient comme route officielle pour traverser la vallée. Une route sur un lac, utilisée pendant des siècles, complètement normale pour eux.":
      ['Anterselva has a glacial lake at 1,642 metres that freezes so reliably and so perfectly in winter that locals used it as an official road to cross the valley. A road on a lake, used for centuries, completely normal to them.',
       "Anterselva ha un lago glaciale a 1.642 metri che gela così regolarmente e perfettamente in inverno che gli abitanti lo usavano come strada ufficiale per attraversare la valle. Una strada su un lago, usata per secoli, del tutto normale per loro."],
    "En hiver, Livigno est régulièrement coupée du reste de l'Italie par les chutes de neige, et pendant des siècles les habitants ont développé un dialecte local si particulier que les villages voisins avaient du mal à les comprendre. L'isolement forcé a littéralement fabriqué une langue à part entière dans une vallée de montagne.":
      ['In winter, Livigno is regularly cut off from the rest of Italy by snowfall, and over centuries its residents developed a local dialect so distinctive that neighbouring villages struggled to understand them. Forced isolation literally created a language of its own in a mountain valley.',
       "In inverno Livigno è regolarmente isolata dal resto dell'Italia dalle nevicate, e per secoli gli abitanti hanno sviluppato un dialetto locale così particolare che i paesi vicini faticavano a capirli. L'isolamento forzato ha letteralmente creato una lingua a sé in una valle di montagna."],
    'Le Cavalier de Bronze': ['The Bronze Horseman', 'Il Cavaliere di Bronzo'],
    "Au centre de la plus célèbre place de Milan, le premier roi de l'Italie unifiée veille sur le Duomo depuis son cheval de bronze. Sculpté par Ercole Rosa et inauguré en 1896, le monument fige Victor-Emmanuel II en plein élan, le regard tourné vers la cathédrale.":
      ["At the centre of Milan's most famous square, the first king of unified Italy watches over the Duomo from his bronze horse. Sculpted by Ercole Rosa and unveiled in 1896, the monument captures Victor Emmanuel II in full stride, his gaze turned toward the cathedral.",
       "Al centro della piazza più celebre di Milano, il primo re d'Italia unita veglia sul Duomo dal suo cavallo di bronzo. Scolpito da Ercole Rosa e inaugurato nel 1896, il monumento immortala Vittorio Emanuele II in pieno slancio, lo sguardo rivolto verso la cattedrale."]
  };

  // Index normalisé (apostrophes droites) → tableau [en, it]
  var MAP = {};
  for (var k in DICT) { if (DICT.hasOwnProperty(k)) MAP[norm(k)] = DICT[k]; }

  function translate(idx, root) {
    var walker = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentNode;
        if (p && (p.tagName === 'SCRIPT' || p.tagName === 'STYLE')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(function (node) {
      var t = node.nodeValue.trim();
      var arr = MAP[norm(t)];
      if (arr && arr[idx]) node.nodeValue = node.nodeValue.replace(t, arr[idx]);
    });
    (root || document).querySelectorAll('input[placeholder], textarea[placeholder]').forEach(function (el) {
      var arr = MAP[norm((el.getAttribute('placeholder') || '').trim())];
      if (arr && arr[idx]) el.setAttribute('placeholder', arr[idx]);
    });
  }

  var lang = getLang();
  var curIdx = lang === 'en' ? 0 : (lang === 'it' ? 1 : -1);
  if (lang === 'en') { translate(0); document.documentElement.lang = 'en'; }
  else if (lang === 'it') { translate(1); document.documentElement.lang = 'it'; }

  // Exposé pour traduire un sous-arbre injecté après coup (ex. le drawer mobile
  // construit par auth.js). FLAGS/LABELS servent au sélecteur de langue du menu.
  window.mcI18n = {
    lang: lang, idx: curIdx, FLAGS: FLAGS, LABELS: LABELS, ORDER: ORDER,
    apply: function (root) { if (curIdx >= 0) translate(curIdx, root); }
  };

  // Menu de langues : clic sur le drapeau → choisir directement FR / EN / IT.
  var flag = document.querySelector('.mc-nav__flag');
  if (flag) {
    flag.src = FLAGS[lang]; flag.alt = LABELS[lang];
    flag.style.cursor = 'pointer';
    flag.setAttribute('role', 'button');
    flag.setAttribute('aria-haspopup', 'true');
    flag.title = 'Choisir la langue';

    var wrap = document.createElement('span');
    wrap.className = 'mc-langwrap';
    flag.parentNode.insertBefore(wrap, flag);
    wrap.appendChild(flag);

    var menu = document.createElement('div');
    menu.className = 'mc-langmenu';
    menu.setAttribute('role', 'menu');
    menu.innerHTML = ORDER.map(function (l) {
      return '<button type="button" class="mc-langmenu__opt' + (l === lang ? ' is-active' : '') +
        '" role="menuitemradio" aria-checked="' + (l === lang) + '" data-lang="' + l + '">' +
        '<img src="' + FLAGS[l] + '" alt="" class="mc-langmenu__flag" />' + LABELS[l] + '</button>';
    }).join('');
    wrap.appendChild(menu);

    function close() { wrap.classList.remove('is-open'); flag.setAttribute('aria-expanded', 'false'); }
    flag.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      var open = wrap.classList.toggle('is-open');
      flag.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('.mc-langmenu__opt').forEach(function (opt) {
      opt.addEventListener('click', function () {
        var l = opt.getAttribute('data-lang');
        if (l === lang) { close(); return; }
        setLang(l); location.reload();
      });
    });
    document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }
})();
