import { Box, Text } from '@react-three/drei'
import Room from './Room'

const ROOM_Z_POSITIONS = [-2.55, -0.85, 0.85, 2.55]
const LEFT_X = -1.3
const RIGHT_X = 1.3

export default function Floor({ floorIndex, roomsLeft, roomsRight, selectedRoom, onRoomClick }) {
  const yOffset = 1.5 + floorIndex * 3

  return (
    <group>
      {/* Slab / floor base */}
      <Box args={[5, 0.2, 6.5]} position={[0, yOffset - 0.45, 0]}>
        <meshStandardMaterial color="#374151" roughness={0.8} />
      </Box>

      {/* Corridor */}
      <Box args={[1.2, 0.5, 6.5]} position={[0, yOffset, 0]}>
        <meshStandardMaterial color="#6b7280" roughness={0.7} transparent opacity={0.5} />
      </Box>

      {/* Floor number label */}
      <Text
        position={[-2.8, yOffset + 0.4, -3.5]}
        fontSize={0.5}
        color="#9ca3af"
        anchorX="left"
        anchorY="middle"
      >
        {`Этаж ${floorIndex + 1}`}
      </Text>

      {/* Left side rooms */}
      {roomsLeft.map((room, i) => {
        const pos = [LEFT_X, yOffset, ROOM_Z_POSITIONS[i]]
        return (
          <Room
            key={room.id}
            room={room}
            position={pos}
            onClick={onRoomClick}
          />
        )
      })}

      {/* Right side rooms */}
      {roomsRight.map((room, i) => {
        const pos = [RIGHT_X, yOffset, ROOM_Z_POSITIONS[i]]
        return (
          <Room
            key={room.id}
            room={room}
            position={pos}
            onClick={onRoomClick}
          />
        )
      })}
    </group>
  )
}
