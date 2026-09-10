import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type SceneProps = {
  progressRef: React.MutableRefObject<number>
  velocityRef: React.MutableRefObject<number>
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uVelocity;
  attribute float aScale;
  attribute float aOffset;
  varying float vAlpha;
  varying float vMix;

  void main() {
    vec3 p = position;
    float drift = uTime * (0.12 + aOffset * 0.35);
    p.x += sin(drift + p.y * 0.35) * (0.35 + uVelocity * 2.5);
    p.y += cos(drift * 0.8 + p.x * 0.2) * 0.25;
    p.z += sin(drift * 0.6 + p.x * 0.15) * (0.4 + uProgress);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = -mv.z;
    gl_PointSize = aScale * (180.0 / dist) * (1.0 + uVelocity * 4.0);
    gl_Position = projectionMatrix * mv;

    vAlpha = smoothstep(28.0, 4.0, dist);
    vMix = fract(aOffset + uProgress);
  }
`

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  varying float vMix;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, d);
    vec3 ember = vec3(0.91, 0.65, 0.29);
    vec3 signal = vec3(0.37, 0.88, 0.66);
    vec3 col = mix(ember, signal, vMix);
    gl_FragColor = vec4(col, glow * vAlpha * 0.85);
  }
`

const ribbonVertex = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  varying float vFade;

  void main() {
    vec3 p = position;
    float t = uTime * 0.4 + position.x * 0.15;
    p.y += sin(t + uProgress * 6.2831) * 0.35;
    p.z += cos(t * 0.8) * 0.25;
    float nx = (p.x + 9.0) / 18.0;
    vFade = 1.0 - abs(nx - 0.5) * 1.6;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const ribbonFragment = /* glsl */ `
  uniform float uProgress;
  varying float vFade;

  void main() {
    vec3 a = vec3(0.91, 0.65, 0.29);
    vec3 b = vec3(0.37, 0.88, 0.66);
    vec3 col = mix(a, b, uProgress);
    gl_FragColor = vec4(col, vFade * 0.35);
  }
`

function createParticleGeo(count: number) {
  const positions = new Float32Array(count * 3)
  const scales = new Float32Array(count)
  const offsets = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const r = Math.pow(Math.random(), 0.55) * 18
    const theta = Math.random() * Math.PI * 2
    const y = (Math.random() - 0.5) * 22
    positions[i3] = Math.cos(theta) * r
    positions[i3 + 1] = y
    positions[i3 + 2] = Math.sin(theta) * r - 4
    scales[i] = 0.6 + Math.random() * 2.4
    offsets[i] = Math.random()
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
  geo.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 1))
  return geo
}

function createStructures() {
  const group = new THREE.Group()
  const material = new THREE.MeshBasicMaterial({
    color: 0x5ee0a8,
    wireframe: true,
    transparent: true,
    opacity: 0.22,
  })
  const emberMat = new THREE.MeshBasicMaterial({
    color: 0xe8a54b,
    wireframe: true,
    transparent: true,
    opacity: 0.18,
  })

  const shapes: THREE.Object3D[] = []

  const torus = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.08, 16, 96), material)
  torus.position.set(-3.2, 0.6, -2)
  group.add(torus)
  shapes.push(torus)

  const octa = new THREE.Mesh(new THREE.OctahedronGeometry(1.35, 0), emberMat)
  octa.position.set(3.4, -0.4, -3)
  group.add(octa)
  shapes.push(octa)

  const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 1), material.clone())
  ;(ico.material as THREE.MeshBasicMaterial).opacity = 0.16
  ico.position.set(0.4, 1.8, -5.5)
  group.add(ico)
  shapes.push(ico)

  const box = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 1.8), emberMat.clone())
  ;(box.material as THREE.MeshBasicMaterial).opacity = 0.14
  box.position.set(-1.2, -1.6, -7)
  group.add(box)
  shapes.push(box)

  const ring = new THREE.Mesh(new THREE.TorusKnotGeometry(1.0, 0.18, 120, 16), material.clone())
  ;(ring.material as THREE.MeshBasicMaterial).opacity = 0.2
  ring.position.set(2.2, 0.8, -10)
  group.add(ring)
  shapes.push(ring)

  const crystal = new THREE.Mesh(new THREE.ConeGeometry(0.9, 2.2, 5), emberMat.clone())
  ;(crystal.material as THREE.MeshBasicMaterial).opacity = 0.2
  crystal.position.set(-2.8, 0.2, -13)
  group.add(crystal)
  shapes.push(crystal)

  return { group, shapes }
}

