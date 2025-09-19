import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Stars } from '@react-three/drei'
import './App.css'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { PosteriorHeatmap } from './components/PosteriorHeatmap'
import { WalletPanel } from './components/WalletPanel'

type SimStep = { step: number; player_action: number; opponent_action: number; reward: number; posterior?: number[]; policy?: number[] }

function Arena({ current }: { current?: SimStep }) {
  const pAct = current?.player_action ?? 1
  const oAct = current?.opponent_action ?? 1
  const playerPos = useMemo<[number, number, number]>(() => {
    if (pAct === 0) return [0.5, 0.5, 0]
    if (pAct === 2) return [-0.8, 0.5, 0.6]
    return [0, 0.5, 0]
  }, [pAct])
  const oppPos = useMemo<[number, number, number]>(() => {
    if (oAct === 0) return [2.5, 0.5, 0]
    if (oAct === 2) return [3.8, 0.5, -0.6]
    return [3, 0.5, 0]
  }, [oAct])

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[10, 64]} />
        <meshStandardMaterial color="#0b1020" />
      </mesh>
      <mesh position={playerPos} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#55ccff" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={oppPos} castShadow>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#ffd166" />
      </mesh>
    </group>
  )
}

export default function App() {
  const [steps, setSteps] = useState<SimStep[]>([])
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    fetch('http://127.0.0.1:8000/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opponent_history: [], max_steps: 30 })
    })
      .then(r => r.json())
      .then(data => setSteps(data.steps || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!steps.length) return
    setIdx(0)
    const t = setInterval(() => setIdx(i => (i + 1) % steps.length), 400)
    return () => clearInterval(t)
  }, [steps])

  const current = steps[idx]

  return (
    <div style={{ height: '100vh', width: '100vw', background: 'radial-gradient(60% 60% at 50% 40%, #0a0f1f, #030712 70%)' }}>
      <Canvas camera={{ position: [6, 6, 6], fov: 50 }} shadows>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
        <Suspense fallback={null}>
          <Environment preset="night" />
          <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
          <Arena current={current} />
        </Suspense>
        <OrbitControls enablePan={false} />
      </Canvas>
      <div style={{ position: 'fixed', left: 16, top: 16, color: '#e5e7eb', fontFamily: 'ui-sans-serif, system-ui' }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>EvoArena</div>
        <div style={{ opacity: 0.8, fontSize: 12 }}>Sim steps: {steps.length}</div>
        <PosteriorHeatmap posterior={current?.posterior} />
      </div>
      <WalletPanel />
    </div>
  )
}
