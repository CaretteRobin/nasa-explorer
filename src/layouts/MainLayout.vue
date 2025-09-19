<template>
  <div class="min-h-screen relative text-slate-100">
    <StarBackground />
    <NavBar />
    <main class="mx-auto max-w-screen-2xl px-6 py-8">
      <slot />
    </main>
    <footer class="border-t border-white/10 py-8">
      <div class="mx-auto max-w-screen-2xl px-6 text-sm text-slate-400 flex items-center justify-between">
        <div>© {{ new Date().getFullYear() }} NASA Explorer</div>
        <div class="flex items-center gap-4">
          <a href="https://api.nasa.gov" target="_blank" rel="noreferrer" class="hover:text-cyan-300">API NASA</a>
          <a href="https://images.nasa.gov/" target="_blank" rel="noreferrer" class="hover:text-cyan-300">Bibliothèque d’images NASA</a>
        </div>
      </div>
    </footer>
  </div>
  
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import StarBackground from '../components/StarBackground.vue'
</script>
