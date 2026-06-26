# La Mia Città

**Application compagnon (maquette) pour les Jeux Olympiques d'hiver Milano Cortina 2026.**

Vivez les Jeux où que vous soyez : watchparties, forum communautaire (CAFFÈ26),
carte interactive des sites, calendrier des épreuves et espace personnel.
Site vitrine multi-pages, **100 % statique** (HTML / CSS / JavaScript vanilla),
sans framework ni étape de build.

---

## ✨ Fonctionnalités

- **Multilingue** FR / EN / IT (sélecteur par drapeau, traduction à la volée).
- **Carte interactive** plein écran avec zoom / déplacement (molette, pincement,
  boutons) et **vue 360°** immersive.
- **Watchparties** publiques et privées (lecteur vidéo, chat, invitations).
- **CAFFÈ26** : forum filtrable par discipline, modération (signaler / bloquer).
- **Programme** : calendrier des épreuves filtrable par sport, site et date.
- **Compte** (démo) : inscription / connexion factices via `localStorage`,
  favoris, badges, utilisateurs bloqués.
- **Responsive** complet (menu hamburger, mises en page adaptatives).
- **Design System** documenté (`design-system.html`) + page **Crédits**.

---

## 🗂 Structure

```
.
├── index.html              # Landing (héro vidéo)
├── caffe26.html            # CAFFÈ26 — forum & watchparties
├── carte.html              # Carte interactive (zoom/pan) + vue 360°
├── programme.html          # Calendrier des épreuves (filtres)
├── watchparty.html         # Watchparty publique
├── watchparty-privee.html  # Watchparty privée (invitations)
├── direct.html             # Direct plein écran
├── compte.html             # Espace personnel
├── onboarding.html         # Inscription / connexion
├── credits.html            # Crédits
├── design-system.html      # Design System (couleurs, typo, espacements…)
├── css/
│   └── styles.css          # Feuille de style unique (+ règles d'impression)
└── assets/
    ├── i18n.js             # Internationalisation FR/EN/IT
    ├── auth.js             # Compte factice + menu mobile (drawer)
    ├── map.js              # Zoom / déplacement de la carte
    ├── player.js           # Lecteur vidéo (pause, plein écran)
    ├── comments.js         # Modération des commentaires
    ├── filters.js          # Filtres du programme
    ├── confetti.js         # Effet confettis (vue 360°)
    ├── img/                # Images, icônes SVG, drapeaux, photos
    ├── fonts/              # Police Alio Text
    ├── hero-web.mp4        # Vidéo héro (optimisée web)
    └── placeholder-web.mp4 # Vidéo des lecteurs (optimisée web)
```

---

## 🚀 Lancer en local

Aucune installation requise — il suffit d'un petit serveur statique (recommandé
plutôt que d'ouvrir le fichier directement, pour que **les vidéos** se lisent
correctement, car elles ont besoin du support des requêtes de plage HTTP).

Au choix :

```bash
# Avec Node (npx)
npx serve .

# ou avec Python 3
python -m http.server 8080
```

Puis ouvrir `http://localhost:8080`. (Sinon, l'extension **Live Server** de
VS Code fait très bien l'affaire.)

---

## 🌍 Mise en ligne (Infomaniak)

Le site étant statique, il suffit de déposer les fichiers à la racine web du
domaine.

1. Dans le **Manager Infomaniak** → *Hébergement Web* → récupère les
   identifiants **FTP/SFTP** (ou active l'accès **SSH**).
2. Connecte-toi avec **FileZilla** (SFTP) et place le contenu du dépôt dans le
   dossier web du site (généralement `sites/<ton-domaine>/`).
3. Vérifie que **`index.html` est à la racine** de ce dossier.
4. **HTTPS** : le certificat Let's Encrypt est fourni et activé automatiquement
   par Infomaniak.

> La vidéo du héro fonctionne directement : Apache/Nginx gèrent nativement les
> requêtes de plage et le type `video/mp4`.

> **À ne pas envoyer en ligne** : `dist/`, `*.zip`, et les exports du Design
> System (déjà exclus par `.gitignore`).

---

## 🛠 Stack

- HTML5 sémantique, CSS moderne (variables, `clamp()`, grid, `aspect-ratio`).
- JavaScript **vanilla**, sans dépendance ni build.
- Polices : **Alio Text** (locale) et **Lexend** (Google Fonts).
- État persistant via `localStorage` (langue, compte, favoris, utilisateurs bloqués).

---

## 👤 Crédits

Conçu et réalisé par **Mellony Veyre** — direction artistique, design UX/UI,
identité visuelle et intégration front-end. Voir [`credits.html`](credits.html).

## ⚖️ Mentions

Projet de **démonstration** réalisé à des fins de présentation. **Non affilié**
au Comité International Olympique ni à Milano Cortina 2026. Les marques,
emblèmes et visuels olympiques appartiennent à leurs détenteurs respectifs.

© 2026 Mellony Veyre.
