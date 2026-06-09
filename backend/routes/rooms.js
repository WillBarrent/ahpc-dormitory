import { Router } from 'express'
import prisma from '../prisma/client.js'
import requireAuth from '../middleware/auth.js'

const router = Router()

// GET /api/rooms — public, used by floor plans
router.get('/', async (req, res) => {
  const { floor } = req.query
  const where = floor ? { floor: Number(floor) } : {}

  const rooms = await prisma.room.findMany({
    where,
    include: { students: { where: { movedOut: null } } },
    orderBy: { number: 'asc' },
  })

  const result = rooms.map((room) => ({
    id: room.id,
    number: room.number,
    floor: room.floor,
    totalBeds: room.totalBeds,
    type: room.type,
    occupiedBeds: room.students.length,
  }))

  res.json(result)
})

// GET /api/rooms/:id — admin, detailed room info with students
router.get('/:id', requireAuth, async (req, res) => {
  const room = await prisma.room.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      students: {
        where: { movedOut: null },
        orderBy: { bedNumber: 'asc' },
      },
    },
  })

  if (!room) {
    return res.status(404).json({ error: 'Комната не найдена' })
  }

  res.json(room)
})

// POST /api/rooms — admin, create room
router.post('/', requireAuth, async (req, res) => {
  const { number, floor, totalBeds, type } = req.body
  const room = await prisma.room.create({
    data: { number, floor, totalBeds, type },
  })
  res.status(201).json(room)
})

// PATCH /api/rooms/:id — admin, update room
router.patch('/:id', requireAuth, async (req, res) => {
  const { totalBeds, type } = req.body
  const room = await prisma.room.update({
    where: { id: Number(req.params.id) },
    data: { totalBeds, type },
  })
  res.json(room)
})

export default router
