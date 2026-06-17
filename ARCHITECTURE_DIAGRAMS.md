# Архитектура проекта «Автоматизированное общежитие»

## 1. Общая структура проекта (System Overview)

Проект состоит из **трёх независимых приложений**, которые общаются через один API-сервер:

```mermaid
graph TB
    subgraph "Браузер пользователя"
        A["Сайт общежития<br/>Frontend :5173<br/>React + Vite"]
        B["Панель администратора<br/>CMS :5174<br/>React + Vite"]
    end

    subgraph "Сервер"
        C["API Сервер :3001<br/>Express.js"]
        D["База данных<br/>PostgreSQL<br/>(через Prisma ORM)"]
    end

    A -->|"fetch запросы<br/>публичные: бронирование, статус"| C
    B -->|"fetch запросы<br/>с JWT-токеном<br/>все CRUD операции"| C
    C -->|"Prisma Client"| D

    style A fill:#e1f5fe
    style B fill:#fff3e0
    style C fill:#e8f5e9
    style D fill:#f3e5f5
```

### Простыми словами:
- **Frontend** (`:5173`) — это сайт, который видят **студенты**. Они могут смотреть план этажей и бронировать комнаты.
- **CMS** (`:5174`) — это админ-панель, где **комендант** управляет студентами, комнатами, платежами, заявками.
- **API** (`:3001`) — это «мозг» системы. Оба приложения шлют запросы сюда, а API уже работает с базой данных.
- **PostgreSQL** — база данных, где хранятся все записи: студенты, комнаты, бронирования, платежи.

---

## 2. Слои бэкенда (Backend Layers)

Как устроен API-сервер изнутри:

```mermaid
graph LR
    subgraph "Слой 1: Маршруты (Routes)"
        R1["/api/rooms"]
        R2["/api/students"]
        R3["/api/bookings"]
        R4["/api/payments"]
        R5["/api/absences"]
        R6["/api/auth"]
        R7["/api/stats"]
        R8["/api/import"]
    end

    subgraph "Слой 2: Middleware"
        M1["auth.js<br/>Проверка JWT токена"]
        M2["CORS<br/>Доступ только с :5173 и :5174"]
    end

    subgraph "Слой 3: ORM"
        P["Prisma Client<br/>Type-safe SQL запросы"]
    end

    subgraph "Слой 4: База данных"
        DB[("PostgreSQL<br/>7 таблиц")]
    end

    R1 & R2 & R3 & R4 & R5 & R6 & R7 & R8 --> M1
    M1 --> M2
    M2 --> P
    P --> DB

    style M1 fill:#ffcdd2
    style M2 fill:#ffcdd2
    style P fill:#c8e6c9
    style DB fill:#d1c4e9
```

### Простыми словами:
- **Маршруты** — это «двери» в систему. Каждый URL (`/api/rooms`, `/api/bookings` и т.д.) ведёт к своей группе операций.
- **Middleware auth.js** — это «охранник». Проверяет JWT-токен: есть токен → пускает, нет → возвращает 401.
- **Middleware CORS** — разрешает запросы только с наших приложений (:5173, :5174), чужие сайты доступ не получат.
- **Prisma** — это «переводчик» между JavaScript и SQL. Вместо того чтобы писать сырые SQL-запросы, мы пишем `prisma.student.findMany()` — Prisma сама превращает это в SQL.

---

## 3. База данных (ER-диаграмма)

Семь таблиц и как они связаны:

