<template>
  <span :class="['inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border', cls]">
    <span class="w-1.5 h-1.5 rounded-full" :class="dot" />
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup>
const props = defineProps({
  status: { type: String, default: 'unknown' }, // ok | warn | down
})
const label = ({ ok: 'Opérationnel', warn: 'Partiel', down: 'Hors-ligne' }[props.status]) || 'Inconnu'
const cls = props.status === 'ok'
  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
  : props.status === 'warn'
  ? 'bg-amber-50 text-amber-700 border-amber-200'
  : 'bg-rose-50 text-rose-700 border-rose-200'
const dot = props.status === 'ok' ? 'bg-emerald-500' : props.status === 'warn' ? 'bg-amber-500' : 'bg-rose-500'
</script>

