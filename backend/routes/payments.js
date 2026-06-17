import { Router } from 'express'
import prisma from '../prisma/client.js'
import requireAuth from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)

function getMonthRange(year, month) {
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 0)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

// GET /api/payments/config
router.get('/config', async (req, res) => {
  let config = await prisma.paymentConfig.findFirst()
  if (!config) {
    config = await prisma.paymentConfig.create({ data: { id: 1, amount: 10000 } })
  }
  res.json(config)
})

// PUT /api/payments/config
router.put('/config', async (req, res) => {
  const { amount } = req.body
  if (!amount || amount < 1) {
    return res.status(400).json({ error: 'Укажите корректную сумму' })
  }
  const config = await prisma.paymentConfig.upsert({
    where: { id: 1 },
    update: { amount: Number(amount) },
    create: { id: 1, amount: Number(amount) },
  })
  res.json(config)
})

// GET /api/payments?month=4&year=2026&floor=2
router.get('/', async (req, res) => {
  const { month, year, floor } = req.query

  if (!month || !year) {
    return res.status(400).json({ error: 'Укажите месяц и год' })
  }

  const { start, end } = getMonthRange(Number(year), Number(month))
  const where = {
    movedIn: { not: null, lte: end },
    OR: [
      { movedOut: null },
      { movedOut: { gte: start } },
    ],
  }
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
    movedIn: s.movedIn,
    movedOut: s.movedOut,
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

  // Validate payment month falls within student's residency period
  const paymentEnd = new Date(year, month, 0)
  paymentEnd.setHours(23, 59, 59, 999)
  const paymentStart = new Date(year, month - 1, 1)

  if (!student.movedIn) {
    return res.status(400).json({ error: 'Студент не заселён' })
  }
  if (student.movedIn > paymentEnd) {
    return res.status(400).json({
      error: `Студент заселился ${student.movedIn.toLocaleDateString('ru-RU')}. Оплата за этот период невозможна`,
    })
  }
  if (student.movedOut && student.movedOut < paymentStart) {
    return res.status(400).json({
      error: `Студент выселился ${student.movedOut.toLocaleDateString('ru-RU')}. Оплата за этот период невозможна`,
    })
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
