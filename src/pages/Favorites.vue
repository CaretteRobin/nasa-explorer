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
          Importer<input type="file" class="hidden" accept="application/json,image/*" @change="handleImport" />
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
function handleImport(e) {
  const input = e.target
  const file = input.files?.[0]
  if (!file) return

  const resetInput = () => { input.value = '' }

  if (file.type === 'application/json' || file.name.toLowerCase().endsWith('.json')) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result || '[]')
        if (Array.isArray(parsed)) {
          fav.items = parsed
          fav.save()
        } else {
          window.alert('Le fichier JSON doit contenir une liste de favoris valide.')
        }
      } catch (err) {
        window.alert('Impossible de lire ce fichier JSON.')
      }
      resetInput()
    }
    reader.readAsText(file)
    return
  }

  if (file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const id = `local:${Date.now()}`
        const title = file.name.replace(/\.[^/.]+$/, '')
        const date = new Date().toISOString().slice(0, 10)
        fav.items.unshift({
          id,
          type: 'Image locale',
          title: title || 'Image importée',
          date,
          thumb: reader.result,
        })
        fav.save()
      } catch (err) {
        window.alert('Impossible d’importer cette image.')
      }
      resetInput()
    }
    reader.readAsDataURL(file)
    return
  }

  window.alert('Format de fichier non pris en charge. Veuillez sélectionner une image ou un fichier JSON.')
  resetInput()
}
</script>
