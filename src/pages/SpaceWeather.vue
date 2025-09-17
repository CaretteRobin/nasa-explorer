<template>
  <section>
    <div class="mb-6 flex flex-wrap items-end gap-3 justify-between">
      <div>
        <h1 class="font-display text-3xl">Space Weather (DONKI)</h1>
        <p class="text-slate-300">Solar flares (FLR), CMEs, geomagnetic storms (GST)</p>
      </div>
      <div class="flex items-center gap-2">
        <select v-model="type" class="bg-white/10 border border-white/10 rounded px-3 py-2 text-slate-100">
          <option value="FLR">Flares (FLR)</option>
          <option value="CME">CME</option>
          <option value="GST">Geomagnetic (GST)</option>
        </select>
        <input type="date" v-model="from" class="bg-white/10 border border-white/10 rounded px-3 py-2 text-slate-100" />
        <input type="date" v-model="to" class="bg-white/10 border border-white/10 rounded px-3 py-2 text-slate-100" />
        <button @click="load" class="btn-primary">Load</button>
      </div>
    </div>

    <div v-if="error" class="mb-4"><ErrorState :message="'Erreur DONKI'" :details="error" /></div>
    <LoadingSpinner v-else-if="loading" />
    <div v-else class="space-y-3">
      <div v-for="e in items" :key="e.activityID || e.flrID || e.gstID" class="rounded-2xl glass p-4">
        <div class="text-slate-300 text-sm">{{ e.beginTime || e.startTime || e.starttime || e.eventTime }}</div>
        <div class="text-slate-100 font-medium">{{ e.classType || e.note || e.cmeAnalyses?.[0]?.type || 'Event' }}</div>
        <div class="text-slate-400 text-sm">{{ e.instruments?.map(i=>i.displayName).join(', ') }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { fetchDonki } from '../api/nasa'
import LoadingSpinner from '../components/ui/LoadingSpinner.vue'
import ErrorState from '../components/ui/ErrorState.vue'

const type = ref('FLR')
const from = ref(new Date(Date.now()-7*24*3600*1000).toISOString().slice(0,10))
const to = ref(new Date().toISOString().slice(0,10))
const items = ref([])
const loading = ref(false)
const error = ref('')

async function load() {
  try { loading.value = true; error.value = ''
    items.value = await fetchDonki(type.value, from.value, to.value)
  } catch (e) { error.value = e.message || String(e) } finally { loading.value = false }
}

load()
</script>
