import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_URL || '/api'

export const api = axios.create({
  baseURL: BASE,
  timeout: 12000,
  headers: {
    'Accept': 'application/json',
  },
})

// Simple request ID for log correlation
api.interceptors.request.use((config) => {
  const id = Math.random().toString(36).slice(2, 10)
  config.headers['x-request-id'] = id
  config.metadata = { start: Date.now(), id }
  return config
})

// Response logging + error normalization
api.interceptors.response.use(
  (response) => {
    const meta = response.config?.metadata
    if (import.meta.env.DEV && meta) {
      const dur = Date.now() - meta.start
      // eslint-disable-next-line no-console
      console.debug('[API OK]', response.config.method?.toUpperCase(), response.config.url, `${dur}ms`)
    }
    return response
  },
  (error) => {
    const cfg = error.config || {}
    const meta = cfg.metadata || {}
    const dur = meta.start ? (Date.now() - meta.start) : undefined
    const status = error.response?.status
    const url = (cfg.baseURL || '') + (cfg.url || '')
    const msg =
      status === 404 ? 'Ressource introuvable'
      : status === 401 ? 'Non autorisé'
      : status && status >= 500 ? 'Erreur serveur'
      : error.code === 'ECONNABORTED' ? 'Délai dépassé'
      : 'Erreur de connexion'

    // eslint-disable-next-line no-console
    console.error('[API ERR]', cfg.method?.toUpperCase(), url, status || error.code, dur ? `${dur}ms` : '', error.message)

    return Promise.reject(Object.assign(new Error(msg), { cause: error, status }))
  }
)

export default api
