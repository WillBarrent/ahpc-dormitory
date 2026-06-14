import prisma from './client.js'

async function main() {
  // ---- Получаем список комнат ----
  const rooms = await prisma.room.findMany({
    where: { type: 'RESIDENTIAL' },
    orderBy: { number: 'asc' },
  })

  const room = (num) => rooms.find((r) => r.number === num)

  // ---- 1. Студенты (уже заселённые) ----
  const students = [
    { fullName: 'Кабидоллаев Жалел Бауыржанулы', course: 2, group: 'ИС-21', phone: '+7 (777) 123-45-67', room: 203, bed: 1, status: 'ACTIVE' },
    { fullName: 'Ахметов Дамир Русланович',        course: 3, group: 'ИС-31', phone: '87001112233',       room: 203, bed: 2, status: 'ACTIVE' },
    { fullName: 'Ким Александр Алексеевич',        course: 1, group: 'ИС-11', phone: '87773334455',       room: 204, bed: 1, status: 'ACTIVE' },
    { fullName: 'Сулейменова Айнура Маратовна',    course: 4, group: 'ИС-41', phone: '87446667788',       room: 205, bed: 1, status: 'ACTIVE' },
    { fullName: 'Оспанова Диана Бахытовна',        course: 2, group: 'ИС-21', phone: '87009998877',       room: 205, bed: 2, status: 'PENDING' },
  ]

  const createdStudents = []
  for (const s of students) {
    const r = room(s.room)
    const student = await prisma.student.create({
      data: {
        fullName: s.fullName,
        course: s.course,
        group: s.group,
        phone: s.phone,
        roomId: r.id,
        bedNumber: s.bed,
        status: s.status,
        movedIn: new Date('2026-09-01'),
      },
    })
    createdStudents.push(student)
    console.log(`  Студент: ${s.fullName} (ком. ${s.room}, место ${s.bed}, статус: ${s.status})`)
  }

  // ---- 2. Бронирования (разные статусы) ----

  // Обычные PENDING заявки
  const pendingBookings = [
    { fullName: 'Нурпеисов Алихан Ерланович',   course: 1, group: 'ИС-11', phone: '87011112233', room: 206, bed: 1 },
    { fullName: 'Кусаинов Темирлан Бекжанович', course: 2, group: 'ИС-22', phone: '87022223344', room: 206, bed: 2 },
    { fullName: 'Сабитов Рустем Арманович',      course: 3, group: 'ИС-32', phone: '87033334455', room: 208, bed: 1 },
  ]

  for (const b of pendingBookings) {
    const r = room(b.room)
    await prisma.booking.create({
      data: {
        fullName: b.fullName,
        course: b.course,
        group: b.group,
        phone: b.phone,
        roomId: r.id,
        bedNumber: b.bed,
        status: 'PENDING',
      },
    })
    console.log(`  Бронь (PENDING): ${b.fullName} → ком. ${b.room}, место ${b.bed}`)
  }

  // Заявка, помеченная как подозрительная (похожа на Кабидоллаев Жалел Бауыржанулы)
  const flaggedRoom = room(209)
  const flagged = await prisma.booking.create({
    data: {
      fullName: 'Кабидоллаев Жалелл Бауржанулы',
      course: 2,
      group: 'ИС-22',
      phone: '87771234567',
      roomId: flaggedRoom.id,
      bedNumber: 1,
      status: 'PENDING',
      similarStudentId: createdStudents[0].id, // Кабидоллаев Жалел Бауыржанулы
    },
  })
  console.log(`  Бронь (PENDING + FLAGGED): Кабидоллаев Жалелл Бауржанулы → ком. 209, место 1`)
  console.log(`    ⚠️  Похож на: Кабидоллаев Жалел Бауыржанулы (id=${createdStudents[0].id})`)

  // Подтверждённая заявка (CONFIRMED)
  const confirmedRoom = room(207)
  await prisma.booking.create({
    data: {
      fullName: 'Сагинтаев Ержан Кайратович',
      course: 3,
      group: 'ИС-31',
      phone: '87055556677',
      roomId: confirmedRoom.id,
      bedNumber: 2,
      status: 'CONFIRMED',
    },
  })
  console.log(`  Бронь (CONFIRMED): Сагинтаев Ержан Кайратович → ком. 207, место 2`)

  // Отклонённая заявка (REJECTED)
  const rejectedRoom = room(210)
  await prisma.booking.create({
    data: {
      fullName: 'Иванов Дмитрий Сергеевич',
      course: 2,
      group: 'ИС-22',
      phone: '87066667788',
      roomId: rejectedRoom.id,
      bedNumber: 1,
      status: 'REJECTED',
    },
  })
  console.log(`  Бронь (REJECTED): Иванов Дмитрий Сергеевич → ком. 210, место 1`)

  // ---- 3. Пару оплат ----
  await prisma.payment.create({
    data: {
      studentId: createdStudents[0].id, // Кабидоллаев
      month: 6,
      year: 2026,
      amount: 10000,
    },
  })
  console.log(`  Оплата: ${createdStudents[0].fullName} — июнь 2026`)

  await prisma.payment.create({
    data: {
      studentId: createdStudents[1].id, // Ахметов
      month: 6,
      year: 2026,
      amount: 10000,
    },
  })
  console.log(`  Оплата: ${createdStudents[1].fullName} — июнь 2026`)

  console.log('\n✅ Тестовые данные загружены')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
