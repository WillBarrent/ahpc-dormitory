import { Router } from 'express'
import prisma from '../prisma/client.js'
import requireAuth from '../middleware/auth.js'

const router = Router()

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

router.use(requireAuth)

// GET /api/absences — list all absences with optional filters
router.get('/', asyncHandler(async (req, res) => {
  const { status, search } = req.query
  const where = {}

  if (status && status !== 'ALL') {
    where.status = status
  }

  if (search) {
    where.student = {
      fullName: { contains: search, mode: 'insensitive' },
    }
  }

  const absences = await prisma.absence.findMany({
    where,
    include: {
      student: {
        select: {
          id: true,
          fullName: true,
          course: true,
          group: true,
          bedNumber: true,
          room: { select: { number: true, floor: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json(absences)
}))

// GET /api/absences/student/:id — get all absences for a student
router.get('/student/:id', asyncHandler(async (req, res) => {
  const absences = await prisma.absence.findMany({
    where: { studentId: Number(req.params.id) },
    include: {
      student: {
        select: {
          id: true,
          fullName: true,
          course: true,
          group: true,
          bedNumber: true,
          room: { select: { number: true, floor: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json(absences)
}))

// POST /api/absences/student/:id — create a new absence
router.post('/student/:id', asyncHandler(async (req, res) => {
  const { startDate, endDate, reason } = req.body
  const studentId = Number(req.params.id)

  if (!startDate || !endDate || !reason) {
    return res.status(400).json({ error: 'Заполните все обязательные поля' })
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
  })

  if (!student) {
    return res.status(404).json({ error: 'Студент не найден' })
  }

  if (student.status !== 'ACTIVE' || !student.roomId) {
    return res.status(400).json({ error: 'Студент должен быть заселён и подтверждён' })
  }

  // Check no active/pending absence already exists
  const existing = await prisma.absence.findFirst({
    where: {
      studentId,
      status: { in: ['PENDING', 'ACTIVE'] },
    },
  })

  if (existing) {
    return res.status(400).json({ error: 'У студента уже есть активное убытие' })
  }

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ error: 'Укажите корректные даты' })
  }

  if (end <= start) {
    return res.status(400).json({ error: 'Дата возвращения должна быть позже даты убытия' })
  }

  const absence = await prisma.absence.create({
    data: {
      studentId,
      startDate: start,
      endDate: end,
      reason,
    },
    include: {
      student: {
        select: {
          id: true,
          fullName: true,
          course: true,
          group: true,
          bedNumber: true,
          room: { select: { number: true, floor: true } },
        },
      },
    },
  })

  res.status(201).json(absence)
}))

// PATCH /api/absences/:id/confirm — confirm signed raspiska (PENDING → ACTIVE)
router.patch('/:id/confirm', asyncHandler(async (req, res) => {
  const absence = await prisma.absence.findUnique({
    where: { id: Number(req.params.id) },
  })

  if (!absence) {
    return res.status(404).json({ error: 'Убытие не найдено' })
  }

  if (absence.status === 'OVERDUE') {
    return res.status(400).json({ error: 'Убытие просрочено, подтверждение невозможно' })
  }

  if (absence.status !== 'PENDING') {
    return res.status(400).json({ error: 'Расписка уже подтверждена' })
  }

  const updated = await prisma.absence.update({
    where: { id: Number(req.params.id) },
    data: { status: 'ACTIVE' },
    include: {
      student: {
        select: {
          id: true,
          fullName: true,
          course: true,
          group: true,
          bedNumber: true,
          room: { select: { number: true, floor: true } },
        },
      },
    },
  })

  res.json(updated)
}))

// PATCH /api/absences/:id/complete — mark student as returned (ACTIVE → COMPLETED)
router.patch('/:id/complete', asyncHandler(async (req, res) => {
  const absence = await prisma.absence.findUnique({
    where: { id: Number(req.params.id) },
  })

  if (!absence) {
    return res.status(404).json({ error: 'Убытие не найдено' })
  }

  if (absence.status !== 'ACTIVE') {
    return res.status(400).json({ error: 'Убытие не активно' })
  }

  const updated = await prisma.absence.update({
    where: { id: Number(req.params.id) },
    data: { status: 'COMPLETED' },
    include: {
      student: {
        select: {
          id: true,
          fullName: true,
          course: true,
          group: true,
          bedNumber: true,
          room: { select: { number: true, floor: true } },
        },
      },
    },
  })

  res.json(updated)
}))

export default router
