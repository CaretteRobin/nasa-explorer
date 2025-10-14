<template>
  <section class="space-y-12">
    <div class="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
      <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-indigo-600/20"></div>
      <div class="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl"></div>
      <div class="hero-spectral-ring"></div>
      <div class="hero-comet"></div>
      <div class="hero-grid-overlay"></div>
      <div class="relative grid gap-10 lg:grid-cols-[minmax(0,1fr),minmax(280px,360px)]">
        <div class="space-y-6">
          <div v-if="nasaOffline" class="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-cyan-200/80">
            <span class="h-2 w-2 rounded-full bg-cyan-300 animate-ping"></span>
            <span>Mode démo activé</span>
          </div>
          <div class="flex items-center gap-4">
            <div class="relative h-16 w-16 shrink-0">
              <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="h-full w-full">
                <defs>
                  <radialGradient id="nasa-gradient" cx="50%" cy="45%" r="60%">
                    <stop offset="0%" stop-color="#4fc3f7" stop-opacity="0.9" />
                    <stop offset="100%" stop-color="#0b3d91" />
                  </radialGradient>
                </defs>
                <circle cx="60" cy="60" r="55" fill="url(#nasa-gradient)" stroke="#84d5ff" stroke-opacity="0.4" stroke-width="2" />
                <path d="M25 70 C45 48, 75 48, 95 70" fill="none" stroke="#ff4f58" stroke-width="6" stroke-linecap="round" />
                <text x="50%" y="54%" text-anchor="middle" font-size="34" fill="white" font-family="'Rajdhani', 'Orbitron', 'Segoe UI', sans-serif" font-weight="600">NASA</text>
              </svg>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.45em] text-cyan-200/80">NASA Explorer</p>
              <h1 class="font-display text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight">Bienvenue au centre d'observation</h1>
            </div>
          </div>
          <p class="text-base md:text-lg text-slate-200/90 max-w-2xl">
            Explore l’univers en un clin d’œil&nbsp;: image du jour, météo spatiale, missions martiennes et surveillance des géocroiseurs, le tout alimenté par les APIs officielles de la NASA.
          </p>
          <div class="flex flex-wrap gap-3">
            <router-link to="/apod" class="btn-primary">Voir l’image du jour</router-link>
            <router-link to="/about" class="btn-ghost">Découvrir les modules</router-link>
          </div>
          <dl class="grid gap-4 pt-6 sm:grid-cols-3">
            <div class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <dt class="text-xs uppercase tracking-widest text-slate-300">Thématiques</dt>
              <dd class="mt-2 text-lg font-medium text-slate-100">APOD · Mars · EPIC · NEO</dd>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <dt class="text-xs uppercase tracking-widest text-slate-300">Données</dt>
              <dd class="mt-2 text-lg font-medium text-slate-100">Temps réel via api.nasa.gov</dd>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <dt class="text-xs uppercase tracking-widest text-slate-300">Navigation</dt>
              <dd class="mt-2 text-lg font-medium text-slate-100">Interface réactive &amp; favoris</dd>
            </div>
          </dl>
        </div>
        <div class="relative rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur">
          <div class="text-sm uppercase tracking-[0.4em] text-cyan-200/80">À la une</div>
          <div class="mt-4">
            <LoadingSpinner v-if="loadingApod" />
            <template v-else>
              <div v-if="apod && apod.media_type==='image'" class="space-y-3">
                <img :src="apod.url" :alt="apod.title" class="h-44 w-full rounded-xl object-cover border border-white/10" />
                <div>
                  <div class="text-sm text-slate-300">{{ apod.date }}</div>
                  <div class="text-lg font-semibold text-slate-100">{{ apod.title }}</div>
                </div>
              </div>
              <div v-else-if="apod && apod.media_type!=='image'" class="space-y-3">
                <iframe :src="apod.url" title="APOD" class="h-44 w-full rounded-xl border border-white/10" allowfullscreen></iframe>
                <div class="text-lg font-semibold text-slate-100">{{ apod.title }}</div>
              </div>
              <div v-else class="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4 text-slate-300">
                <div class="text-sm font-medium text-slate-200">APOD indisponible</div>
                <p class="text-sm leading-relaxed">{{ errorApod || 'Réessaye dans quelques instants ou active le mode démo pour continuer à explorer.' }}</p>
              </div>
            </template>
          </div>
          <div class="mt-6 text-sm text-slate-400">
            Envie d’en voir plus&nbsp;? Direction la galerie complète pour voyager parmi les dernières captures du cosmos.
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div class="xl:col-span-2">
        <h2 class="font-display text-2xl mb-4">Image astronomique du jour</h2>
        <div v-if="errorApod" class="mb-6"><ErrorState :message="'APOD indisponible'" :details="errorApod" /></div>
        <LoadingSpinner v-else-if="loadingApod" />
        <div v-else-if="apod" class="rounded-2xl glass overflow-hidden">
          <div class="aspect-video bg-black">
            <img v-if="apod.media_type==='image'" :src="apod.url" :alt="apod.title" class="w-full h-full object-cover" />
            <iframe v-else :src="apod.url" title="APOD video" class="w-full h-full" allowfullscreen></iframe>
          </div>
          <div class="p-4">
            <div class="text-lg font-medium">{{ apod.title }}</div>
            <div class="text-slate-400 text-sm mt-1">{{ apod.date }}</div>
            <p class="text-slate-300 text-sm mt-3">{{ apod.explanation }}</p>
          </div>
        </div>
        <div v-else class="rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-sm text-slate-300">
          APOD en attente de chargement. Recharge plus tard ou active le mode démo pour disposer immédiatement d’un aperçu.
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-display text-xl">Rovers martiens</h3>
            <router-link to="/mars" class="text-cyan-300 hover:text-cyan-200 text-sm">Ouvrir</router-link>
          </div>
          <div v-if="rovers.length" class="grid grid-cols-3 gap-3 text-center">
            <div v-for="r in rovers" :key="r.name" class="rounded-lg bg-white/5 border border-white/10 p-2">
              <div class="text-sm font-medium">{{ r.name }}</div>
              <div class="text-xs text-slate-400">{{ r.status }}</div>
            </div>
          </div>
          <div v-else class="rounded-lg border border-dashed border-white/20 bg-white/5 p-4 text-sm text-slate-400 text-center">
            Données rover en cours de chargement…
          </div>
        </div>
        <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-display text-xl">EPIC Terre</h3>
            <router-link to="/epic" class="text-cyan-300 hover:text-cyan-200 text-sm">Ouvrir</router-link>
          </div>
          <div v-if="epicDates.length" class="text-slate-300 text-sm">Dernières dates disponibles : <span class="text-slate-200">{{ epicDates.slice(-3).join(', ') }}</span></div>
          <div v-else class="rounded-lg border border-dashed border-white/20 bg-white/5 p-3 text-sm text-slate-400">
            En attente des dernières prises de vue EPIC…
          </div>
        </div>
        <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-display text-xl">NEO du jour</h3>
            <router-link to="/neo" class="text-cyan-300 hover:text-cyan-200 text-sm">Ouvrir</router-link>
          </div>
          <div class="text-slate-300 text-sm">Nombre potentiellement dangereux : <span class="font-semibold text-rose-300">{{ neoh }}</span></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { fetchApod, fetchRovers, fetchEpicDates, fetchNeoToday } from '../api/nasa'
import LoadingSpinner from '../components/ui/LoadingSpinner.vue'
import ErrorState from '../components/ui/ErrorState.vue'
import { useStatusStore } from '../stores/status'

const apod = ref(null)
const loadingApod = ref(false)
const errorApod = ref('')
const rovers = ref([])
const epicDates = ref([])
const neoh = ref(0)
const statusStore = useStatusStore()
const { nasaOffline } = storeToRefs(statusStore)

onMounted(async () => {
  try { loadingApod.value = true; apod.value = await fetchApod() } catch (e) { errorApod.value = e.message || String(e) } finally { loadingApod.value = false }
  try { rovers.value = await fetchRovers() } catch {}
  try { epicDates.value = await fetchEpicDates('natural') } catch {}
  try {
    const neo = await fetchNeoToday()
    const todays = Object.values(neo.near_earth_objects || {})[0] || []
    neoh.value = todays.filter((o) => o.is_potentially_hazardous_asteroid).length
  } catch {}
})
</script>
