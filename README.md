# NBA Explore — Vue 3 + Vite + Tailwind

Front-end pour explorer les données NBA (matchs, joueurs, leaders, équipes dérivées, classements).

## Démarrage

- Node 18+
- pnpm (ou npm)

```
pnpm i
pnpm dev
```

## Configuration

- Dev: un proxy Vite évite les soucis CORS.
  - `VITE_API_BASE=/api` (par défaut dans `.env`)
- Prod: soit reverse-proxy, soit base absolue
  - `VITE_API_BASE=https://api.server.nbaapi.com`

Voir `vite.config.js` → `server.proxy['/api']`.

## Endpoints consommés (Swagger)

- `GET /api/games`: données de matchs (params: `date?`, `season?` si supporté)
- `GET /api/playertotals`: totaux joueurs (params: `season?`, `team?`… selon API)
- `GET /api/playersadvancedstats`: stats avancées (optionnel)
- `GET /api/playershotchart`: shot chart (optionnel)

## Schéma interne (normalisation)

- Normalisation côté client pour tolérer `snake_case`/`camelCase` et champs manquants:
  - Games → `{ id, date, time, homeName, homeAbbr, awayName, awayAbbr, homeScore, awayScore, status }`
  - PlayerTotals → `{ id, name, teamName, teamAbbr, position, pts, reb, ast, fg3Pct }`
  - Teams (dérivées) → `{ id, name, abbr, city, conference, division }`

Voir `src/api/normalize.js`.

## Pages

- Home: hero full‑bleed, état API, aperçu des matchs du jour
- Games: liste du jour/sélection date, filtres statut/équipe
- Players: recherche, filtre équipe/position, pagination locale sur playertotals
- Leaders: calcul client (PTS/REB/AST/3P%), tri + limite
- Teams: dérivées depuis playertotals, lien vers Players filtré
- Standings: calculés localement à partir de games (W/L, %, diff)

## États & robustesse

- Client HTTP unique `src/api/http.js` (timeout 12s, logs, x-request-id)
- Composants d’état réutilisables: `LoadingSkeleton`, `ErrorAlert`, `EmptyState`, `ApiStatusPill`
- Gestion d’erreurs homogène + messages lisibles

## Notes DX

- Tailwind (plugin vite) et mise en page plein écran
- Containers larges `max-w-screen-2xl` et hero full‑bleed
