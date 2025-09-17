<template>
  <section>
    <div class="mb-6 flex flex-wrap items-end gap-3 justify-between">
      <div>
        <h1 class="font-display text-3xl">EPIC Earth</h1>
        <p class="text-slate-300">Natural or Enhanced; browse by date</p>
      </div>
      <div class="flex items-center gap-2">
        <select v-model="mode" class="bg-white/10 border border-white/10 rounded px-3 py-2 text-slate-100">
          <option value="natural">Natural</option>
          <option value="enhanced">Enhanced</option>
        </select>
        <select v-model="date" class="bg-white/10 border border-white/10 rounded px-3 py-2 text-slate-100">
          <option v-for="d in dates" :key="d" :value="d">{{ d }}</option>
        </select>
        <button @click="load" class="btn-primary">Load</button>
      </div>
    </div>
    <div v-if="isDemo" class="mb-4 text-xs text-slate-400">Mode démo activé: données EPIC simulées.</div>

    <div v-if="error" class="mb-4"><ErrorState :message="'Erreur EPIC'" :details="error" /></div>
    <LoadingSpinner v-else-if="loading" />
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="e in items" :key="e.identifier" class="rounded-2xl glass overflow-hidden card-hover">
        <img :src="imgUrl(e)" :alt="e.caption" class="w-full h-48 object-cover" loading="lazy" />
        <div class="p-3 text-sm">
          <div class="font-medium text-slate-100">{{ e.date }}</div>
          <div class="text-slate-400 truncate">{{ e.caption }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { fetchEpicDates, fetchEpicByDate, epicImageUrl } from '../api/nasa'
import LoadingSpinner from '../components/ui/LoadingSpinner.vue'
import ErrorState from '../components/ui/ErrorState.vue'

const mode = ref('natural')
const dates = ref([])
const date = ref('')
const items = ref([])
const loading = ref(false)
const error = ref('')
const isDemo = String(import.meta.env.VITE_DEMO_MODE || 'false') === 'true'

onMounted(async () => {
  dates.value = await fetchEpicDates(mode.value)
  date.value = dates.value.at(-1) || ''
  load()
})

watch(mode, async () => {
  dates.value = await fetchEpicDates(mode.value)
  date.value = dates.value.at(-1) || ''
})

async function load() {
  try { loading.value = true; error.value = ''
    items.value = await fetchEpicByDate(mode.value, date.value)
  } catch (e) { error.value = e.message || String(e) } finally { loading.value = false }
}

function imgUrl(e) { return epicImageUrl(mode.value, e.date.slice(0,10), e.image) }
</script>
