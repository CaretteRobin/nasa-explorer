<template>
  <div>
    <NavBar />
    <main class="max-w-6xl mx-auto p-4"><slot /></main>
  </div>
</template>
<script setup>
import NavBar from '../components/NavBar.vue'
</script>
