<template>
  <div ref="holder" class="w-full h-full min-h-[340px] lg:min-h-[460px] rounded-3xl overflow-hidden">
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'

const holder = ref(null)

let renderer = null
let scene = null
let camera = null
let world = null
let clock = null
let animationId = 0
let resizeObserver = null
const pointer = { x: 0, y: 0 }
const pointerTarget = { x: 0, y: 0 }
const orbiters = []

const createEarth = () => {
  const geometry = new THREE.SphereGeometry(40, 64, 64)
  const material = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(0x08213b) },
      uColorB: { value: new THREE.Color(0x0fa4c9) },
      uColorC: { value: new THREE.Color(0x3bbff6) },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform vec3 uColorC;
      varying vec2 vUv;
      varying vec3 vNormal;
      float stripes(float x, float freq) {
        return smoothstep(0.48, 0.5, abs(fract(x * freq) - 0.5));
      }
      void main() {
        vec3 normal = normalize(vNormal);
        float night = clamp(1.0 - normal.z * 0.7, 0.0, 1.0);
        vec3 base = mix(uColorA, uColorB, smoothstep(-0.1, 0.6, normal.y));
        float currents = stripes(vUv.y + uTime * 0.02, 8.0);
        float lats = stripes(vUv.x + uTime * 0.05, 10.0);
        float glow = pow(1.0 - abs(normal.z), 3.0);
        vec3 cityLights = uColorC * (currents * 0.35 + lats * 0.2);
        vec3 color = base + cityLights * glow;
        color = mix(color, vec3(0.02, 0.07, 0.12), night * 0.75);
        gl_FragColor = vec4(color, 0.95);
      }
    `,
  })
  const mesh = new THREE.Mesh(geometry, material)
  return mesh
}

const createAtmosphere = () => {
  const geometry = new THREE.SphereGeometry(42, 64, 64)
  const material = new THREE.MeshBasicMaterial({
    color: 0x4fd6ff,
    transparent: true,
    opacity: 0.18,
    side: THREE.BackSide,
  })
  const mesh = new THREE.Mesh(geometry, material)
  return mesh
}

const createOrbit = (radius, tilt, speed, color) => {
  const orbitGroup = new THREE.Group()
  orbitGroup.rotation.x = tilt.x
  orbitGroup.rotation.z = tilt.z

  const torus = new THREE.TorusGeometry(radius, 0.22, 12, 128)
  const orbitMaterial = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.32,
  })
  const orbit = new THREE.Mesh(torus, orbitMaterial)
  orbit.rotation.x = Math.PI / 2
  orbitGroup.add(orbit)

  const beaconPivot = new THREE.Group()
  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(1.8, 16, 16),
    new THREE.MeshStandardMaterial({
      color: 0xfff3d6,
      emissive: 0xfff9c2,
      emissiveIntensity: 1.8,
      metalness: 0.1,
      roughness: 0.3,
    }),
  )
  beacon.position.set(radius, 0, 0)
  beaconPivot.add(beacon)

  const trailGeometry = new THREE.BufferGeometry()
  const points = []
  for (let i = 0; i <= 64; i += 1) {
    const angle = (i / 64) * Math.PI * 2
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0))
  }
  trailGeometry.setFromPoints(points)
  const trailMaterial = new THREE.LineDashedMaterial({
    color,
    dashSize: 2,
    gapSize: 1.5,
    transparent: true,
    opacity: 0.65,
  })
  const trail = new THREE.LineLoop(trailGeometry, trailMaterial)
  trail.computeLineDistances()
  orbitGroup.add(trail)

  orbitGroup.add(beaconPivot)

  orbiters.push({ pivot: beaconPivot, mesh: beacon, speed, radius, trail })
  return orbitGroup
}

const addStarParticles = (parent) => {
  const geometry = new THREE.BufferGeometry()
  const count = 1200
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i += 1) {
    const index = i * 3
    const random = new THREE.Vector3(
      (Math.random() - 0.5) * 800,
      (Math.random() - 0.5) * 800,
      (Math.random() - 0.5) * 800,
    )
    positions[index] = random.x
    positions[index + 1] = random.y
    positions[index + 2] = random.z
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const material = new THREE.PointsMaterial({
    size: 1.6,
    color: 0x66f0ff,
    transparent: true,
    opacity: 0.4,
    sizeAttenuation: true,
  })
  const points = new THREE.Points(geometry, material)
  parent.add(points)
}

const onPointerMove = (event) => {
  if (!holder.value) return
  const rect = holder.value.getBoundingClientRect()
  const nx = (event.clientX - rect.left) / rect.width
  const ny = (event.clientY - rect.top) / rect.height
  pointerTarget.x = (ny - 0.5) * 0.6
  pointerTarget.y = (nx - 0.5) * 1.0
}

const onPointerLeave = () => {
  pointerTarget.x = 0
  pointerTarget.y = 0
}

const init = () => {
  if (!holder.value) return
  const { clientWidth: width, clientHeight: height } = holder.value

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height)
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  renderer.domElement.style.display = 'block'
  if ('outputColorSpace' in renderer) {
    renderer.outputColorSpace = THREE.SRGBColorSpace
  } else {
    renderer.outputEncoding = THREE.sRGBEncoding
  }
  holder.value.appendChild(renderer.domElement)

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x020a16, 0.0008)

  camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 800)
  camera.position.set(0, 28, 160)

  world = new THREE.Group()
  scene.add(world)

  const earth = createEarth()
  world.add(earth)

  const atmosphere = createAtmosphere()
  world.add(atmosphere)

  const orbit1 = createOrbit(62, { x: Math.PI / 2.7, z: Math.PI / 6 }, 0.0036, 0x00f0ff)
  const orbit2 = createOrbit(78, { x: Math.PI / 2.4, z: -Math.PI / 5 }, 0.0022, 0x7c3aed)
  world.add(orbit1)
  world.add(orbit2)

  addStarParticles(scene)

  const ambient = new THREE.AmbientLight(0x66ccff, 0.6)
  scene.add(ambient)
  const dir = new THREE.DirectionalLight(0xffffff, 1.1)
  dir.position.set(-120, 80, 60)
  scene.add(dir)

  clock = new THREE.Clock()

  const resize = () => {
    if (!holder.value) return
    const w = holder.value.clientWidth
    const h = holder.value.clientHeight
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(holder.value)
  window.addEventListener('resize', resize)

  holder.value.addEventListener('pointermove', onPointerMove)
  holder.value.addEventListener('pointerleave', onPointerLeave)

  const animate = () => {
    animationId = requestAnimationFrame(animate)
    const elapsed = clock.getElapsedTime()

    pointer.x += (pointerTarget.x - pointer.x) * 0.06
    pointer.y += (pointerTarget.y - pointer.y) * 0.06

    if (world) {
      world.rotation.x = pointer.x
      world.rotation.y += 0.001 + (pointer.y - world.rotation.y) * 0.04
    }

    orbiters.forEach((orb) => {
      orb.pivot.rotation.y += orb.speed
      orb.mesh.rotation.y += 0.02
      if (orb.trail?.material && 'dashOffset' in orb.trail.material) {
        orb.trail.material.dashOffset = -elapsed * 0.12 * orb.speed * 120
      }
    })

    if (world?.children?.[0]?.material?.uniforms?.uTime) {
      world.children[0].material.uniforms.uTime.value = elapsed
    }

    renderer.render(scene, camera)
  }
  animate()

  return () => {
    window.removeEventListener('resize', resize)
    holder.value?.removeEventListener('pointermove', onPointerMove)
    holder.value?.removeEventListener('pointerleave', onPointerLeave)
  }
}

let cleanup = null

onMounted(() => {
  cleanup = init()
})

onBeforeUnmount(() => {
  cleanup?.()
  if (resizeObserver) resizeObserver.disconnect()
  if (animationId) cancelAnimationFrame(animationId)
  orbiters.length = 0
  const canvas = renderer?.domElement
  renderer?.dispose()
  if (holder.value && canvas && holder.value.contains(canvas)) {
    holder.value.removeChild(canvas)
  }
  scene?.traverse((child) => {
    if (child.isMesh) {
      child.geometry?.dispose()
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => m.dispose?.())
      } else {
        child.material?.dispose?.()
      }
    }
    if (child.isPoints) {
      child.geometry?.dispose()
      child.material?.dispose?.()
    }
  })
  scene = null
  camera = null
  world = null
  renderer = null
})
</script>

<style scoped>
:host {
  display: block;
}
</style>
