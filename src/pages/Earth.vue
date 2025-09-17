<template>
  <section>
    <div class="mb-6 flex flex-wrap items-end gap-3 justify-between">
      <div>
        <h1 class="font-display text-3xl">Earth Imagery</h1>
        <p class="text-slate-300">Landsat/Modis at given lat/lon and date</p>
      </div>
      <div class="flex items-center gap-2">
        <input v-model.number="lat" type="number" placeholder="Lat" step="0.0001" class="bg-white/10 border border-white/10 rounded px-3 py-2 w-32 text-slate-100" />
        <input v-model.number="lon" type="number" placeholder="Lon" step="0.0001" class="bg-white/10 border border-white/10 rounded px-3 py-2 w-32 text-slate-100" />
        <input v-model="date" type="date" class="bg-white/10 border border-white/10 rounded px-3 py-2 text-slate-100" />
        <input v-model.number="dim" type="number" step="0.01" placeholder="Dim (km/pixel)" class="bg-white/10 border border-white/10 rounded px-3 py-2 w-40 text-slate-100" />
        <button @click="load" class="btn-primary">Load</button>
      </div>
    </div>
    <div v-if="isDemo" class="mb-4 text-xs text-slate-400">Mode démo activé: image d'illustration chargée.</div>

    <div v-if="error" class="mb-4"><ErrorState :message="'Erreur Earth'" :details="error" /></div>
    <LoadingSpinner v-else-if="loading" />
    <div v-else-if="image" class="rounded-2xl glass overflow-hidden">
      <img :src="image.url" :alt="image.date" class="w-full h-auto" />
      <div class="p-3 text-sm text-slate-300">{{ image.date }}</div>
    </div>
    <EmptyState v-else label="Aucune image" />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { fetchEarthImagery } from '../api/nasa'
import LoadingSpinner from '../components/ui/LoadingSpinner.vue'
import ErrorState from '../components/ui/ErrorState.vue'
import EmptyState from '../components/ui/EmptyState.vue'

const lat = ref(48.8584)
const lon = ref(2.2945)
const date = ref('')
const dim = ref(0.15)
const image = ref(null)
const loading = ref(false)
const error = ref('')
const isDemo = String(import.meta.env.VITE_DEMO_MODE || 'false') === 'true'

async function load() {
  try { loading.value = true; error.value = ''
    image.value = await fetchEarthImagery({ lat: lat.value, lon: lon.value, date: date.value || undefined, dim: dim.value })
  } catch (e) { error.value = e.message || String(e) } finally { loading.value = false }
}

load()
</script>
