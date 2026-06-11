import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, AlignmentType, TableOfContents, Table, TableRow, TableCell, WidthType, BorderStyle, PageBreak } from 'docx'
import fs from 'fs'

const IMG = (name, w = 520) => {
  const buf = fs.readFileSync(`../${name}`)
  const ratio = 720 / 1280
  const h = Math.round(w * ratio)
  return new ImageRun({ data: buf, transformation: { width: w, height: h } })
}

function detectSize(buf) {
  // Simple PNG header parser
  return { width: 1280, height: 720 } // fallback
}

async function main() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Times New Roman', size: 28, lang: 'ru-RU' },
        },
      },
    },
    sections: [
      // ═══════ ТИТУЛЬНАЯ СТРАНИЦА ═══════
      {
        properties: { page: { margin: { top: 1200, bottom: 800, left: 1200, right: 1200 } } },
        children: [
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'МИНИСТЕРСТВО НАУКИ И ВЫСШЕГО ОБРАЗОВАНИЯ РК', size: 26, bold: true })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'Актюбинский Высший Политехнический Колледж', size: 26 })] }),
          new Paragraph({ spacing: { before: 1600, after: 600 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'АВТОМАТИЗИРОВАННАЯ СИСТЕМА\nУПРАВЛЕНИЯ ОБЩЕЖИТИЕМ', size: 44, bold: true })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'Документация к программному продукту', size: 30 })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: '(описание реализованного функционала)', size: 24, italics: true })] }),
          new Paragraph({ spacing: { before: 2000 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Актобе, 2026', size: 28 })] }),
        ],
      },

      // ═══════ ОГЛАВЛЕНИЕ + ОСНОВНОЙ ТЕКСТ ═══════
      {
        properties: { page: { margin: { top: 800, bottom: 800, left: 1000, right: 1000 } } },
        children: [
          // --- ОГЛАВЛЕНИЕ ---
          new Paragraph({ spacing: { after: 400 }, children: [new TextRun({ text: 'Содержание', size: 36, bold: true })], heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '1. Переработка схемы 1 этажа ................................................... 3', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '2. Система онлайн-бронирования ................................................ 4', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '3. Обновление дашборда администратора ....................................... 6', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '4. Экспорт и импорт данных Excel ............................................. 8', size: 28 })] }),

          // ============ ГЛАВА 1 ============
          new Paragraph({ spacing: { before: 800, after: 300 }, children: [new TextRun({ text: '1. Переработка схемы 1 этажа', size: 36, bold: true })], heading: HeadingLevel.HEADING_1 }),

          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'До переработки первый этаж представлял собой пустой контур стен без каких-либо обозначений, цветов или подписей. Зоны не были идентифицированы, что делало схему бесполезной для посетителей сайта.', size: 28 })] }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'В рамках доработки схема 1 этажа была полностью перепроектирована. Поскольку на первом этаже общежития отсутствуют жилые комнаты, схема стала информационной — с цветовым кодированием нежилых зон.', size: 28 })] }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Реализованные зоны первого этажа:', size: 28, bold: true })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Вестибюль (главный холл) — небесно-голубой цвет', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Администрация (левое крыло) — терракотовый цвет', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Приемная (правое крыло) — лавандовый цвет', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Пост охраны — сизый цвет', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Кабинет коменданта — стальной цвет', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Зона отдыха — янтарный цвет', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Кухня — шалфейный цвет', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Буфет — коралловый цвет', size: 28 })] }),
          new Paragraph({ spacing: { after: 200 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Уборные и техническое помещение — сохранены в стандартной цветовой гамме', size: 28 })] }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Всего добавлено 8 новых CSS-классов в модуль FloorPlan.module.css. Схема не содержит интерактивных элементов (кликабельных зон), поскольку комнаты на первом этаже отсутствуют в базе данных. Это визуально отличает её от этажей 2–5.', size: 28 })] }),

          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Рисунок 1 — Обновлённая схема 1 этажа', size: 24, italics: true }), IMG('floor1-redesigned.png')] }),

          // ============ ГЛАВА 2 ============
          new Paragraph({ spacing: { before: 800, after: 300 }, children: [new TextRun({ text: '2. Система онлайн-бронирования', size: 36, bold: true })], heading: HeadingLevel.HEADING_1 }),

          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Одним из ключевых нововведений стала система онлайн-бронирования мест в общежитии. Ранее заселение осуществлялось исключительно через администратора в CMS-панели. Теперь студент может самостоятельно выбрать свободное место на плане этажа и подать заявку.', size: 28 })] }),

          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: '2.1. Процесс бронирования со стороны студента', size: 32, bold: true })], heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: 'Процесс состоит из четырёх шагов:', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Студент переходит на страницу «Планировка этажей» (/floors) и выбирает этаж', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Кликает на интересующую комнату — открывается карточка с сеткой кроватей', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Нажимает «Забронировать» на свободном месте — появляется форма', size: 28 })] }),
          new Paragraph({ spacing: { after: 200 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Заполняет ФИО, курс, группу, телефон и отправляет заявку', size: 28 })] }),

          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Рисунок 2 — Карточка комнаты с кнопками бронирования', size: 24, italics: true }), IMG('room-with-book-buttons.png')] }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Рисунок 3 — Форма бронирования', size: 24, italics: true }), IMG('booking-form.png')] }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Рисунок 4 — Экран успешной отправки заявки', size: 24, italics: true }), IMG('booking-success.png')] }),

          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: '2.2. Обработка броней администратором', size: 32, bold: true })], heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'В CMS-панели добавлен новый раздел «Бронирования». Администратор видит таблицу всех заявок с фильтрацией по статусу (Ожидает / Подтверждена / Отклонена). Для каждой заявки доступны два действия: «Подтвердить» и «Отклонить».', size: 28 })] }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'При подтверждении брони автоматически создаётся запись студента со статусом PENDING (ожидает подписания заявления). Место резервируется за студентом. Далее администратор работает по стандартному процессу: печать заявления → подпись студента → подтверждение (статус ACTIVE).', size: 28 })] }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'При отклонении брони место освобождается для других студентов.', size: 28 })] }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Все операции выполняются в транзакции Prisma для предотвращения конфликтов (двойное бронирование одного места).', size: 28 })] }),

          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Рисунок 5 — Страница бронирований в CMS', size: 24, italics: true }), IMG('cms-bookings.png')] }),

          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: '2.3. Технические детали', size: 32, bold: true })], heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Модель Booking в БД (Prisma): поля fullName, course, group, phone, roomId, bedNumber, status (PENDING/CONFIRMED/REJECTED)', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'API: POST /api/bookings (публичный), GET /api/bookings (админ), POST /api/bookings/:id/confirm, POST /api/bookings/:id/reject', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Обновлён GET /api/rooms — возвращает takenBeds с учётом активных броней', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Frontend: BookingForm, BookingSuccess — новые компоненты. FloorsPage — машина состояний (просмотр → комната → форма → успех)', size: 28 })] }),

          // ============ ГЛАВА 3 ============
          new Paragraph({ spacing: { before: 800, after: 300 }, children: [new TextRun({ text: '3. Обновление дашборда администратора', size: 36, bold: true })], heading: HeadingLevel.HEADING_1 }),

          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Главная страница CMS-панели была существенно расширена. В исходной версии дашборд содержал только 4 карточки со статистикой и прогресс-бар заполненности. После доработки добавлены следующие элементы:', size: 28 })] }),

          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: '3.1. Карточка «Новые бронирования»', size: 32, bold: true })], heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Пятая карточка в ряду статистики. Отображает количество заявок со статусом PENDING. При наличии новых броней карточка подсвечивается фиолетовой рамкой и отображает чип «Требуют внимания». Карточка кликабельна — ведёт в раздел «Бронирования».', size: 28 })] }),

          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: '3.2. Лента недавней активности', size: 32, bold: true })], heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Новый API-эндпоинт GET /api/activity собирает последние события из трёх источников (бронирования, студенты, платежи) и объединяет их в единую хронологическую ленту. Каждое событие отображается с иконкой, описанием и относительным временем («7 мин. назад», «2 ч. назад»).', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: 'Типы событий в ленте:', size: 28, bold: true })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: '📨 Новая бронь — ФИО, комната, место', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: '✅ Бронь подтверждена — бронь переведена в студента', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: '👤 Новый студент — зарегистрирован в системе', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: '🏠 Заселение — студент стал ACTIVE', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: '🚪 Выселение — студент выписан', size: 28 })] }),
          new Paragraph({ spacing: { after: 200 }, bullet: { level: 0 }, children: [new TextRun({ text: '💳 Оплата — сумма, месяц, плательщик', size: 28 })] }),

          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: '3.3. Панель быстрых действий', size: 32, bold: true })], heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Четыре кнопки для быстрого перехода к основным разделам: «Добавить студента», «Все бронирования», «Оплата за месяц», «Просмотр комнат». Расположены справа от ленты активности.', size: 28 })] }),

          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: '3.4. Кликабельные карточки', size: 32, bold: true })], heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Все 5 карточек статистики стали кликабельными. При нажатии администратор переходит в соответствующий раздел CMS (студенты, комнаты, оплата, бронирования). При наведении карточки приподнимаются с тенью.', size: 28 })] }),

          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Рисунок 6 — Обновлённый дашборд CMS', size: 24, italics: true }), IMG('dashboard-final.png')] }),

          // ============ ГЛАВА 4 ============
          new Paragraph({ spacing: { before: 800, after: 300 }, children: [new TextRun({ text: '4. Экспорт и импорт данных Excel', size: 36, bold: true })], heading: HeadingLevel.HEADING_1 }),

          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Для удобства работы с данными реализован двусторонний обмен с форматом Excel (.xlsx) с использованием библиотеки SheetJS.', size: 28 })] }),

          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: '4.1. Экспорт данных', size: 32, bold: true })], heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'На всех страницах CMS с табличными данными добавлена кнопка «📥 Excel». При нажатии генерируется файл .xlsx с текущими данными из таблицы, готовый к открытию в Microsoft Excel или Google Sheets.', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Студенты — ФИО, курс, группа, телефон, комната, место, статус, дата заселения', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Бронирования — ФИО, группа, курс, телефон, комната, место, статус, дата', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Оплата — ФИО, группа, комната, сумма, статус, дата оплаты', size: 28 })] }),
          new Paragraph({ spacing: { after: 200 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Комнаты — номер, этаж, тип, всего мест, занято, свободно', size: 28 })] }),

          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: '4.2. Импорт студентов', size: 32, bold: true })], heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'На странице «Студенты» добавлена кнопка «📤 Импорт». Администратор выбирает .xlsx файл, содержащий столбцы: ФИО, Курс, Группа, Телефон, Номер комнаты, Место. Система парсит файл в браузере и отправляет данные на сервер.', size: 28 })] }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Серверный эндпоинт POST /api/import/students выполняет построчную валидацию:', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Проверка обязательных полей (ФИО, курс, группа)', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Валидация курса (1–4)', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Проверка существования комнаты и её типа (только RESIDENTIAL)', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Проверка свободных мест в комнате', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Проверка занятости конкретного места при его указании', size: 28 })] }),
          new Paragraph({ spacing: { after: 200 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Автоматическое назначение первого свободного места, если место не указано', size: 28 })] }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'По завершении импорта выводится алерт с результатами: количество созданных записей, пропущенных, и список ошибок с номерами строк.', size: 28 })] }),

          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Рисунок 7 — Страница студентов с кнопками экспорта и импорта', size: 24, italics: true }), IMG('students-export.png')] }),

          // ============ ЗАКЛЮЧЕНИЕ ============
          new Paragraph({ spacing: { before: 800, after: 300 }, children: [new TextRun({ text: 'Заключение', size: 36, bold: true })], heading: HeadingLevel.HEADING_1 }),

          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'В ходе доработки автоматизированной системы управления общежитием АВПК было реализовано четыре крупных функциональных блока:', size: 28 })] }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: '1. Переработка схемы 1 этажа — нежилая информационная схема с 8 уникальными зонами и цветовым кодированием.', size: 28 })] }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: '2. Система онлайн-бронирования — полный цикл от выбора места студентом до подтверждения администратором, с автоматическим созданием записи студента.', size: 28 })] }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: '3. Обновление дашборда — 5 кликабельных карточек, лента активности из трёх источников, панель быстрых действий.', size: 28 })] }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: '4. Экспорт и импорт Excel — выгрузка данных из всех разделов CMS, массовый импорт студентов с валидацией.', size: 28 })] }),

          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Все изменения выполнены с соблюдением архитектурных принципов проекта: CSS Modules без Tailwind, разделение на frontend/CMS/backend, транзакционная целостность данных через Prisma, JWT-аутентификация для админ-эндпоинтов.', size: 28 })] }),

          new Paragraph({ spacing: { before: 600 }, children: [new TextRun({ text: 'Объём изменений:', size: 28, bold: true })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Новых файлов: 15 (компоненты, роуты, CSS-модули)', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Изменённых файлов: 9', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Новая модель БД: Booking + BookingStatus enum', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Новых API-эндпоинтов: 7 (4 bookings + 1 activity + 1 import/students + 1 rooms обновлён)', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'CSS-классов: 8 новых зон + стили кнопок, ленты, карточек, форм', size: 28 })] }),
          new Paragraph({ spacing: { after: 100 }, bullet: { level: 0 }, children: [new TextRun({ text: 'Установленные библиотеки: xlsx (SheetJS), docx', size: 28 })] }),
        ],
      },
    ],
  })

  const buf = await Packer.toBuffer(doc)
  fs.writeFileSync('../Документация_АВПК_Общежитие.docx', buf)
  console.log('✅ Документ сохранён: ../Документация_АВПК_Общежитие.docx')
  console.log(`   Размер: ${(buf.length / 1024).toFixed(0)} КБ`)
}

main().catch(console.error)
