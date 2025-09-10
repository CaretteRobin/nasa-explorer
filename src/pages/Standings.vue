<template>
  <section class="max-w-screen-2xl mx-auto">
    <!-- Header -->
    <div class="rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-6 text-white shadow-lg mb-6">
      <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight">📊 Standings</h1>
          <p class="text-white/80">Classements par saison et conférence.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <select v-model="season" @change="fetchStandings" class="bg-white/90 text-gray-900 rounded-xl px-3 py-2 text-sm">
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
          <div class="bg-white/15 rounded-xl p-1 flex">
            <button
              v-for="c in conferences"
              :key="c.value"
              @click="conf = c.value"
              :class="[
                'px-3 py-1.5 text-sm rounded-lg',
                conf === c.value ? 'bg-white text-gray-900 font-semibold' : 'text-white/90 hover:bg-white/10'
              ]"
            >
              {{ c.label }}
            </button>
          </div>
          <button @click="fetchStandings" class="bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/90">
            Recharger
          </button>
        </div>
      </div>
    </div>

    <!-- States -->
    <div v-if="loading" class="space-y-2">
      <div class="h-12 w-full animate-pulse bg-gray-100 rounded-lg"></div>
      <div class="h-12 w-full animate-pulse bg-gray-100 rounded-lg"></div>
      <div class="h-12 w-full animate-pulse bg-gray-100 rounded-lg"></div>
    </div>

    <p v-else-if="error" class="text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-xl">
      {{ error }}
    </p>

    <div v-else>
      <div class="flex items-center justify-between mb-3">
        <p class="text-sm text-gray-500">
          Saison {{ season }} — {{ confLabel }} — {{ filtered.length }} équipes
        </p>
        <div class="text-xs text-gray-400">Source: /api/games (calcul local)</div>
      </div>

      <div v-if="filtered.length === 0" class="text-gray-500 bg-white border rounded-2xl p-6 text-center">
        Aucun résultat.
      </div>

      <div v-else class="overflow-hidden rounded-xl border bg-white">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 sticky top-0">
            <tr class="text-left">
              <th class="p-3 w-12">#</th>
              <th class="p-3">Équipe</th>
              <th class="p-3">Conf.</th>
              <th class="p-3 text-right">W</th>
              <th class="p-3 text-right">L</th>
              <th class="p-3 text-right">Pct</th>
              <th class="p-3 text-right">Diff</th>
              <th class="p-3 text-right">Streak</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(t, idx) in filtered" :key="t.id" class="border-t">
              <td class="p-3">{{ idx + 1 }}</td>
              <td class="p-3">
                <div class="font-medium">{{ t.teamName }}</div>
                <div class="text-xs text-gray-500">{{ t.teamAbbr }}</div>
              </td>
              <td class="p-3">{{ t.conference || '—' }}</td>
              <td class="p-3 text-right font-semibold">{{ t.w }}</td>
              <td class="p-3 text-right">{{ t.l }}</td>
              <td class="p-3 text-right">
                <span
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded-full border',
                    t.pct >= 0.6 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    t.pct >= 0.5 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                   'bg-gray-50 text-gray-700 border-gray-200'
                  ]"
                >
                  {{ (t.pct * 100).toFixed(1) }}%
                </span>
              </td>
              <td class="p-3 text-right">{{ diffLabel(t) }}</td>
              <td class="p-3 text-right">
                <span :class="['px-2 py-0.5 rounded-full text-xs',
                              t.streak.startsWith('W') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700']">
                  {{ t.streak || '—' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { listGames } from '../api/games'
import { listTeams } from '../api/teams'

const year = new Date().getFullYear()
const years = Array.from({ length: 8 }, (_, i) => year - i)

const season = ref(year)
const conf = ref('all') // 'all' | 'east' | 'west'
const conferences = [
  { value: 'all',  label: 'Toutes' },
  { value: 'east', label: 'Est' },
  { value: 'west', label: 'Ouest' },
]

const loading = ref(false)
const error = ref('')
const rowsRaw = ref([])

/* ----- Helpers UI ----- */
const confLabel = computed(() => conferences.find(c => c.value === conf.value)?.label || 'Toutes')

function diffLabel(t) {
  const d = Number(t.w) - Number(t.l)
  return d > 0 ? `+${d}` : d.toString()
}

/* ----- Normalisation ----- */
const rows = computed(() =>
  rowsRaw.value
    .sort((a, b) => (b.pct - a.pct) || ((b.w - b.l) - (a.w - a.l)))
)

const filtered = computed(() => {
  if (conf.value === 'all') return rows.value
  if (conf.value === 'east') return rows.value.filter(r => r.conference === 'East')
  if (conf.value === 'west') return rows.value.filter(r => r.conference === 'West')
  return rows.value
})

/* ----- Fetch ----- */
async function fetchStandings() {
  loading.value = true
  error.value = ''
  rowsRaw.value = []
  try {
    const [games, teams] = await Promise.all([
      listGames({ season: season.value }),
      listTeams({ season: season.value }),
    ])

    const teamMeta = new Map(teams.map(t => [t.abbr || t.name, t]))
    const acc = new Map()

    for (const g of games) {
      const homeKey = g.homeAbbr || g.homeName
      const awayKey = g.awayAbbr || g.awayName
      const home = acc.get(homeKey) || { teamAbbr: g.homeAbbr, teamName: g.homeName, w: 0, l: 0 }
      const away = acc.get(awayKey) || { teamAbbr: g.awayAbbr, teamName: g.awayName, w: 0, l: 0 }

      if (g.homeScore != null && g.awayScore != null) {
        if (g.homeScore > g.awayScore) { home.w++; away.l++; }
        else if (g.awayScore > g.homeScore) { away.w++; home.l++; }
      }
      acc.set(homeKey, home)
      acc.set(awayKey, away)
    }

    const rows = Array.from(acc.values()).map(r => {
      const t = teamMeta.get(r.teamAbbr || r.teamName)
      const w = Number(r.w) || 0
      const l = Number(r.l) || 0
      const pct = (w + l) > 0 ? w / (w + l) : 0
      return {
        id: r.teamAbbr || r.teamName,
        teamName: t?.name || r.teamName,
        teamAbbr: t?.abbr || r.teamAbbr,
        conference: t?.conference || '',
        w, l, pct,
        streak: '—',
      }
    })

    rowsRaw.value = rows
  } catch (e) {
    console.error(e)
    error.value = 'Erreur de calcul des standings (API /api/games).'
  } finally {
    loading.value = false
  }
}

fetchStandings()
</script>
