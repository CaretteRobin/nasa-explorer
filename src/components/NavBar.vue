<template>
  <header class="sticky top-0 z-40 backdrop-blur-md bg-black/40 border-b border-cyan-400/10">
    <div class="mx-auto max-w-screen-2xl px-6 h-16 flex items-center justify-between">
      <router-link to="/" class="inline-flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm1 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm.75 3.75a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0V14h-2a.75.75 0 0 1 0-1.5h2V10a.75.75 0 0 1 .75-.75Z"/>
        </svg>
        <div class="font-display text-xl tracking-wide">
          <span class="text-white">NASA</span><span class="text-cyan-400">Explorer</span>
        </div>
      </router-link>

      <nav class="hidden md:flex items-center gap-2">
        <router-link :class="linkClass('/apod')" to="/apod">APOD</router-link>
        <router-link :class="linkClass('/mars')" to="/mars">Mars</router-link>
        <router-link :class="linkClass('/epic')" to="/epic">EPIC</router-link>
        <router-link :class="linkClass('/library')" to="/library">Library</router-link>
        <router-link :class="linkClass('/neo')" to="/neo">NEO</router-link>
        <router-link :class="linkClass('/space-weather')" to="/space-weather">Space Weather</router-link>
        <router-link :class="linkClass('/earth')" to="/earth">Earth</router-link>
        <router-link :class="linkClass('/favorites')" to="/favorites">Favorites</router-link>
        <router-link :class="linkClass('/about')" to="/about">About</router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const base = 'px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition duration-250 ring-1 ring-transparent hover:ring-cyan-400/50 shadow-[0_0_0_rgba(0,240,255,0)] hover:shadow-[0_0_12px_rgba(0,240,255,0.35)]'
const active = 'bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/60 shadow-[0_0_16px_rgba(0,240,255,0.45)]'
const linkClass = (path) => [base, route.path.startsWith(path) && active]
</script>
