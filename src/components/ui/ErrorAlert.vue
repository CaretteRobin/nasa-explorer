<template>
  <div :class="['rounded-lg border p-3 text-sm', kindClass]">
    <slot>{{ message }}</slot>
  </div>
</template>

<script setup>
const props = defineProps({
  message: { type: String, default: 'Une erreur est survenue.' },
  kind: { type: String, default: 'error' }, // 'error' | 'warn' | 'info'
})
const kindClass = {
  error: 'text-rose-700 bg-rose-50 border-rose-200',
  warn: 'text-amber-700 bg-amber-50 border-amber-200',
  info: 'text-sky-700 bg-sky-50 border-sky-200',
}[props.kind] || 'text-rose-700 bg-rose-50 border-rose-200'
</script>

