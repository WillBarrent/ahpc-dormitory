import { Router } from 'express'
import prisma from '../prisma/client.js'
import requireAuth from '../middleware/auth.js'

const router = Router()

// POST /api/bookings — public, create a booking
router.post('/', async (req, res) => {
  const { fullName, course, group, phone, roomId, bedNumber } = req.body

  if (!fullName || !course || !group || !phone || !roomId || !bedNumber) {
    return res.status(400).json({ error: 'Заполните все обязательные поля' })
  }

  const room = await prisma.room.findUnique({
    where: { id: Number(roomId) },
  })

  if (!room) {
    return res.status(404).json({ error: 'Комната не найдена' })
  }

  if (room.type !== 'RESIDENTIAL') {
    return res.status(400).json({ error: 'Эта комната не предназначена для проживания' })
  }

  if (bedNumber < 1 || bedNumber > room.totalBeds) {
    return res.status(400).json({ error: 'Некорректный номер места' })
  }

  // Check availability: bed must not be occupied or already booked
  const [occupyingStudent, existingBooking] = await Promise.all([
    prisma.student.findFirst({
      where: { roomId: room.id, bedNumber, movedOut: null },
    }),
    prisma.booking.findFirst({
      where: { roomId: room.id, bedNumber, status: 'PENDING' },
    }),
  ])

  if (occupyingStudent || existingBooking) {
    return res.status(409).json({ error: 'Это место уже занято или забронировано' })
  }

  const booking = await prisma.booking.create({
    data: {
      fullName,
      course: Number(course),
      group,
      phone: phone || null,
      roomId: Number(roomId),
      bedNumber: Number(bedNumber),
    },
    include: { room: { select: { number: true, floor: true } } },
  })

  res.status(201).json(booking)
})

// GET /api/bookings/status — public, check booking status by name + phone
router.get('/status', async (req, res) => {
  const { fullName, phone } = req.query

  if (!fullName || !phone) {
    return res.status(400).json({ error: 'Укажите ФИО и телефон' })
  }

  const bookings = await prisma.booking.findMany({
    where: {
      fullName: { contains: fullName.trim(), mode: 'insensitive' },
      phone: phone.trim(),
    },
    include: { room: { select: { number: true, floor: true } } },
    orderBy: { createdAt: 'desc' },
  })

  res.json(bookings)
})

// All remaining routes require admin auth
router.use(requireAuth)

// GET /api/bookings — list bookings (admin only)
router.get('/', async (req, res) => {
  const { status, floor, search } = req.query
  const where = {}

  if (status) where.status = status
  if (search) where.fullName = { contains: search, mode: 'insensitive' }
  if (floor) where.room = { floor: Number(floor) }

  const bookings = await prisma.booking.findMany({
    where,
    include: { room: { select: { number: true, floor: true } } },
    orderBy: { createdAt: 'desc' },
  })

  res.json(bookings)
})

// POST /api/bookings/:id/confirm — confirm booking and create student
router.post('/:id/confirm', async (req, res) => {
  const booking = await prisma.booking.findUnique({
    where: { id: Number(req.params.id) },
  })

  if (!booking) {
    return res.status(404).json({ error: 'Бронирование не найдено' })
  }

  if (booking.status !== 'PENDING') {
    return res.status(400).json({ error: 'Бронирование уже обработано' })
  }

  try {
    const [student] = await prisma.$transaction(async (tx) => {
      // Double-check bed availability
      const occupyingStudent = await tx.student.findFirst({
        where: { roomId: booking.roomId, bedNumber: booking.bedNumber, movedOut: null },
      })

      const otherBooking = await tx.booking.findFirst({
        where: {
          roomId: booking.roomId,
          bedNumber: booking.bedNumber,
          status: 'PENDING',
          id: { not: booking.id },
        },
      })

      if (occupyingStudent || otherBooking) {
        throw new Error('Это место уже занято')
      }

      const newStudent = await tx.student.create({
        data: {
          fullName: booking.fullName,
          course: booking.course,
          group: booking.group,
          phone: booking.phone,
          roomId: booking.roomId,
          bedNumber: booking.bedNumber,
        },
        include: { room: { select: { number: true, floor: true } } },
      })

      await tx.booking.update({
        where: { id: booking.id },
        data: { status: 'CONFIRMED' },
      })

      return [newStudent]
    })

    res.json({ student, message: 'Студент успешно заселён' })
  } catch (err) {
    res.status(409).json({ error: err.message })
  }
})

// POST /api/bookings/:id/reject — reject a booking
router.post('/:id/reject', async (req, res) => {
  const booking = await prisma.booking.findUnique({
    where: { id: Number(req.params.id) },
  })

  if (!booking) {
    return res.status(404).json({ error: 'Бронирование не найдено' })
  }

  if (booking.status !== 'PENDING') {
    return res.status(400).json({ error: 'Бронирование уже обработано' })
  }

  const updated = await prisma.booking.update({
    where: { id: Number(req.params.id) },
    data: { status: 'REJECTED' },
  })

  res.json(updated)
})

export default router
