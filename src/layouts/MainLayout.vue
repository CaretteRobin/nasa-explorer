<template>
  <div class="min-h-screen relative text-slate-100 overflow-hidden">
    <StarBackground />
    <div class="cosmic-grid"></div>
    <div class="floating-orb orb-one"></div>
    <div class="floating-orb orb-two"></div>
    <div class="aurora-band"></div>
    <NavBar />
    <transition name="warp">
      <div v-if="nasaOffline" class="relative z-30 border-y border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-transparent to-indigo-600/10 backdrop-blur-md">
        <div class="mx-auto max-w-screen-2xl px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="text-sm text-slate-200">
            <strong class="text-cyan-200">Service NASA en maintenance&nbsp;:</strong>
            Les flux officiels sont gelés suite à l’arrêt des mises à jour NASA. Nous affichons des données de démonstration pour maintenir l’expérience.
          </div>
          <a href="https://api.nasa.gov" target="_blank" rel="noreferrer" class="text-xs uppercase tracking-[0.3em] text-cyan-300 hover:text-white">En savoir plus</a>
        </div>
      </div>
    </transition>
    <div class="fixed top-4 right-6 z-30 flex items-center gap-3">
      <AudioControl />
    </div>
    <main class="relative mx-auto max-w-screen-2xl px-6 py-10 z-10">
      <slot />
    </main>
    <footer class="relative border-t border-white/10 py-8 z-10 backdrop-blur-sm bg-black/40">
      <div class="mx-auto max-w-screen-2xl px-6 text-sm text-slate-400 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-cyan-200/80">
          <span>© {{ year }} NASA Explorer</span>
          <span class="hidden md:inline">·</span>
          <span class="text-slate-500 normal-case tracking-normal">Centre de contrôle galactique</span>
        </div>
        <div class="flex items-center gap-4 text-sm">
          <a href="https://api.nasa.gov" target="_blank" rel="noreferrer" class="hover:text-cyan-300 transition">API NASA</a>
          <a href="https://images.nasa.gov/" target="_blank" rel="noreferrer" class="hover:text-cyan-300 transition">Bibliothèque d’images NASA</a>
          <a href="https://www.nasa.gov/specials/europa-in-our-solar-system/" target="_blank" rel="noreferrer" class="hover:text-cyan-300 transition">Ressources mission</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import NavBar from '../components/NavBar.vue'
import StarBackground from '../components/StarBackground.vue'
import AudioControl from '../components/AudioControl.vue'
import { useStatusStore } from '../stores/status'

const year = computed(() => new Date().getFullYear())
const statusStore = useStatusStore()
const { nasaOffline } = storeToRefs(statusStore)
</script>
