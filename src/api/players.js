import api from './http'
import { normalizePlayerTotals } from './normalize'

export async function listPlayerTotals(params = {}) {
  const { data } = await api.get('/api/playertotals', { params })
  const rows = Array.isArray(data) ? data : (data?.data ?? data?.results ?? [])
  return rows.map(normalizePlayerTotals)
}

export default { listPlayerTotals }

export async function listPlayerAdvancedStats(params = {}) {
  const { data } = await api.get('/api/playersadvancedstats', { params })
  return Array.isArray(data) ? data : (data?.data ?? data?.results ?? [])
}

export async function getPlayerShotChart(params = {}) {
  const { data } = await api.get('/api/playershotchart', { params })
  return Array.isArray(data) ? data : (data?.data ?? data?.results ?? [])
}

export { listPlayerAdvancedStats as listAdvanced, getPlayerShotChart as shotChart }
