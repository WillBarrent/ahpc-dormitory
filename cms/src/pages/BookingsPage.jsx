import { useState, useEffect, useCallback } from 'react'
import { api } from '../utils/api'
import { exportToExcel } from '../utils/excel'
import styles from './BookingsPage.module.css'

const STATUS_LABELS = {
  PENDING: 'Ожидает',
  CONFIRMED: 'Подтверждена',
  REJECTED: 'Отклонена',
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('PENDING')

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (statusFilter) params.set('status', statusFilter)
    const query = params.toString()
    const data = await api(`/bookings${query ? `?${query}` : ''}`)
    setBookings(data)
    setLoading(false)
  }, [search, statusFilter])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const handleConfirm = async (id) => {
    if (!window.confirm('Подтвердить бронь и заселить студента?')) return
    try {
      await api(`/bookings/${id}/confirm`, { method: 'POST' })
      fetchBookings()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleReject = async (id) => {
    if (!window.confirm('Отклонить бронь?')) return
    await api(`/bookings/${id}/reject`, { method: 'POST' })
    fetchBookings()
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('ru-RU')
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING': return styles.badgePending
      case 'CONFIRMED': return styles.badgeConfirmed
      case 'REJECTED': return styles.badgeRejected
      default: return ''
    }
  }

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Бронирования</h1>
        <button className={styles.exportBtn} onClick={() => {
          const data = bookings.map((b) => ({
            fullName: b.fullName,
            group: b.group,
            course: b.course,
            phone: b.phone || '',
            roomNumber: b.room ? b.room.number : '',
            bedNumber: b.bedNumber,
            status: STATUS_LABELS[b.status],
            createdAt: formatDate(b.createdAt),
          }))
          exportToExcel(
            data,
            ['fullName', 'group', 'course', 'phone', 'roomNumber', 'bedNumber', 'status', 'createdAt'],
            { fullName: 'ФИО', group: 'Группа', course: 'Курс', phone: 'Телефон', roomNumber: 'Комната', bedNumber: 'Место', status: 'Статус', createdAt: 'Дата' },
            'бронирования'
          )
        }}>
          📥 Excel
        </button>
      </div>

      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Поиск по имени..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.statusSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Все статусы</option>
          <option value="PENDING">Ожидает</option>
          <option value="CONFIRMED">Подтверждена</option>
          <option value="REJECTED">Отклонена</option>
        </select>
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : bookings.length === 0 ? (
          <div className={styles.empty}>Бронирования не найдены</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Группа</th>
                <th>Курс</th>
                <th>Телефон</th>
                <th>Комната</th>
                <th>Место</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.fullName}</td>
                  <td>{b.group}</td>
                  <td>{b.course}</td>
                  <td>{b.phone || '—'}</td>
                  <td>{b.room ? `${b.room.number} (${b.room.floor} эт.)` : '—'}</td>
                  <td>{b.bedNumber}</td>
                  <td>{formatDate(b.createdAt)}</td>
                  <td>
                    <span className={getStatusClass(b.status)}>
                      {STATUS_LABELS[b.status]}
                    </span>
                  </td>
                  <td>
                    {b.status === 'PENDING' && (
                      <div className={styles.actions}>
                        <button
                          className={styles.confirmBtn}
                          onClick={() => handleConfirm(b.id)}
                        >
                          Подтвердить
                        </button>
                        <button
                          className={styles.rejectBtn}
                          onClick={() => handleReject(b.id)}
                        >
                          Отклонить
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
