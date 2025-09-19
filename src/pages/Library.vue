<template>
  <section>
    <div class="mb-6 flex flex-wrap items-end gap-3 justify-between">
      <div>
        <h1 class="font-display text-3xl">Bibliothèque d’images et de vidéos NASA</h1>
        <p class="text-slate-300">Rechercher des images, vidéos ou sons avec des filtres</p>
      </div>
      <div class="flex items-center gap-2">
        <input v-model="q" placeholder="Recherche (ex : nébuleuse)" class="bg-white/10 border border-white/10 rounded px-3 py-2 w-64 text-slate-100 placeholder-slate-400" />
        <select v-model="media" class="bg-white/10 border border-white/10 rounded px-3 py-2 text-slate-100">
          <option value="image,video">Images & vidéos</option>
          <option value="image">Images</option>
          <option value="video">Vidéos</option>
          <option value="audio">Audio</option>
        </select>
        <input v-model.number="from" type="number" placeholder="Depuis" class="bg-white/10 border border-white/10 rounded px-3 py-2 w-28 text-slate-100" />
        <input v-model.number="to" type="number" placeholder="Jusqu’à" class="bg-white/10 border border-white/10 rounded px-3 py-2 w-28 text-slate-100" />
        <button @click="load(1)" class="btn-primary">Rechercher</button>
      </div>
    </div>

    <div v-if="error" class="mb-4"><ErrorState :message="'Erreur médiathèque'" :details="error" /></div>
    <template v-else-if="loading">
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <SkeletonScan v-for="i in 8" :key="i" height="12rem" />
      </div>
    </template>
    <div v-else>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <MediaCard v-for="it in items" :key="it.data?.[0]?.nasa_id" :title="it.data?.[0]?.title" :thumb="it.links?.[0]?.href">
          <template #meta>
            <span>{{ it.data?.[0]?.media_type }}</span>
            <span>•</span>
            <span>{{ (it.data?.[0]?.date_created || '').slice(0,10) }}</span>
          </template>
          <a class="text-cyan-300 hover:text-cyan-200 text-sm" :href="detailUrl(it)" target="_blank" rel="noreferrer">Ouvrir</a>
        </MediaCard>
      </div>
      <div class="mt-6 flex justify-center">
        <Pagination :page="page" :total="totalPages" @update:page="load" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchLibrary } from '../api/nasa'
import LoadingSpinner from '../components/ui/LoadingSpinner.vue'
import ErrorState from '../components/ui/ErrorState.vue'
import Pagination from '../components/ui/Pagination.vue'
import MediaCard from '../components/MediaCard.vue'

const route = useRoute(); const router = useRouter()
const q = ref(route.query.q || 'nebula')
const media = ref(route.query.media_type || 'image,video')
const from = ref(Number(route.query.year_start) || 1995)
const to = ref(Number(route.query.year_end) || new Date().getFullYear())
const page = ref(Number(route.query.page) || 1)
const totalPages = ref(1)
const items = ref([])
const loading = ref(false)
const error = ref('')

async function load(p = 1) {
  try {
    loading.value = true; error.value = ''
    page.value = p
    router.replace({ query: { q: q.value, media_type: media.value, year_start: from.value, year_end: to.value, page: p } })
    const { items: list, meta } = await searchLibrary({ q: q.value, media_type: media.value, year_start: from.value, year_end: to.value, page: p })
    items.value = list
    totalPages.value = Math.max(1, Math.ceil((meta.total || 0)/100))
  } catch (e) { error.value = e.message || String(e) } finally { loading.value = false }
}

load(page.value)

function detailUrl(it) {
  const id = it?.data?.[0]?.nasa_id || ''
  return id ? `https://images.nasa.gov/details-${id}.html` : '#'
}
</script>
