<template>
  <div :class="['animate-pulse rounded-lg bg-gray-100', sizeClass]" />
</template>

<script setup>
const props = defineProps({ size: { type: String, default: 'md' } })
const sizeClass = {
  xs: 'h-4 w-24',
  sm: 'h-6 w-full',
  md: 'h-10 w-full',
  lg: 'h-16 w-full',
}[props.size] || 'h-10 w-full'
</script>

