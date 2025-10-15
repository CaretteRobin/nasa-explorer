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
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <button
        type="button"
        class="md:hidden inline-flex items-center justify-center rounded-full border border-cyan-400/60 bg-[#041021]/80 px-3 py-2 text-xs uppercase tracking-[0.35em] text-cyan-100 hover:text-white transition shadow-[0_0_22px_rgba(34,211,238,0.25)]"
        :aria-expanded="mobileOpen"
        :aria-controls="'mobile-nav'"
        @click="toggleMobile">
        <span class="sr-only">Ouvrir le menu</span>
        <div class="relative h-5 w-6">
          <span
            class="absolute inset-x-0 top-1 h-[2px] rounded-full bg-cyan-300 transition-transform duration-300"
            :class="mobileOpen ? 'translate-y-2 rotate-45' : ''"></span>
          <span
            class="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-cyan-200 transition-opacity duration-300"
            :class="mobileOpen ? 'opacity-0' : 'opacity-80'"></span>
          <span
            class="absolute inset-x-0 bottom-1 h-[2px] rounded-full bg-cyan-300 transition-transform duration-300"
            :class="mobileOpen ? '-translate-y-2 -rotate-45' : ''"></span>
        </div>
      </button>
    </div>

    <transition name="warp">
      <div
        v-if="mobileOpen"
        id="mobile-nav"
        class="md:hidden fixed inset-0 z-50 bg-[#010409]/88 backdrop-blur-[36px]">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.22),transparent_55%)] opacity-70"></div>
        <div class="relative h-full flex flex-col justify-between px-6 pt-12 pb-10">
          <div class="flex items-center justify-between mb-6">
            <div class="text-xs uppercase tracking-[0.35em] text-cyan-300">Navigation</div>
            <button type="button" class="rounded-full border border-cyan-400/60 bg-[#041021]/80 p-2 text-cyan-100 hover:text-white transition shadow-[0_0_20px_rgba(34,211,238,0.25)]" @click="closeMobile">
              <span class="sr-only">Fermer le menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="space-y-8">
            <nav class="flex flex-col gap-4 text-lg">
              <router-link
                v-for="item in navItems"
                :key="`mobile-${item.path}`"
                :to="item.path"
                class="nav-link-mobile"
                :class="{ 'is-active': isActive(item.path) }"
                @click="closeMobile">
                {{ item.label }}
              </router-link>
            </nav>
          </div>
          <div class="text-xs uppercase tracking-[0.35em] text-slate-500">
            © {{ year }} NASA Explorer
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const year = new Date().getFullYear()

const route = useRoute()

const navItems = [
  { path: '/apod', label: 'APOD' },
  { path: '/mars', label: 'Mars' },
  { path: '/epic', label: 'EPIC' },
  { path: '/library', label: 'Médiathèque' },
  { path: '/neo', label: 'NEO' },
  { path: '/space-weather', label: 'Météo' },
  { path: '/earth', label: 'Terre' },
  { path: '/mission-control', label: 'MissionControl' },
  { path: '/favorites', label: 'Favoris' },
  { path: '/about', label: 'APropos' },
]

const navContainer = ref(null)
const indicator = reactive({ width: 0, translate: 0 })
const linkRefs = new Map()
const mobileOpen = ref(false)

const resolveEl = (el) => {
  if (!el) return null
  if (Array.isArray(el)) return resolveEl(el[0])
  if (el.$el) return el.$el
  if (el.$?.subTree?.el) return el.$.subTree.el
  return el
}

const setLinkRef = (el, path) => {
  const domEl = resolveEl(el)
  if (domEl) linkRefs.set(path, domEl)
  else linkRefs.delete(path)
  updateIndicator()
}

const isActive = (path) => route.path.startsWith(path)

const updateIndicator = () => {
  nextTick(() => {
    const activeItem = navItems.find((item) => isActive(item.path))
    const el = activeItem ? resolveEl(linkRefs.get(activeItem.path)) : null
    const container = resolveEl(navContainer.value)
    if (!el || !container || typeof el.getBoundingClientRect !== 'function' || typeof container.getBoundingClientRect !== 'function') {
      indicator.width = 0
      indicator.translate = 0
      return
    }
    const parentRect = container.getBoundingClientRect()
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

const toggleMobile = () => {
  mobileOpen.value = !mobileOpen.value
  document.body.classList.toggle('overflow-hidden', mobileOpen.value)
}
const closeMobile = () => {
  mobileOpen.value = false
  document.body.classList.remove('overflow-hidden')
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  updateIndicator()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

watch(() => route.fullPath, () => {
  updateIndicator()
  closeMobile()
})
</script>
