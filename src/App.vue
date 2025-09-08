<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <MainLayout><router-view /></MainLayout>
  </div>
</template>
<script setup>
import MainLayout from './layouts/MainLayout.vue'
</script>
