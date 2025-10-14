import { defineStore } from 'pinia'

const STORAGE_KEY = 'nasa-observatory-modules'

const defaultModules = ['mission-control', 'apod', 'neo']

const readPersisted = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [...defaultModules]
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length) return parsed
    return [...defaultModules]
  } catch (err) {
    console.warn('Observatory storage unavailable', err)
    return [...defaultModules]
  }
}

export const useObservatoryStore = defineStore('observatory', {
  state: () => ({
    modules: defaultModules,
  }),
  actions: {
    init() {
      this.modules = readPersisted()
    },
    toggle(moduleId) {
      if (this.modules.includes(moduleId)) {
        this.modules = this.modules.filter((id) => id !== moduleId)
      } else {
        this.modules = [...this.modules, moduleId]
      }
      this.persist()
    },
    reorder({ from, to }) {
      const copy = [...this.modules]
      const [item] = copy.splice(from, 1)
      copy.splice(to, 0, item)
      this.modules = copy
      this.persist()
    },
    reset() {
      this.modules = [...defaultModules]
      this.persist()
    },
    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.modules))
      } catch (err) {
        console.warn('Unable to persist observatory', err)
      }
    },
  },
})
