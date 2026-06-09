import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const ROOMS = [
  // Floor 2
  { number: 203, floor: 2, totalBeds: 3 },
  { number: 204, floor: 2, totalBeds: 2 },
  { number: 205, floor: 2, totalBeds: 2 },
  { number: 206, floor: 2, totalBeds: 2 },
  { number: 207, floor: 2, totalBeds: 4 },
  { number: 208, floor: 2, totalBeds: 4 },
  { number: 209, floor: 2, totalBeds: 2 },
  { number: 210, floor: 2, totalBeds: 2 },
  { number: 211, floor: 2, totalBeds: 2 },
  { number: 212, floor: 2, totalBeds: 5 },
  // Floor 3
  { number: 304, floor: 3, totalBeds: 4 },
  { number: 305, floor: 3, totalBeds: 4 },
  { number: 306, floor: 3, totalBeds: 4 },
  { number: 307, floor: 3, totalBeds: 4 },
  // Floor 4
  { number: 402, floor: 4, totalBeds: 4 },
  { number: 403, floor: 4, totalBeds: 4 },
  { number: 404, floor: 4, totalBeds: 4 },
  { number: 405, floor: 4, totalBeds: 4 },
  { number: 406, floor: 4, totalBeds: 4 },
  { number: 407, floor: 4, totalBeds: 4 },
  { number: 408, floor: 4, totalBeds: 4 },
  { number: 409, floor: 4, totalBeds: 4 },
  // Floor 5
  { number: 502, floor: 5, totalBeds: 4 },
  { number: 503, floor: 5, totalBeds: 4 },
  { number: 504, floor: 5, totalBeds: 4 },
  { number: 505, floor: 5, totalBeds: 4 },
  { number: 506, floor: 5, totalBeds: 4 },
  { number: 507, floor: 5, totalBeds: 4 },
  { number: 508, floor: 5, totalBeds: 4 },
  { number: 509, floor: 5, totalBeds: 4 },
]

async function main() {
  // Create default admin
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.admin.upsert({
    where: { login: 'admin' },
    update: {},
    create: {
      login: 'admin',
      password: hashedPassword,
      name: 'Администратор',
    },
  })
  console.log('Admin created: admin / admin123')

  // Create rooms
  for (const room of ROOMS) {
    await prisma.room.upsert({
      where: { number: room.number },
      update: { totalBeds: room.totalBeds },
      create: room,
    })
  }
  console.log(`${ROOMS.length} rooms created`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
