import { Router } from 'express'
import prisma from '../prisma/client.js'
import requireAuth from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)

// GET /api/activity — recent activity feed
router.get('/', async (req, res) => {
  const [bookings, students, payments] = await Promise.all([
    prisma.booking.findMany({
      take: 8,
      include: { room: { select: { number: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.student.findMany({
      take: 8,
      include: { room: { select: { number: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.payment.findMany({
      take: 8,
      include: { student: { select: { fullName: true } } },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const items = []

  for (const b of bookings) {
    items.push({
      type: b.status === 'PENDING' ? 'booking_new' : b.status === 'CONFIRMED' ? 'booking_confirmed' : 'booking_rejected',
      text: `${b.fullName} — комн. ${b.room?.number || '?'}, место ${b.bedNumber}`,
      sub: b.status === 'PENDING' ? 'Новая бронь' : b.status === 'CONFIRMED' ? 'Бронь подтверждена' : 'Бронь отклонена',
      time: b.createdAt,
    })
  }

  for (const s of students) {
    if (s.movedOut) {
      items.push({
        type: 'student_out',
        text: `${s.fullName} выселен`,
        sub: s.room ? `из комн. ${s.room.number}` : '',
        time: s.movedOut,
      })
    } else if (s.status === 'ACTIVE' && s.movedIn) {
      items.push({
        type: 'student_in',
        text: `${s.fullName} заселён`,
        sub: s.room ? `комн. ${s.room.number}` : '',
        time: s.movedIn,
      })
    } else {
      items.push({
        type: 'student_new',
        text: s.fullName,
        sub: s.room ? `комн. ${s.room.number} — ожидает подписания` : 'ожидает комнату',
        time: s.createdAt,
      })
    }
  }

  for (const p of payments) {
    items.push({
      type: 'payment',
      text: `${p.student?.fullName || '?'} — ${p.amount.toLocaleString('ru-RU')} ₸`,
      sub: `Оплата за ${p.month}.${p.year}`,
      time: p.paidAt,
    })
  }

  items.sort((a, b) => new Date(b.time) - new Date(a.time))

  res.json(items.slice(0, 10))
})

export default router
