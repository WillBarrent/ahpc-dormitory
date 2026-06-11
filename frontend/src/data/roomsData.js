const API_URL = 'http://localhost:3001/api'

/**
 * Fetch rooms for a given floor from the backend API
 * and build a lookup map: { [roomNumber]: { number, totalBeds, occupiedBeds, status, beds[] } }
 */
export async function fetchRoomMap(floorNumber) {
  const res = await fetch(`${API_URL}/rooms?floor=${floorNumber}`)
  const rooms = await res.json()

  const map = {}
  for (const room of rooms) {
    if (room.type !== 'RESIDENTIAL') continue

    const total = room.totalBeds
    const takenBedNumbers = new Set(
      (room.takenBeds || []).map((t) => t.bedNumber)
    )
    const beds = []
    for (let b = 0; b < total; b++) {
      const bedNum = b + 1
      beds.push({ id: `${room.number}-bed-${bedNum}`, occupied: takenBedNumbers.has(bedNum) })
    }

    const occupied = takenBedNumbers.size
    let status = 'free'
    if (occupied > 0 && occupied < total) status = 'reserved'
    if (occupied >= total) status = 'occupied'

    map[room.number] = {
      number: room.number,
      totalBeds: total,
      occupiedBeds: occupied,
      status,
      beds,
      roomId: room.id,
    }
  }
  return map
}
