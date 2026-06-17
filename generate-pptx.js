import PptxGenJS from 'pptxgenjs'

const pptx = new PptxGenJS()
pptx.defineLayout({ name: 'SLIDE', width: 13.3, height: 7.5 })
pptx.layout = 'SLIDE'

const DARK = '0F172A'
const BLUE = '3B82F6'
const WHITE = 'FFFFFF'
const LIGHT = 'F8FAFC'

// ============================================
// SLIDE 1: Title
// ============================================
{
  const s = pptx.addSlide()
  s.background = { fill: DARK }
  s.addText('АВПК Общежитие', { x: 1, y: 1.8, w: 11.3, h: 1.2, fontSize: 40, bold: true, color: WHITE, align: 'center' })
  s.addText('Информационная система управления общежитием', { x: 1, y: 3, w: 11.3, h: 0.7, fontSize: 18, color: '94A3B8', align: 'center' })
  s.addShape(pptx.ShapeType.rect, { x: 5.5, y: 3.8, w: 2.3, h: 0.03, fill: { color: BLUE } })
  s.addText('Дипломный проект\nВыполнил: студент группы _________', { x: 1, y: 4.2, w: 11.3, h: 1.2, fontSize: 14, color: 'CBD5E1', align: 'center', lineSpacingMultiple: 1.6 })
}

// ============================================
// SLIDE 2: Problem + Goal
// ============================================
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.3, h: 0.06, fill: { color: BLUE } })

  s.addText('Проблема', { x: 0.8, y: 0.5, w: 5.5, h: 0.6, fontSize: 20, bold: true, color: DARK })
  s.addText([
    { text: 'Бумажный учёт студентов и заселений', options: { bullet: true, fontSize: 14, color: '374151' } },
    { text: 'Отсутствие онлайн-регистрации для новых студентов', options: { bullet: true, fontSize: 14, color: '374151' } },
    { text: 'Ручной контроль оплат — легко пропустить должника', options: { bullet: true, fontSize: 14, color: '374151' } },
    { text: 'Нет истории заселений и выселений', options: { bullet: true, fontSize: 14, color: '374151' } },
  ], { x: 0.8, y: 1.3, w: 5.5, h: 3, lineSpacingMultiple: 1.8, valign: 'top' })

  s.addText('Решение', { x: 7, y: 0.5, w: 5.5, h: 0.6, fontSize: 20, bold: true, color: BLUE })
  s.addText([
    { text: 'Электронная база студентов и комнат', options: { bullet: true, fontSize: 14, color: '374151' } },
    { text: 'Онлайн-бронирование через публичный сайт', options: { bullet: true, fontSize: 14, color: '374151' } },
    { text: 'Автоматический учёт оплат', options: { bullet: true, fontSize: 14, color: '374151' } },
    { text: 'Экспорт отчётов в Excel', options: { bullet: true, fontSize: 14, color: '374151' } },
    { text: 'Полная история по каждому студенту', options: { bullet: true, fontSize: 14, color: '374151' } },
  ], { x: 7, y: 1.3, w: 5.5, h: 3, lineSpacingMultiple: 1.8, valign: 'top' })

  // Divider line
  s.addShape(pptx.ShapeType.rect, { x: 6.4, y: 0.8, w: 0.03, h: 4.5, fill: { color: 'E2E8F0' } })
}

