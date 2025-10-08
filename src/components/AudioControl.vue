<template>
  <button
    class="audio-toggle"
    type="button"
    :aria-pressed="isOn"
    @click="toggle">
    <svg v-if="isOn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-cyan-300">
      <path d="M5.25 8.25 9 6v12l-3.75-2.25H3a.75.75 0 0 1-.75-.75v-6a.75.75 0 0 1 .75-.75h2.25Z" />
      <path d="M19.5 12a3.75 3.75 0 0 0-3.75-3.75v7.5A3.75 3.75 0 0 0 19.5 12Zm0 0a6 6 0 0 0-6-6v12a6 6 0 0 0 6-6Z" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-slate-300">
      <path d="M15 8.25v7.5m0-11.25a6 6 0 0 1 3.422 10.963M15 4.5a6 6 0 0 0-3.422 10.963M3 9.75v4.5a.75.75 0 0 0 1.125.65l3.33-2.06a.75.75 0 0 0 .36-.65v-0.72a.75.75 0 0 0-.36-.65L4.125 9.1A.75.75 0 0 0 3 9.75Z" />
    </svg>
    <span class="text-xs uppercase tracking-[0.4em]">Audio {{ isOn ? 'ON' : 'OFF' }}</span>
  </button>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'

const isOn = ref(false)
let context = null
let baseOsc = null
let baseGain = null
let noiseSource = null
let noiseGain = null
let beepOsc = null
let beepGain = null
let beepTimer = null

const restore = () => {
  try {
    const stored = localStorage.getItem('nasa-audio-enabled')
    if (stored === '1') {
      isOn.value = true
    }
  } catch (err) {
    console.warn('Audio preference unavailable', err)
  }
}

const createNoiseBuffer = (ctx) => {
  const bufferSize = ctx.sampleRate * 2
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = (Math.random() * 2 - 1) * 0.35
  }
  return buffer
}

const startAudio = async () => {
  if (context) return
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext
  if (!AudioContextCtor) return
  context = new AudioContextCtor()
  await context.resume()

  const now = context.currentTime

  baseGain = context.createGain()
  baseGain.gain.setValueAtTime(0.0001, now)
  baseGain.connect(context.destination)

  baseOsc = context.createOscillator()
  baseOsc.type = 'triangle'
  baseOsc.frequency.setValueAtTime(56, now)
  baseOsc.frequency.exponentialRampToValueAtTime(46, now + 16)
  baseOsc.connect(baseGain)
  baseOsc.start(now)
  baseGain.gain.exponentialRampToValueAtTime(0.12, now + 2)

  noiseGain = context.createGain()
  noiseGain.gain.value = 0.018
  noiseGain.connect(context.destination)
  noiseSource = context.createBufferSource()
  noiseSource.buffer = createNoiseBuffer(context)
  noiseSource.loop = true
  noiseSource.connect(noiseGain)
  noiseSource.start(now)

  beepGain = context.createGain()
  beepGain.gain.setValueAtTime(0.0001, now)
  beepGain.connect(context.destination)
  beepOsc = context.createOscillator()
  beepOsc.type = 'sine'
  beepOsc.frequency.setValueAtTime(880, now)
  beepOsc.connect(beepGain)
  beepOsc.start(now)

  beepTimer = setInterval(() => {
    if (!context) return
    const t = context.currentTime
    beepGain.gain.cancelScheduledValues(t)
    beepGain.gain.setValueAtTime(0.0001, t)
    beepGain.gain.exponentialRampToValueAtTime(0.08, t + 0.08)
    beepGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45)
    beepOsc.frequency.setValueAtTime(660 + Math.random() * 140, t)
  }, 4200)
}

const shutdown = () => {
  if (!context) return
  const now = context.currentTime
  const nodes = [baseGain, noiseGain, beepGain]
  nodes.forEach((node) => {
    try {
      node?.gain?.cancelScheduledValues(now)
      node?.gain?.linearRampToValueAtTime(0.0001, now + 0.4)
    } catch (err) {
      // noop
    }
  })
  setTimeout(() => {
    try {
      baseOsc?.stop()
      noiseSource?.stop()
      beepOsc?.stop()
      context?.close()
    } catch (err) {
      console.warn('Audio shutdown issue', err)
    }
    baseOsc = null
    baseGain = null
    noiseSource = null
    noiseGain = null
    beepOsc = null
    beepGain = null
    context = null
  }, 500)
  if (beepTimer) clearInterval(beepTimer)
  beepTimer = null
}

watch(isOn, (value) => {
  try {
    localStorage.setItem('nasa-audio-enabled', value ? '1' : '0')
  } catch (err) {
    console.warn('Audio preference storage failed', err)
  }
  if (value) startAudio()
  else shutdown()
})

const toggle = () => {
  isOn.value = !isOn.value
}

restore()
if (isOn.value) startAudio()

onBeforeUnmount(() => {
  shutdown()
})
</script>
