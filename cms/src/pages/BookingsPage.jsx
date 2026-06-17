import { useState, useEffect, useCallback } from 'react'
import { api } from '../utils/api'
import { exportToExcel } from '../utils/excel'
import ConfirmModal from '../components/ConfirmModal'
import AlertModal from '../components/AlertModal'
import SortTh from '../components/SortTh'
import useSort from '../utils/useSort'
import useDebounce from '../utils/useDebounce'
import usePagination from '../utils/usePagination'
import PaginationBar from '../components/PaginationBar'
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
  const [confirm, setConfirm] = useState(null)
  const [alertMsg, setAlertMsg] = useState(null)
  const debouncedSearch = useDebounce(search, 400)

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedSearch) params.set('search', debouncedSearch)
      if (statusFilter) params.set('status', statusFilter)
      const query = params.toString()
      const data = await api(`/bookings${query ? `?${query}` : ''}`)
      setBookings(data)
    } catch (err) {
      setAlertMsg(err.message)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, statusFilter])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const handleConfirm = async (id) => {
    try {
      await api(`/bookings/${id}/confirm`, { method: 'POST' })
      fetchBookings()
    } catch (err) {
      setAlertMsg(err.message)
    }
  }

  const handleReject = async (id) => {
    try {
      await api(`/bookings/${id}/reject`, { method: 'POST' })
      fetchBookings()
    } catch (err) {
      setAlertMsg(err.message)
    }
  }

  const { sortedData, sortColumn, sortDir, handleSort } = useSort(bookings, 'createdAt')
  const { paginatedData, page, totalPages, setPage } = usePagination(sortedData)

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
          <>
          <table className={styles.table}>
            <thead>
              <tr>
                <SortTh column="fullName" currentColumn={sortColumn} sortDir={sortDir} onSort={handleSort}>ФИО</SortTh>
                <SortTh column="group" currentColumn={sortColumn} sortDir={sortDir} onSort={handleSort}>Группа</SortTh>
                <SortTh column="course" currentColumn={sortColumn} sortDir={sortDir} onSort={handleSort}>Курс</SortTh>
                <SortTh column="phone" currentColumn={sortColumn} sortDir={sortDir} onSort={handleSort}>Телефон</SortTh>
                <SortTh column="room.number" currentColumn={sortColumn} sortDir={sortDir} onSort={handleSort}>Комната</SortTh>
                <SortTh column="bedNumber" currentColumn={sortColumn} sortDir={sortDir} onSort={handleSort}>Место</SortTh>
                <SortTh column="createdAt" currentColumn={sortColumn} sortDir={sortDir} onSort={handleSort}>Дата</SortTh>
                <SortTh column="status" currentColumn={sortColumn} sortDir={sortDir} onSort={handleSort}>Статус</SortTh>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((b) => (
                <tr key={b.id} className={b.similarStudent ? styles.rowFlagged : ''}>
                  <td>
                    <div className={styles.nameCell}>
                      {b.fullName}
                      {b.similarStudent && (
                        <span className={styles.flagBadge} title={`Похож на: ${b.similarStudent.fullName}`}>
                          ⚠️ {b.similarStudent.fullName}
                        </span>
                      )}
                    </div>
                  </td>
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
                          onClick={() => setConfirm({
                            message: 'Подтвердить бронь и заселить студента?',
                            action: () => handleConfirm(b.id),
                            variant: 'default',
                          })}
                        >
                          Подтвердить
                        </button>
                        <button
                          className={styles.rejectBtn}
                          onClick={() => setConfirm({
                            message: 'Отклонить бронь?',
                            action: () => handleReject(b.id),
                            variant: 'danger',
                          })}
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
          <PaginationBar page={page} totalPages={totalPages} onPage={setPage} />
          </>
        )}
      </div>

      <ConfirmModal
        open={confirm !== null}
        title="Подтверждение"
        message={confirm?.message || ''}
        confirmLabel="Да"
        cancelLabel="Отмена"
        variant={confirm?.variant || 'default'}
        onConfirm={async () => {
          const action = confirm?.action
          setConfirm(null)
          if (action) await action()
        }}
        onCancel={() => setConfirm(null)}
      />

      <AlertModal
        open={alertMsg !== null}
        title="Ошибка"
        message={alertMsg || ''}
        onClose={() => setAlertMsg(null)}
      />
    </>
  )
}