// ============================================
// SLIDE 3: Architecture
// ============================================
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.3, h: 0.06, fill: { color: BLUE } })
  s.addText('Архитектура системы', { x: 0.8, y: 0.4, w: 11.7, h: 0.7, fontSize: 22, bold: true, color: DARK })

  const cards = [
    { x: 0.8, label: 'Фронтенд\n(студенты)', desc: 'React + Vite\nSVG план этажа\nФорма бронирования\nСтатус заявки', color: BLUE },
    { x: 4.8, label: 'CMS\n(администратор)', desc: 'React + Vite\nУправление студентами\nБронирования, оплаты\nУбытия, экспорт Excel', color: '8B5CF6' },
    { x: 8.8, label: 'API + БД', desc: 'Express + Prisma\nPostgreSQL\nJWT авторизация\nREST API', color: '10B981' },
  ]

  cards.forEach((c, i) => {
    s.addShape(pptx.ShapeType.roundRect, { x: c.x, y: 1.4, w: 3.7, h: 4.5, fill: { color: LIGHT }, rectRadius: 0.15, line: { color: 'E2E8F0', width: 0.75 } })

    s.addShape(pptx.ShapeType.roundRect, { x: c.x, y: 1.4, w: 3.7, h: 0.9, fill: { color: c.color }, rectRadius: 0.15 })
    s.addShape(pptx.ShapeType.rect, { x: c.x, y: 2.2, w: 3.7, h: 0.1, fill: { color: c.color } })

    s.addText(c.label, { x: c.x, y: 1.45, w: 3.7, h: 0.8, fontSize: 14, bold: true, color: WHITE, align: 'center', valign: 'middle' })
    s.addText(c.desc, { x: c.x + 0.3, y: 2.6, w: 3.1, h: 3, fontSize: 13, color: '374151', lineSpacingMultiple: 1.8, valign: 'top' })

    if (i < 2) {
      s.addText('↔', { x: c.x + 3.5, y: 3.4, w: 0.6, h: 0.5, fontSize: 20, color: BLUE, align: 'center' })
    }
  })

  s.addText('REST API — JWT авторизация — JSON', { x: 2, y: 6.2, w: 9.3, h: 0.5, fontSize: 12, color: '94A3B8', align: 'center' })
}

// ============================================
// SLIDE 4: Tech Stack
// ============================================
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.3, h: 0.06, fill: { color: BLUE } })
  s.addText('Стек технологий', { x: 0.8, y: 0.4, w: 11.7, h: 0.7, fontSize: 22, bold: true, color: DARK })

  const rows = [
    ['Frontend', 'React 19, Vite, CSS Modules, React Router'],
    ['Backend', 'Node.js, Express, Prisma ORM'],
    ['База данных', 'PostgreSQL'],
    ['Авторизация', 'JWT (bcrypt для паролей)'],
    ['Графика', 'SVG floor plans (Figma)'],
    ['Документы', 'react-to-print (печать заявлений, расписок)'],
    ['Экспорт', 'xlsx-js-style (форматированный Excel)'],
    ['Презентация', 'pptxgenjs (этот файл создан программно)'],
  ]

  const cols = [
    { name: '', w: 2.5 },
    { name: '', w: 9 },
  ]

  const tableData = rows.map((r, i) => [
    { text: r[0], options: { bold: true, fontSize: 13, color: BLUE, fill: { color: i % 2 === 0 ? LIGHT : WHITE }, align: 'right', valign: 'middle' } },
    { text: r[1], options: { fontSize: 13, color: '374151', fill: { color: i % 2 === 0 ? LIGHT : WHITE }, valign: 'middle' } },
  ])

  s.addTable(tableData, { x: 1.2, y: 1.4, w: 10.9, colW: [2.5, 8.4], rowH: 0.55, border: { type: 'none' } })
}

// ============================================
// SLIDE 5: Dashboard
// ============================================
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.3, h: 0.06, fill: { color: BLUE } })
  s.addText('Дашборд', { x: 0.8, y: 0.4, w: 6, h: 0.7, fontSize: 22, bold: true, color: DARK })
  s.addText('ЧТО ПОКАЗЫВАТЬ:', { x: 0.8, y: 1.3, w: 11.7, h: 0.5, fontSize: 11, bold: true, color: '94A3B8' })

  s.addText([
    { text: 'Карточки статистики: заселённые студенты, свободные места, оплаты, новые бронирования', options: { bullet: true, fontSize: 14, color: '374151' } },
    { text: 'Лента событий — кто заселился, кто оплатил, кто подал заявку', options: { bullet: true, fontSize: 14, color: '374151' } },
    { text: 'Шкала заполненности общежития', options: { bullet: true, fontSize: 14, color: '374151' } },
    { text: 'Быстрые действия', options: { bullet: true, fontSize: 14, color: '374151' } },
  ], { x: 0.8, y: 1.9, w: 5.5, h: 3, lineSpacingMultiple: 2, valign: 'top' })

  s.addShape(pptx.ShapeType.roundRect, { x: 7, y: 1.5, w: 5.5, h: 3.8, fill: { color: LIGHT }, rectRadius: 0.15, line: { color: 'E2E8F0', width: 0.75 } })
  s.addText('[СКРИНШОТ ДАШБОРДА]', { x: 7, y: 3, w: 5.5, h: 0.8, fontSize: 13, color: '94A3B8', align: 'center', valign: 'middle' })
}

