<template>
  <section class="max-w-screen-2xl mx-auto">
    <!-- Header -->
    <div class="rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-6 text-white shadow-lg mb-6">
      <h1 class="text-3xl font-extrabold tracking-tight">🏟️ Teams</h1>
      <p class="text-white/80">Toutes les équipes NBA, par conférence.</p>
    </div>

    <!-- States -->
    <div v-if="loading" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="h-40 bg-gray-100 animate-pulse rounded-2xl"></div>
    </div>

    <p v-else-if="error" class="text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-xl">
      {{ error }}
    </p>

    <div v-else>
      <div class="flex items-center justify-between mb-4">
        <p class="text-sm text-gray-500">{{ teams.length }} équipes</p>
        <div class="flex gap-2">
          <button
            v-for="c in conferences"
            :key="c.value"
            @click="conf = c.value"
            :class="[
              'px-3 py-1.5 text-sm rounded-lg border',
              conf === c.value ? 'bg-black text-white font-semibold' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ c.label }}
          </button>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="t in filtered"
          :key="t.id"
          class="group bg-white rounded-2xl border shadow-sm p-5 hover:shadow-xl transition flex flex-col"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white grid place-items-center text-lg font-bold">
              {{ t.abbr }}
            </div>
            <span
              :class="[
                'text-xs px-2 py-0.5 rounded-full border',
                t.conference === 'East' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                t.conference === 'West' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                           'bg-gray-50 text-gray-700 border-gray-200'
              ]"
            >
              {{ t.conference || '—' }}
            </span>
          </div>

          <h2 class="font-semibold text-lg leading-tight">{{ t.name }}</h2>
          <p class="text-sm text-gray-500">{{ t.city }}</p>

          <div class="mt-auto pt-4 flex justify-between items-center text-xs text-gray-500">
            <span>{{ t.division || '—' }}</span>
            <router-link
              :to="{ name: 'players', query: { team: t.abbr } }"
              class="text-indigo-600 hover:underline"
            >
              Voir joueurs →
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { listTeams } from '../api/teams'

const loading = ref(false)
const error = ref('')
const teamsRaw = ref([])
const conf = ref('all')

const conferences = [
  { value: 'all', label: 'Toutes' },
  { value: 'East', label: 'Est' },
  { value: 'West', label: 'Ouest' },
]

// teams already normalized by API module

const teams = computed(() =>
  teamsRaw.value
)

const filtered = computed(() =>
  conf.value === 'all' ? teams.value : teams.value.filter(t => t.conference === conf.value)
)

async function fetchTeams() {
  loading.value = true
  error.value = ''
  teamsRaw.value = []
  try {
    teamsRaw.value = await listTeams()
  } catch (e) {
    console.error(e)
    error.value = 'Erreur de chargement des équipes (dérivation /api/playertotals).'
  } finally {
    loading.value = false
  }
}

onMounted(fetchTeams)
</script>
