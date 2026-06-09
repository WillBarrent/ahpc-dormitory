import { Router } from 'express'
import prisma from '../prisma/client.js'
import requireAuth from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)

// GET /api/payments?month=4&year=2026&floor=2
router.get('/', async (req, res) => {
  const { month, year, floor } = req.query

  if (!month || !year) {
    return res.status(400).json({ error: 'Укажите месяц и год' })
  }

  const where = { movedOut: null, roomId: { not: null } }
  if (floor) {
    where.room = { floor: Number(floor) }
  }

  const students = await prisma.student.findMany({
    where,
    include: {
      room: { select: { number: true, floor: true } },
      payments: {
        where: { month: Number(month), year: Number(year) },
      },
    },
    orderBy: { fullName: 'asc' },
  })

  const result = students.map((s) => ({
    id: s.id,
    fullName: s.fullName,
    group: s.group,
    course: s.course,
    room: s.room,
    paid: s.payments.length > 0,
    payment: s.payments[0] || null,
  }))

  res.json(result)
})

// POST /api/payments — mark student as paid
router.post('/', async (req, res) => {
  const { studentId, month, year, amount } = req.body

  if (!studentId || !month || !year || !amount) {
    return res.status(400).json({ error: 'Заполните все поля' })
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
  })

  if (!student) {
    return res.status(404).json({ error: 'Студент не найден' })
  }

  const existing = await prisma.payment.findUnique({
    where: { studentId_month_year: { studentId, month, year } },
  })

  if (existing) {
    return res.status(400).json({ error: 'Оплата за этот месяц уже внесена' })
  }

  const payment = await prisma.payment.create({
    data: { studentId, month, year, amount },
  })

  res.status(201).json(payment)
})

// DELETE /api/payments/:id — remove payment record
router.delete('/:id', async (req, res) => {
  const payment = await prisma.payment.findUnique({
    where: { id: Number(req.params.id) },
  })

  if (!payment) {
    return res.status(404).json({ error: 'Запись об оплате не найдена' })
  }

  await prisma.payment.delete({
    where: { id: Number(req.params.id) },
  })

  res.json({ success: true })
})

export default router
