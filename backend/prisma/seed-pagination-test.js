import prisma from './client.js'

const FIRST_NAMES = [
  'Алихан', 'Дамир', 'Темирлан', 'Рустем', 'Ержан', 'Асхат', 'Диас', 'Нурсултан',
  'Бекзат', 'Айдос', 'Арман', 'Бауыржан', 'Галым', 'Дархан', 'Ермек', 'Жандос',
  'Кайрат', 'Максат', 'Нурлан', 'Олжас', 'Рахат', 'Серик', 'Талгат', 'Улан',
  'Фархат', 'Шынгыс', 'Асет', 'Берик', 'Гани', 'Дулат',
]

const LAST_NAMES = [
  'Ахметов', 'Кусаинов', 'Сабитов', 'Нурпеисов', 'Сагинтаев', 'Искаков', 'Маратов',
  'Тулегенов', 'Абдрахманов', 'Касымов', 'Смагулов', 'Алимжанов', 'Болатов',
  'Досымов', 'Есенов', 'Жумабаев', 'Каримов', 'Муканов', 'Назарбаев', 'Оспанов',
  'Рахметов', 'Сейдахметов', 'Тураров', 'Утегенов', 'Хамитов', 'Шарипов',
  'Абенов', 'Балгабеков', 'Габдуллин', 'Дюсембаев',
]

const GROUPS = ['ИС-11', 'ИС-21', 'ИС-22', 'ИС-31', 'ИС-32', 'ИС-41', 'ИС-42']
const COURSES = [1, 2, 3, 4]

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomPhone() {
  const prefixes = ['8700', '8701', '8702', '8705', '8707', '8777', '8778', '8747']
  const suffix = String(Math.floor(Math.random() * 10000000)).padStart(7, '0')
  return randomPick(prefixes) + suffix
}

async function main() {
  const rooms = await prisma.room.findMany({
    where: { type: 'RESIDENTIAL' },
    orderBy: { number: 'asc' },
  })

  console.log(`Найдено ${rooms.length} жилых комнат\n`)

  // ---- 30 студентов ----
  console.log('--- Студенты ---')
  for (let i = 0; i < 30; i++) {
    const lastName = randomPick(LAST_NAMES)
    const firstName = randomPick(FIRST_NAMES)
    const fullName = `${lastName} ${firstName} Айдосович`
    const room = randomPick(rooms)
    const bed = Math.floor(Math.random() * room.totalBeds) + 1
    const status = Math.random() > 0.3 ? 'ACTIVE' : 'PENDING'

    // Skip if bed already taken
    const taken = await prisma.student.findFirst({
      where: { roomId: room.id, bedNumber: bed, movedOut: null },
    })
    if (taken) { i--; continue }

    await prisma.student.create({
      data: {
        fullName,
        course: randomPick(COURSES),
        group: randomPick(GROUPS),
        phone: randomPhone(),
        roomId: room.id,
        bedNumber: bed,
        status,
        movedIn: new Date('2026-09-01'),
      },
    })
    console.log(`  ${i + 1}. ${fullName} (ком. ${room.number}, место ${bed})`)
  }

  // ---- 25 бронирований ----
  console.log('\n--- Бронирования ---')
  const statuses = ['PENDING', 'PENDING', 'PENDING', 'PENDING', 'CONFIRMED', 'REJECTED']
  for (let i = 0; i < 25; i++) {
    const lastName = randomPick(LAST_NAMES)
    const firstName = randomPick(FIRST_NAMES)
    const fullName = `${lastName} ${firstName} Ерланович`
    const room = randomPick(rooms)
    const bed = Math.floor(Math.random() * room.totalBeds) + 1
    const status = randomPick(statuses)

    const taken = await prisma.booking.findFirst({
      where: { roomId: room.id, bedNumber: bed, status: 'PENDING' },
    })
    if (taken) { i--; continue }

    await prisma.booking.create({
      data: {
        fullName,
        course: randomPick(COURSES),
        group: randomPick(GROUPS),
        phone: randomPhone(),
        roomId: room.id,
        bedNumber: bed,
        status,
      },
    })
    console.log(`  ${i + 1}. ${fullName} (ком. ${room.number}, место ${bed}, ${status})`)
  }

  // ---- Отмечаем несколько оплат ----
  console.log('\n--- Оплаты ---')
  const activeStudents = await prisma.student.findMany({
    where: { status: 'ACTIVE' },
    take: 10,
  })
  for (const s of activeStudents) {
    await prisma.payment.create({
      data: { studentId: s.id, month: 6, year: 2026, amount: 10000 },
    })
    console.log(`  ${s.fullName} — июнь 2026 ✅`)
  }

  // ---- Одна flagged заявка на первого активного студента ----
  const firstActive = await prisma.student.findFirst({ where: { status: 'ACTIVE' } })
  if (firstActive) {
    await prisma.booking.create({
      data: {
        fullName: firstActive.fullName.slice(0, -1) + 'ы', // slightly modified name
        course: firstActive.course,
        group: firstActive.group,
        phone: firstActive.phone,
        roomId: randomPick(rooms).id,
        bedNumber: 1,
        status: 'PENDING',
        similarStudentId: firstActive.id,
      },
    })
    console.log(`\n  ⚠️ FLAGGED: ${firstActive.fullName.slice(0, -1) + 'ы'} → похож на ${firstActive.fullName}`)
  }

  console.log('\n✅ Тестовые данные загружены')
  console.log(`   Студентов: 30, Бронирований: 25 (+1 flagged), Оплат: 10`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
