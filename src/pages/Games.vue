<template>
  <section class="max-w-screen-2xl mx-auto">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-6">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight">📅 Games</h1>
        <p class="text-gray-500">Consulte les matchs par date, filtre par statut ou équipe.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <input v-model="date" type="date" class="border rounded-lg px-3 py-2 text-sm" />
        <select v-model="status" class="border rounded-lg px-3 py-2 text-sm">
          <option value="">Tous statuts</option>
          <option value="scheduled">Programmé</option>
          <option value="in_progress">En cours</option>
          <option value="final">Terminé</option>
        </select>
        <input v-model.trim="teamQuery" type="search" placeholder="Filtrer équipe (ex: Lakers)"
               class="border rounded-lg px-3 py-2 text-sm w-48" />
        <button @click="fetchGames" class="bg-black text-white px-4 py-2 rounded-lg text-sm">
          Recharger
        </button>
      </div>
    </div>

    <!-- States -->
    <div v-if="loading" class="space-y-2">
      <LoadingSkeleton size="md" />
      <LoadingSkeleton size="md" />
      <LoadingSkeleton size="md" />
    </div>

    <ErrorAlert v-else-if="error" :message="error" />

    <div v-else>
      <div class="flex items-center justify-between mb-3">
        <p class="text-sm text-gray-500">
          {{ filteredGames.length }} match{{ filteredGames.length > 1 ? 's' : '' }}
          — {{ date }}
        </p>
        <div class="text-xs text-gray-400">Source: /api/games</div>
      </div>

      <EmptyState v-if="filteredGames.length === 0">Aucun match ne correspond à tes filtres.</EmptyState>

      <div v-else class="overflow-hidden rounded-xl border bg-white">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 sticky top-0">
            <tr class="text-left">
              <th class="p-3">Heure</th>
              <th class="p-3">Domicile</th>
              <th class="p-3">Extérieur</th>
              <th class="p-3">Score</th>
              <th class="p-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="g in filteredGames" :key="g.id" class="border-t">
              <td class="p-3 whitespace-nowrap">{{ g.time }}</td>
              <td class="p-3">
                <div class="font-medium">{{ g.homeName }}</div>
                <div class="text-xs text-gray-500">{{ g.homeAbbr }}</div>
              </td>
              <td class="p-3">
                <div class="font-medium">{{ g.awayName }}</div>
                <div class="text-xs text-gray-500">{{ g.awayAbbr }}</div>
              </td>
              <td class="p-3 font-semibold">
                <span v-if="g.homeScore != null && g.awayScore != null">
                  {{ g.homeScore }} - {{ g.awayScore }}
                </span>
                <span v-else class="text-gray-400">—</span>
              </td>
              <td class="p-3">
                <span
                  :class="[
                    'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border',
                    g.status === 'final' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    g.status === 'in_progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-gray-50 text-gray-700 border-gray-200'
                  ]"
                >
                  <span class="w-1.5 h-1.5 rounded-full"
                        :class="g.status === 'final' ? 'bg-emerald-500' : g.status === 'in_progress' ? 'bg-amber-500' : 'bg-gray-400'"></span>
                  {{ statusLabel(g.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination simple si l'API renvoie beaucoup d'éléments (placeholder)
      <div class="mt-4 flex justify-end gap-2">
        <button class="px-3 py-1 border rounded">Précédent</button>
        <button class="px-3 py-1 border rounded">Suivant</button>
      </div>
      -->
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { listGames } from '../api/games'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.vue'
import ErrorAlert from '../components/ui/ErrorAlert.vue'
import EmptyState from '../components/ui/EmptyState.vue'

const date = ref(new Date().toISOString().slice(0, 10))
const status = ref('')        // '', 'scheduled', 'in_progress', 'final'
const teamQuery = ref('')

const rawGames = ref([])
const loading = ref(false)
const error = ref('')

// Data from API module already normalized
const games = computed(() => rawGames.value)

const filteredGames = computed(() => {
  return games.value.filter(g => {
    const statusOk = !status.value || g.status === status.value
    const teamOk = !teamQuery.value
      || g.homeName.toLowerCase().includes(teamQuery.value.toLowerCase())
      || g.awayName.toLowerCase().includes(teamQuery.value.toLowerCase())
    return statusOk && teamOk
  })
})

function statusLabel(s) {
  return s === 'final' ? 'Terminé'
    : s === 'in_progress' ? 'En cours'
    : s === 'scheduled' ? 'Programmé'
    : 'Inconnu'
}

async function fetchGames() {
  loading.value = true
  error.value = ''
  rawGames.value = []

  try {
    const data = await listGames({ date: date.value })
    rawGames.value = data

    // tri par heure si possible
    rawGames.value.sort((a, b) => {
      const ad = new Date(a.date || 0).getTime()
      const bd = new Date(b.date || 0).getTime()
      return ad - bd
    })
  } catch (e) {
    console.error(e)
    error.value = 'Erreur de chargement des matchs (API /api/games).'
  } finally {
    loading.value = false
  }
}

fetchGames()
</script>
