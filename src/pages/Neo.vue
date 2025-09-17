<template>
  <section>
    <div class="mb-6 flex flex-wrap items-end gap-3 justify-between">
      <div>
        <h1 class="font-display text-3xl">Near-Earth Objects</h1>
        <p class="text-slate-300">Today or 7-day range; sort and highlight hazardous objects</p>
      </div>
      <div class="flex items-center gap-2">
        <select v-model="mode" class="bg-white/10 border border-white/10 rounded px-3 py-2 text-slate-100">
          <option value="today">Today</option>
          <option value="range">Range (7 days)</option>
        </select>
        <button @click="load" class="btn-primary">Load</button>
      </div>
    </div>

    <div v-if="error" class="mb-4"><ErrorState :message="'Erreur NEO'" :details="error" /></div>
    <LoadingSpinner v-else-if="loading" />
    <div v-else class="overflow-x-auto rounded-2xl glass">
      <table class="min-w-full text-sm">
        <thead class="bg-white/5 text-slate-300">
          <tr>
            <th class="px-3 py-2 text-left">Name</th>
            <th class="px-3 py-2">PHA</th>
            <th class="px-3 py-2">Mag</th>
            <th class="px-3 py-2">Size (m)</th>
            <th class="px-3 py-2">Velocity (km/s)</th>
            <th class="px-3 py-2">Miss Dist (km)</th>
            <th class="px-3 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in rows" :key="o.id" :class="[o.hazardous ? 'bg-rose-500/10' : 'odd:bg-white/0 even:bg-white/5', 'hover:bg-cyan-500/10 transition']">
            <td class="px-3 py-2">{{ o.name }}</td>
            <td class="px-3 py-2 text-center"><span :class="['px-2 py-0.5 rounded text-xs', o.hazardous ? 'bg-rose-500/20 text-rose-200' : 'bg-emerald-500/20 text-emerald-200']">{{ o.hazardous ? 'Yes' : 'No' }}</span></td>
            <td class="px-3 py-2 text-center">{{ o.mag }}</td>
            <td class="px-3 py-2 text-center">{{ o.size }}</td>
            <td class="px-3 py-2 text-center">{{ o.vel }}</td>
            <td class="px-3 py-2 text-center">{{ o.miss }}</td>
            <td class="px-3 py-2 text-center">{{ o.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { fetchNeoToday, fetchNeoRange } from '../api/nasa'
import LoadingSpinner from '../components/ui/LoadingSpinner.vue'
import ErrorState from '../components/ui/ErrorState.vue'

const mode = ref('today')
const rows = ref([])
const loading = ref(false)
const error = ref('')

async function load() {
  try {
    loading.value = true; error.value = ''
    const data = mode.value === 'today' ? await fetchNeoToday() : await fetchNeoRange(new Date().toISOString().slice(0,10), new Date(Date.now()+6*24*3600*1000).toISOString().slice(0,10))
    const flat = []
    const map = data.near_earth_objects || {}
    Object.keys(map).forEach((date) => {
      for (const o of map[date] || []) {
        const ca = o.close_approach_data?.[0]
        flat.push({
          id: o.id,
          name: o.name,
          hazardous: !!o.is_potentially_hazardous_asteroid,
          mag: o.absolute_magnitude_h,
          size: Math.round(((o.estimated_diameter?.meters?.estimated_diameter_min || 0) + (o.estimated_diameter?.meters?.estimated_diameter_max || 0))/2),
          vel: Number(ca?.relative_velocity?.kilometers_per_second || 0).toFixed(2),
          miss: Math.round(Number(ca?.miss_distance?.kilometers || 0)).toLocaleString(),
          date,
        })
      }
    })
    flat.sort((a,b) => Number(a.miss.replace(/,/g,'')) - Number(b.miss.replace(/,/g,'')))
    rows.value = flat
  } catch (e) { error.value = e.message || String(e) } finally { loading.value = false }
}

load()
</script>
