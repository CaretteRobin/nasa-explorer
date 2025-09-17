<template>
  <div class="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
    <div class="font-medium text-red-300">Une erreur est survenue</div>
    <div v-if="message" class="mt-1 opacity-90">{{ message }}</div>
    <div v-if="details" class="mt-2 text-xs opacity-70">{{ details }}</div>
  </div>
</template>

<script setup>
defineProps({
  message: String,
  details: String,
})
</script>

