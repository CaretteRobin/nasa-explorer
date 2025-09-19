<template>
  <div class="flex items-center justify-center gap-2">
    <button class="px-3 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-40" :disabled="page<=1" @click="$emit('update:page', page-1)">Précédent</button>
    <div class="text-sm text-slate-300">Page {{ page }} / {{ total }}</div>
    <button class="px-3 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-40" :disabled="page>=total" @click="$emit('update:page', page+1)">Suivant</button>
  </div>
</template>

<script setup>
defineProps({ page: { type: Number, default: 1 }, total: { type: Number, default: 1 } })
defineEmits(['update:page'])
</script>

