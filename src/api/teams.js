import { listPlayerTotals } from './players'
import { normalizeTeam } from './normalize'

let teamsCache = { t: 0, data: [] }
const TTL = 1000 * 60 * 10

export async function listTeams({ season } = {}) {
  const now = Date.now()
  if (teamsCache.data.length && now - teamsCache.t < TTL) return teamsCache.data

  // Derive from player totals to cover all teams
  const players = await listPlayerTotals({ season, limit: 2000 })
  const map = new Map()
  for (const p of players) {
    const k = p.teamAbbr || p.teamName
    if (!k) continue
    if (!map.has(k)) {
      map.set(k, normalizeTeam({ team: { name: p.teamName, abbreviation: p.teamAbbr } }))
    }
  }
  const list = Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
  teamsCache = { t: now, data: list }
  return list
}

export default { listTeams }

