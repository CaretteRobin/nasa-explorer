<template>
  <section class="max-w-screen-2xl mx-auto">
    <!-- Header -->
    <div class="rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-6 text-white shadow-lg mb-6">
      <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight">⭐ Leaders</h1>
          <p class="text-white/80">Top joueurs par statistique, filtrés par saison.</p>
        </div>
        <form @submit.prevent="fetchLeaders" class="flex flex-wrap gap-2">
          <select v-model="metric" class="bg-white/90 text-gray-900 rounded-xl px-3 py-2 text-sm">
            <option value="ppg">Points</option>
            <option value="reb">Rebounds</option>
            <option value="ast">Assists</option>
            <option value="fg3_pct">3P%</option>
          </select>
          <select v-model="season" class="bg-white/90 text-gray-900 rounded-xl px-3 py-2 text-sm">
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
          <select v-model.number="limit" class="bg-white/90 text-gray-900 rounded-xl px-3 py-2 text-sm">
            <option :value="10">Top 10</option>
            <option :value="20">Top 20</option>
            <option :value="50">Top 50</option>
          </select>
          <button class="bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/90">
            Charger
          </button>
        </form>
      </div>
    </div>

    <!-- States -->
    <div v-if="loading" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 9" :key="i" class="h-28 bg-gray-100 animate-pulse rounded-2xl"></div>
    </div>

    <p v-else-if="error" class="text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-xl">
      {{ error }}
    </p>

    <div v-else>
      <div class="flex items-center justify-between mb-3">
        <p class="text-sm text-gray-500">
          {{ leadersNorm.length }} résultats — Saison {{ season }} — Métrique : <strong>{{ metricLabel }}</strong>
        </p>
        <div class="text-xs text-gray-400">Source: /api/playertotals (calcul local)</div>
      </div>

      <div v-if="leadersNorm.length === 0" class="text-gray-500 bg-white border rounded-2xl p-6 text-center">
        Aucun joueur trouvé pour ces critères.
      </div>

      <ol v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <li
          v-for="(p, idx) in leadersNorm"
          :key="p.id || idx"
          class="group bg-white rounded-2xl border shadow-sm p-4 hover:shadow-xl transition"
        >
          <div class="flex items-start justify-between">
            <span
              :class="[
                'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold',
                idx < 3 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
              ]"
              :title="`Rang #${idx+1}`"
            >{{ idx+1 }}</span>

            <span
              :class="[
                'text-xs px-2 py-0.5 rounded-full border',
                idx < 3 ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-gray-50 text-gray-700 border-gray-200'
              ]"
            >
              {{ p.teamAbbr || '—' }}
            </span>
          </div>

          <div class="mt-3">
            <div class="text-lg font-semibold leading-tight">
              {{ p.name }}
            </div>
            <div class="text-xs text-gray-500">{{ p.teamName || '—' }}</div>
          </div>

          <div class="mt-4 flex items-end justify-between">
            <div>
              <div class="text-2xl font-extrabold">
                {{ formatValue(p.value) }}
              </div>
              <div class="text-xs text-gray-500 uppercase tracking-wide">{{ metricLabel }}</div>
            </div>
            <div class="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                :style="{ width: barWidth(p.value) }"
                title="Comparaison relative (max local)"
              />
            </div>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { listPlayerTotals } from '../api/players'

const year = new Date().getFullYear()
const years = Array.from({ length: 7 }, (_, i) => year - i)

const metric = ref('ppg')
const season = ref(year)
const limit  = ref(20)

const loading = ref(false)
const error = ref('')
const leadersRaw = ref([])

// étiquettes jolies pour l'UI
const metricLabel = computed(() => ({
  ppg: 'Points par match',
  reb: 'Rebonds',
  ast: 'Passes',
  fg3_pct: '3 Points %',
}[metric.value] || metric.value))

// normalisation des différents schémas possibles
function projectMetric(p) {
  if (metric.value === 'ppg') return p.pts
  if (metric.value === 'reb') return p.reb
  if (metric.value === 'ast') return p.ast
  if (metric.value === 'fg3_pct') return p.fg3Pct
  return null
}

const leadersNorm = computed(() => {
  const arr = leadersRaw.value
    .map(p => ({ id: p.id, name: p.name, teamName: p.teamName, teamAbbr: p.teamAbbr, value: projectMetric(p) }))
    .filter(l => l.value != null)
    .sort((a, b) => Number(b.value) - Number(a.value))
  return arr.slice(0, limit.value)
})

// mini bar width (max local)
const maxValue = computed(() => Math.max(1, ...leadersNorm.value.map(l => l.value || 0)))
function barWidth(v) {
  const pct = Math.max(0, Math.min(100, Math.round((v / maxValue.value) * 100)))
  return `${pct}%`
}

// format affichage (PPG avec 1 décimale, % avec 1 décimale + %)
function formatValue(v) {
  if (metric.value === 'fg3_pct') return `${(v * (v > 1 ? 1 : 100) > 1 ? v : v * 100).toFixed(1)}%`
  return Number(v).toFixed(1)
}

async function fetchLeaders() {
  loading.value = true
  error.value = ''
  leadersRaw.value = []

  try {
    const data = await listPlayerTotals({ season: season.value })
    leadersRaw.value = data
  } catch (e) {
    console.error(e)
    error.value = 'Erreur de chargement des leaders (API /api/playertotals).'
  } finally {
    loading.value = false
  }
  }

fetchLeaders()
</script>
