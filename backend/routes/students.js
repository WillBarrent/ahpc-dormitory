import { Router } from 'express'
import prisma from '../prisma/client.js'
import requireAuth from '../middleware/auth.js'

const router = Router()

// ----- Helpers (same fuzzy matching as bookings) -----

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

function nameSimilarity(a, b) {
  const s1 = a.toLowerCase().replace(/\s+/g, ' ').trim()
  const s2 = b.toLowerCase().replace(/\s+/g, ' ').trim()
  const dist = levenshtein(s1, s2)
  const maxLen = Math.max(s1.length, s2.length)
  return maxLen === 0 ? 1 : 1 - dist / maxLen
}

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

// GET /api/students/:id/payments — payment history for a student
router.get('/:id/payments', async (req, res) => {
  const payments = await prisma.payment.findMany({
    where: { studentId: Number(req.params.id) },
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
  })
  res.json(payments)
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

  // Prevent duplicate students (fuzzy check)
  const existingStudents = await prisma.student.findMany({
    where: { movedOut: null },
  })

  const existing = existingStudents.find((s) => {
    const normPhone1 = (phone || '').replace(/\D/g, '').slice(-10)
    const normPhone2 = (s.phone || '').replace(/\D/g, '').slice(-10)
    const phoneMatch = normPhone1 && normPhone2 && normPhone1 === normPhone2
    const nameMatch = nameSimilarity(s.fullName, fullName) >= 0.8
    return phoneMatch && nameMatch
  })

  if (existing) {
    return res.status(409).json({ error: 'Студент с таким именем уже заселён' })
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
      ...(roomId !== undefined && { roomId }),
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
