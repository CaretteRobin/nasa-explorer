import { defineStore } from 'pinia'

const LS_KEY = 'nasa_favorites_v1'

export const useFavorites = defineStore('favorites', {
  state: () => ({ items: [] }),
  actions: {
    load() {
      try {
        const raw = localStorage.getItem(LS_KEY)
        if (raw) this.items = JSON.parse(raw)
      } catch {}
    },
    save() {
      try { localStorage.setItem(LS_KEY, JSON.stringify(this.items)) } catch {}
    },
    toggle(item) {
      const idx = this.items.findIndex((i) => i.id === item.id)
      if (idx >= 0) this.items.splice(idx, 1)
      else this.items.unshift(item)
      this.save()
    },
    clear() { this.items = []; this.save() },
  },
})

