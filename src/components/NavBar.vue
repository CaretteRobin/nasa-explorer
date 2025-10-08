<template>
  <header class="sticky top-0 z-40 backdrop-blur-xl bg-black/40 border-b border-cyan-400/10 shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
    <div class="mx-auto max-w-screen-2xl px-6 h-20 flex items-center justify-between">
      <router-link to="/" class="inline-flex items-center gap-3 magnetic-area">
        <div class="magnetic-content inline-flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.65)]">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm1 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm.75 3.75a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0V14h-2a.75.75 0 0 1 0-1.5h2V10a.75.75 0 0 1 .75-.75Z"/>
          </svg>
          <div class="font-display text-2xl tracking-[0.25em] uppercase">
            <span class="text-white">NASA</span><span class="text-cyan-400">Explorer</span>
          </div>
        </div>
      </router-link>

      <nav class="hidden md:flex items-center gap-4 relative"
           ref="navContainer">
        <div class="nav-indicator" v-if="indicator.width" :style="indicatorStyle"></div>
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          :class="{ 'is-active': isActive(item.path) }"
          :ref="(el) => setLinkRef(el, item.path)">
          <span class="uppercase tracking-[0.2em]">{{ item.label }}</span>
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { path: '/apod', label: 'APOD' },
  { path: '/mars', label: 'Mars' },
  { path: '/epic', label: 'EPIC' },
  { path: '/library', label: 'Médiathèque' },
  { path: '/neo', label: 'NEO' },
  { path: '/space-weather', label: 'Météo' },
  { path: '/earth', label: 'Terre' },
  { path: '/mission-control', label: 'Mission Control' },
  { path: '/favorites', label: 'Favoris' },
  { path: '/about', label: 'À propos' },
]

const navContainer = ref(null)
const indicator = reactive({ width: 0, translate: 0 })
const linkRefs = new Map()

const setLinkRef = (el, path) => {
  if (el) linkRefs.set(path, el)
  else linkRefs.delete(path)
  updateIndicator()
}

const isActive = (path) => route.path.startsWith(path)

const updateIndicator = () => {
  nextTick(() => {
    const activeItem = navItems.find((item) => isActive(item.path))
    const el = activeItem ? linkRefs.get(activeItem.path) : null
    if (!el || !navContainer.value) {
      indicator.width = 0
      indicator.translate = 0
      return
    }
    const parentRect = navContainer.value.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    indicator.width = rect.width
    indicator.translate = rect.left - parentRect.left
  })
}

const indicatorStyle = computed(() => ({
  width: `${indicator.width}px`,
  transform: `translateX(${indicator.translate}px) translateZ(0)`
}))

const handleResize = () => updateIndicator()

onMounted(() => {
  window.addEventListener('resize', handleResize)
  updateIndicator()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

watch(() => route.fullPath, () => updateIndicator())
</script>
