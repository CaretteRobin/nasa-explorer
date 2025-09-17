import axios from 'axios'
import { withCache } from './cache'

const base = import.meta.env.VITE_NASA_API_BASE || 'https://api.nasa.gov'
const imagesBase = import.meta.env.VITE_NASA_IMAGES_BASE || 'https://images-api.nasa.gov'
const apiKey = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'

const timeout = Number(import.meta.env.VITE_HTTP_TIMEOUT_MS || 12000)
const demo = String(import.meta.env.VITE_DEMO_MODE || 'false') === 'true'
const http = axios.create({ baseURL: base, timeout })
const httpImages = axios.create({ baseURL: imagesBase, timeout })

http.interceptors.response.use((r) => r, (e) => Promise.reject(normalizeErr(e)))
httpImages.interceptors.response.use((r) => r, (e) => Promise.reject(normalizeErr(e)))

function normalizeErr(err) {
  const status = err.response?.status
  const data = err.response?.data
  const message = data?.error?.message || data?.msg || err.message || 'Request failed'
  console.error('HTTP error', { status, message, url: err.config?.url, params: err.config?.params })
  return { status, message, endpoint: err.config?.url, params: err.config?.params, data }
}

const cached = withCache()

// APOD
export async function fetchApod(params = {}) {
  if (demo) {
    return {
      date: '2021-06-01',
      title: 'Pillars of Creation (Demo)',
      url: 'https://apod.nasa.gov/apod/image/1501/POcosmos1024.jpg',
      media_type: 'image',
      explanation: 'Démo APOD pour développement hors-ligne.',
    }
  }
  const p = { thumbs: true, hd: true, api_key: apiKey, ...params }
  const { data } = await http.get('/planetary/apod', { params: p })
  return data
}

export async function fetchApodRange(startDate, endDate) {
  return cached(`apod:${startDate}:${endDate}`, async () => {
    if (demo) {
      return [
        { date: '2021-06-01', title: 'Pillars of Creation (Demo)', url: 'https://apod.nasa.gov/apod/image/1501/POcosmos1024.jpg', media_type: 'image' },
        { date: '2021-05-31', title: 'Orion Nebula (Demo)', url: 'https://apod.nasa.gov/apod/image/1901/OrionNebula_Trinh_960.jpg', media_type: 'image' },
        { date: '2021-05-30', title: 'Milky Way Arch (Demo)', url: 'https://apod.nasa.gov/apod/image/2105/MWarch_Tafreshi_2048.jpg', media_type: 'image' },
      ]
    }
    const { data } = await http.get('/planetary/apod', { params: { start_date: startDate, end_date: endDate, thumbs: true, api_key: apiKey } })
    // Ensure array sorted desc by date
    const arr = Array.isArray(data) ? data : [data]
    return arr.sort((a,b) => new Date(b.date) - new Date(a.date))
  })
}

// Mars Rovers
export async function fetchRovers() {
  return cached('rovers', async () => {
    if (demo) {
      return [
        { name: 'Curiosity', status: 'active' },
        { name: 'Opportunity', status: 'complete' },
        { name: 'Spirit', status: 'complete' },
      ]
    }
    const { data } = await http.get('/mars-photos/api/v1/rovers', { params: { api_key: apiKey } })
    return data?.rovers || []
  })
}

export async function fetchRoverPhotos({ rover, sol, earth_date, camera, page = 1 }) {
  if (demo) {
    return [
      { id: 1, img_src: 'https://mars.nasa.gov/system/resources/detail_files/25066_PIA25179-16.jpg', rover: { name: 'Curiosity' }, camera: { name: 'NAVCAM', full_name: 'Navigation Camera' }, sol: 1000, earth_date: '2015-05-30' },
      { id: 2, img_src: 'https://mars.nasa.gov/system/resources/detail_files/25088_PIA25330-16.jpg', rover: { name: 'Curiosity' }, camera: { name: 'MAST', full_name: 'Mast Camera' }, sol: 1000, earth_date: '2015-05-30' },
    ]
  }
  const params = { api_key: apiKey, page }
  if (sol) params.sol = sol
  if (earth_date) params.earth_date = earth_date
  if (camera) params.camera = camera
  const { data } = await http.get(`/mars-photos/api/v1/rovers/${encodeURIComponent(rover)}/photos`, { params })
  return data?.photos || []
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
  return cached(`epic:dates:${mode}`, async () => {
    if (demo) {
      return ['2019-06-01', '2019-05-31', '2019-05-30']
    }
    const { data } = await withRetry(() => http.get(`/EPIC/api/${mode}/all`, { params: { api_key: apiKey } }))
    // returns array of objects with date fields or dates; normalize strings
    return (data || []).map((d) => (typeof d === 'string' ? d : d.date)).filter(Boolean)
  })
}

