<template>
  <section>
    <div class="mb-6 flex flex-wrap items-end gap-3 justify-between">
      <div>
        <h1 class="font-display text-3xl">Mars Rover Photos</h1>
        <p class="text-slate-300">Filter by rover, sol or Earth date, camera</p>
      </div>
      <div class="flex items-center gap-2">
        <select v-model="rover" class="bg-white/10 border border-white/10 rounded px-3 py-2 text-slate-100">
          <option v-for="r in rovers" :key="r.name" :value="r.name.toLowerCase()">{{ r.name }}</option>
        </select>
        <input type="number" v-model.number="sol" placeholder="Sol" class="bg-white/10 border border-white/10 rounded px-3 py-2 w-28 text-slate-100" />
        <input type="date" v-model="earth" class="bg-white/10 border border-white/10 rounded px-3 py-2 text-slate-100" />
        <select v-model="camera" class="bg-white/10 border border-white/10 rounded px-3 py-2 text-slate-100">
          <option value="">All cams</option>
          <option v-for="c in cameras" :key="c" :value="c">{{ c }}</option>
        </select>
        <button @click="load(1)" class="btn-primary">Load</button>
      </div>
    </div>

    <div v-if="error" class="mb-4"><ErrorState :message="'Erreur Mars'" :details="error" /></div>
    <LoadingSpinner v-else-if="loading" />
    <div v-else>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="p in photos" :key="p.id" class="rounded-2xl glass overflow-hidden card-hover">
          <img :src="p.img_src" :alt="p.camera.full_name" class="w-full h-48 object-cover" loading="lazy" />
          <div class="p-3 text-sm">
            <div class="font-medium text-slate-100">{{ p.rover.name }} • {{ p.camera.name }}</div>
            <div class="text-slate-400">Sol {{ p.sol }} • {{ p.earth_date }}</div>
          </div>
        </div>
      </div>
      <div class="mt-6 flex justify-center">
        <Pagination :page="page" :total="totalPages" @update:page="load" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchRovers, fetchRoverPhotos } from '../api/nasa'
import LoadingSpinner from '../components/ui/LoadingSpinner.vue'
import ErrorState from '../components/ui/ErrorState.vue'
import Pagination from '../components/ui/Pagination.vue'

const route = useRoute(); const router = useRouter()
const rovers = ref([])
const rover = ref((route.query.rover || 'curiosity').toLowerCase())
const sol = ref(Number(route.query.sol) || undefined)
const earth = ref(route.query.earth || '')
const camera = ref(route.query.camera || '')
const page = ref(Number(route.query.page) || 1)
const totalPages = ref(50) // unknown, keep pagination usable
const photos = ref([])
const loading = ref(false)
const error = ref('')

const cameras = computed(() => ['FHAZ','RHAZ','MAST','CHEMCAM','NAVCAM','PANCAM','MINITES'])

onMounted(async () => {
  try { rovers.value = await fetchRovers() } catch {}
  load(page.value)
})

async function load(p = 1) {
  try {
    loading.value = true; error.value = ''
    page.value = p
    // Ensure at least one of sol or earth_date is provided for the API
    if (!sol.value && !earth.value) {
      sol.value = 1000
    }
    router.replace({ query: { rover: rover.value, sol: sol.value, earth: earth.value, camera: camera.value, page: p } })
    photos.value = await fetchRoverPhotos({ rover: rover.value, sol: sol.value, earth_date: earth.value, camera: camera.value, page: p })
  } catch (e) { error.value = e.message || String(e) } finally { loading.value = false }
}
</script>
