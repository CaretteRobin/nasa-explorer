<template>
  <section class="max-w-3xl mx-auto">
    <h1 class="text-2xl font-semibold mb-4">Players</h1>
    <form @submit.prevent="fetchPlayers" class="flex gap-2 mb-4">
      <input v-model="q" placeholder="Name" class="border rounded px-3 py-2 w-full" />
      <button class="bg-black text-white px-4 rounded">Search</button>
    </form>
    <p v-if="loading">Loading…</p>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>
    <ul class="grid md:grid-cols-2 gap-3">
      <li v-for="p in players" :key="p.id" class="p-3 border rounded bg-white">
        <div class="font-medium">{{ p.first_name }} {{ p.last_name }}</div>
        <div class="text-xs text-gray-500">{{ p.team?.full_name }}</div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { api } from '../api/http'
const q = ref(''); const players = ref([]); const loading = ref(false); const error = ref('')
async function fetchPlayers() {
  loading.value = true; error.value = ''
  try {
    const { data } = await api.get('/players', { params: { search: q.value } })
    players.value = data?.data || data?.results || []
  } catch (e) { error.value = 'Erreur de chargement' }
  finally { loading.value = false }
}
fetchPlayers()
</script>
