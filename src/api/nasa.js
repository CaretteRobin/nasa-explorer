import axios from 'axios'
import { withCache } from './cache'
import { useStatusStore } from '../stores/status'
import {
  demoApod,
  demoApodRange,
  demoRovers,
  demoRoverPhotos,
  demoEpicDates,
  demoNeoHistory,
  demoSolarEvents,
  demoEarthImagery,
} from '../lib/demoData'

const base = import.meta.env.VITE_NASA_API_BASE || 'https://api.nasa.gov'
const imagesBase = import.meta.env.VITE_NASA_IMAGES_BASE || 'https://images-api.nasa.gov'
const apiKey = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'

const timeout = Number(import.meta.env.VITE_HTTP_TIMEOUT_MS || 12000)
const demo = String(import.meta.env.VITE_DEMO_MODE || 'false') === 'true'
const http = axios.create({ baseURL: base, timeout })
const httpImages = axios.create({ baseURL: imagesBase, timeout })

const getStatusStore = () => {
  try {
    return useStatusStore()
  } catch (err) {
    return null
  }
}

const markOffline = (payload) => {
  const store = getStatusStore()
  store?.setOffline(payload)
}

const markOnline = () => {
  const store = getStatusStore()
  store?.setOnline()
}

const shouldUseDemo = () => {
  const store = getStatusStore()
  return demo || Boolean(store?.nasaOffline)
}

const buildDemoNeoFeed = () => {
  const feed = {}
  const counts = demoNeoHistory.history
  const today = new Date()
  counts.forEach((count, index) => {
    const day = new Date(today.getTime() - (counts.length - 1 - index) * 24 * 60 * 60 * 1000)
    const key = day.toISOString().slice(0, 10)
    feed[key] = Array.from({ length: count }, (_, i) => ({
      id: `demo-neo-${key}-${i}`,
      name: `DEMO ${key} #${i + 1}`,
      is_potentially_hazardous_asteroid: i % 2 === 0,
      close_approach_data: [],
    }))
  })
  return feed
}

http.interceptors.response.use((r) => { markOnline(); return r }, (e) => Promise.reject(normalizeErr(e)))
httpImages.interceptors.response.use((r) => { markOnline(); return r }, (e) => Promise.reject(normalizeErr(e)))

function normalizeErr(err) {
  const status = err.response?.status
  const data = err.response?.data
  const message = data?.error?.message || data?.msg || err.message || 'Request failed'
  console.error('HTTP error', { status, message, url: err.config?.url, params: err.config?.params })
  markOffline({ status, message, endpoint: err.config?.url })
  return { status, message, endpoint: err.config?.url, params: err.config?.params, data }
}

const cached = withCache()

// APOD
export async function fetchApod(params = {}) {
  if (shouldUseDemo()) {
    return demoApod
  }
  const p = { thumbs: true, hd: true, api_key: apiKey, ...params }
  try {
    const { data } = await http.get('/planetary/apod', { params: p })
    return data
  } catch (error) {
    return demoApod
  }
}

export async function fetchApodRange(startDate, endDate) {
  if (shouldUseDemo()) {
    return demoApodRange
  }
  return cached(`apod:${startDate}:${endDate}`, async () => {
    try {
      const { data } = await http.get('/planetary/apod', { params: { start_date: startDate, end_date: endDate, thumbs: true, api_key: apiKey } })
      const arr = Array.isArray(data) ? data : [data]
      return arr.sort((a, b) => new Date(b.date) - new Date(a.date))
    } catch (error) {
      return demoApodRange
    }
  })
}

// Mars Rovers
export async function fetchRovers() {
  if (shouldUseDemo()) {
    return demoRovers
  }
  return cached('rovers', async () => {
    try {
      const { data } = await http.get('/mars-photos/api/v1/rovers', { params: { api_key: apiKey } })
      return data?.rovers || []
    } catch (error) {
      return demoRovers
    }
  })
}

export async function fetchRoverPhotos({ rover, sol, earth_date, camera, page = 1 }) {
  if (shouldUseDemo()) {
    return demoRoverPhotos[rover] || []
  }
  const params = { api_key: apiKey, page }
  if (sol) params.sol = sol
  if (earth_date) params.earth_date = earth_date
  if (camera) params.camera = camera
  try {
    const { data } = await http.get(`/mars-photos/api/v1/rovers/${encodeURIComponent(rover)}/photos`, { params })
    const photos = data?.photos || []
    return photos.length ? photos : (demoRoverPhotos[rover] || [])
  } catch (error) {
    return demoRoverPhotos[rover] || []
  }
}

// EPIC
async function withRetry(fn, times = 2, delay = 600) {
  let last
  for (let i = 0; i <= times; i++) {
    try { return await fn() } catch (e) { last = e; await new Promise(r => setTimeout(r, delay)) }
  }
  throw last
}

