<template>
  <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(1200px_600px_at_15%_25%,rgba(11,15,26,1)_0%,rgba(9,13,22,0.86)_45%,rgba(0,0,0,0.95)_100%)]"></div>
    <div class="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.22),rgba(0,0,0,0)_55%)]"></div>
    <div ref="container" class="absolute inset-0"></div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'

const container = ref(null)

let renderer = null
let scene = null
let camera = null
let animationId = 0
let resizeObserver = null
let starLayers = []
let nebula = null
let parallaxTarget = 0
let parallaxValue = 0
let cleanupRef = null

const LAYER_CONFIG = [
  { count: 1800, size: 0.028, depth: 420, color: new THREE.Color(0x7ff9ff), speed: 0.0008 },
  { count: 1100, size: 0.042, depth: 280, color: new THREE.Color(0x80d0ff), speed: 0.0013 },
  { count: 650, size: 0.075, depth: 120, color: new THREE.Color(0xff9ff2), speed: 0.0019 },
]

const createStarField = ({ count, size, depth, color, speed }) => {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  for (let i = 0; i < count; i += 1) {
    const index = i * 3
    const radius = Math.random() * depth
    const theta = Math.random() * 2 * Math.PI
    const phi = Math.acos((Math.random() * 2) - 1)
    positions[index] = Math.sin(phi) * Math.cos(theta) * radius
    positions[index + 1] = Math.sin(phi) * Math.sin(theta) * radius
    positions[index + 2] = Math.cos(phi) * radius
    sizes[i] = (Math.random() * 0.6 + 0.6) * size
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: color },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute float aSize;
      uniform float uPixelRatio;
      varying float vAlpha;
      void main() {
        vAlpha = clamp(aSize * 120.0, 0.3, 1.0);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * 600.0 * (1.0 / -mvPosition.z) * uPixelRatio;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vAlpha;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        float alpha = smoothstep(0.6, 0.1, dist) * vAlpha;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
  })

  const points = new THREE.Points(geometry, material)
  points.userData = { speed }
  return points
}

const createNebula = () => {
  const geometry = new THREE.SphereGeometry(120, 64, 64)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(0x1f67ff) },
      uColorB: { value: new THREE.Color(0x7c3aed) },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 pos = position + normal * 2.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      varying vec2 vUv;
      float noise(vec2 p){
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      void main() {
        vec2 uv = vUv * 2.0 - 1.0;
        float n = noise(uv * 3.2 + uTime * 0.12);
        float halo = smoothstep(1.0, 0.1, length(uv));
        vec3 color = mix(uColorA, uColorB, n * 0.6 + 0.2);
        float alpha = pow(halo, 1.4) * 0.35;
        gl_FragColor = vec4(color, alpha);
      }
    `,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(0, -10, -90)
  mesh.scale.set(1.2, 0.8, 1.2)
  return mesh
}

const init = () => {
  if (!container.value) return
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  renderer.domElement.style.display = 'block'
  renderer.setClearColor(0x020409, 1)
  container.value.appendChild(renderer.domElement)

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(
    60,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000,
  )
  camera.position.z = 120

  nebula = createNebula()
  scene.add(nebula)

  starLayers = LAYER_CONFIG.map((config, index) => {
    const points = createStarField(config)
    points.position.z = -index * 40
    scene.add(points)
    return points
  })

  const ambient = new THREE.AmbientLight(0x72d4ff, 0.3)
  scene.add(ambient)

  const scrollHandler = () => {
    const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1)
    const ratio = window.scrollY / maxScroll
    parallaxTarget = ratio * 1.2
  }
  window.addEventListener('scroll', scrollHandler, { passive: true })

  const resize = () => {
    if (!container.value) return
    const width = container.value.clientWidth
    const height = container.value.clientHeight
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    starLayers.forEach((layer) => {
      layer.material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
    })
  }

  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container.value)
  window.addEventListener('resize', resize)

  const clock = new THREE.Clock()

  const animate = () => {
    animationId = requestAnimationFrame(animate)
    const elapsed = clock.getElapsedTime()
    parallaxValue += (parallaxTarget - parallaxValue) * 0.05

    starLayers.forEach((layer, index) => {
      const speed = layer.userData.speed
      layer.rotation.y += speed * 1.2
      layer.rotation.x = parallaxValue * (0.4 + index * 0.2)
    })

    if (nebula?.material?.uniforms?.uTime) {
      nebula.material.uniforms.uTime.value = elapsed
      nebula.rotation.z = Math.sin(elapsed * 0.05) * 0.25
    }

    camera.position.z = 120 - parallaxValue * 30
    renderer.render(scene, camera)
  }
  animate()

  return () => {
    window.removeEventListener('scroll', scrollHandler)
    window.removeEventListener('resize', resize)
  }
}

onMounted(() => {
  const cleanup = init()
  if (cleanup) cleanupRef = cleanup
})

onBeforeUnmount(() => {
  if (cleanupRef) cleanupRef()
  if (resizeObserver && container.value) resizeObserver.disconnect()
  if (animationId) cancelAnimationFrame(animationId)
  const dom = renderer?.domElement
  starLayers.forEach((layer) => {
    layer.geometry.dispose()
    layer.material.dispose()
  })
  starLayers = []
  if (nebula) {
    nebula.geometry.dispose()
    nebula.material.dispose()
  }
  renderer?.dispose()
  if (container.value && dom && container.value.contains(dom)) {
    container.value.removeChild(dom)
  }
  renderer = null
  scene = null
  camera = null
})
</script>
