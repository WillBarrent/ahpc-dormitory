import { useState, useEffect, useCallback, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { api } from '../utils/api'
import { exportToExcel } from '../utils/excel'
import LeavePrint from '../components/LeavePrint'
import LeaveModal from '../components/LeaveModal'
import styles from './LeavesPage.module.css'

const STATUS_LABELS = {
  PENDING: 'Ожидает подписи',
  ACTIVE: 'В убытии',
  COMPLETED: 'Вернулся',
}

export default function LeavesPage() {
  const [absences, setAbsences] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [printingAbsence, setPrintingAbsence] = useState(null)
  const [leaveStudent, setLeaveStudent] = useState(null)

  const printRef = useRef(null)
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    onAfterPrint: () => setPrintingAbsence(null),
  })

  const fetchAbsences = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (statusFilter && statusFilter !== 'ALL') params.set('status', statusFilter)
    const query = params.toString()
    const data = await api(`/absences${query ? `?${query}` : ''}`)
    setAbsences(data)
    setLoading(false)
  }, [search, statusFilter])

  useEffect(() => {
    fetchAbsences()
  }, [fetchAbsences])

  const handleConfirm = async (id) => {
    if (!window.confirm('Подтвердить подписание расписки?')) return
    try {
      await api(`/absences/${id}/confirm`, { method: 'PATCH' })
      fetchAbsences()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleComplete = async (id) => {
    if (!window.confirm('Отметить студента как вернувшегося?')) return
    try {
      await api(`/absences/${id}/complete`, { method: 'PATCH' })
      fetchAbsences()
    } catch (err) {
      alert(err.message)
    }
  }

  const handlePrintClick = (absence) => {
    setPrintingAbsence(absence)
    setTimeout(() => handlePrint(), 100)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('ru-RU')
  }

  const isOverdue = (absence) => {
    if (absence.status !== 'ACTIVE') return false
    const end = new Date(absence.endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return end < today
  }

  const getStatusLabel = (absence) => {
    if (isOverdue(absence)) return 'Просрочено'
    return STATUS_LABELS[absence.status]
  }

  const getStatusClass = (absence) => {
    if (isOverdue(absence)) return styles.badgeOverdue
    switch (absence.status) {
      case 'PENDING': return styles.badgePending
      case 'ACTIVE': return styles.badgeActive
      case 'COMPLETED': return styles.badgeCompleted
      default: return ''
    }
  }

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Убытия</h1>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn} onClick={() => {
            const data = absences.map((a) => ({
              studentName: a.student?.fullName || '',
              group: a.student?.group || '',
              room: a.student?.room ? `№${a.student.room.number}` : '',
              period: `${formatDate(a.startDate)} – ${formatDate(a.endDate)}`,
              reason: a.reason,
              status: STATUS_LABELS[a.status],
            }))
            exportToExcel(
              data,
              ['studentName', 'group', 'room', 'period', 'reason', 'status'],
              { studentName: 'Студент', group: 'Группа', room: 'Комната', period: 'Период', reason: 'Причина', status: 'Статус' },
              'убытия'
            )
          }}>
            📥 Excel
          </button>
        </div>
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
          <option value="ALL">Все статусы</option>
          <option value="PENDING">Ожидает подписи</option>
          <option value="ACTIVE">В убытии</option>
          <option value="COMPLETED">Вернулся</option>
        </select>
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : absences.length === 0 ? (
          <div className={styles.empty}>Убытия не найдены</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Студент</th>
                <th>Группа</th>
                <th>Комната</th>
                <th>Период</th>
                <th>Причина</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {absences.map((a) => (
                <tr key={a.id} className={isOverdue(a) ? styles.rowOverdue : ''}>
                  <td className={styles.studentCell}>{a.student?.fullName || '—'}</td>
                  <td>{a.student?.group || '—'}</td>
                  <td>
                    {a.student?.room
                      ? `№${a.student.room.number} (м. ${a.student.bedNumber || '—'})`
                      : '—'}
                  </td>
                  <td className={isOverdue(a) ? styles.periodOverdue : ''}>
                    {formatDate(a.startDate)} – {formatDate(a.endDate)}
                  </td>
                  <td className={styles.reasonCell}>{a.reason}</td>
                  <td>
                    <span className={getStatusClass(a)}>
                      {getStatusLabel(a)}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {a.status === 'PENDING' && (
                        <>
                          <button
                            className={styles.printBtn}
                            onClick={() => handlePrintClick(a)}
                          >
                            Печать
                          </button>
                          <button
                            className={styles.confirmBtn}
                            onClick={() => handleConfirm(a.id)}
                          >
                            Подтвердить
                          </button>
                        </>
                      )}
                      {a.status === 'ACTIVE' && (
                        <button
                          className={styles.completeBtn}
                          onClick={() => handleComplete(a.id)}
                        >
                          Вернулся
                        </button>
                      )}
                      {a.status === 'COMPLETED' && (
                        <span className={styles.returnedText}>Возвращён</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {printingAbsence && (
        <div className={styles.printHidden}>
          <LeavePrint
            ref={printRef}
            absence={printingAbsence}
            student={printingAbsence.student || {}}
          />
        </div>
      )}

      {leaveStudent && (
        <LeaveModal
          student={leaveStudent}
          onClose={() => setLeaveStudent(null)}
          onSaved={() => {
            setLeaveStudent(null)
            fetchAbsences()
          }}
        />
      )}
    </>
  )
}
