import { useState } from 'react'
import { Box } from '@react-three/drei'

const STATUS_COLORS = {
  free: '#22c55e',
  occupied: '#ef4444',
  maintenance: '#eab308',
}

const STATUS_COLORS_EMISSIVE = {
  free: '#166534',
  occupied: '#7f1d1d',
  maintenance: '#713f12',
}

export default function Room({ room, position, onClick }) {
  const [hovered, setHovered] = useState(false)

  const color = STATUS_COLORS[room.status] || '#94a3b8'
  const emissive = STATUS_COLORS_EMISSIVE[room.status] || '#000000'

  return (
    <Box
      args={[1.4, 0.7, 1.4]}
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onClick(room)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'default'
      }}
    >
      <meshStandardMaterial
        color={color}
        emissive={hovered ? color : emissive}
        emissiveIntensity={hovered ? 0.6 : 0.1}
        roughness={0.6}
        metalness={0.1}
      />
    </Box>
  )
}

export { STATUS_COLORS }
