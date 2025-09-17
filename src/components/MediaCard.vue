<template>
  <div class="group rounded-2xl glass overflow-hidden hover:border-cyan-400/40 transition duration-250 shadow-sm card-hover">
    <div class="aspect-video overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
      <img v-if="thumb" :src="thumb" :alt="title" class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" loading="lazy" />
      <div v-else class="w-full h-full flex items-center justify-center text-slate-400">No preview</div>
    </div>
    <div class="p-4">
      <div class="text-slate-100 font-medium truncate">{{ title }}</div>
      <div class="text-slate-300 text-xs mt-1 flex items-center gap-2">
        <slot name="meta" />
      </div>
      <div class="mt-3 flex items-center gap-2">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ title: String, thumb: String })
</script>
