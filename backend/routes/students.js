import { Router } from 'express'
import prisma from '../prisma/client.js'
import requireAuth from '../middleware/auth.js'

const router = Router()

// All student routes require admin auth
router.use(requireAuth)

// GET /api/students
router.get('/', async (req, res) => {
  const { floor, room, search } = req.query

  const where = { movedOut: null }

  if (room) {
    where.roomId = Number(room)
  } else if (floor) {
    where.room = { floor: Number(floor) }
  }

  if (search) {
    where.fullName = { contains: search, mode: 'insensitive' }
  }

  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  const students = await prisma.student.findMany({
    where,
    include: {
      room: { select: { number: true, floor: true } },
      payments: {
        where: { month: currentMonth, year: currentYear },
        take: 1,
      },
      absences: {
        where: { status: { in: ['PENDING', 'ACTIVE'] } },
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { fullName: 'asc' },
  })

  const result = students.map((s) => ({
    ...s,
    paidThisMonth: s.payments.length > 0,
    payments: undefined,
    currentAbsence: s.absences[0] || null,
    absences: undefined,
  }))

  res.json(result)
})

// GET /api/students/:id
router.get('/:id', async (req, res) => {
  const student = await prisma.student.findUnique({
    where: { id: Number(req.params.id) },
    include: { room: true },
  })

  if (!student) {
    return res.status(404).json({ error: 'Студент не найден' })
  }

  res.json(student)
})

// POST /api/students — register student and assign to room
router.post('/', async (req, res) => {
  const { fullName, course, group, phone, roomId, bedNumber } = req.body

  if (!fullName || !course || !group) {
    return res.status(400).json({ error: 'Заполните обязательные поля' })
  }

  if (roomId) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { students: { where: { movedOut: null } } },
    })

    if (!room) {
      return res.status(404).json({ error: 'Комната не найдена' })
    }

    if (room.students.length >= room.totalBeds) {
      return res.status(400).json({ error: 'В комнате нет свободных мест' })
    }
  }

  const student = await prisma.student.create({
    data: {
      fullName,
      course,
      group,
      phone,
      roomId,
      bedNumber,
      movedIn: roomId ? new Date() : null,
    },
    include: { room: { select: { number: true, floor: true } } },
  })

  res.status(201).json(student)
})

// PATCH /api/students/:id — update student info or reassign room
router.patch('/:id', async (req, res) => {
  const { fullName, course, group, phone, roomId, bedNumber } = req.body

  if (roomId) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { students: { where: { movedOut: null } } },
    })

    if (!room) {
      return res.status(404).json({ error: 'Комната не найдена' })
    }

    const currentStudent = await prisma.student.findUnique({
      where: { id: Number(req.params.id) },
    })

    const otherStudents = room.students.filter((s) => s.id !== currentStudent.id)
    if (otherStudents.length >= room.totalBeds) {
      return res.status(400).json({ error: 'В комнате нет свободных мест' })
    }
  }

  const student = await prisma.student.update({
    where: { id: Number(req.params.id) },
    data: {
      ...(fullName && { fullName }),
      ...(course && { course }),
      ...(group && { group }),
      ...(phone !== undefined && { phone }),
      ...(roomId !== undefined && { roomId, movedIn: roomId ? new Date() : null }),
      ...(bedNumber !== undefined && { bedNumber }),
    },
    include: { room: { select: { number: true, floor: true } } },
  })

  res.json(student)
})

// POST /api/students/:id/confirm — confirm document signed, activate student
router.post('/:id/confirm', async (req, res) => {
  const student = await prisma.student.findUnique({
    where: { id: Number(req.params.id) },
  })

  if (!student) {
    return res.status(404).json({ error: 'Студент не найден' })
  }

  if (student.status === 'ACTIVE') {
    return res.status(400).json({ error: 'Студент уже подтверждён' })
  }

  const updated = await prisma.student.update({
    where: { id: Number(req.params.id) },
    data: { status: 'ACTIVE' },
    include: { room: { select: { number: true, floor: true } } },
  })

  res.json(updated)
})

// POST /api/students/:id/checkout — move student out
router.post('/:id/checkout', async (req, res) => {
  const student = await prisma.student.update({
    where: { id: Number(req.params.id) },
    data: {
      movedOut: new Date(),
      roomId: null,
      bedNumber: null,
    },
  })

  res.json(student)
})

export default router
