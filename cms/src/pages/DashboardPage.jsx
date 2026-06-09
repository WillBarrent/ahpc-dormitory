import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import styles from './DashboardPage.module.css'

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/stats').then((data) => {
      setStats(data)
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
        <div className={styles.card}>
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

        <div className={styles.card}>
          <div className={styles.cardIcon} data-color="green">🛏️</div>
          <div className={styles.cardBody}>
            <div className={styles.cardValue}>{stats.freeBeds}</div>
            <div className={styles.cardLabel}>Свободных мест</div>
            <div className={styles.cardSub}>
              <span className={styles.chipGray}>из {stats.totalBeds} всего</span>
            </div>
          </div>
        </div>

        <div className={styles.card}>
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

        <div className={styles.card}>
          <div className={styles.cardIcon} data-color="amber">📋</div>
          <div className={styles.cardBody}>
            <div className={styles.cardValue}>{stats.pendingStudents}</div>
            <div className={styles.cardLabel}>Ожидают подтверждения</div>
            <div className={styles.cardSub}>
              {stats.pendingStudents === 0 ? (
                <span className={styles.chipGreen}>Всё подтверждено</span>
              ) : (
                <span className={styles.chipAmber}>Нужна подпись заявления</span>
              )}
            </div>
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