```mermaid
erDiagram
    Room ||--o{ Student : "комната → студенты"
    Room ||--o{ Booking : "комната → заявки"
    Student ||--o{ Payment : "студент → платежи"
    Student ||--o{ Absence : "студент → отлучки"

    Admin {
        int id PK
        string login "уникальный"
        string password "bcrypt-хеш"
        string name
    }

    Room {
        int id PK
        string number "уникальный номер"
        int floor "этаж 1-5"
        int totalBeds "всего мест"
        enum type "RESIDENTIAL, NON_RESIDENTIAL, TOILET, TECH"
    }

    Student {
        int id PK
        string fullName "ФИО"
        int course "курс"
        string group "группа"
        string phone
        int roomId FK "ссылка на комнату"
        int bedNumber "номер койки"
        enum status "PENDING или ACTIVE"
    }

    Booking {
        int id PK
        string fullName
        int course
        string group
        string phone
        int roomId FK "выбранная комната"
        int bedNumber "выбранная койка"
        enum status "PENDING, CONFIRMED, REJECTED"
        int similarStudentId FK "похожий студент (опционально)"
    }

    Payment {
        int id PK
        int studentId FK
        int month
        int year
        float amount
        datetime paidAt
    }

    Absence {
        int id PK
        int studentId FK
        date startDate
        date endDate
        string reason "причина"
        enum status "PENDING, ACTIVE, COMPLETED"
    }
```

### Простыми словами:
- **Admin** — учётка коменданта. Пароль хранится в зашифрованном виде (bcrypt).
- **Room** — комната. Бывает жилая, нежилая, туалет, техпомещение. У каждой есть этаж и количество мест.
- **Student** — студент. Привязан к комнате (`roomId`). Статус: PENDING (ждёт подписания документов) или ACTIVE (заселён).
- **Booking** — заявка на заселение. Создаётся студентом через сайт. Статус: PENDING → CONFIRMED (одобрено) или REJECTED (отказано). При подтверждении автоматически создаётся запись Student.
- **Payment** — платёж за месяц. Каждый студент платит ежемесячно. Уникальная пара `[studentId, month, year]` — нельзя заплатить дважды за один месяц.
- **Absence** — отлучка (отпуск/больничный). Статус: PENDING → ACTIVE → COMPLETED.

---

## 4. Процесс бронирования (Booking Flow)

Как студент бронирует комнату, и что делает админ:

```mermaid
stateDiagram-v2
    [*] --> Студент_заполняет_форму
    Студент_заполняет_форму --> Поиск_дубликатов : POST /api/bookings

    Поиск_дубликатов --> Заявка_создана : дубликатов нет
    Поиск_дубликатов --> Заявка_с_флагом : найден похожий студент

    Заявка_создана --> На_рассмотрении : status = PENDING
    Заявка_с_флагом --> На_рассмотрении : status = PENDING

    state На_рассмотрении {
        [*] --> Админ_проверяет
        Админ_проверяет --> Подтвердить : нет проблем
        Админ_проверяет --> Отказать : комната занята / отказ
    }

    На_рассмотрении --> Одобрено : POST /bookings/:id/confirm
    На_рассмотрении --> Отказано : POST /bookings/:id/reject

    Одобрено --> Студент_создан : Prisma $transaction<br/>(создаётся Student +<br/>обновляется Booking)

    Студент_создан --> [*]
    Отказано --> [*]
```

### Простыми словами:
1. Студент заходит на сайт → выбирает этаж → видит комнаты → выбирает свободную койку → заполняет форму (ФИО, курс, группа, телефон).
2. Система **автоматически ищет дубликаты**: проверяет, нет ли уже похожего студента в базе (по ФИО и телефону). Если находит — помечает заявку флагом.
3. Заявка уходит админу со статусом **PENDING** (на рассмотрении).
4. Админ в CMS видит заявку. Может **подтвердить** (тогда автоматически создаётся студент) или **отказать**.
5. При подтверждении используется **транзакция** — либо обе операции (создать студента + обновить заявку) выполняются вместе, либо ни одна. Это защита от ошибок.

---

## 5. Поток данных (Data Flow)

Как данные проходят от пользователя до базы и обратно:

