<template>
  <section>
    <div class="mb-6 flex flex-wrap items-end gap-3 justify-between">
      <div>
        <h1 class="font-display text-3xl">Galerie APOD</h1>
        <p class="text-slate-300">Parcourir l’image astronomique du jour sur une plage de dates</p>
        <p v-if="nasaOffline" class="mt-2 text-xs uppercase tracking-[0.3em] text-cyan-200/80">Mode démo&nbsp;: les images proviennent d’une sélection locale.</p>
      </div>
      <div class="flex items-center gap-2">
        <input type="date" v-model="from" class="bg-white/10 border border-white/10 rounded px-3 py-2 placeholder-slate-400 text-slate-100" />
        <input type="date" v-model="to" class="bg-white/10 border border-white/10 rounded px-3 py-2 placeholder-slate-400 text-slate-100" />
        <button @click="load" class="btn-primary">Charger</button>
      </div>
    </div>

    <div v-if="error" class="mb-4"><ErrorState :message="'Erreur APOD'" :details="error" /></div>
    <template v-else-if="loading">
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <SkeletonScan v-for="i in 8" :key="i" height="12rem" />
      </div>
    </template>
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="item in items" :key="item.date" class="rounded-2xl glass overflow-hidden hover:border-cyan-400/30 card-hover">
        <div class="aspect-video bg-black">
          <img v-if="item.media_type==='image'" :src="item.url" :alt="item.title" class="w-full h-full object-cover" />
          <img v-else :src="item.thumbnail_url" :alt="item.title" class="w-full h-full object-cover" />
        </div>
        <div class="p-3">
          <div class="font-medium text-slate-100 truncate">{{ item.title }}</div>
          <div class="text-xs text-slate-400">{{ item.date }}</div>
          <div class="mt-2 flex items-center gap-3">
            <button class="text-cyan-300 hover:text-cyan-200 text-sm" @click="open(item)">Détails</button>
            <button class="text-pink-300 hover:text-pink-200 text-sm" @click="toggleFav(item)">{{ isFav(item) ? 'Retirer des favoris' : 'Ajouter aux favoris' }}</button>
          </div>
        </div>
      </div>
    </div>

    <Modal :open="show" @close="show=false">
      <div class="p-4">
        <div class="text-xl font-medium">{{ current?.title }}</div>
        <div class="text-slate-400 text-sm">{{ current?.date }}</div>
      </div>
      <div class="max-h-[70vh] overflow-auto">
        <img v-if="current?.media_type==='image'" :src="current?.hdurl || current?.url" :alt="current?.title" class="w-full h-auto" />
        <img v-else :src="current?.thumbnail_url" :alt="current?.title" class="w-full h-auto" />
      </div>
      <div class="p-4 text-slate-300 text-sm">{{ current?.explanation }}</div>
    </Modal>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { fetchApodRange } from '../api/nasa'
import LoadingSpinner from '../components/ui/LoadingSpinner.vue'
import ErrorState from '../components/ui/ErrorState.vue'
import Modal from '../components/ui/Modal.vue'
import { useFavorites } from '../stores/favorites'
import { useStatusStore } from '../stores/status'

const route = useRoute(); const router = useRouter()
const today = new Date().toISOString().slice(0,10)
const lastWeek = new Date(Date.now()-7*24*3600*1000).toISOString().slice(0,10)
const from = ref(route.query.from || lastWeek)
const to = ref(route.query.to || today)
const items = ref([])
const loading = ref(false)
const error = ref('')
const show = ref(false)
const current = ref(null)
const fav = useFavorites(); fav.load()
const statusStore = useStatusStore()
const { nasaOffline } = storeToRefs(statusStore)

async function load() {
  try {
    loading.value = true; error.value = ''
    router.replace({ query: { from: from.value, to: to.value } })
    items.value = await fetchApodRange(from.value, to.value)
  } catch (e) { error.value = e.message || String(e) } finally { loading.value = false }
}

function open(item) { current.value = item; show.value = true }

function favKey(it) { return `apod:${it.date}` }
function isFav(it) { return fav.items.some((i) => i.id === favKey(it)) }
function toggleFav(it) {
  fav.toggle({
    id: favKey(it),
    type: 'APOD',
    title: it.title,
    date: it.date,
    thumb: it.media_type === 'image' ? (it.url || it.thumbnail_url) : (it.thumbnail_url || it.url),
  })
}

load()
</script>