// ============================================
// SLIDE 6: Students
// ============================================
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.3, h: 0.06, fill: { color: BLUE } })
  s.addText('Управление студентами', { x: 0.8, y: 0.4, w: 6, h: 0.7, fontSize: 22, bold: true, color: DARK })

  s.addText([
    { text: 'Таблица с сортировкой по любой колонке', options: { bullet: true, fontSize: 14, color: '374151' } },
    { text: 'Поиск по имени с задержкой (не дёргает сервер на каждый символ)', options: { bullet: true, fontSize: 14, color: '374151' } },
    { text: 'Фильтр по этажу', options: { bullet: true, fontSize: 14, color: '374151' } },
    { text: 'Пагинация — по 20 записей на страницу', options: { bullet: true, fontSize: 14, color: '374151' } },
    { text: 'Детальная информация в раскрывающейся строке', options: { bullet: true, fontSize: 14, color: '374151' } },
    { text: 'Действия: изменить, печать заявления, убытие, выселение', options: { bullet: true, fontSize: 14, color: '374151' } },
  ], { x: 0.8, y: 1.4, w: 5.5, h: 4, lineSpacingMultiple: 1.8, valign: 'top' })

  s.addShape(pptx.ShapeType.roundRect, { x: 7, y: 1.5, w: 5.5, h: 3.8, fill: { color: LIGHT }, rectRadius: 0.15, line: { color: 'E2E8F0', width: 0.75 } })
  s.addText('[СКРИНШОТ СТУДЕНТОВ]', { x: 7, y: 3, w: 5.5, h: 0.8, fontSize: 13, color: '94A3B8', align: 'center', valign: 'middle' })
}

// ============================================
// SLIDE 7: Bookings + Fuzzy
// ============================================
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.3, h: 0.06, fill: { color: BLUE } })
  s.addText('Бронирование и защита от дубликатов', { x: 0.8, y: 0.4, w: 8, h: 0.7, fontSize: 22, bold: true, color: DARK })

  s.addText([
    { text: 'Студенты подают заявку через публичный сайт', options: { bullet: true, fontSize: 14, color: '374151' } },
    { text: 'Выбирают комнату и место на интерактивном плане этажа', options: { bullet: true, fontSize: 14, color: '374151' } },
    { text: 'Защита от дубликатов:', options: { bullet: true, fontSize: 14, bold: true, color: DARK } },
    { text: 'Телефон нормализуется до 10 последних цифр', options: { bullet: true, fontSize: 13, color: '64748B' } },
    { text: 'Имя сравнивается нечётко — расстояние Левенштейна (≥80%)', options: { bullet: true, fontSize: 13, color: '64748B' } },
    { text: 'Если совпадение найдено — заявка помечается флагом ⚠️', options: { bullet: true, fontSize: 13, color: '92400E' } },
    { text: 'Решение принимает администратор — подтвердить или отклонить', options: { bullet: true, fontSize: 14, color: '374151' } },
  ], { x: 0.8, y: 1.3, w: 6, h: 5, lineSpacingMultiple: 1.7, valign: 'top' })

  s.addShape(pptx.ShapeType.roundRect, { x: 7.5, y: 1.5, w: 5, h: 3.8, fill: { color: LIGHT }, rectRadius: 0.15, line: { color: 'E2E8F0', width: 0.75 } })
  s.addText('[СКРИНШОТ БРОНИРОВАНИЙ\nС ПОМЕЧЕННОЙ ЗАЯВКОЙ]', { x: 7.5, y: 3, w: 5, h: 0.8, fontSize: 13, color: '94A3B8', align: 'center', valign: 'middle' })
}

