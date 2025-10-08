<template>
  <section class="space-y-10">
    <header class="space-y-3">
      <p class="text-xs uppercase tracking-[0.5em] text-cyan-200/80">Mission Control</p>
      <h1 class="font-display text-4xl md:text-5xl tracking-tight">Tableau de bord orbital</h1>
      <p class="max-w-3xl text-slate-300">
        Visualise l’activité autour de la Terre : station spatiale, météo solaire, objets proches et missions en cours. Les données sont synchronisées avec les services publics de la NASA.
      </p>
    </header>

    <div class="grid gap-8 xl:grid-cols-[minmax(0,1.2fr),minmax(0,0.8fr)] items-start">
      <div class="relative glass glow-surface overflow-hidden p-0">
        <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-indigo-600/10 pointer-events-none"></div>
        <MissionControlScene />
        <div class="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em] text-cyan-100/80">
          <div class="flex items-center gap-2">
            <span class="inline-flex h-2 w-2 rounded-full bg-cyan-300 animate-ping"></span>
            <span>ISS · orbite synchrone</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex h-2 w-2 rounded-full bg-violet-300 animate-pulse"></span>
            <span>Réseau Deep Space</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex h-2 w-2 rounded-full bg-rose-300 animate-pulse"></span>
            <span>Surveillance NEO</span>
          </div>
        </div>
      </div>

      <aside class="space-y-6">
        <section class="hud-panel p-6">
          <header class="flex items-center justify-between mb-6">
            <h2 class="font-display text-xl">État des systèmes</h2>
            <span class="text-xs uppercase tracking-[0.4em] text-cyan-200/70">Live</span>
          </header>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-xl bg-white/5 border border-cyan-400/10 p-4">
              <p class="text-xs uppercase tracking-wide text-slate-400">Objets surveillés</p>
              <p class="text-2xl font-semibold text-cyan-200">{{ telemetry.neoCount }}</p>
              <p class="text-xs text-slate-400 mt-2">Potentiellement dangereux aujourd’hui</p>
            </div>
            <div class="rounded-xl bg-white/5 border border-cyan-400/10 p-4">
              <p class="text-xs uppercase tracking-wide text-slate-400">Alertes solaires</p>
              <p class="text-2xl font-semibold text-rose-200">{{ telemetry.solarEvents.length }}</p>
              <p class="text-xs text-slate-400 mt-2">FLR & CME sur 48h</p>
            </div>
            <div class="rounded-xl bg-white/5 border border-cyan-400/10 p-4">
              <p class="text-xs uppercase tracking-wide text-slate-400">Fenêtres EPIC</p>
              <p class="text-2xl font-semibold text-indigo-200">{{ telemetry.epicDates.length }}</p>
              <p class="text-xs text-slate-400 mt-2">Dernières prises de vue Terre</p>
            </div>
            <div class="rounded-xl bg-white/5 border border-cyan-400/10 p-4">
              <p class="text-xs uppercase tracking-wide text-slate-400">Rovers actifs</p>
              <p class="text-2xl font-semibold text-emerald-200">{{ telemetry.activeRovers }}</p>
              <p class="text-xs text-slate-400 mt-2">Curiosity·Perseverance·Opportunity</p>
            </div>
          </div>
        </section>

        <section class="glass p-6">
          <header class="flex items-center justify-between mb-4">
            <h3 class="font-display text-xl">Chronologie météo spatiale</h3>
            <router-link to="/space-weather" class="btn-holo">Ouvrir</router-link>
          </header>
          <div v-if="telemetry.solarEvents.length" class="space-y-4 max-h-[320px] overflow-y-auto pr-1">
            <article
              v-for="event in telemetry.solarEvents"
              :key="event.activityID"
              class="card-hover rounded-xl p-4">
              <p class="text-xs uppercase tracking-[0.3em] text-slate-400">{{ event.type }}</p>
              <p class="mt-1 text-lg font-semibold text-slate-100">{{ event.title }}</p>
              <p class="text-xs text-slate-400 mt-2">{{ event.time }}</p>
              <p v-if="event.instruments?.length" class="text-xs text-slate-500 mt-3">{{ event.instruments.join(', ') }}</p>
            </article>
          </div>
          <div v-else class="rounded-xl border border-dashed border-white/15 bg-white/5 p-6 text-slate-400 text-sm">
            Flux météo spatiale indisponible pour l’instant.
          </div>
        </section>
      </aside>
    </div>

    <section class="glass p-6">
      <header class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="font-display text-2xl">Réseau d’observation</h2>
          <p class="text-sm text-slate-400">Rovers martiens, instruments EPIC et suivi des flux NEO au format HUD.</p>
        </div>
        <router-link to="/favorites" class="btn-primary">Composer un suivi personnalisé</router-link>
      </header>
      <div class="space-divider"></div>
      <div class="grid gap-4 lg:grid-cols-3">
        <div class="widget-shell">
          <header class="flex items-center justify-between">
            <p class="text-xs uppercase tracking-[0.4em] text-cyan-200/80">Rovers</p>
            <span class="text-sm text-slate-400">{{ telemetry.rovers.length }} suivis</span>
          </header>
          <ul class="mt-3 space-y-2">
            <li
              v-for="rover in telemetry.rovers"
              :key="rover.name"
              class="flex items-center justify-between rounded-lg bg-black/30 px-3 py-2">
              <span class="text-sm font-medium">{{ rover.name }}</span>
              <span class="text-xs uppercase tracking-[0.25em] text-slate-400">{{ rover.status }}</span>
            </li>
          </ul>
        </div>
        <div class="widget-shell">
          <header class="flex items-center justify-between">
            <p class="text-xs uppercase tracking-[0.4em] text-cyan-200/80">EPIC</p>
            <span class="text-sm text-slate-400">Dernières fenêtres</span>
          </header>
          <ul class="mt-4 text-sm text-slate-300 space-y-2">
            <li v-for="date in telemetry.epicDates.slice(-5).reverse()" :key="date" class="flex items-center justify-between">
              <span>{{ date }}</span>
              <router-link :to="{ name: 'epic' }" class="text-cyan-300 hover:text-cyan-200 text-xs uppercase tracking-[0.3em]">Voir</router-link>
            </li>
          </ul>
        </div>
        <div class="widget-shell">
          <header class="flex items-center justify-between">
            <p class="text-xs uppercase tracking-[0.4em] text-cyan-200/80">NEO</p>
            <span class="text-xs text-slate-400">Danger potentiel</span>
          </header>
          <div class="mt-4">
            <svg v-if="neoSparkline.length" class="sparkline" viewBox="0 0 120 32" preserveAspectRatio="none">
              <polyline :points="neoSparkline" fill="none" stroke="rgba(96,165,250,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <p class="text-2xl font-semibold text-slate-100 mt-3">{{ telemetry.neoCount }}</p>
            <p class="text-xs text-slate-400">Sommet sur 7 jours glissants</p>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import MissionControlScene from '../components/mission/MissionControlScene.vue'
