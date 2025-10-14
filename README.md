# 🚀 NASA Explorer — Immersion spatiale en Vue 3

> Interface futuriste pour explorer les données publiques de la NASA, même lorsque les services officiels sont gelés. Approche « resilient-first » : expériences holographiques, fallback automatiques, et une migration complète vers Earthdata GIBS.

---

## 🛰️ Panorama du projet

| Module                | Contenu temps-réel / fallback | Détails clés |
|-----------------------|-------------------------------|--------------|
| **Home / MissionControl** | APOD, rovers, EPIC, NEO – badging “démo” si NASA down | Hero animé (anneau spectral, comète), HUD néon, scène 3D Three.js responsive |
| **APOD Gallery**      | Récupération par date, cache local, placeholders cosmique | Modale HD, favoris, label “Cache/Simulation” |
| **Mars Rover Photos** | Navigation sol/date, roue de secours multi-rovers | Retours auto de date (sol-1) + images fallback stylisées |
| **EPIC Earth**        | Mode NASA `natural`/`enhanced` + tuiles GIBS | Aperçu daté, lien direct archive |
| **NASA Image Library**| Recherche plein texte `images-api.nasa.gov` | Filtres media type, année, vignette responsive |
| **NEO Radar**         | Feed `feed/today` et range 7j | Badge « potentiellement dangereux » |
| **Space Weather**     | Timeline DONKI (CME, FLR, GST) | Typographie HUD, badges instruments |
| **Earth Imagery**     | Migration totale vers **GIBS WMTS** | MapLibre/Leaflet ready (tuiles XYZ) |
| **Favorites**         | Persistance locale + export JSON | UX hors-ligne |

---

## 🧭 Contexte NASA 2025

- **Shutdown fédéral** : depuis le 1er octobre 2025, plusieurs endpoints NASA (APOD, Mars Photos, DONKI, etc.) ne sont plus rafraîchis. Attendez-vous à des `5xx`, timeouts ou payloads vides. 
- **Earth API** : l’ancienne API `planetary/earth/*` est **archivée**. La NASA recommande désormais **Earthdata GIBS** (WMTS/XYZ, sans clé API).
- **Réponse du projet** :
  - Intercepteurs HTTP qui détectent l’échec, basculent le store `status` en mode démo, et servent des datasets simulés + placeholders XXL.
  - UX transparente : bandeau global, badges “Mode démo activé”, transitions warp, audio d’ambiance.
  - Cache local (IndexedDB/localStorage) pour APOD/Mars : restauration immédiate même hors-ligne.

---

## ⚙️ Stack & outils

- **Vue 3** (SFCs, `<script setup>`), **Vite**, **Pinia**, **Vue Router**
- **Tailwind CSS** + pipeline PostCSS
- **Three.js** pour la scène orbitale (MissionControl)
- **Axios** + client maison `withCache` + `fetchWithRetry` (timeouts, exponentiel backoff)
- **Assets** : shaders personnalisés, placeholders SVG (APOD/Mars/Earth), bruit procédural, grilles holographiques

---

## 🚨 Résilience & fallback

### 1. Stratégie APOD
```ts
const { data, fallback } = await getApod();
// fallback === false | "cache" | "simulation"
```
- `fetchWithRetry` (3 tentatives, timeout 8s, backoff x2).
- Cache local (`localStorage` / `withCache`) pour la dernière APOD valide.
- Placeholders `apod-fallback.svg` si aucune donnée n’est disponible.
- Badges "Simulation" + message UX.

### 2. Mars Rover Photos
- Descente automatique `earth_date - 1` si la date est vide.
- Fallback multi-rovers (`demoRoverPhotos`) illustré live.
- Paramètres conservés dans l’URL (sol, caméra, rover).

### 3. Earth Imagery → GIBS
- Tuiles WMTS/XYZ :
  ```text
  https://gibs-{a-c}.earthdata.nasa.gov/wmts/epsg3857/best/{LAYER}/default/{DATE}/{TILEMATRIXSET}/{Z}/{Y}/{X}.jpg
  ```
