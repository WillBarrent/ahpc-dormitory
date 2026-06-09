import { useState, useEffect, useCallback, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { api } from '../utils/api'
import StudentModal from '../components/StudentModal'
import ApplicationPrint from '../components/ApplicationPrint'
import DutyRosterPrint from '../components/DutyRosterPrint'
import styles from './StudentsPage.module.css'

export default function StudentsPage() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [floor, setFloor] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [printingStudent, setPrintingStudent] = useState(null)
  const [rosterStudents, setRosterStudents] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const printRef = useRef(null)
  const rosterRef = useRef(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    onAfterPrint: () => setPrintingStudent(null),
  })

  const handleRosterPrint = useReactToPrint({
    contentRef: rosterRef,
    onAfterPrint: () => setRosterStudents(null),
  })

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (floor) params.set('floor', floor)
    const query = params.toString()

    const data = await api(`/students${query ? `?${query}` : ''}`)
    setStudents(data)
    setLoading(false)
  }, [search, floor])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const handleCheckout = async (id) => {
    if (!window.confirm('Выселить студента?')) return
    await api(`/students/${id}/checkout`, { method: 'POST' })
    fetchStudents()
  }

  const handleConfirm = async (id) => {
    if (!window.confirm('Подтвердить подписание заявления?')) return
    await api(`/students/${id}/confirm`, { method: 'POST' })
    fetchStudents()
  }

  const handlePrintClick = (student) => {
    setPrintingStudent(student)
    setTimeout(() => handlePrint(), 100)
  }

  const handleRosterPrintClick = async () => {
    const data = await api('/students')
    setRosterStudents(data)
    setTimeout(() => handleRosterPrint(), 100)
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    setModalOpen(true)
  }

  const handleAdd = () => {
    setEditingStudent(null)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingStudent(null)
  }

  const handleSaved = () => {
    handleModalClose()
    fetchStudents()
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('ru-RU')
  }

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Студенты</h1>
        <div className={styles.headerActions}>
          <button className={styles.rosterBtn} onClick={handleRosterPrintClick}>
            Печать списка дежурного
          </button>
          <button className={styles.addBtn} onClick={handleAdd}>
            + Добавить студента
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
          className={styles.floorSelect}
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
        >
          <option value="">Все этажи</option>
          <option value="2">2 этаж</option>
          <option value="3">3 этаж</option>
          <option value="4">4 этаж</option>
          <option value="5">5 этаж</option>
        </select>
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : students.length === 0 ? (
          <div className={styles.empty}>Студенты не найдены</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Группа</th>
                <th>Курс</th>
                <th>Телефон</th>
                <th>Комната</th>
                <th>Заселение</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <>
                  <tr
                    key={s.id}
                    className={expandedId === s.id ? styles.rowExpanded : styles.rowClickable}
                    onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                  >
                    <td>{s.fullName}</td>
                    <td>{s.group}</td>
                    <td>{s.course}</td>
                    <td>{s.phone || '—'}</td>
                    <td>{s.room ? `${s.room.number} (${s.room.floor} эт.)` : '—'}</td>
                    <td>{formatDate(s.movedIn)}</td>
                    <td>
                      {!s.roomId ? (
                        <span className={styles.badgeUnassigned}>Не заселён</span>
                      ) : s.status === 'PENDING' ? (
                        <span className={styles.badgePending}>Ожидает подписания</span>
                      ) : (
                        <span className={styles.badgeAssigned}>Заселён</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.editBtn} onClick={(e) => { e.stopPropagation(); handleEdit(s) }}>
                          Изменить
                        </button>
                        {s.roomId && (
                          <>
                            <button
                              className={styles.printBtn}
                              onClick={(e) => { e.stopPropagation(); handlePrintClick(s) }}
                            >
                              Печать
                            </button>
                            {s.status === 'PENDING' && (
                              <button
                                className={styles.confirmBtn}
                                onClick={(e) => { e.stopPropagation(); handleConfirm(s.id) }}
                              >
                                Подтвердить
                              </button>
                            )}
                            <button
                              className={styles.checkoutBtn}
                              onClick={(e) => { e.stopPropagation(); handleCheckout(s.id) }}
                            >
                              Выселить
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedId === s.id && (
                    <tr key={`${s.id}-detail`} className={styles.detailRow}>
                      <td colSpan={8}>
                        <div className={styles.detailGrid}>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>ФИО</span>
                            <span className={styles.detailValue}>{s.fullName}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Курс</span>
                            <span className={styles.detailValue}>{s.course}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Группа</span>
                            <span className={styles.detailValue}>{s.group}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Телефон</span>
                            <span className={styles.detailValue}>{s.phone || '—'}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Комната</span>
                            <span className={styles.detailValue}>
                              {s.room ? `${s.room.number} (${s.room.floor} этаж)` : '—'}
                            </span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Место</span>
                            <span className={styles.detailValue}>{s.bedNumber || '—'}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Дата заселения</span>
                            <span className={styles.detailValue}>{formatDate(s.movedIn)}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Статус</span>
                            <span className={styles.detailValue}>
                              {!s.roomId ? 'Не заселён' : s.status === 'PENDING' ? 'Ожидает подписания' : 'Заселён'}
                            </span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Оплата за текущий месяц</span>
                            {s.paidThisMonth ? (
                              <span className={styles.badgePaidInline}>Оплачено</span>
                            ) : (
                              <span className={styles.badgeUnpaidInline}>Не оплачено</span>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <StudentModal
          student={editingStudent}
          onClose={handleModalClose}
          onSaved={handleSaved}
        />
      )}

      {printingStudent && (
        <div className={styles.printHidden}>
          <ApplicationPrint ref={printRef} student={printingStudent} />
        </div>
      )}

      {rosterStudents && (
        <div className={styles.printHidden}>
          <DutyRosterPrint ref={rosterRef} students={rosterStudents} />
        </div>
      )}
    </>
  )
}
