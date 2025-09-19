<template>
  <section>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="font-display text-3xl">Favoris</h1>
        <p class="text-slate-300">Vos APOD et éléments de la médiathèque sauvegardés</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="exportJson" class="px-3 py-2 rounded bg-white/10 hover:bg-white/20">Exporter</button>
        <label class="px-3 py-2 rounded bg-white/10 hover:bg-white/20 cursor-pointer">
          Importer<input type="file" class="hidden" accept="application/json" @change="importJson" />
        </label>
        <button @click="clear" class="px-3 py-2 rounded bg-rose-500/20 text-rose-200 hover:bg-rose-500/30">Tout effacer</button>
      </div>
    </div>

    <div v-if="items.length===0"><EmptyState label="Aucun favori" /></div>
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <MediaCard v-for="it in items" :key="it.id" :title="it.title" :thumb="it.thumb">
        <template #meta>
          <span>{{ it.type }}</span>
          <span>•</span>
          <span>{{ it.date }}</span>
        </template>
        <button @click="remove(it)" class="text-rose-300 hover:text-rose-200 text-sm">Retirer</button>
      </MediaCard>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useFavorites } from '../stores/favorites'
import EmptyState from '../components/ui/EmptyState.vue'
import MediaCard from '../components/MediaCard.vue'

const fav = useFavorites(); fav.load()
const items = computed(() => fav.items)

function remove(it) { fav.toggle(it) }
function clear() { fav.clear() }
function exportJson() {
  const blob = new Blob([JSON.stringify(items.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'favorites.json'; a.click(); URL.revokeObjectURL(url)
}
function importJson(e) {
  const file = e.target.files?.[0]; if (!file) return
  const reader = new FileReader(); reader.onload = () => { try { fav.items = JSON.parse(reader.result); fav.save() } catch {} }
  reader.readAsText(file)
}
</script>

