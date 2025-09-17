<template>
  <section>
    <div class="relative overflow-hidden rounded-2xl glass p-8 mb-8">
      <div class="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
        <div>
          <h1 class="font-display text-4xl md:text-5xl tracking-tight">Mission Control</h1>
          <p class="mt-3 text-slate-300 max-w-2xl">APOD of the day, Mars rovers, EPIC Earth, NASA Image Library and NEO insights. Powered by NASA APIs.</p>
          <div class="mt-4 flex flex-wrap gap-3 items-center">
            <router-link to="/apod" class="btn-primary">APOD Gallery</router-link>
            <router-link to="/mars" class="btn-ghost">Mars Rovers</router-link>
          </div>
        </div>
        <img v-if="apod?.url && apod.media_type==='image'" :src="apod.url" class="w-56 h-36 rounded-xl object-cover border border-white/10" :alt="apod.title" />
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div class="xl:col-span-2">
        <h2 class="font-display text-2xl mb-4">Astronomy Picture of the Day</h2>
        <div v-if="errorApod" class="mb-6"><ErrorState :message="'APOD indisponible'" :details="errorApod" /></div>
        <LoadingSpinner v-else-if="loadingApod" />
        <div v-else class="rounded-2xl glass overflow-hidden">
          <div class="aspect-video bg-black">
            <img v-if="apod.media_type==='image'" :src="apod.url" :alt="apod.title" class="w-full h-full object-cover" />
            <iframe v-else :src="apod.url" title="APOD video" class="w-full h-full" allowfullscreen></iframe>
          </div>
          <div class="p-4">
            <div class="text-lg font-medium">{{ apod.title }}</div>
            <div class="text-slate-400 text-sm mt-1">{{ apod.date }}</div>
            <p class="text-slate-300 text-sm mt-3">{{ apod.explanation }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-display text-xl">Mars Rovers</h3>
            <router-link to="/mars" class="text-cyan-300 hover:text-cyan-200 text-sm">Open</router-link>
          </div>
          <div class="grid grid-cols-3 gap-3 text-center">
            <div v-for="r in rovers" :key="r.name" class="rounded-lg bg-white/5 border border-white/10 p-2">
              <div class="text-sm font-medium">{{ r.name }}</div>
              <div class="text-xs text-slate-400">{{ r.status }}</div>
            </div>
          </div>
        </div>
        <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-display text-xl">EPIC Earth</h3>
            <router-link to="/epic" class="text-cyan-300 hover:text-cyan-200 text-sm">Open</router-link>
          </div>
          <div class="text-slate-300 text-sm">Latest available dates: <span class="text-slate-200">{{ epicDates.slice(-3).join(', ') }}</span></div>
        </div>
        <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-display text-xl">NEO Today</h3>
            <router-link to="/neo" class="text-cyan-300 hover:text-cyan-200 text-sm">Open</router-link>
          </div>
          <div class="text-slate-300 text-sm">Potentially hazardous: <span class="font-semibold text-rose-300">{{ neoh }}</span></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { fetchApod, fetchRovers, fetchEpicDates, fetchNeoToday } from '../api/nasa'
import LoadingSpinner from '../components/ui/LoadingSpinner.vue'
import ErrorState from '../components/ui/ErrorState.vue'
import EmptyState from '../components/ui/EmptyState.vue'

const apod = ref(null)
const loadingApod = ref(false)
const errorApod = ref('')
const rovers = ref([])
const epicDates = ref([])
const neoh = ref(0)

onMounted(async () => {
  try { loadingApod.value = true; apod.value = await fetchApod() } catch (e) { errorApod.value = e.message || String(e) } finally { loadingApod.value = false }
  try { rovers.value = await fetchRovers() } catch {}
  try { epicDates.value = await fetchEpicDates('natural') } catch {}
  try {
    const neo = await fetchNeoToday()
    const todays = Object.values(neo.near_earth_objects || {})[0] || []
    neoh.value = todays.filter((o) => o.is_potentially_hazardous_asteroid).length
  } catch {}
})
</script>
