import { Router } from 'express'
import prisma from '../prisma/client.js'
import requireAuth from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)

router.get('/', async (req, res) => {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  const [rooms, housed, active, pending, paidThisMonth, pendingBookings] = await Promise.all([
    prisma.room.findMany({ select: { totalBeds: true } }),
    prisma.student.count({ where: { movedOut: null, roomId: { not: null } } }),
    prisma.student.count({ where: { movedOut: null, roomId: { not: null }, status: 'ACTIVE' } }),
    prisma.student.count({ where: { movedOut: null, roomId: { not: null }, status: 'PENDING' } }),
    prisma.payment.count({ where: { month: currentMonth, year: currentYear } }),
    prisma.booking.count({ where: { status: 'PENDING' } }),
  ])

  const totalBeds = rooms.reduce((sum, r) => sum + r.totalBeds, 0)

  res.json({
    totalStudents: housed,
    activeStudents: active,
    pendingStudents: pending,
    totalBeds,
    occupiedBeds: housed,
    freeBeds: totalBeds - housed,
    paidThisMonth,
    unpaidThisMonth: housed - paidThisMonth,
    pendingBookings,
    currentMonth,
    currentYear,
    paymentAmount: 10000, // стоимость проживания в месяц (тенге)
  })
})

export default router
