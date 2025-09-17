<template>
  <img :src="src || fallback" :alt="alt" class="object-contain" @error="onErr" />
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({ src: String, alt: String, fallback: { type: String, default: '/vite.svg' } })
const failed = ref(false)
const onErr = (e) => {
  if (!failed.value) {
    failed.value = true
    e.target.src = props.fallback
  }
}
</script>

