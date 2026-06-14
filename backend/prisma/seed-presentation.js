import prisma from './client.js'

// ---- Реалистичные казахстанские имена, разные специальности ----
const STUDENTS = [
  // ПО (Программное Обеспечение)
  { name: 'Ахметов Дамир Русланович', course: 1, group: '101ПО', phone: '87001234567', room: 203, bed: 1 },
  { name: 'Нурпеисов Алихан Ерланович', course: 1, group: '101ПО', phone: '87071112233', room: 203, bed: 2 },
  { name: 'Ким Алина Сергеевна', course: 1, group: '102ПО', phone: '87773334455', room: 204, bed: 1 },
  { name: 'Оспанова Меруерт Бахытовна', course: 2, group: '201ПО', phone: '87448889900', room: 205, bed: 1 },
  { name: 'Садыков Асан Маратович', course: 2, group: '201ПО', phone: '87015556677', room: 205, bed: 2 },

  // ТМ (Техническое Моделирование)
  { name: 'Кабидоллаев Жалел Бауыржанулы', course: 2, group: '201ТМ', phone: '+7 (777) 123-45-67', room: 304, bed: 1 },
  { name: 'Искаков Рустем Арманович', course: 2, group: '201ТМ', phone: '87015678901', room: 304, bed: 2 },
  { name: 'Кусаинов Темирлан Айдосович', course: 2, group: '202ТМ', phone: '87774567890', room: 304, bed: 3 },
  { name: 'Тулегенов Ернар Аскарович', course: 2, group: '202ТМ', phone: '87052345678', room: 305, bed: 1 },
  { name: 'Каримова Милена Рахатовна', course: 2, group: '202ТМ', phone: '87783456789', room: 305, bed: 2 },

  // ЭС (Электрические Системы)
  { name: 'Есенов Шынгыс Дулатович', course: 1, group: '101ЭС', phone: '87039012345', room: 306, bed: 1 },
  { name: 'Смагулова Айжан Талгатовна', course: 1, group: '101ЭС', phone: '87770123456', room: 306, bed: 2 },
  { name: 'Абдрахманова Диана Сериковна', course: 1, group: '102ЭС', phone: '87083456789', room: 306, bed: 3 },
  { name: 'Балгабеков Асет Габдуллинович', course: 1, group: '102ЭС', phone: '87051234567', room: 307, bed: 1 },
  { name: 'Маратов Галым Бекжанович', course: 2, group: '203ЭС', phone: '87017890123', room: 307, bed: 2 },

  // ЭТ (Электротехника)
  { name: 'Тураров Берик Уланович', course: 2, group: '201ЭТ', phone: '87062345678', room: 402, bed: 1 },
  { name: 'Алимжанов Дастан Серикович', course: 2, group: '201ЭТ', phone: '87074567890', room: 402, bed: 2 },
  { name: 'Сабитова Жанна Ермековна', course: 2, group: '202ЭТ', phone: '87786789012', room: 403, bed: 1 },
  { name: 'Дюсембаева Камила Олжасовна', course: 3, group: '301ЭТ', phone: '87028901234', room: 403, bed: 2 },
  { name: 'Муканов Жандос Дауренович', course: 3, group: '302ЭТ', phone: '87085678901', room: 404, bed: 1 },

  // ПД (Право и Документоведение)
  { name: 'Назарбаева Асель Кайратовна', course: 2, group: '201ПД', phone: '87096789012', room: 404, bed: 2 },
  { name: 'Габдуллин Арман Бахытович', course: 2, group: '201ПД', phone: '87017890123', room: 404, bed: 3 },
  { name: 'Шарипова Дана Ерлановна', course: 3, group: '301ПД', phone: '87778901234', room: 405, bed: 1 },
  { name: 'Досымов Талгат Максатович', course: 3, group: '301ПД', phone: '87029012345', room: 405, bed: 2 },
  { name: 'Абенов Еркебулан Маратович', course: 3, group: '302ПД', phone: '87069876543', room: 405, bed: 3 },

  // Б (Бухгалтерия)
  { name: 'Утегенов Улан Рахатович', course: 2, group: '201Б', phone: '87030123456', room: 502, bed: 1 },
  { name: 'Болатова Арайлым Айдосовна', course: 2, group: '201Б', phone: '87053456789', room: 502, bed: 2 },
  { name: 'Рахимова Инкар Нурлановна', course: 2, group: '202Б', phone: '87781234567', room: 503, bed: 1 },
  { name: 'Хамитов Фархат Галымович', course: 3, group: '301Б', phone: '87042345678', room: 503, bed: 2 },
  { name: 'Оспанов Нурсултан Бауыржанович', course: 3, group: '302Б', phone: '87064567890', room: 504, bed: 1 },
  { name: 'Сейдахметова Айгерим Дархановна', course: 4, group: '401Б', phone: '87775678901', room: 504, bed: 2 },
]

const BOOKINGS = [
  { name: 'Кабидоллаев Жалелл Бауржанулы', course: 2, group: '202ТМ', phone: '87771234567', room: 208, bed: 1, status: 'PENDING', flag: 'Кабидоллаев Жалел Бауыржанулы' },
  { name: 'Рахметов Бауыржан Нурланович', course: 1, group: '103ПО', phone: '87070987654', room: 206, bed: 1, status: 'PENDING', flag: null },
  { name: 'Сулейменов Алишер Кайратович', course: 2, group: '204ЭС', phone: '87051230987', room: 212, bed: 1, status: 'PENDING', flag: null },
  { name: 'Сагинтаев Ержан Кайратович', course: 3, group: '303ЭТ', phone: '87051098765', room: 207, bed: 2, status: 'CONFIRMED', flag: null },
  { name: 'Иванов Дмитрий Сергеевич', course: 2, group: '202ПД', phone: '87062109876', room: 210, bed: 1, status: 'REJECTED', flag: null },
  { name: 'Петрова Анна Владимировна', course: 1, group: '103Б', phone: '87073210987', room: 211, bed: 1, status: 'REJECTED', flag: null },
]

