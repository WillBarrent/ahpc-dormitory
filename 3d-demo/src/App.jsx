import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import Building from './components/Building'
import InfoPanel from './components/InfoPanel'
import Legend from './components/Legend'
import styles from './App.module.css'

export default function App() {
  const [selectedRoom, setSelectedRoom] = useState(null)

  return (
    <div className={styles.root}>
      <Canvas
        camera={{
          position: [10, 8, 12],
          fov: 40,
          near: 0.1,
          far: 100,
        }}
        shadows
      >
        <color attach="background" args={['#0f172a']} />

        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} />
        <hemisphereLight args={['#b1e1ff', '#000000', 0.3]} />

        <Suspense fallback={null}>
          <Building
            selectedRoom={selectedRoom}
            onRoomClick={setSelectedRoom}
          />
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.4}
            scale={20}
            blur={2}
          />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={5}
          maxDistance={25}
          target={[0, 5, 0]}
        />
      </Canvas>

      <Legend />
      <InfoPanel room={selectedRoom} onClose={() => setSelectedRoom(null)} />

      <div className={styles.hint}>
        🖱 Вращайте · Колесо для зумирования · Клик по комнате
      </div>
    </div>
  )
}
