<template>
  <div class="pointer-events-none absolute inset-0 -z-10">
    <div class="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_20%,#0b0f1a_0%,#090d16_40%,#000_100%)]"></div>
    <canvas ref="canvas" class="absolute inset-0 w-full h-full opacity-30"></canvas>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const canvas = ref(null)
let raf = 0
let resizeHandler = null

onMounted(() => {
  const el = canvas.value
  if (!el) return
  const ctx = el.getContext('2d')
  const resize = () => { el.width = el.clientWidth; el.height = el.clientHeight }
  resizeHandler = () => resize()
  resize(); window.addEventListener('resize', resizeHandler)

  const stars = Array.from({ length: 140 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.2 + 0.2,
    s: Math.random() * 0.25 + 0.02,
    c: `rgba(165,243,252,${0.5 + Math.random() * 0.5})`,
  }))
  let t = 0
  const draw = () => {
    const { width, height } = el
    ctx.clearRect(0, 0, width, height)
    for (const st of stars) {
      const x = (st.x + Math.sin(t * st.s) * 0.002) * width
      const y = (st.y + Math.cos(t * st.s) * 0.002) * height
      ctx.fillStyle = st.c
      ctx.beginPath(); ctx.arc(x, y, st.r, 0, 2 * Math.PI); ctx.fill()
    }
    t += 1
    raf = requestAnimationFrame(draw)
  }
  raf = requestAnimationFrame(draw)
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
})
</script>