// ============================================
// SLIDE 8: Payments + Absences
// ============================================
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.3, h: 0.06, fill: { color: BLUE } })

  // Left: Payments
  s.addText('Оплата проживания', { x: 0.8, y: 0.4, w: 5.5, h: 0.7, fontSize: 20, bold: true, color: DARK })
  s.addText([
    { text: 'Помесячный учёт оплат', options: { bullet: true, fontSize: 13, color: '374151' } },
    { text: 'Фильтры: месяц, год, этаж', options: { bullet: true, fontSize: 13, color: '374151' } },
    { text: 'Отметка оплаты и отмена', options: { bullet: true, fontSize: 13, color: '374151' } },
    { text: 'Экспорт в стилизованный Excel', options: { bullet: true, fontSize: 13, color: '374151' } },
    { text: 'Сумма настраивается на сервере', options: { bullet: true, fontSize: 13, color: '374151' } },
  ], { x: 0.8, y: 1.3, w: 5.5, h: 3, lineSpacingMultiple: 1.8, valign: 'top' })

  // Right: Absences
  s.addText('Убытия', { x: 7.3, y: 0.4, w: 5.5, h: 0.7, fontSize: 20, bold: true, color: DARK })
  s.addText([
    { text: 'Оформление убытия: даты, причина', options: { bullet: true, fontSize: 13, color: '374151' } },
    { text: 'Статусы: ожидает → в убытии → вернулся', options: { bullet: true, fontSize: 13, color: '374151' } },
    { text: 'Просроченные — красным с анимацией', options: { bullet: true, fontSize: 13, color: '374151' } },
    { text: 'Печать расписки — готовый документ', options: { bullet: true, fontSize: 13, color: '374151' } },
  ], { x: 7.3, y: 1.3, w: 5.5, h: 3, lineSpacingMultiple: 1.8, valign: 'top' })

  s.addShape(pptx.ShapeType.rect, { x: 6.6, y: 0.8, w: 0.03, h: 4.5, fill: { color: 'E2E8F0' } })

  s.addShape(pptx.ShapeType.roundRect, { x: 1, y: 4.7, w: 5, h: 2, fill: { color: LIGHT }, rectRadius: 0.15, line: { color: 'E2E8F0', width: 0.75 } })
  s.addText('[СКРИНШОТ ОПЛАТЫ]', { x: 1, y: 5.5, w: 5, h: 0.5, fontSize: 12, color: '94A3B8', align: 'center' })

  s.addShape(pptx.ShapeType.roundRect, { x: 7.2, y: 4.7, w: 5, h: 2, fill: { color: LIGHT }, rectRadius: 0.15, line: { color: 'E2E8F0', width: 0.75 } })
  s.addText('[СКРИНШОТ УБЫТИЙ]', { x: 7.2, y: 5.5, w: 5, h: 0.5, fontSize: 12, color: '94A3B8', align: 'center' })
}

// ============================================
// SLIDE 9: Public site
// ============================================
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.3, h: 0.06, fill: { color: BLUE } })
  s.addText('Публичный сайт для студентов', { x: 0.8, y: 0.4, w: 8, h: 0.7, fontSize: 22, bold: true, color: DARK })

  s.addText([
    { text: 'Интерактивный план этажа', options: { bullet: true, fontSize: 14, color: '374151' } },
    { text: 'SVG-графика, координаты привязаны к плану здания', options: { bullet: true, fontSize: 13, color: '64748B' } },
    { text: 'При наведении — номер комнаты и занятость', options: { bullet: true, fontSize: 13, color: '64748B' } },
    { text: 'Форма бронирования', options: { bullet: true, fontSize: 14, color: '374151' } },
    { text: 'После подачи — страница со статусом заявки', options: { bullet: true, fontSize: 14, color: '374151' } },
  ], { x: 0.8, y: 1.3, w: 5.5, h: 4, lineSpacingMultiple: 1.8, valign: 'top' })

  s.addShape(pptx.ShapeType.roundRect, { x: 7, y: 1.5, w: 5.5, h: 3.8, fill: { color: LIGHT }, rectRadius: 0.15, line: { color: 'E2E8F0', width: 0.75 } })
  s.addText('[СКРИНШОТ ФРОНТЕНДА\nПЛАН ЭТАЖА]', { x: 7, y: 3, w: 5.5, h: 0.8, fontSize: 13, color: '94A3B8', align: 'center', valign: 'middle' })
}

