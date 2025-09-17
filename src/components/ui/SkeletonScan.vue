<template>
  <div :style="{ height }" class="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10">
    <div class="absolute inset-0 bg-gradient-to-b from-white/0 via-white/5 to-white/0 animate-scan"></div>
  </div>
</template>

<script setup>
defineProps({ height: { type: String, default: '10rem' } })
</script>

<style scoped>
@keyframes scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
.animate-scan { animation: scan 1.8s linear infinite; backdrop-filter: blur(2px); }
</style>

