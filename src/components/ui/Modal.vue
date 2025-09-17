<template>
  <div v-if="open" class="fixed inset-0 z-50" @keydown.esc="$emit('close')" role="dialog" aria-modal="true">
    <div class="absolute inset-0 bg-black/70" @click="$emit('close')"></div>
    <div class="absolute inset-0 flex items-center justify-center p-6">
      <div class="relative max-w-5xl w-full rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 ring-1 ring-cyan-400/20 overflow-hidden">
        <button class="absolute top-3 right-3 text-slate-300 hover:text-white" @click="$emit('close')" aria-label="Close">
          ✕
        </button>
        <slot />
      </div>
    </div>
  </div>
  
</template>

<script setup>
defineProps({ open: Boolean })
defineEmits(['close'])
</script>