- Préconfiguré pour `VIIRS_SNPP_CorrectedReflectance_TrueColor` avec `GoogleMapsCompatible_Level9`.
- Date paramétrable (`default` = meilleure dispo). Env vars :
  ```env
  GIBS_LAYER=VIIRS_SNPP_CorrectedReflectance_TrueColor
  GIBS_DATE=default
  GIBS_TILEMATRIXSET=GoogleMapsCompatible_Level9
  ```

### 4. DONKI / NEO / EPIC
- Même pipeline `retry + fallback`.
- `demoNeoHistory` reconstitue un feed synthétique (7 jours) pour garder les graphes (sparkline) animés.

---

## 📁 Structure fonctionnelle
```
src/
├─ api/            # client axios + retries + normalisation NASA
├─ assets/         # placeholders SVG, logos, bruit
├─ components/
│  ├─ mission/     # MissionControlScene (Three.js + HUD)
│  ├─ home/        # GuidedTour, ObservatoryConfigurator
│  └─ ui/          # LoadingSpinner, ErrorState, etc.
├─ layouts/        # MainLayout (bandeau offline + audio toggle)
├─ pages/          # Vue pages (Home, APOD, Mars, NEO...)
├─ stores/         # Pinia (favorites, status, observatory)
└─ style.css       # Tokens globaux, animations, utilitaires
```

---

## 🔌 Configuration & secrets

Créer `.env.local` :
```env
VITE_NASA_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_GIBS_LAYER=VIIRS_SNPP_CorrectedReflectance_TrueColor
VITE_GIBS_DATE=default
VITE_GIBS_TILEMATRIXSET=GoogleMapsCompatible_Level9
```

Options supplémentaires :
- `VITE_NASA_API_BASE` (par défaut `https://api.nasa.gov`)
- `VITE_NASA_IMAGES_BASE` (`https://images-api.nasa.gov`)
- `VITE_DEMO_MODE=true` force le mode hors-ligne.

---

## 🧪 Tests & QA

1. `npm run dev` → vérifier le mode live (si clé NASA valide).
2. Simuler une coupure réseau (`offline` sous DevTools) → bandeau “Service NASA en maintenance” + fallbacks visuels.
3. MissionControl : vérifier la bascule audio, la rotation du globe, et le zoom responsive (desktop > 780px).
4. Pages APOD/Mars : vérifier l’apparition du badge `Simulation` + placeholders.

_(Suites recommandées : tests unitaires sur `withRetry`, store `status`; tests e2e sur la navigation fallback.)_

---

## 🧊 Style & expérience

- **Nav** : liens uppercase microtypés, underline néon animé, transition magnétique sur le logo.
- **Hero** : anneau spectral rotatif, comète animée, grille conique.
- **MissionControl** : scène 3D orbites, glow volumetric, shader océan.
- **Placeholder** : illustrations SVG originales (APOD, Mars, Earth) coordonnées à la charte.
- **Audio** : fond sonore synthétisé (drone + bruit cabine + bips) activable/désactivable via le bouton global.

---

## 🔁 Scripts
```bash
npm install         # dépendances
npm run dev         # serveur Vite + HMR
npm run build       # build prod (vite build)
npm run preview     # prévisualisation prod
```

---

## 📦 Commits / PRs

- `feat(mission-control): upgrade 3d scene + presentation` — extension du globe et halo.
- `feat(fallbacks): add demo datasets + status store` — résilience NASA.
- `feat(ui): hero holographic layers + nav neon` — embellissement global.
- `docs(readme): document nasa shutdown + gibs migration` — ce fichier.

_(Conservez cette granularité dans vos PR : chaque feature visuelle/fallback isolée.)_

---

## 🛠 Roadmap future

- [ ] Intégration MapLibre pour afficher GIBS en direct (tuiles interactives).
- [ ] Mode PhotoFrame : boucle plein écran (mission control + fond audio).
- [ ] Automatisation tests `retry/fallback` avec MSW/Playwright.
- [ ] Dock spatial interactif (déplaçable) pour composer son tableau de bord.

---

## 🙌 Crédit & licence

- Données : NASA & ESA (domaine public, respect des guidelines NASA usage).
- UI/UX : conçu pour être clonable dans Figma (tokens et classes documentées).
- Licence : MIT.

Bon voyage dans les étoiles 🌌
