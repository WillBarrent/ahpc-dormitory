import { Router } from 'express'
import prisma from '../prisma/client.js'
import requireAuth from '../middleware/auth.js'
import { normalizePhone, validatePhone } from '../utils/phone.js'

const router = Router()

// ----- Helpers -----

/** Расстояние Левенштейна между двумя строками */
function levenshtein(a, b) {
  const m = a.length, n = b.length
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}

/** Сходство имён в процентах (0..1), нечувствительно к регистру и порядку слов */
function nameSimilarity(a, b) {
  const s1 = a.toLowerCase().replace(/\s+/g, ' ').trim()
  const s2 = b.toLowerCase().replace(/\s+/g, ' ').trim()
  const dist = levenshtein(s1, s2)
  const maxLen = Math.max(s1.length, s2.length)
  return maxLen === 0 ? 1 : 1 - dist / maxLen
}

// POST /api/bookings — public, create a booking
router.post('/', async (req, res) => {
  const { fullName, course, group, phone, roomId, bedNumber } = req.body

  if (!fullName || !course || !group || !phone || !roomId || !bedNumber) {
    return res.status(400).json({ error: 'Заполните все обязательные поля' })
  }

  if (!validatePhone(phone)) {
    return res.status(400).json({
      error: 'Некорректный формат номера телефона. Допускаются форматы: +7 (777) 123-45-67 или 8 777 123 45 67',
    })
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

  // Fuzzy check against existing students — flag if similar found (admin decides)
  let similarStudentId = null
  const normPhone = normalizePhone(phone)
  const existingStudents = await prisma.student.findMany({
    where: { movedOut: null },
  })

  const match = existingStudents.find((s) => {
    const phoneMatch = normalizePhone(s.phone || '') === normPhone
    const nameMatch = nameSimilarity(s.fullName, fullName) >= 0.8
    return phoneMatch && nameMatch
  })

  if (match) {
    similarStudentId = match.id
  }

  const booking = await prisma.booking.create({
    data: {
      fullName,
      course: Number(course),
      group,
      phone: normalizePhone(phone),
      roomId: Number(roomId),
      bedNumber: Number(bedNumber),
      similarStudentId,
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

  if (!validatePhone(phone)) {
    return res.status(400).json({
      error: 'Некорректный формат номера телефона. Допускаются форматы: +7 (777) 123-45-67 или 8 777 123 45 67',
    })
  }

  const normPhone = normalizePhone(phone)

  const allByName = await prisma.booking.findMany({
    where: { fullName: { contains: fullName.trim(), mode: 'insensitive' } },
    include: { room: { select: { number: true, floor: true } } },
  })

  // Фильтруем по нормализованному телефону, чтобы +7 и 8 находили одни и те же записи
  const bookings = allByName.filter((b) => normalizePhone(b.phone) === normPhone)
  bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

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
    include: {
      room: { select: { number: true, floor: true } },
      similarStudent: { select: { id: true, fullName: true } },
    },
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
          movedIn: new Date(),
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
