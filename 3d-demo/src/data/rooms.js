const FIRST_NAMES = ['Алексей', 'Дмитрий', 'Сергей', 'Андрей', 'Максим', 'Иван', 'Павел', 'Артем', 'Даниил', 'Егор', 'Кирилл', 'Владислав', 'Никита', 'Матвей', 'Тимофей']
const LAST_NAMES = ['Иванов', 'Петров', 'Сидоров', 'Кузнецов', 'Смирнов', 'Попов', 'Васильев', 'Зайцев', 'Морозов', 'Волков', 'Козлов', 'Новиков', 'Титов', 'Громов', 'Белов']

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateOccupants(count) {
  const result = []
  for (let i = 0; i < count; i++) {
    result.push(`${random(LAST_NAMES)} ${random(FIRST_NAMES)[0]}.`)
  }
  return result
}

const SIDES = ['left', 'right']

const FLOOR_ROOMS = [
  // Floor 1
  [
    { number: 101, side: 'left', status: 'free', beds: 2 },
    { number: 102, side: 'right', status: 'occupied', beds: 2 },
    { number: 103, side: 'left', status: 'occupied', beds: 3 },
    { number: 104, side: 'right', status: 'free', beds: 2 },
    { number: 105, side: 'left', status: 'occupied', beds: 3 },
    { number: 106, side: 'right', status: 'maintenance', beds: 2 },
    { number: 107, side: 'left', status: 'occupied', beds: 2 },
    { number: 108, side: 'right', status: 'free', beds: 3 },
  ],
  // Floor 2
  [
    { number: 201, side: 'left', status: 'occupied', beds: 2 },
    { number: 202, side: 'right', status: 'occupied', beds: 3 },
    { number: 203, side: 'left', status: 'free', beds: 2 },
    { number: 204, side: 'right', status: 'occupied', beds: 2 },
    { number: 205, side: 'left', status: 'occupied', beds: 2 },
    { number: 206, side: 'right', status: 'free', beds: 3 },
    { number: 207, side: 'left', status: 'occupied', beds: 3 },
    { number: 208, side: 'right', status: 'maintenance', beds: 2 },
  ],
  // Floor 3
  [
    { number: 301, side: 'left', status: 'free', beds: 2 },
    { number: 302, side: 'right', status: 'occupied', beds: 3 },
    { number: 303, side: 'left', status: 'occupied', beds: 2 },
    { number: 304, side: 'right', status: 'occupied', beds: 2 },
    { number: 305, side: 'left', status: 'free', beds: 3 },
    { number: 306, side: 'right', status: 'occupied', beds: 2 },
    { number: 307, side: 'left', status: 'occupied', beds: 2 },
    { number: 308, side: 'right', status: 'free', beds: 3 },
  ],
  // Floor 4
  [
    { number: 401, side: 'left', status: 'occupied', beds: 2 },
    { number: 402, side: 'right', status: 'free', beds: 3 },
    { number: 403, side: 'left', status: 'maintenance', beds: 2 },
    { number: 404, side: 'right', status: 'occupied', beds: 2 },
    { number: 405, side: 'left', status: 'occupied', beds: 3 },
    { number: 406, side: 'right', status: 'occupied', beds: 2 },
    { number: 407, side: 'left', status: 'free', beds: 2 },
    { number: 408, side: 'right', status: 'occupied', beds: 3 },
  ],
]

// Enrich with occupants
const rooms = FLOOR_ROOMS.map((floor, floorIndex) =>
  floor.map((room) => ({
    ...room,
    id: `${floorIndex + 1}-${room.number}`,
    floor: floorIndex + 1,
    occupants:
      room.status === 'occupied'
        ? generateOccupants(Math.min(room.beds, Math.floor(Math.random() * room.beds) + 1))
        : [],
  }))
)

export default rooms