import { fetchDonki, fetchEpicDates, fetchNeoRange, fetchRovers } from '../api/nasa'

const telemetry = ref({
  neoCount: 0,
  rovers: [],
  epicDates: [],
  solarEvents: [],
  activeRovers: 0,
})

const neoSparkline = computed(() => {
  const history = telemetry.value.neoHistory || []
  if (!history.length) return ''
  const max = Math.max(...history)
  const min = Math.min(...history)
  const range = Math.max(max - min, 1)
  return history.map((value, index) => {
    const x = (index / Math.max(history.length - 1, 1)) * 120
    const y = 32 - ((value - min) / range) * 28 - 2
    return `${x.toFixed(2)},${y.toFixed(2)}`
  }).join(' ')
})

const mapEvents = (type, entries = []) => {
  return entries.slice(0, 6).map((entry) => ({
    activityID: entry.activityID || entry.flrID || entry.cmeAnalyses?.[0]?.id || `${type}-${entry.startTime}`,
    title: entry.note || entry.classType || entry.cmeAnalyses?.[0]?.type || `${type} detecté`,
    time: entry.beginTime || entry.startTime || entry.peakTime || '—',
    instruments: (entry.instruments || entry.instrumentsUsed)?.map((inst) => inst.displayName || inst) || [],
    type,
  }))
}

const loadTelemetry = async () => {
  const now = new Date()
  const start = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7)
  const startISO = start.toISOString().slice(0, 10)
  const endISO = now.toISOString().slice(0, 10)

  try {
    const [rovers, epic, neoRange, flares, cmes] = await Promise.all([
      fetchRovers(),
      fetchEpicDates('natural'),
      fetchNeoRange(startISO, endISO),
      fetchDonki('FLR', startISO, endISO),
      fetchDonki('CME', startISO, endISO),
    ])

    const neoHistory = []
    let hazardousToday = 0
    const neoEntries = neoRange?.near_earth_objects || {}
    Object.keys(neoEntries).sort().forEach((dateKey) => {
      const list = neoEntries[dateKey] || []
      const count = list.filter((item) => item.is_potentially_hazardous_asteroid).length
      if (dateKey === now.toISOString().slice(0, 10)) hazardousToday = count
      neoHistory.push(count)
    })

    telemetry.value = {
      neoCount: hazardousToday,
      rovers: rovers.slice(0, 4),
      epicDates: epic.slice(0, 8),
      solarEvents: [...mapEvents('FLR', flares), ...mapEvents('CME', cmes)].sort((a, b) => (a.time > b.time ? -1 : 1)).slice(0, 8),
      activeRovers: rovers.filter((r) => r.status === 'active').length,
      neoHistory,
    }
  } catch (error) {
    console.error('Mission control load failed', error)
  }
}

onMounted(() => {
  loadTelemetry()
})
</script>
