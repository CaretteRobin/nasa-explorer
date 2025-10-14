<template>
  <section class="glass p-6">
    <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.5em] text-cyan-200/80">Observatoire</p>
        <h2 class="font-display text-3xl">Compose ton centre de contrôle</h2>
        <p class="text-sm text-slate-300 max-w-3xl">
          Active les modules clés et organise l’ordre d’apparition. Ce choix est sauvegardé dans ton navigateur pour retrouver instantanément ton cockpit favori.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button class="btn-ghost" type="button" @click="store.reset()">Réinitialiser</button>
        <router-link class="btn-primary" :to="{ name: 'mission-control' }">Ouvrir Mission Control</router-link>
      </div>
    </header>
    <div class="space-divider"></div>
    <div class="grid gap-6 lg:grid-cols-[280px,1fr]">
      <aside class="space-y-4">
        <p class="text-xs uppercase tracking-[0.35em] text-slate-400">Modules</p>
        <ul class="space-y-3">
          <li
            v-for="module in presets"
            :key="module.id"
            class="card-hover rounded-xl p-4 flex items-start gap-3">
            <input
              :id="`module-${module.id}`"
              type="checkbox"
              :checked="store.modules.includes(module.id)"
              class="accent-cyan-400 h-4 w-4 mt-1"
              @change="store.toggle(module.id)" />
            <label :for="`module-${module.id}`" class="flex-1 cursor-pointer">
              <p class="text-sm font-semibold text-slate-100 uppercase tracking-[0.25em]">{{ module.label }}</p>
              <p class="text-xs text-slate-400 mt-1">{{ module.description }}</p>
              <router-link :to="module.route" class="text-xs text-cyan-300 hover:text-cyan-200 mt-2 inline-flex items-center gap-1">
                <span>Voir</span>
                <span aria-hidden="true">→</span>
              </router-link>
            </label>
          </li>
        </ul>
      </aside>
      <div class="space-y-4">
        <p class="text-xs uppercase tracking-[0.35em] text-slate-400">Ordre d’affichage</p>
        <transition-group name="list" tag="div" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="(moduleId, index) in store.modules"
            :key="moduleId"
            class="widget-shell">
            <header class="flex items-center justify-between">
              <span class="widget-handle">
                <button type="button" @click="move(index, index - 1)" :disabled="index === 0" class="disabled:opacity-30">↑</button>
                <button type="button" @click="move(index, index + 1)" :disabled="index === store.modules.length - 1" class="disabled:opacity-30">↓</button>
              </span>
              <button type="button" class="text-xs uppercase tracking-[0.3em] text-rose-300" @click="store.toggle(moduleId)">Retirer</button>
            </header>
            <div class="mt-4 space-y-3">
              <h3 class="font-display text-xl">{{ labels[moduleId]?.label }}</h3>
              <p class="text-sm text-slate-300">{{ labels[moduleId]?.description }}</p>
              <router-link :to="labels[moduleId]?.route" class="btn-holo">Accéder</router-link>
            </div>
          </article>
        </transition-group>
        <p v-if="!store.modules.length" class="rounded-xl border border-dashed border-white/15 bg-white/5 p-6 text-sm text-slate-400">
          Active les modules dans la liste de gauche pour construire ton observatoire.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useObservatoryStore } from '../../stores/observatory'
import { observatoryPresets } from '../../lib/demoData'

const store = useObservatoryStore()

const labels = reactive(Object.fromEntries(observatoryPresets.map((module) => [module.id, module])))
const presets = observatoryPresets

const move = (from, to) => {
  if (to < 0 || to >= store.modules.length) return
  store.reorder({ from, to })
}

onMounted(() => {
  store.init()
})
</script>
