<template>
  <section class="glass p-6 relative overflow-hidden">
    <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.5em] text-emerald-200/80">Voyage guidé</p>
        <h2 class="font-display text-3xl">Itinéraire immersif</h2>
        <p class="text-sm text-slate-300 max-w-2xl">
          Laisse-toi porter par un scénario narratif qui enchaîne APOD, Mission Control et les rovers martiens.
          Chaque scène enclenche des vidéos, des cartes de données et des hotspots audio.
        </p>
      </div>
      <router-link :to="{ name: 'mission-control' }" class="btn-primary whitespace-nowrap">
        Débuter le voyage
      </router-link>
    </header>
    <div class="space-divider"></div>
    <div class="grid gap-4 lg:grid-cols-3">
      <article
        v-for="scene in scenes"
        :key="scene.id"
        class="tour-scene relative card-hover p-6">
        <div class="tour-scanline"></div>
        <p class="text-xs uppercase tracking-[0.35em] text-slate-400">{{ scene.id }}</p>
        <h3 class="font-display text-2xl mt-3">{{ scene.title }}</h3>
        <p class="text-sm text-slate-300 mt-3 whitespace-pre-line">{{ scene.description }}</p>
        <router-link
          class="btn-holo mt-6"
          :to="scene.route">
          Ouvrir le module
        </router-link>
      </article>
    </div>
  </section>
</template>

<script setup>
defineProps({
  scenes: {
    type: Array,
    default: () => [],
  },
})
</script>
