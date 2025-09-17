<template>
  <div class="rounded-lg border border-white/10 bg-white/5 p-8 text-center">
    <div class="text-slate-300">{{ label }}</div>
  </div>
</template>

<script setup>
defineProps({ label: { type: String, default: 'Aucune donnée à afficher' } })
</script>

