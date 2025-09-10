import api from './http'
import { normalizeGame } from './normalize'

const cache = new Map() // key: JSON.stringify(params) → { t, data }
const TTL = 1000 * 60 * 5

export async function listGames(params = {}) {
  const key = JSON.stringify(params || {})
  const now = Date.now()
  const c = cache.get(key)
  if (c && now - c.t < TTL) return c.data

  const { data } = await api.get('/api/games', { params })
  const rows = Array.isArray(data) ? data : (data?.data ?? data?.results ?? data?.games ?? [])
  const normalized = rows.map(normalizeGame)
  cache.set(key, { t: now, data: normalized })
  return normalized
}

export default { listGames }