// ============================================
// SLIDE 10: Data model
// ============================================
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.3, h: 0.06, fill: { color: BLUE } })
  s.addText('Модель данных', { x: 0.8, y: 0.4, w: 8, h: 0.7, fontSize: 22, bold: true, color: DARK })

  const entities = [
    ['Admin', 'Логин, хеш пароля (bcrypt)'],
    ['Room', 'Номер, этаж, тип (жилая/санузел/тех), количество мест'],
    ['Student', 'ФИО, курс, группа, телефон, комната, место, статус, даты заселения/выселения'],
    ['Booking', 'ФИО, курс, группа, телефон, комната, место, статус, similarStudentId'],
    ['Payment', 'Студент, месяц, год, сумма, дата оплаты'],
    ['Absence', 'Студент, даты убытия и возврата, причина, статус'],
  ]

  const tableData = [
    [
      { text: 'Сущность', options: { bold: true, fontSize: 12, color: WHITE, fill: { color: BLUE }, align: 'center', valign: 'middle' } },
      { text: 'Поля', options: { bold: true, fontSize: 12, color: WHITE, fill: { color: BLUE }, align: 'center', valign: 'middle' } },
    ],
    ...entities.map((e, i) => [
      { text: e[0], options: { bold: true, fontSize: 12, color: DARK, fill: { color: i % 2 === 0 ? LIGHT : WHITE }, valign: 'middle' } },
      { text: e[1], options: { fontSize: 12, color: '374151', fill: { color: i % 2 === 0 ? LIGHT : WHITE }, valign: 'middle' } },
    ]),
  ]

  s.addTable(tableData, { x: 1, y: 1.3, w: 11.3, colW: [2.5, 8.8], rowH: 0.65, border: { type: 'none' } })

  s.addText('Prisma ORM — PostgreSQL — связи через внешние ключи', { x: 2, y: 6.6, w: 9.3, h: 0.5, fontSize: 12, color: '94A3B8', align: 'center' })
}

// ============================================
// SLIDE 11: Results + End
// ============================================
{
  const s = pptx.addSlide()
  s.background = { fill: DARK }

  s.addText('Спасибо за внимание!', { x: 1, y: 1.5, w: 11.3, h: 1.2, fontSize: 36, bold: true, color: WHITE, align: 'center' })

  s.addShape(pptx.ShapeType.rect, { x: 5.5, y: 2.8, w: 2.3, h: 0.03, fill: { color: BLUE } })

  s.addText('Готов ответить на ваши вопросы', { x: 1, y: 3.2, w: 11.3, h: 0.8, fontSize: 18, color: '94A3B8', align: 'center' })

  s.addText([
    { text: 'React + Vite', options: { bullet: true, fontSize: 13, color: 'CBD5E1' } },
    { text: 'Express + Prisma + PostgreSQL', options: { bullet: true, fontSize: 13, color: 'CBD5E1' } },
    { text: 'CSS Modules', options: { bullet: true, fontSize: 13, color: 'CBD5E1' } },
    { text: 'JWT авторизация', options: { bullet: true, fontSize: 13, color: 'CBD5E1' } },
  ], { x: 4, y: 4.5, w: 5.3, h: 2, lineSpacingMultiple: 1.6, align: 'center' })
}

// ============================================
await pptx.writeFile({ fileName: './АВПК_Общежитие.pptx' })
console.log('✅ Готово: АВПК_Общежитие.pptx')
console.log(`   ${pptx.slides.length} слайдов`)