```mermaid
sequenceDiagram
    actor S as Студент
    participant F as Frontend :5173<br/>(React)
    participant API as API :3001<br/>(Express)
    participant P as Prisma
    participant DB as PostgreSQL

    S->>F: Выбирает комнату на плане этажа
    F->>API: GET /api/rooms?floor=3
    API->>P: prisma.room.findMany({ where: { floor: 3 } })
    P->>DB: SELECT * FROM Room WHERE floor = 3
    DB-->>P: комнаты 3-го этажа
    P-->>API: Room[]
    API-->>F: JSON [{ id, number, floor, ... }]
    F-->>S: Показывает план этажа с комнатами

    S->>F: Заполняет форму и нажимает «Забронировать»
    F->>API: POST /api/bookings { fullName, phone, roomId, bedNumber }
    API->>P: Поиск дубликатов (fuzzy matching)
    P->>DB: Запрос на поиск похожих студентов
    DB-->>P: Результаты поиска
    P-->>API: Похожие студенты (или пусто)
    API->>P: prisma.booking.create({ data: {...} })
    P->>DB: INSERT INTO Booking ...
    DB-->>P: OK
    P-->>API: Booking { id, status: "PENDING" }
    API-->>F: JSON с результатом
    F-->>S: «Заявка отправлена! Номер заявки: #42»
```

### Простыми словами:
- Студент **читает** данные (GET) — просто получает список комнат с этажа.
- Студент **отправляет** данные (POST) — создаётся заявка на бронирование.
- API **проверяет дубликаты** (fuzzy matching) перед созданием заявки — это защита от спама и ошибочных повторных заявок.
- Всё общение между Frontend и API идёт через **JSON** — самый распространённый формат данных в вебе.

---

## 6. Структура Frontend (студентский сайт)

```mermaid
graph TD
    App["App.jsx<br/>Роутер + Общий layout"]
    App --> HP["HomePage<br/>Главная страница<br/>(hero, о нас, цены)"]
    App --> FP["FloorsPage<br/>План этажей"]
    App --> BS["BookingStatusPage<br/>Проверить статус заявки"]

    FP --> FS["FloorSelector<br/>Кнопки: Этаж 1-5"]
    FP --> SVG["FloorPlan SVG<br/>Интерактивная карта этажа"]
    FP --> RV["RoomView<br/>Детали комнаты<br/>(сетка коек)"]

    RV --> BF["BookingForm<br/>Форма: ФИО, курс, группа, тел."]
    BF --> Success["BookingSuccess<br/>«Заявка отправлена!»"]

    style App fill:#bbdefb
    style HP fill:#c8e6c9
    style FP fill:#fff9c4
    style BS fill:#e1bee7
```

### Простыми словами:
- **App.jsx** — это «скелет» приложения. Внутри него react-router-dom переключает страницы.
- **Главная страница** — просто информационная (hero, описание общежития, правила, контакты).
- **План этажей** — самая сложная страница. SVG-план этажа реагирует на наведение (React `useState`), показывает свободные/занятые койки.
- **Выбор комнаты → Форма → Успех** — три шага, которые студент проходит при бронировании.
- **Проверка статуса** — отдельная страница, где студент вводит ФИО и телефон, чтобы узнать судьбу своей заявки.

---

## 7. Структура CMS (админ-панель)

```mermaid
graph TD
    Login["LoginPage<br/>Вход (логин + пароль)"]
    Layout["Layout<br/>Боковое меню + Контент"]

    Login -->|"JWT токен → localStorage"| Layout

    Layout --> D["DashboardPage<br/>Статистика + активность"]
    Layout --> S["StudentsPage<br/>Студенты: список,<br/>добавить, изменить,<br/>подписать документы,<br/>Excel импорт"]
    Layout --> R["RoomsPage<br/>Комнаты: список,<br/>изменить"]
    Layout --> P["PaymentsPage<br/>Платежи по месяцам:<br/>оплатить / отменить"]
    Layout --> B["BookingsPage<br/>Заявки: список,<br/>подтвердить / отказать"]
    Layout --> L["LeavesPage<br/>Отлучки: создать,<br/>подтвердить, завершить,<br/>печать рапорта"]

    style Login fill:#ffcdd2
    style Layout fill:#bbdefb
    style D fill:#c8e6c9
    style S fill:#fff9c4
    style R fill:#fff9c4
    style P fill:#fff9c4
    style B fill:#fff9c4
    style L fill:#fff9c4
```

