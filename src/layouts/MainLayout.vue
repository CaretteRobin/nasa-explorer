<template>
  <div class="min-h-screen relative text-slate-100 overflow-hidden">
    <StarBackground />
    <div class="aurora-band"></div>
    <NavBar />
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
import NavBar from '../components/NavBar.vue'
import StarBackground from '../components/StarBackground.vue'
import AudioControl from '../components/AudioControl.vue'

const year = computed(() => new Date().getFullYear())
</script>