export function epicImageUrl(mode, date, image) {
  // date YYYY-MM-DD
  const [y, m, d] = date.split('-')
  return `https://epic.gsfc.nasa.gov/archive/${mode}/${y}/${m}/${d}/png/${image}.png`
}

export async function fetchEpicByDate(mode, date) {
  if (demo) {
    return [
      { identifier: 'demo-1', caption: 'Terre (démo)', date: `${date} 00:00:00`, image: 'epic_1b_20190601000001' },
      { identifier: 'demo-2', caption: 'Terre (démo)', date: `${date} 00:01:54`, image: 'epic_1b_20190601000154' },
    ]
  }
  const { data } = await withRetry(() => http.get(`/EPIC/api/${mode}/date/${date}`, { params: { api_key: apiKey } }))
  return data || []
}

// NASA Image & Video Library
export async function searchLibrary({ q, media_type, year_start, year_end, page = 1 }) {
  const params = { q, media_type, year_start, year_end, page }
  const { data } = await httpImages.get('/search', { params })
  const collection = data?.collection
  const items = collection?.items || []
  const meta = { total: Number(collection?.metadata?.total_hits || 0), href: collection?.href }
  return { items, meta }
}

export async function fetchLibraryAsset(nasa_id) {
  const { data } = await httpImages.get(`/asset/${encodeURIComponent(nasa_id)}`)
  const items = data?.collection?.items || []
  return items.map((i) => i.href)
}

// NEO
export async function fetchNeoToday() {
  const { data } = await http.get('/neo/rest/v1/feed/today', { params: { detailed: true, api_key: apiKey } })
  return data
}

export async function fetchNeoRange(start_date, end_date) {
  const { data } = await http.get('/neo/rest/v1/feed', { params: { start_date, end_date, api_key: apiKey } })
  return data
}

// DONKI (space weather)
export async function fetchDonki(type, startDate, endDate) {
  if (demo) {
    return [
      { activityID: 'DEMO-FLR-1', beginTime: '2021-06-01T12:00Z', classType: 'M1.0', instruments: [{ displayName: 'GOES' }] },
      { activityID: 'DEMO-CME-1', startTime: '2021-06-01T11:00Z', note: 'CME demo', instruments: [{ displayName: 'SOHO/LASCO' }] },
    ]
  }
  const { data } = await http.get(`/DONKI/${type}`, { params: { startDate, endDate, api_key: apiKey } })
  return data || []
}

// Earth Imagery
export async function fetchEarthImagery({ lat, lon, date, dim }) {
  const params = { lat, lon, date, dim, api_key: apiKey }
  try {
    if (demo) {
      return { url: 'https://epic.gsfc.nasa.gov/archive/natural/2019/06/01/png/epic_1b_20190601000001.png', date: '2019-06-01' }
    }
    const { data } = await http.get('/planetary/earth/imagery', { params })
    return data
  } catch (e) {
    // Fallback: discover nearest available date via assets then retry
    try {
      const { data: assets } = await http.get('/planetary/earth/assets', { params: { lon, lat, begin: date || undefined, api_key: apiKey } })
      const nearest = assets?.results?.[0]?.date?.slice(0, 10)
      if (nearest) {
        const { data } = await http.get('/planetary/earth/imagery', { params: { lat, lon, date: nearest, dim, api_key: apiKey } })
        return data
      }
    } catch {}
    throw e
  }
}
