import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import styles from './DashboardPage.module.css'

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

const ACTIVITY_ICONS = {
  booking_new: '📨',
  booking_confirmed: '✅',
  booking_rejected: '❌',
  student_new: '👤',
  student_in: '🏠',
  student_out: '🚪',
  payment: '💳',
}

const ACTIVITY_LABELS = {
  booking_new: 'Новая бронь',
  booking_confirmed: 'Бронь подтверждена',
  booking_rejected: 'Бронь отклонена',
  student_new: 'Новый студент',
  student_in: 'Заселение',
  student_out: 'Выселение',
  payment: 'Оплата',
}

function formatTime(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now - d
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return 'только что'
  if (mins < 60) return `${mins} мин. назад`
  if (hours < 24) return `${hours} ч. назад`
  if (days < 7) return `${days} дн. назад`
  return d.toLocaleDateString('ru-RU')
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api('/stats'), api('/activity')]).then(([statsData, activityData]) => {
      setStats(statsData)
      setActivity(activityData)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <span className={styles.loading}>Загрузка...</span>
      </div>
    )
  }

  const monthName = MONTH_NAMES[stats.currentMonth - 1]

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Главная</h1>
        <span className={styles.subtitle}>{monthName} {stats.currentYear}</span>
      </div>

      <div className={styles.grid}>
        <div className={styles.card} onClick={() => navigate('/students')}>
          <div className={styles.cardIcon} data-color="blue">🏠</div>
          <div className={styles.cardBody}>
            <div className={styles.cardValue}>{stats.totalStudents}</div>
            <div className={styles.cardLabel}>Заселено студентов</div>
            <div className={styles.cardSub}>
              <span className={styles.chipGreen}>{stats.activeStudents} активных</span>
              {stats.pendingStudents > 0 && (
                <span className={styles.chipAmber}>{stats.pendingStudents} ожидает</span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.card} onClick={() => navigate('/rooms')}>
          <div className={styles.cardIcon} data-color="green">🛏️</div>
          <div className={styles.cardBody}>
            <div className={styles.cardValue}>{stats.freeBeds}</div>
            <div className={styles.cardLabel}>Свободных мест</div>
            <div className={styles.cardSub}>
              <span className={styles.chipGray}>из {stats.totalBeds} всего</span>
            </div>
          </div>
        </div>

        <div className={styles.card} onClick={() => navigate('/payments')}>
          <div className={styles.cardIcon} data-color="emerald">💳</div>
          <div className={styles.cardBody}>
            <div className={styles.cardValue}>{stats.paidThisMonth}</div>
            <div className={styles.cardLabel}>Оплатили в {monthName.toLowerCase()}</div>
            <div className={styles.cardSub}>
              {stats.unpaidThisMonth > 0 ? (
                <span className={styles.chipRed}>{stats.unpaidThisMonth} не оплатили</span>
              ) : (
                <span className={styles.chipGreen}>Все оплатили</span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.card} onClick={() => navigate('/students')}>
          <div className={styles.cardIcon} data-color="amber">📋</div>
          <div className={styles.cardBody}>
            <div className={styles.cardValue}>{stats.pendingStudents}</div>
            <div className={styles.cardLabel}>Ожидают подписания</div>
            <div className={styles.cardSub}>
              {stats.pendingStudents === 0 ? (
                <span className={styles.chipGreen}>Всё подтверждено</span>
              ) : (
                <span className={styles.chipAmber}>Нужна подпись заявления</span>
              )}
            </div>
          </div>
        </div>

        <div
          className={`${styles.card} ${stats.pendingBookings > 0 ? styles.cardHighlight : ''}`}
          onClick={() => navigate('/bookings')}
        >
          <div className={styles.cardIcon} data-color="purple">📨</div>
          <div className={styles.cardBody}>
            <div className={styles.cardValue}>{stats.pendingBookings}</div>
            <div className={styles.cardLabel}>Новых бронирований</div>
            <div className={styles.cardSub}>
              {stats.pendingBookings > 0 ? (
                <span className={styles.chipIndigo}>Требуют внимания</span>
              ) : (
                <span className={styles.chipGray}>Нет новых заявок</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.sectionRow}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Недавняя активность</h2>
          {activity.length === 0 ? (
            <p className={styles.emptyText}>Пока нет событий</p>
          ) : (
            <div className={styles.activityFeed}>
              {activity.map((item, i) => (
                <div key={i} className={styles.activityItem}>
                  <span className={styles.activityIcon} data-type={item.type}>
                    {ACTIVITY_ICONS[item.type] || '•'}
                  </span>
                  <div className={styles.activityBody}>
                    <span className={styles.activityText}>{item.text}</span>
                    <span className={styles.activitySub}>{item.sub}</span>
                  </div>
                  <span className={styles.activityTime}>{formatTime(item.time)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Быстрые действия</h2>
          <div className={styles.quickActions}>
            <button className={styles.actionBtn} onClick={() => navigate('/students')}>
              <span className={styles.actionIcon}>➕</span>
              <span className={styles.actionLabel}>Добавить студента</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/bookings')}>
              <span className={styles.actionIcon}>📨</span>
              <span className={styles.actionLabel}>Все бронирования</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/payments')}>
              <span className={styles.actionIcon}>💳</span>
              <span className={styles.actionLabel}>Оплата за месяц</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/rooms')}>
              <span className={styles.actionIcon}>🛏️</span>
              <span className={styles.actionLabel}>Просмотр комнат</span>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Заполненность</h2>
        <div className={styles.occupancyBar}>
          <div
            className={styles.occupancyFill}
            style={{ width: stats.totalBeds ? `${(stats.occupiedBeds / stats.totalBeds) * 100}%` : '0%' }}
          />
        </div>
        <div className={styles.occupancyLabels}>
          <span>{stats.occupiedBeds} занято</span>
          <span>
            {stats.totalBeds > 0
              ? `${Math.round((stats.occupiedBeds / stats.totalBeds) * 100)}%`
              : '0%'}
          </span>
          <span>{stats.freeBeds} свободно</span>
        </div>
      </div>
    </div>
  )
}