export async function fetchEpicDates(mode = 'natural') {
  if (shouldUseDemo()) {
    return demoEpicDates
  }
  return cached(`epic:dates:${mode}`, async () => {
    try {
      const { data } = await withRetry(() => http.get(`/EPIC/api/${mode}/all`, { params: { api_key: apiKey } }))
      return (data || []).map((d) => (typeof d === 'string' ? d : d.date)).filter(Boolean)
    } catch (error) {
      return demoEpicDates
    }
  })
}

export function epicImageUrl(mode, date, image) {
  // date YYYY-MM-DD
  const [y, m, d] = date.split('-')
  return `https://epic.gsfc.nasa.gov/archive/${mode}/${y}/${m}/${d}/png/${image}.png`
}

export async function fetchEpicByDate(mode, date) {
  if (shouldUseDemo()) {
    return [
      { identifier: 'demo-1', caption: 'Terre (démo)', date: `${date} 00:00:00`, image: 'epic_1b_20190601000001' },
      { identifier: 'demo-2', caption: 'Terre (démo)', date: `${date} 00:01:54`, image: 'epic_1b_20190601000154' },
    ]
  }
  try {
    const { data } = await withRetry(() => http.get(`/EPIC/api/${mode}/date/${date}`, { params: { api_key: apiKey } }))
    return data || []
  } catch (error) {
    return [
      { identifier: 'demo-1', caption: 'Terre (démo)', date: `${date} 00:00:00`, image: 'epic_1b_20190601000001' },
      { identifier: 'demo-2', caption: 'Terre (démo)', date: `${date} 00:01:54`, image: 'epic_1b_20190601000154' },
    ]
  }
}

// NASA Image & Video Library
export async function searchLibrary({ q, media_type, year_start, year_end, page = 1 }) {
  const params = { q, media_type, year_start, year_end, page }
  try {
    const { data } = await httpImages.get('/search', { params })
    const collection = data?.collection
    const items = collection?.items || []
    const meta = { total: Number(collection?.metadata?.total_hits || 0), href: collection?.href }
    return { items, meta }
  } catch (error) {
    return { items: [], meta: { total: 0 } }
  }
}

export async function fetchLibraryAsset(nasa_id) {
  try {
    const { data } = await httpImages.get(`/asset/${encodeURIComponent(nasa_id)}`)
    const items = data?.collection?.items || []
    return items.map((i) => i.href)
  } catch (error) {
    return []
  }
}

// NEO
export async function fetchNeoToday() {
  if (shouldUseDemo()) {
    const today = new Date().toISOString().slice(0, 10)
    const count = demoNeoHistory.today
    const entries = Array.from({ length: count }, (_, i) => ({
      id: `demo-neo-today-${i}`,
      name: `DEMO NEO ${i + 1}`,
      is_potentially_hazardous_asteroid: true,
      close_approach_data: [],
    }))
    return { near_earth_objects: { [today]: entries } }
  }
  try {
    const { data } = await http.get('/neo/rest/v1/feed/today', { params: { detailed: true, api_key: apiKey } })
    return data
  } catch (error) {
    const today = new Date().toISOString().slice(0, 10)
    const count = demoNeoHistory.today
    const entries = Array.from({ length: count }, (_, i) => ({
      id: `demo-neo-today-${i}`,
      name: `DEMO NEO ${i + 1}`,
      is_potentially_hazardous_asteroid: true,
      close_approach_data: [],
    }))
    return { near_earth_objects: { [today]: entries } }
  }
}

export async function fetchNeoRange(start_date, end_date) {
  if (shouldUseDemo()) {
    return { near_earth_objects: buildDemoNeoFeed() }
  }
  try {
    const { data } = await http.get('/neo/rest/v1/feed', { params: { start_date, end_date, api_key: apiKey } })
    return data
  } catch (error) {
    return { near_earth_objects: buildDemoNeoFeed() }
  }
}

// DONKI (space weather)
export async function fetchDonki(type, startDate, endDate) {
  if (shouldUseDemo()) {
    return demoSolarEvents
  }
  try {
    const { data } = await http.get(`/DONKI/${type}`, { params: { startDate, endDate, api_key: apiKey } })
    return data || []
  } catch (error) {
    return demoSolarEvents
  }
}

// Earth Imagery
export async function fetchEarthImagery({ lat, lon, date, dim }) {
  if (shouldUseDemo()) {
    return demoEarthImagery
  }
  const params = { lat, lon, date, dim, api_key: apiKey }
  try {
    const { data } = await http.get('/planetary/earth/imagery', { params })
    return data
  } catch (e) {
    try {
      const { data: assets } = await http.get('/planetary/earth/assets', { params: { lon, lat, begin: date || undefined, api_key: apiKey } })
      const nearest = assets?.results?.[0]?.date?.slice(0, 10)
      if (nearest) {
        const { data } = await http.get('/planetary/earth/imagery', { params: { lat, lon, date: nearest, dim, api_key: apiKey } })
        return data
      }
    } catch {}
    return demoEarthImagery
  }
}
