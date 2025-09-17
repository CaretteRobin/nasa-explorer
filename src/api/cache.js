const cache = new Map()

export function withCache(ttlMs = 5 * 60 * 1000) {
  return async function cachedFetch(key, fn) {
    const now = Date.now()
    const hit = cache.get(key)
    if (hit && now - hit.time < ttlMs) return hit.value
    const val = await fn()
    cache.set(key, { time: now, value: val })
    return val
  }
}

export function clearCache() {
  cache.clear()
}

