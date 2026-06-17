import { Router } from 'express'
import prisma from '../prisma/client.js'
import requireAuth from '../middleware/auth.js'

const router = Router()

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

router.use(requireAuth)

router.get('/', asyncHandler(async (req, res) => {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  const [rooms, housed, active, pending, paidThisMonth, pendingBookings, paymentConfig] = await Promise.all([
    prisma.room.findMany({ select: { totalBeds: true } }),
    prisma.student.count({ where: { movedOut: null, roomId: { not: null } } }),
    prisma.student.count({ where: { movedOut: null, roomId: { not: null }, status: 'ACTIVE' } }),
    prisma.student.count({ where: { movedOut: null, roomId: { not: null }, status: 'PENDING' } }),
    prisma.payment.count({
      where: {
        month: currentMonth,
        year: currentYear,
        student: { movedOut: null, roomId: { not: null } },
      },
    }),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.paymentConfig.findFirst(),
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
    paymentAmount: paymentConfig?.amount ?? 10000,
  })
}))

export default router
