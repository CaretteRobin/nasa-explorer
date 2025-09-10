<template>
  <section class="relative">
    <!-- Hero full-bleed -->
    <div class="relative -mx-6 lg:-mx-10 px-6 lg:px-10 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 text-white py-10 shadow-xl">
      <div class="absolute inset-0 opacity-20" aria-hidden="true">
        <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M24 0H0v24" fill="none" stroke="currentColor" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div class="relative z-10 max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-6">
        <div class="flex-1">
          <h1 class="text-4xl lg:text-5xl font-extrabold tracking-tight">🏀 NBA Explore</h1>
          <p class="mt-3 text-white/90 text-lg max-w-2xl">
            Explorez joueurs, équipes, matchs, classements et leaders — en un clin d’œil.
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <router-link to="/players" class="px-5 py-2.5 bg-white/95 text-gray-900 rounded-xl font-semibold shadow hover:bg-white">Explorer les joueurs</router-link>
            <router-link to="/teams" class="px-5 py-2.5 bg-white/15 rounded-xl font-semibold hover:bg-white/20">Voir les équipes</router-link>
            <router-link to="/games" class="px-5 py-2.5 bg-white/15 rounded-xl font-semibold hover:bg-white/20">Matchs</router-link>
          </div>
        </div>
        <div class="w-full lg:w-auto">
          <!-- Carte état API -->
          <div class="backdrop-blur bg-white/10 rounded-2xl p-5 border border-white/20 shadow-xl w-full lg:w-80">
            <div class="flex items-center justify-between">
              <h2 class="font-semibold">État de l’API</h2>
              <ApiStatusPill :status="apiStatus">{{ apiStatusLabel }}</ApiStatusPill>
            </div>
            <div class="mt-4 grid grid-cols-3 gap-3 text-center">
              <div class="bg-white/10 rounded-xl p-3">
                <div class="text-2xl font-extrabold">{{ teamsCount ?? '—' }}</div>
                <div class="text-xs text-white/70">Teams</div>
              </div>
              <div class="bg-white/10 rounded-xl p-3">
                <div class="text-2xl font-extrabold">{{ playersCount ?? '—' }}</div>
                <div class="text-xs text-white/70">Players (échant.)</div>
              </div>
              <div class="bg-white/10 rounded-xl p-3">
                <div class="text-2xl font-extrabold">{{ todayCount ?? '—' }}</div>
                <div class="text-xs text-white/70">Matchs (auj.)</div>
              </div>
            </div>
            <button @click="probeApi" class="mt-4 w-full px-4 py-2 rounded-xl bg-white/90 text-gray-900 font-semibold hover:bg-white">
              Re-tester
            </button>
            <p v-if="apiError" class="mt-2 text-xs text-rose-200">{{ apiError }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sections -->
    <div class="max-w-screen-2xl mx-auto mt-10 grid lg:grid-cols-3 gap-6">
      <!-- Cartes de navigation -->
      <div class="lg:col-span-2 grid sm:grid-cols-2 gap-6">
        <router-link to="/players" class="group bg-white rounded-2xl border shadow-sm p-6 hover:shadow-xl transition">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Joueurs</h3>
            <span class="opacity-0 group-hover:opacity-100 transition text-indigo-600">→</span>
          </div>
          <p class="mt-2 text-gray-500 text-sm">Recherche par nom, équipe, filtres avancés (bientôt).</p>
          <div class="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-indigo-500 w-2/3 group-hover:w-5/6 transition-all"></div>
          </div>
        </router-link>

        <router-link to="/teams" class="group bg-white rounded-2xl border shadow-sm p-6 hover:shadow-xl transition">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Équipes</h3>
            <span class="opacity-0 group-hover:opacity-100 transition text-indigo-600">→</span>
          </div>
          <p class="mt-2 text-gray-500 text-sm">Roster, conférences, métriques d’équipe.</p>
          <div class="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-fuchsia-500 w-1/2 group-hover:w-2/3 transition-all"></div>
          </div>
        </router-link>

        <router-link to="/games" class="group bg-white rounded-2xl border shadow-sm p-6 hover:shadow-xl transition">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Matchs</h3>
            <span class="opacity-0 group-hover:opacity-100 transition text-indigo-600">→</span>
          </div>
          <p class="mt-2 text-gray-500 text-sm">Par date, score par quart-temps, leaders du match.</p>
          <div class="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-purple-500 w-2/5 group-hover:w-3/5 transition-all"></div>
          </div>
        </router-link>

        <router-link to="/standings" class="group bg-white rounded-2xl border shadow-sm p-6 hover:shadow-xl transition">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Classements</h3>
            <span class="opacity-0 group-hover:opacity-100 transition text-indigo-600">→</span>
          </div>
          <p class="mt-2 text-gray-500 text-sm">Standings par saison, conférences, net rating (à venir).</p>
          <div class="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-emerald-500 w-3/5 group-hover:w-4/5 transition-all"></div>
          </div>
        </router-link>
      </div>

      <!-- Matchs du jour (aperçu) -->
      <div class="bg-white rounded-2xl border shadow-sm p-6">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Matchs du jour</h3>
          <input
            v-model="date"
            type="date"
            class="border rounded-lg px-3 py-1.5 text-sm"
            @change="fetchTodayGames"
          />
        </div>
        <div class="mt-4 space-y-2">
          <template v-if="gamesLoading">
            <LoadingSkeleton size="md" />
            <LoadingSkeleton size="md" />
            <LoadingSkeleton size="md" />
          </template>
          <template v-else-if="gamesError">
            <ErrorAlert :message="gamesError" />
          </template>
          <template v-else-if="todayGames.length === 0">
            <EmptyState>Aucun match pour cette date.</EmptyState>
          </template>
          <ul v-else class="divide-y">
            <li v-for="g in todayGames" :key="g.id" class="py-2 flex items-center justify-between">
              <div class="text-sm">
                <div class="font-medium">{{ g.homeName }}</div>
                <div class="text-gray-500">{{ g.awayName }}</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold">
                  {{ g.homeScore ?? '—' }} - {{ g.awayScore ?? '—' }}
                </div>
                <div class="text-xs text-gray-500">{{ g.date }}</div>
              </div>
            </li>
          </ul>
        </div>
        <router-link to="/games" class="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:underline">
          Voir tous les matchs <span>→</span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { listGames } from '../api/games'
import { listTeams } from '../api/teams'
import { listPlayerTotals } from '../api/players'
import ApiStatusPill from '../components/ui/ApiStatusPill.vue'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.vue'
import ErrorAlert from '../components/ui/ErrorAlert.vue'
import EmptyState from '../components/ui/EmptyState.vue'

// ---- UI state
const teamsCount = ref(null)
const playersCount = ref(null)
const todayCount = ref(null)
const apiStatus = ref('warn') // 'ok' | 'warn' | 'down'
const apiError = ref('')

// ---- date du jour (Europe/Paris friendly)
const date = ref(new Date().toISOString().slice(0, 10))

// ---- matchs du jour
const todayGames = ref([])
const gamesLoading = ref(false)
const gamesError = ref('')

const apiStatusLabel = computed(() => ({
  ok: 'Opérationnel',
  warn: 'Partiel',
  down: 'Hors-ligne'
}[apiStatus.value] || 'Inconnu'))

async function probeApi() {
  apiError.value = ''
  try {
    // 1) Teams (compte via dérivation playertotals)
    const t = await listTeams()
    teamsCount.value = t.length

    // 2) Players (échantillon playertotals)
    const p = await listPlayerTotals({})
    playersCount.value = Array.isArray(p) ? Math.min(10, p.length) : null

    // 3) Games du jour (compte)
    const g = await fetchGamesByDate(date.value, true)
    todayCount.value = Array.isArray(g) ? g.length : null

    // statut
    apiStatus.value = (teamsCount.value && playersCount.value != null) ? 'ok' : 'warn'
  } catch (e) {
    apiStatus.value = 'down'
    apiError.value = 'Impossible de joindre l’API (vérifie .env et les chemins).'
  }
}

async function fetchTodayGames() {
  gamesError.value = ''
  gamesLoading.value = true
  try {
    todayGames.value = await fetchGamesByDate(date.value, false)
  } catch (e) {
    gamesError.value = 'Erreur de chargement des matchs.'
  } finally {
    gamesLoading.value = false
  }
}

async function fetchGamesByDate(isoDate, returnOnly = false) {
  try {
    const data = await listGames({ date: isoDate })
    return data
  } catch (e) {
    if (returnOnly) return []
    throw e
  }
}

onMounted(async () => {
  await probeApi()
  await fetchTodayGames()
})
</script>

<style scoped>
/* micro-améliorations */
</style>