### Простыми словами:
- **LoginPage** — вход в админку. После входа токен сохраняется в localStorage браузера.
- **Layout** — общая обёртка с боковым меню. Все страницы внутри неё.
- **DashboardPage** — «главный экран» админа: сколько студентов, сколько свободных мест, последняя активность.
- **StudentsPage** — управление студентами: список, поиск, сортировка, добавить/изменить, импорт из Excel, подписание документов.
- **RoomsPage** — управление комнатами: изменить тип, количество мест.
- **PaymentsPage** — учёт оплат: выбрать месяц → отметить студентов, которые заплатили.
- **BookingsPage** — обработка заявок: подтвердить (создаёт студента) или отказать.
- **LeavesPage** — учёт отлучек (больничные, отпуска) и печать дежурного рапорта.

---

## 8. Единая картина (всё вместе)

```mermaid
graph TB
    subgraph "Пользователи"
        U1["👨‍🎓 Студент"]
        U2["👩‍💼 Комендант"]
    end

    subgraph "Frontend :5173"
        F1["Главная страница"]
        F2["План этажей (SVG)"]
        F3["Бронирование"]
        F4["Статус заявки"]
    end

    subgraph "CMS :5174"
        C1["Дашборд"]
        C2["Студенты"]
        C3["Комнаты"]
        C4["Платежи"]
        C5["Заявки"]
        C6["Отлучки"]
    end

    subgraph "API :3001"
        API2["10 маршрутов<br/>Auth middleware<br/>Prisma ORM"]
    end

    subgraph "Хранилище"
        DB["PostgreSQL<br/>7 таблиц"]
        Files["Excel / Docx<br/>Импорт и экспорт"]
    end

    U1 --> F1 & F2 & F3 & F4
    U2 --> C1 & C2 & C3 & C4 & C5 & C6
    F1 & F2 & F3 & F4 --> API2
    C1 & C2 & C3 & C4 & C5 & C6 --> API2
    API2 --> DB
    C2 & C6 --> Files

    style U1 fill:#e3f2fd
    style U2 fill:#fff3e0
    style API2 fill:#e8f5e9
    style DB fill:#f3e5f5
```

### Простыми словами — вся система за 5 предложений:

1. **Студент** заходит на сайт (React), видит план этажа (SVG), выбирает комнату и бронирует койку.
2. **Комендант** заходит в админку (React CMS), видит заявку, проверяет данные студента, подтверждает или отклоняет.
3. **API-сервер** (Express.js) принимает запросы от обоих приложений, проверяет права доступа (JWT), и выполняет операции с базой данных.
4. **Prisma ORM** превращает JavaScript-код в SQL-запросы к PostgreSQL — безопасно, без риска SQL-инъекций.
5. **PostgreSQL** хранит все данные: 7 связанных таблиц (админы, комнаты, студенты, заявки, платежи, отлучки).

### Стек технологий одной строкой:
**React + Vite → Express.js → Prisma ORM → PostgreSQL**

---

## Как использовать эти диаграммы

1. **Скопируй** нужный блок кода с ` ```mermaid ... ``` `
2. **Вставь** в презентацию — Mermaid поддерживается в:
   - Obsidian (плагин)
   - Notion (через `/mermaid`)
   - GitHub/GitLab Markdown
   - VS Code (расширение Markdown Preview Mermaid)
   - [Mermaid Live Editor](https://mermaid.live) — можно сгенерировать PNG/SVG
3. Для PowerPoint/Google Slides — сгенерируй изображение через [mermaid.live](https://mermaid.live) и вставь как картинку.
