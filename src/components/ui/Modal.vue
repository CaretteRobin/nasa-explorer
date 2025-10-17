<template>
  <teleport to="body">
    <div
      v-if="open"
      ref="root"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      @keydown.esc.prevent="emitClose">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" @click="emitClose"></div>
      <div
        class="relative w-full max-w-4xl"
        @click.stop>
        <div class="relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-[0_30px_120px_rgba(15,23,42,0.55)] ring-1 ring-cyan-400/20">
          <button
            type="button"
            class="absolute top-3 right-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
            @click="emitClose"
            aria-label="Fermer la fenêtre">
            ✕
          </button>
          <div class="relative z-10 w-full flex-1 overflow-y-auto p-5 pt-12 sm:p-6 sm:pt-12">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['close'])

const root = ref(null)

const lockScroll = (value) => {
  const body = document?.body
  if (!body) return
  body.classList.toggle('overflow-hidden', value)
}

const focusDialog = () => {
  nextTick(() => root.value?.focus?.())
}

watch(
  () => props.open,
  (value) => {
    lockScroll(value)
    if (value) focusDialog()
  },
  { immediate: true },
)

onBeforeUnmount(() => lockScroll(false))

const emitClose = () => emit('close')
</script>
