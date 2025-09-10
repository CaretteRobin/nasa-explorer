<template>
  <section class="max-w-screen-2xl mx-auto">
    <!-- Header -->
    <div class="rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-6 text-white shadow-lg mb-6">
      <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight">🔎 Players</h1>
          <p class="text-white/80">Recherchez des joueurs par nom, équipe et position, avec pagination.</p>
        </div>
        <form @submit.prevent class="flex flex-wrap gap-2">
          <input
            v-model="q"
            type="search"
            placeholder="Nom du joueur (ex: LeBron)"
            class="bg-white/90 text-gray-900 rounded-xl px-3 py-2 text-sm w-64"
          />
          <select v-model="team" class="bg-white/90 text-gray-900 rounded-xl px-3 py-2 text-sm w-44">
            <option value="">Toutes équipes</option>
            <option v-for="t in teams" :key="t.id" :value="t.abbr">{{ t.name }} ({{ t.abbr }})</option>
          </select>
          <select v-model="position" class="bg-white/90 text-gray-900 rounded-xl px-3 py-2 text-sm w-36">
            <option value="">Toutes positions</option>
            <option value="G">G</option>
            <option value="F">F</option>
            <option value="C">C</option>
            <option value="GF">G/F</option>
            <option value="FC">F/C</option>
          </select>
          <select v-model.number="perPage" class="bg-white/90 text-gray-900 rounded-xl px-3 py-2 text-sm w-28">
            <option :value="12">12</option>
            <option :value="24">24</option>
            <option :value="48">48</option>
          </select>
        </form>
      </div>
    </div>

    <!-- States -->
    <div v-if="loading" class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <LoadingSkeleton v-for="i in 12" :key="i" size="lg" />
    </div>

    <ErrorAlert v-else-if="error" :message="error" />

    <div v-else>
      <div class="flex items-center justify-between mb-3">
        <p class="text-sm text-gray-500">
          {{ total }} résultat{{ total > 1 ? 's' : '' }} · page {{ page }} / {{ totalPages || 1 }}
        </p>
        <div class="text-xs text-gray-400">Source: /api/playertotals</div>
      </div>

      <EmptyState v-if="players.length === 0">Aucun joueur ne correspond à ces filtres.</EmptyState>

      <ul v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <li v-for="p in players" :key="p.id" class="group bg-white rounded-2xl border shadow-sm p-4 hover:shadow-xl transition">
          <div class="flex items-center gap-3">
            <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white
                        grid place-items-center text-lg font-bold">
              {{ initials(p.name) }}
            </div>
            <div class="min-w-0">
              <div class="font-semibold truncate">{{ p.name }}</div>
              <div class="text-xs text-gray-500 truncate">{{ p.teamName || '—' }}</div>
            </div>
          </div>
          <div class="mt-3 flex items-center justify-between text-xs text-gray-600">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-50 border">
              POS: <strong class="font-semibold">{{ p.position || '—' }}</strong>
            </span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-50 border">
              {{ p.height || '—' }} · {{ p.weight || '—' }}
            </span>
          </div>
        </li>
      </ul>

      <!-- Pagination -->
      <div class="mt-6 flex flex-wrap items-center justify-between gap-2">
        <div class="text-xs text-gray-500">
          Affiche {{ players.length }} sur {{ total }} — {{ perPage }} / page
        </div>
        <div class="flex items-center gap-2">
          <button
            class="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50"
            :disabled="page <= 1"
            @click="goPage(page - 1)"
          >
            ← Précédent
          </button>
          <button
            class="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50"
            :disabled="page >= totalPages"
            @click="goPage(page + 1)"
          >
            Suivant →
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { listPlayerTotals } from '../api/players'
import { listTeams } from '../api/teams'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.vue'
import ErrorAlert from '../components/ui/ErrorAlert.vue'
import EmptyState from '../components/ui/EmptyState.vue'

const route = useRoute()
const router = useRouter()

/** ------- Filtres & état ------- */
const q        = ref(route.query.q?.toString() || '')
const team     = ref(route.query.team?.toString() || '')
const position = ref(route.query.pos?.toString() || '')
const perPage  = ref(Number(route.query.perPage) || 24)
const page     = ref(Number(route.query.page) || 1)

const total       = ref(0)
const totalPages  = ref(1)
const loading     = ref(false)
const error       = ref('')

const playersRaw  = ref([])
// listPlayerTotals already returns normalized rows
const players     = computed(() => playersRaw.value)

/** ------- Teams pour le filtre ------- */
const teams = ref([])
async function fetchTeams() {
  try { teams.value = await listTeams() } catch {}
}

/** ------- Normalisation joueurs ------- */
// déjà normalisés par listPlayerTotals

function initials(name) {
  return name.split(' ').filter(Boolean).slice(0,2).map(s => s[0]).join('').toUpperCase()
}

/** ------- Fetch joueurs avec fallbacks ------- */
let debounceId
watch([q, team, position, perPage, page], () => {
  clearTimeout(debounceId)
  debounceId = setTimeout(() => {
    syncQuery()
    fetchPlayers()
  }, 300)
})

function syncQuery() {
  const query = {
    ...(q.value ? { q: q.value } : {}),
    ...(team.value ? { team: team.value } : {}),
    ...(position.value ? { pos: position.value } : {}),
    ...(perPage.value !== 24 ? { perPage: perPage.value } : {}),
    ...(page.value !== 1 ? { page: page.value } : {}),
  }
  router.replace({ query })
}

async function fetchPlayers() {
  loading.value = true
  error.value = ''
  playersRaw.value = []

  // client-side filtering & pagination for playertotals
  try {
    const all = await listPlayerTotals({})
    // filter client-side
    let filtered = all
    if (q.value) {
      const qq = q.value.toLowerCase()
      filtered = filtered.filter(p => p.name.toLowerCase().includes(qq))
    }
    if (team.value) filtered = filtered.filter(p => p.teamAbbr === team.value)
    if (position.value) filtered = filtered.filter(p => (p.position || '').includes(position.value))

    total.value = filtered.length
    const start = (page.value - 1) * perPage.value
    const end = start + perPage.value
    playersRaw.value = filtered.slice(start, end)
    totalPages.value = Math.max(1, Math.ceil(total.value / perPage.value))
  } catch (e) {
    console.error(e)
    error.value = 'Erreur de chargement des joueurs (API /api/playertotals).'
  } finally {
    loading.value = false
  }
}

function goPage(p) {
  page.value = Math.max(1, Math.min(p, totalPages.value || p))
}

onMounted(async () => {
  await fetchTeams()
  await fetchPlayers()
})
</script>
