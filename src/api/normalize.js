// Normalisation des données de match provenant d’API hétérogènes
export function normalizeGame(apiGame = {}) {
  // Les API peuvent exposer la date sous différents champs
  const rawDate = apiGame.date || apiGame.gameDate || apiGame.start_time || ''
  let iso = ''
  try { iso = typeof rawDate === 'string' ? rawDate : (new Date(rawDate)).toISOString() } catch { iso = '' }

  const time = (() => {
    try {
      const d = new Date(iso)
      if (isNaN(d.getTime())) return '—'
      const hh = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      return `${hh}:${mm}`
    } catch { return '—' }
  })()

  const homeAbbr = apiGame.homeTeam || apiGame.home_team?.abbreviation || apiGame.homeTeam?.abbreviation || ''
  const awayAbbr = apiGame.visitorTeam || apiGame.awayTeam?.abbreviation || apiGame.visitor_team?.abbreviation || ''
  const homeScore = apiGame.homePts ?? apiGame.homeScore ?? apiGame.home_points ?? null
  const awayScore = apiGame.visitorPts ?? apiGame.awayScore ?? apiGame.away_points ?? null

  // Déterminer un statut lisible même si la source ne fournit rien
  let status = 'scheduled'
  const now = Date.now()
  const t = Date.parse(iso)
  if (homeScore != null && awayScore != null && !Number.isNaN(Number(homeScore)) && !Number.isNaN(Number(awayScore))) status = 'final'
  else if (!Number.isNaN(t) && t <= now) status = 'in_progress'

  return {
    id: apiGame.gameId || apiGame.id || `${homeAbbr}-${awayAbbr}-${iso}`,
    date: iso?.slice(0, 10) || '',
    time,
    homeName: homeAbbr || '—',
    homeAbbr: homeAbbr || '',
    awayName: awayAbbr || '—',
    awayAbbr: awayAbbr || '',
    homeScore: (homeScore ?? null),
    awayScore: (awayScore ?? null),
    status,
  }
}

// Normalisation des totaux joueurs pour harmoniser les listings et classements
export function normalizePlayerTotals(x = {}) {
  const name = x.playerName || x.player_name || `${x.firstName || ''} ${x.lastName || ''}`.trim()
  const teamAbbr = x.team || x.teamAbbr || x.team_abbr || x.team?.abbreviation || ''
  const fg3Pct = x.threePercent ?? x.fg3_pct ?? ((x.threeAttempts || x.fg3a) ? (Number(x.threeFg || x.fg3m) / Number(x.threeAttempts || x.fg3a)) : null)
  const teamName = x.teamName || x.team_name || x.team?.name || teamAbbr

  return {
    id: x.id || x.playerId || x.player_id || name,
    name: name || '—',
    teamName,
    teamAbbr,
    position: x.position || x.pos || '',
    pts: Number(x.points ?? x.pts ?? 0),
    reb: Number(x.totalRb ?? x.reb ?? 0),
    ast: Number(x.assists ?? x.ast ?? 0),
    fg3Pct: fg3Pct != null ? Number(fg3Pct) : null,
  }
}

// Normalisation d’une fiche équipe quel que soit le fournisseur
export function normalizeTeam(x = {}) {
  const team = x.team || x
  const conferenceRaw = (team.conference || x.conference || x.conf || '').toString().toLowerCase()
  return {
    id: team.id || x.team_id || x.teamId || team.abbreviation || team.code || team.name,
    name: team.full_name || team.name || x.team_name || '',
    abbr: team.abbreviation || team.code || x.team_abbr || '',
    city: team.city || x.city || x.location || '',
    conference: conferenceRaw.startsWith('e') ? 'East' : conferenceRaw.startsWith('w') ? 'West' : '',
    division: team.division || x.division || x.div || '',
  }
}

export default { normalizeGame, normalizePlayerTotals, normalizeTeam }
