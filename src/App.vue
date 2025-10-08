<template>
  <div class="min-h-screen text-slate-100">
    <MainLayout>
      <RouterView v-slot="{ Component, route }">
        <transition name="warp" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </RouterView>
    </MainLayout>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import MainLayout from './layouts/MainLayout.vue'
</script>