function createGrid() {
  const geo = new THREE.BufferGeometry()
  const points: number[] = []
  const size = 28
  const step = 1.4
  for (let i = -size; i <= size; i += step) {
    points.push(-size, 0, i, size, 0, i)
    points.push(i, 0, -size, i, 0, size)
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
  const mat = new THREE.LineBasicMaterial({
    color: 0x5ee0a8,
    transparent: true,
    opacity: 0.045,
  })
  const lines = new THREE.LineSegments(geo, mat)
  lines.position.y = -3.2
  lines.rotation.x = -0.18
  return lines
}

export function CanvasScene({ progressRef, velocityRef }: SceneProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0a0c0b, 0.045)

    const camera = new THREE.PerspectiveCamera(
      48,
      mount.clientWidth / mount.clientHeight,
      0.1,
      80,
    )
    camera.position.set(0, 0.4, 6)

    const particles = new THREE.Points(
      createParticleGeo(reduced ? 400 : 1400),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uVelocity: { value: 0 },
        },
        vertexShader,
        fragmentShader,
      }),
    )
    scene.add(particles)

    const { group: structures, shapes } = createStructures()
    scene.add(structures)

    const grid = createGrid()
    scene.add(grid)

    const ribbonGeo = new THREE.PlaneGeometry(18, 0.04, 80, 1)
    const ribbon = new THREE.Mesh(
      ribbonGeo,
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
        },
        vertexShader: ribbonVertex,
        fragmentShader: ribbonFragment,
      }),
    )
    ribbon.position.set(0, -0.2, -4)
    scene.add(ribbon)

    const beamGeo = new THREE.CylinderGeometry(0.015, 0.015, 20, 8, 1, true)
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xe8a54b,
      transparent: true,
      opacity: 0.12,
    })
    const beam = new THREE.Mesh(beamGeo, beamMat)
    beam.rotation.z = Math.PI / 2
    beam.position.set(0, 2.2, -6)
    scene.add(beam)

    const cameraPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.4, 6),
      new THREE.Vector3(0.6, 0.2, 3.5),
      new THREE.Vector3(-0.8, 0.5, 0.5),
      new THREE.Vector3(0.4, -0.1, -2.5),
      new THREE.Vector3(-0.3, 0.35, -6),
      new THREE.Vector3(0.2, 0.15, -10),
      new THREE.Vector3(0, 0.3, -14),
    ])

    const lookPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.1, 0),
      new THREE.Vector3(-0.4, 0, -2),
      new THREE.Vector3(0.5, 0.2, -4),
      new THREE.Vector3(-0.2, 0, -7),
      new THREE.Vector3(0.3, 0.15, -10),
      new THREE.Vector3(0, 0.1, -13),
      new THREE.Vector3(0, 0.2, -16),
    ])

    let raf = 0
    let smoothProgress = 0
    let smoothVelocity = 0
    let mouseX = 0
    let mouseY = 0
    let smoothMouseX = 0
    let smoothMouseY = 0
    const clock = new THREE.Clock()

    const onPointer = (e: PointerEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = (e.clientY / window.innerHeight) * 2 - 1
    }

    const onResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointer)

    const render = () => {
      const t = clock.getElapsedTime()
      const target = progressRef.current
      const vel = velocityRef.current
      smoothProgress += (target - smoothProgress) * 0.075
      smoothVelocity += (vel - smoothVelocity) * 0.08
      smoothMouseX += (mouseX - smoothMouseX) * 0.04
      smoothMouseY += (mouseY - smoothMouseY) * 0.04

      const pMat = particles.material as THREE.ShaderMaterial
      pMat.uniforms.uTime.value = t
      pMat.uniforms.uProgress.value = smoothProgress
      pMat.uniforms.uVelocity.value = Math.min(smoothVelocity * 8, 1.2)

      const rMat = ribbon.material as THREE.ShaderMaterial
      rMat.uniforms.uTime.value = t
      rMat.uniforms.uProgress.value = smoothProgress

      const camPos = cameraPath.getPointAt(THREE.MathUtils.clamp(smoothProgress, 0, 1))
      const look = lookPath.getPointAt(THREE.MathUtils.clamp(smoothProgress, 0, 1))
      camPos.x += smoothMouseX * 0.55
      camPos.y += -smoothMouseY * 0.35
      look.x += smoothMouseX * 0.2
      look.y += -smoothMouseY * 0.12
      camera.position.lerp(camPos, 0.12)
      camera.lookAt(look)
      camera.rotation.z = smoothMouseX * 0.03 + smoothVelocity * 0.04

      shapes.forEach((shape, i) => {
        const speed = 0.15 + i * 0.04
        shape.rotation.x = t * speed * 0.35 + smoothProgress * (1 + i * 0.2)
        shape.rotation.y = t * speed * 0.55
        shape.position.y += Math.sin(t * 0.6 + i) * 0.0008
        const scale = 1 + Math.sin(t * 0.5 + i * 1.3) * 0.04 + smoothVelocity * 0.35
        shape.scale.setScalar(scale)
      })

      structures.rotation.y = smoothMouseX * 0.08
      structures.rotation.x = -smoothMouseY * 0.05

      grid.position.z = -smoothProgress * 8
      ;(grid.material as THREE.LineBasicMaterial).opacity = 0.03 + smoothProgress * 0.04
      ;(beam.material as THREE.MeshBasicMaterial).opacity =
        0.08 + Math.abs(Math.sin(t * 0.7)) * 0.08 + smoothVelocity * 0.2
      beam.rotation.y = t * 0.1
      ribbon.rotation.z = Math.sin(t * 0.2) * 0.08

      const fog = scene.fog as THREE.FogExp2
      fog.density = 0.035 + smoothProgress * 0.02

      renderer.render(scene, camera)
      raf = requestAnimationFrame(render)
    }

    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
      particles.geometry.dispose()
      ;(particles.material as THREE.Material).dispose()
      ribbon.geometry.dispose()
      ;(ribbon.material as THREE.Material).dispose()
      beam.geometry.dispose()
      beam.material.dispose()
      grid.geometry.dispose()
      ;(grid.material as THREE.Material).dispose()
      shapes.forEach((s) => {
        const mesh = s as THREE.Mesh
        mesh.geometry.dispose()
        ;(mesh.material as THREE.Material).dispose()
      })
      renderer.dispose()
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [progressRef, velocityRef])

  return <div className="webgl-root" ref={mountRef} aria-hidden="true" />
}
