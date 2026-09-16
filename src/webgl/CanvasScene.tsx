import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type Props = {
  progressRef: React.MutableRefObject<number>
  velocityRef: React.MutableRefObject<number>
}

const particleVert = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uVelocity;
  attribute float aSize;
  attribute float aSeed;
  varying float vAlpha;
  varying float vMix;

  void main() {
    vec3 p = position;
    float t = uTime * (0.15 + aSeed * 0.4);
    p.x += sin(t + p.z * 0.25) * (0.5 + uVelocity * 2.2);
    p.y += cos(t * 0.7 + p.x * 0.2) * 0.35;
    p.z += sin(t * 0.55 + aSeed * 6.0) * (0.6 + uProgress * 1.4);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * (210.0 / -mv.z) * (1.0 + uVelocity * 3.5);
    gl_Position = projectionMatrix * mv;
    vAlpha = smoothstep(26.0, 3.0, -mv.z);
    vMix = fract(aSeed + uProgress * 0.8);
  }
`

const particleFrag = /* glsl */ `
  varying float vAlpha;
  varying float vMix;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float g = smoothstep(0.5, 0.0, d);
    vec3 volt = vec3(0.96, 1.0, 0.28);
    vec3 flare = vec3(1.0, 0.42, 0.24);
    vec3 col = mix(volt, flare, vMix);
    gl_FragColor = vec4(col, g * vAlpha * 0.9);
  }
`

const ribbonVert = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  varying float vFade;
  varying float vMix;

  void main() {
    vec3 p = position;
    float wave = sin(uTime * 0.55 + position.x * 0.35 + uProgress * 8.0) * 0.55;
    float wave2 = cos(uTime * 0.35 + position.x * 0.2) * 0.25;
    p.y += wave;
    p.z += wave2;
    vFade = 1.0 - abs((position.x + 10.0) / 20.0 - 0.5) * 1.5;
    vMix = fract((position.x + 10.0) / 20.0 + uProgress);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const ribbonFrag = /* glsl */ `
  varying float vFade;
  varying float vMix;
  void main() {
    vec3 a = vec3(0.96, 1.0, 0.28);
    vec3 b = vec3(1.0, 0.42, 0.24);
    vec3 col = mix(a, b, vMix);
    gl_FragColor = vec4(col, clamp(vFade, 0.0, 1.0) * 0.42);
  }
