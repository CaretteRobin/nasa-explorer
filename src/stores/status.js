import { defineStore } from 'pinia'

export const useStatusStore = defineStore('status', {
  state: () => ({
    nasaOffline: false,
    lastError: null,
  }),
  actions: {
    setOffline(payload) {
      this.nasaOffline = true
      this.lastError = payload
    },
    setOnline() {
      this.nasaOffline = false
      this.lastError = null
    },
  },
})
