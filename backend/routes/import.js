import { Router } from 'express'
import prisma from '../prisma/client.js'
import requireAuth from '../middleware/auth.js'
import { normalizePhone, validatePhone } from '../utils/phone.js'

const router = Router()

router.use(requireAuth)

// POST /api/import/students — bulk import students from Excel
router.post('/students', async (req, res) => {
  const { students } = req.body

  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ error: 'Нет данных для импорта' })
  }

  const results = { created: 0, skipped: 0, errors: [] }

  for (let i = 0; i < students.length; i++) {
    const s = students[i]
    const rowNum = i + 2 // Excel row (1-indexed + header row)

    try {
      // Validate required fields
      if (!s.fullName || !s.course || !s.group) {
        results.errors.push({ row: rowNum, error: 'Отсутствуют обязательные поля (ФИО, курс, группа)' })
        results.skipped++
        continue
      }

      if (s.phone && !validatePhone(String(s.phone))) {
        results.errors.push({ row: rowNum, error: `Некорректный номер телефона: ${s.phone}` })
        results.skipped++
        continue
      }

      const course = Number(s.course)
      if (isNaN(course) || course < 1 || course > 4) {
        results.errors.push({ row: rowNum, error: `Некорректный курс: ${s.course}` })
        results.skipped++
        continue
      }

      // If room number is provided, find the room
      let roomId = null
      let bedNumber = null
      if (s.roomNumber) {
        const room = await prisma.room.findUnique({
          where: { number: Number(s.roomNumber) },
        })

        if (!room) {
          results.errors.push({ row: rowNum, error: `Комната ${s.roomNumber} не найдена` })
          results.skipped++
          continue
        }

        if (room.type !== 'RESIDENTIAL') {
          results.errors.push({ row: rowNum, error: `Комната ${s.roomNumber} не жилая` })
          results.skipped++
          continue
        }

        // Check bed availability
        const occupied = await prisma.student.count({
          where: { roomId: room.id, movedOut: null },
        })

        if (occupied >= room.totalBeds) {
          results.errors.push({ row: rowNum, error: `В комнате ${s.roomNumber} нет свободных мест` })
          results.skipped++
          continue
        }

        roomId = room.id

        // Assign bed number
        if (s.bedNumber) {
          bedNumber = Number(s.bedNumber)
          if (bedNumber < 1 || bedNumber > room.totalBeds) {
            results.errors.push({ row: rowNum, error: `Некорректный номер места: ${s.bedNumber}` })
            results.skipped++
            continue
          }
          // Check if bed is taken
          const bedTaken = await prisma.student.findFirst({
            where: { roomId: room.id, bedNumber, movedOut: null },
          })
          if (bedTaken) {
            results.errors.push({ row: rowNum, error: `Место ${bedNumber} в комнате ${s.roomNumber} уже занято` })
            results.skipped++
            continue
          }
        } else {
          // Auto-assign first free bed
          const takenBeds = await prisma.student.findMany({
            where: { roomId: room.id, movedOut: null },
            select: { bedNumber: true },
          })
          const takenSet = new Set(takenBeds.map((s) => s.bedNumber))
          for (let b = 1; b <= room.totalBeds; b++) {
            if (!takenSet.has(b)) {
              bedNumber = b
              break
            }
          }
        }
      }

      // Prevent duplicate students during import
      const duplicate = await prisma.student.findFirst({
        where: {
          fullName: { equals: String(s.fullName).trim(), mode: 'insensitive' },
          movedOut: null,
        },
      })

      if (duplicate) {
        results.errors.push({ row: rowNum, error: 'Студент с таким именем уже существует' })
        results.skipped++
        continue
      }

      await prisma.student.create({
        data: {
          fullName: String(s.fullName),
          course,
          group: String(s.group),
          phone: s.phone ? normalizePhone(String(s.phone)) : null,
          roomId,
          bedNumber,
          movedIn: roomId ? new Date() : null,
        },
      })

      results.created++
    } catch (err) {
      results.errors.push({ row: rowNum, error: err.message })
      results.skipped++
    }
  }

  res.json(results)
})

export default router