`

function makeParticles(count: number) {
  const pos = new Float32Array(count * 3)
  const size = new Float32Array(count)
  const seed = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const r = Math.pow(Math.random(), 0.5) * 16
    const a = Math.random() * Math.PI * 2
    pos[i3] = Math.cos(a) * r
    pos[i3 + 1] = (Math.random() - 0.5) * 20
    pos[i3 + 2] = Math.sin(a) * r - 3
    size[i] = 0.7 + Math.random() * 2.6
    seed[i] = Math.random()
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
  return geo
}

export function CanvasScene({ progressRef, velocityRef }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
      })
    } catch {
      root.dataset.webgl = 'off'
      return
    }
    if (!renderer.getContext()) {
      renderer.dispose()
      root.dataset.webgl = 'off'
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setSize(root.clientWidth, root.clientHeight)
    renderer.setClearColor(0x000000, 0)
    root.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x050608, 0.04)

    const camera = new THREE.PerspectiveCamera(50, root.clientWidth / root.clientHeight, 0.1, 80)
    camera.position.set(0, 0.2, 7)

    const particles = new THREE.Points(
      makeParticles(reduced ? 350 : 1600),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uVelocity: { value: 0 },
        },
        vertexShader: particleVert,
        fragmentShader: particleFrag,
      }),
    )
    scene.add(particles)

    const ribbons: THREE.Mesh[] = []
    for (let i = 0; i < 3; i++) {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(22, 0.035, 120, 1),
        new THREE.ShaderMaterial({
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
          uniforms: {
            uTime: { value: 0 },
            uProgress: { value: 0 },
          },
          vertexShader: ribbonVert,
          fragmentShader: ribbonFrag,
        }),
      )
      mesh.position.set(0, -1.2 + i * 1.1, -2 - i * 2.2)
      mesh.rotation.z = (i - 1) * 0.12
      scene.add(mesh)
      ribbons.push(mesh)
    }

    const matWire = new THREE.MeshBasicMaterial({
      color: 0xf4ff47,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    })
    const matWire2 = new THREE.MeshBasicMaterial({
      color: 0xff6b3d,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    })

    const forms: THREE.Object3D[] = []
    const torus = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.05, 12, 100), matWire)
    torus.position.set(-3.4, 0.8, -2.5)
    scene.add(torus)
    forms.push(torus)

    const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15, 1), matWire2)
    ico.position.set(3.2, -0.6, -4)
    scene.add(ico)
    forms.push(ico)

    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.95, 0.16, 140, 14), matWire.clone())
    ;(knot.material as THREE.MeshBasicMaterial).opacity = 0.18
    knot.position.set(0.2, 1.4, -7)
    scene.add(knot)
    forms.push(knot)

    const octa = new THREE.Mesh(new THREE.OctahedronGeometry(1.2, 0), matWire2.clone())
    octa.position.set(-2.2, -1.2, -10)
    scene.add(octa)
    forms.push(octa)

    const camPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.25, 7),
      new THREE.Vector3(0.8, 0.1, 4),
      new THREE.Vector3(-0.9, 0.45, 1),
      new THREE.Vector3(0.5, -0.15, -2.5),
      new THREE.Vector3(-0.35, 0.3, -6),
      new THREE.Vector3(0.15, 0.1, -10),
      new THREE.Vector3(0, 0.25, -14),
    ])
    const lookPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-0.3, 0.1, -2),
      new THREE.Vector3(0.4, 0.15, -4.5),
      new THREE.Vector3(-0.2, 0, -7.5),
      new THREE.Vector3(0.25, 0.1, -11),
      new THREE.Vector3(0, 0.15, -14),
      new THREE.Vector3(0, 0.2, -17),
    ])

    let raf = 0
    let p = 0
    let v = 0
    let mx = 0
    let my = 0
    let smx = 0
    let smy = 0
    const clock = new THREE.Clock()

    const onPointer = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1
      my = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onResize = () => {
      const w = root.clientWidth
      const h = root.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    }
    window.addEventListener('pointermove', onPointer)
    window.addEventListener('resize', onResize)

    const render = () => {
      const t = clock.getElapsedTime()
      p += (progressRef.current - p) * 0.08
      v += (velocityRef.current - v) * 0.1
      smx += (mx - smx) * 0.045
      smy += (my - smy) * 0.045

      const pm = particles.material as THREE.ShaderMaterial
      pm.uniforms.uTime.value = t
      pm.uniforms.uProgress.value = p
      pm.uniforms.uVelocity.value = Math.min(v * 8, 1.25)

      ribbons.forEach((r, i) => {
        const m = r.material as THREE.ShaderMaterial
        m.uniforms.uTime.value = t + i * 0.7
        m.uniforms.uProgress.value = p
        r.rotation.z = Math.sin(t * 0.2 + i) * 0.08 + smx * 0.05
      })

      const clamped = THREE.MathUtils.clamp(p, 0, 1)
      const cam = camPath.getPointAt(clamped)
      const look = lookPath.getPointAt(clamped)
      cam.x += smx * 0.6
      cam.y += -smy * 0.35
      look.x += smx * 0.2
      look.y += -smy * 0.12
      camera.position.lerp(cam, 0.12)
      camera.lookAt(look)
      camera.rotation.z = smx * 0.035 + v * 0.045

      forms.forEach((f, i) => {
        f.rotation.x = t * (0.12 + i * 0.03) + p * (0.8 + i * 0.2)
        f.rotation.y = t * (0.18 + i * 0.04)
        const s = 1 + Math.sin(t * 0.5 + i) * 0.05 + v * 0.3
        f.scale.setScalar(s)
      })

      ;(scene.fog as THREE.FogExp2).density = 0.032 + p * 0.02
      renderer.render(scene, camera)
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('resize', onResize)
      particles.geometry.dispose()
      ;(particles.material as THREE.Material).dispose()
      ribbons.forEach((r) => {
        r.geometry.dispose()
        ;(r.material as THREE.Material).dispose()
      })
      forms.forEach((f) => {
        const m = f as THREE.Mesh
        m.geometry.dispose()
        ;(m.material as THREE.Material).dispose()
      })
      renderer.dispose()
      if (renderer.domElement.parentElement === root) root.removeChild(renderer.domElement)
    }
  }, [progressRef, velocityRef])

  return <div className="webgl" ref={rootRef} aria-hidden="true" />
}