const ABSENCES = [
  { name: 'Ахметов Дамир Русланович', start: '2026-06-20', end: '2026-06-27', reason: 'Семейные обстоятельства', status: 'ACTIVE' },
  { name: 'Тулегенов Ернар Аскарович', start: '2026-06-10', end: '2026-06-17', reason: 'Учебная практика в Алматы', status: 'COMPLETED' },
  { name: 'Дюсембаева Камила Олжасовна', start: '2026-06-01', end: '2026-06-07', reason: 'По болезни (справка прилагается)', status: 'COMPLETED' },
  { name: 'Абдрахманова Диана Сериковна', start: '2026-06-15', end: '2026-06-18', reason: 'Соревнования по волейболу', status: 'PENDING' },
  { name: 'Есенов Шынгыс Дулатович', start: '2026-06-22', end: '2026-06-30', reason: 'Стажировка на ТЭЦ', status: 'PENDING' },
]

async function main() {
  const rooms = await prisma.room.findMany({ where: { type: 'RESIDENTIAL' }, orderBy: { number: 'asc' } })
  const roomByNum = (n) => rooms.find((r) => r.number === n)

  // ---- 1. Students ----
  console.log('=== СТУДЕНТЫ ===')
  const studentMap = new Map()
  for (const s of STUDENTS) {
    const room = roomByNum(s.room)
    const student = await prisma.student.create({
      data: {
        fullName: s.name,
        course: s.course,
        group: s.group,
        phone: s.phone,
        roomId: room.id,
        bedNumber: s.bed,
        status: 'ACTIVE',
        movedIn: new Date('2026-09-01'),
      },
    })
    studentMap.set(s.name, student)
    console.log(`  ✓ ${s.name.padEnd(30, ' ')} ${s.group}  ком.${s.room}`)
  }
  console.log(`  → Всего: ${STUDENTS.length} студентов\n`)

  // ---- 2. Bookings ----
  console.log('=== БРОНИРОВАНИЯ ===')
  for (const b of BOOKINGS) {
    const room = roomByNum(b.room)
    const data = {
      fullName: b.name,
      course: b.course,
      group: b.group,
      phone: b.phone,
      roomId: room.id,
      bedNumber: b.bed,
      status: b.status,
    }
    if (b.flag) {
      const matched = studentMap.get(b.flag)
      if (matched) data.similarStudentId = matched.id
    }
    await prisma.booking.create({ data })
    const flag = data.similarStudentId ? ' ⚠️' : '   '
    console.log(`  ${flag} ${b.name.padEnd(30, ' ')} ${b.group} ком.${b.room} [${b.status}]`)
  }
  console.log(`  → Всего: ${BOOKINGS.length} (1 со сходством)\n`)

  // ---- 3. Payments ----
  console.log('=== ОПЛАТЫ ===')
  const allStudents = await prisma.student.findMany({ orderBy: { fullName: 'asc' } })
  const paidCount = 25
  for (let i = 0; i < paidCount; i++) {
    await prisma.payment.create({
      data: { studentId: allStudents[i].id, month: 6, year: 2026, amount: 10000 },
    })
  }
  console.log(`  ✓ ${paidCount} студентов оплатили июнь`)
  console.log(`  ✗ ${allStudents.length - paidCount} ещё не оплатили\n`)

  // ---- 4. Absences ----
  console.log('=== УБЫТИЯ ===')
  for (const a of ABSENCES) {
    const student = studentMap.get(a.name)
    if (!student) { console.log(`  ⚠ ${a.name} не найден`); continue }
    await prisma.absence.create({
      data: {
        studentId: student.id,
        startDate: new Date(a.start),
        endDate: new Date(a.end),
        reason: a.reason,
        status: a.status,
      },
    })
    console.log(`  ✓ ${a.name.padEnd(30, ' ')} ${a.start} – ${a.end} [${a.status}]`)
  }
  console.log(`  → Всего: ${ABSENCES.length} убытий\n`)

  console.log('═══════════════════════════════════════════')
  console.log('         ДАННЫЕ ДЛЯ ПРЕЗЕНТАЦИИ')
  console.log('═══════════════════════════════════════════')
  console.log(`  Студенты: ${STUDENTS.length}`)
  console.log(`  Группы:   ПО: 101ПО, 102ПО, 201ПО`)
  console.log('            ТМ: 201ТМ, 202ТМ')
  console.log('            ЭС: 101ЭС, 102ЭС, 203ЭС')
  console.log('            ЭТ: 201ЭТ, 202ЭТ, 301ЭТ, 302ЭТ')
  console.log('            ПД: 201ПД, 301ПД, 302ПД')
  console.log('            Б:  201Б, 202Б, 301Б, 302Б, 401Б')
  console.log(`  Брони:   ${BOOKINGS.length} (1 flagged)`)
  console.log(`  Оплаты:  ${paidCount}/${allStudents.length} за июнь`)
  console.log(`  Убытия:  ${ABSENCES.length}`)
  console.log('═══════════════════════════════════════════')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
