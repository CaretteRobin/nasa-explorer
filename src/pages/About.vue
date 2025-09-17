<template>
  <section class="rounded-2xl glass p-6">
    <h1 class="font-display text-3xl">À propos de NASA Explorer</h1>
    <p class="mt-2 text-slate-300">Ce tableau de bord utilise les API publiques de la NASA pour explorer des images scientifiques et des données spatiales, dans une interface sombre et futuriste inspirée d’un centre de contrôle.</p>

    <div class="mt-6 grid md:grid-cols-2 gap-6">
      <div class="rounded-xl bg-white/5 border border-white/10 p-4">
        <h2 class="font-display text-xl">APOD — Astronomy Picture of the Day</h2>
        <p class="text-slate-300 text-sm mt-1">Parcourez l’image du jour par plages de dates. Ouvrez les détails et ajoutez vos images préférées aux favoris.</p>
      </div>
      <div class="rounded-xl bg-white/5 border border-white/10 p-4">
        <h2 class="font-display text-xl">Mars Rovers</h2>
        <p class="text-slate-300 text-sm mt-1">Photos prises par les rovers martiens. Filtrez par rover (Curiosity, etc.), sol (jour martien), date terrestre et caméra.</p>
      </div>
      <div class="rounded-xl bg-white/5 border border-white/10 p-4">
        <h2 class="font-display text-xl">EPIC — DSCOVR Earth</h2>
        <p class="text-slate-300 text-sm mt-1">Images de la Terre prises depuis le point L1. Choisissez le mode (<em>natural</em> ou <em>enhanced</em>) puis une date disponible.</p>
      </div>
      <div class="rounded-xl bg-white/5 border border-white/10 p-4">
        <h2 class="font-display text-xl">NASA Image Library</h2>
        <p class="text-slate-300 text-sm mt-1">Recherchez des images/vidéos/audio par mots‑clés, type et années. Les liens ouvrent la page officielle de l’item.</p>
      </div>
      <div class="rounded-xl bg-white/5 border border-white/10 p-4">
        <h2 class="font-display text-xl">NEO — Near‑Earth Objects</h2>
        <p class="text-slate-300 text-sm mt-1">Aperçu des objets proches de la Terre pour aujourd’hui ou sur 7 jours. Mise en avant des objets potentiellement dangereux.</p>
      </div>
      <div class="rounded-xl bg-white/5 border border-white/10 p-4">
        <h2 class="font-display text-xl">DONKI — Space Weather</h2>
        <p class="text-slate-300 text-sm mt-1">Activité solaire : éruptions (FLR), éjections de masse coronale (CME), orages géomagnétiques (GST).</p>
      </div>
      <div class="rounded-xl bg-white/5 border border-white/10 p-4 md:col-span-2">
        <h2 class="font-display text-xl">Earth Imagery</h2>
        <p class="text-slate-300 text-sm mt-1">Images satellite (Landsat/Modis) pour une latitude/longitude et une date. Astuce: laissez le champ date vide pour obtenir une image proche disponible.</p>
      </div>
    </div>

    <div class="mt-6 text-sm text-slate-400">
      <p>Clé API: définissez <code>VITE_NASA_API_KEY</code> dans <code>.env.local</code>. Vous pouvez activer un mode démo avec <code>VITE_DEMO_MODE=true</code> pour travailler sans réseau.</p>
      <p>Respectez les limites d’appels API. Les images et données appartiennent à la NASA et ses partenaires.</p>
    </div>
  </section>
</template>

<script setup>
</script>
