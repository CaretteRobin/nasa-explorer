# NASA Explorer — Vue 3 + Vite + Tailwind

Explorateur d'images et de données NASA: APOD, photos des rovers Mars, EPIC Earth, NASA Image Library, NEO, Space Weather (DONKI) et Earth Imagery. Dark mode futuriste, UI glass, responsive.

## Démarrage

- Node 18+
- pnpm (ou npm)

```
pnpm i
pnpm dev
```

## Configuration

- Variables d'env (voir `.env.example`):
  - `VITE_NASA_API_BASE=https://api.nasa.gov`
  - `VITE_NASA_IMAGES_BASE=https://images-api.nasa.gov`
  - `VITE_NASA_API_KEY=...` (dans `.env.local`, ne pas commiter)
  - Flags: `VITE_FEATURE_EPIC`, `VITE_FEATURE_NEO`, `VITE_FEATURE_DONKI`

## Endpoints utilisés

- APOD: `/planetary/apod` (params: `date` ou `start_date`/`end_date`, `thumbs=true`, `hd=true`)
- Mars Rovers: `/mars-photos/api/v1/rovers`, `/mars-photos/api/v1/rovers/{rover}/photos` (params: `sol`|`earth_date`, `camera`, `page`)
- EPIC: `/EPIC/api/{natural|enhanced}/all`, `/EPIC/api/{mode}/date/{YYYY-MM-DD}` (+ archive URL pour images)
- NASA Image Library: `https://images-api.nasa.gov/search` (params: `q`, `media_type`, `year_start`, `year_end`, `page`) + `/asset/{nasa_id}`
- NEO: `/neo/rest/v1/feed` et `/neo/rest/v1/feed/today`
- DONKI: `/DONKI/{FLR|CME|GST}` (params: `startDate`, `endDate`)
- Earth Imagery: `/planetary/earth/imagery` (params: `lat`, `lon`, `date`, `dim`)

## Pages

- Home / Mission Control: APOD du jour, panneaux d’accès rapide (Mars/EPIC/Library/NEO)
- APOD Gallery: archive par dates, miniatures, modale HD, favoris
- Mars Rover Photos: filtres rover/sol/date/cam, pagination
- EPIC Earth: Natural/Enhanced, dates disponibles, grille d’images
- NASA Image Library: recherche texte + filtres, pagination
- NEO Dashboard: today/range 7j, tri/pha badges
- Space Weather (DONKI): timeline par type et dates
- Earth Imagery: image satellite par lat/lon/date/dim
- Favorites: gestion locale (export/import JSON)

## États & robustesse

- Client HTTP `src/api/nasa.js` avec normalisation d’erreurs
- Cache mémoire simple pour endpoints invariants (APOD range, EPIC dates)
- Gestion d’erreurs lisibles, loaders uniformes, images lazy

## Notes UI/DX

- Thème sombre futuriste: dégradés anthracite, accents cyan/fuchsia
- Starfield discret en fond (parallaxe subtile)
- Glassmorphism maîtrisé, transitions 200–300ms, A11y AA
