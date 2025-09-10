<template>
  <div class="min-h-screen w-full bg-gray-50 text-gray-900">
    <NavBar />
    <!-- Full width with comfortable padding; pages decide containers -->
    <main class="w-full px-6 py-6 lg:px-10">
      <slot />
    </main>
  </div>
  
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
</script>
