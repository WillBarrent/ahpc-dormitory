import { Plane, Box } from '@react-three/drei'
import Floor from './Floor'
import rooms from '../data/rooms'

const FLOOR_COUNT = 4

export default function Building({ selectedRoom, onRoomClick }) {
  return (
    <group>
      {/* Ground plane */}
      <Plane args={[30, 30]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <meshStandardMaterial color="#1f2937" roughness={0.9} />
      </Plane>

      {/* Grid helper via simple line-like markers on ground */}
      {Array.from({ length: 8 }, (_, i) => (
        <Box
          key={`gx-${i}`}
          args={[0.02, 0.01, 6.5]}
          position={[-3 + i * 1, -0.05, 0]}
        >
          <meshBasicMaterial color="#374151" transparent opacity={0.3} />
        </Box>
      ))}

      {/* Floors */}
      {Array.from({ length: FLOOR_COUNT }, (_, i) => {
        const floorRooms = rooms[i]
        const leftRooms = floorRooms.filter((r) => r.side === 'left')
        const rightRooms = floorRooms.filter((r) => r.side === 'right')

        return (
          <Floor
            key={i}
            floorIndex={i}
            roomsLeft={leftRooms}
            roomsRight={rightRooms}
            selectedRoom={selectedRoom}
            onRoomClick={onRoomClick}
          />
        )
      })}

      {/* Roof */}
      <Box args={[5, 0.2, 6.5]} position={[0, 1.5 + 4 * 3, 0]}>
        <meshStandardMaterial color="#2d3748" roughness={0.6} />
      </Box>

      {/* Roof edge / parapet */}
      <Box args={[5.3, 0.1, 0.3]} position={[0, 1.5 + 4 * 3 + 0.15, 3.4]}>
        <meshStandardMaterial color="#2d3748" roughness={0.6} />
      </Box>
      <Box args={[5.3, 0.1, 0.3]} position={[0, 1.5 + 4 * 3 + 0.15, -3.4]}>
        <meshStandardMaterial color="#2d3748" roughness={0.6} />
      </Box>
      <Box args={[0.3, 0.1, 6.5]} position={[2.65, 1.5 + 4 * 3 + 0.15, 0]}>
        <meshStandardMaterial color="#2d3748" roughness={0.6} />
      </Box>
    </group>
  )
}
