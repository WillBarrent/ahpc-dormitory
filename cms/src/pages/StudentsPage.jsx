import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { api } from '../utils/api'
import { exportToExcel } from '../utils/excel'
import StudentModal from '../components/StudentModal'
import ApplicationPrint from '../components/ApplicationPrint'
import DutyRosterPrint from '../components/DutyRosterPrint'
import ImportButton from '../components/ImportButton/ImportButton'
import LeaveModal from '../components/LeaveModal'
import ConfirmModal from '../components/ConfirmModal'
import AlertModal from '../components/AlertModal'
import SortTh from '../components/SortTh'
import useSort from '../utils/useSort'
import useDebounce from '../utils/useDebounce'
import usePagination from '../utils/usePagination'
import PaginationBar from '../components/PaginationBar'
import styles from './StudentsPage.module.css'

export default function StudentsPage() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [floor, setFloor] = useState('')
  const [statusFilter, setStatusFilter] = useState('active')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [printingStudent, setPrintingStudent] = useState(null)
  const [rosterStudents, setRosterStudents] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [paymentHistory, setPaymentHistory] = useState({})
  const [leaveStudent, setLeaveStudent] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [alertMsg, setAlertMsg] = useState(null)
  const debouncedSearch = useDebounce(search, 400)
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
    try {
      const params = new URLSearchParams()
      if (debouncedSearch) params.set('search', debouncedSearch)
      if (floor) params.set('floor', floor)
      if (statusFilter !== 'active') params.set('status', statusFilter)
      const query = params.toString()

      const data = await api(`/students${query ? `?${query}` : ''}`)
      setStudents(data)
    } catch (err) {
      setAlertMsg(err.message)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, floor, statusFilter])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const { sortedData, sortColumn, sortDir, handleSort } = useSort(students, 'fullName')
  const { paginatedData, page, totalPages, setPage } = usePagination(sortedData)

  const handleCheckout = async (id) => {
    try {
      await api(`/students/${id}/checkout`, { method: 'POST' })
      fetchStudents()
    } catch (err) {
      setAlertMsg(err.message)
    }
  }

  const handleConfirm = async (id) => {
    try {
      await api(`/students/${id}/confirm`, { method: 'POST' })
      fetchStudents()
    } catch (err) {
      setAlertMsg(err.message)
    }
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

  const STUDENT_EXPORT_COLUMNS = ['fullName', 'course', 'group', 'phone', 'roomNumber', 'bedNumber', 'status', 'movedIn', 'movedOut']
  const STUDENT_EXPORT_LABELS = {
    fullName: 'ФИО', course: 'Курс', group: 'Группа', phone: 'Телефон',
    roomNumber: 'Комната', bedNumber: 'Место', status: 'Статус', movedIn: 'Дата заселения', movedOut: 'Дата выселения',
  }

  const handleExportExcel = () => {
    const data = students.map((s) => ({
      fullName: s.fullName,
      course: s.course,
      group: s.group,
      phone: s.phone || '',
      roomNumber: s.room ? s.room.number : '',
      bedNumber: s.bedNumber || '',
      status: s.movedOut ? 'Выселен' : s.currentAbsence && s.currentAbsence.status === 'ACTIVE' ? 'В убытии' : s.status === 'ACTIVE' ? 'Заселён' : 'Ожидает',
      movedIn: formatDate(s.movedIn),
      movedOut: formatDate(s.movedOut),
    }))
    exportToExcel(data, STUDENT_EXPORT_COLUMNS, STUDENT_EXPORT_LABELS, 'студенты')
  }

  const IMPORT_MAPPING = {
    'ФИО': 'fullName',
    'Курс': 'course',
    'Группа': 'group',
    'Телефон': 'phone',
    'Номер комнаты': 'roomNumber',
    'Место': 'bedNumber',
  }

  const handleImportStudents = async (rows) => {
    const res = await api('/import/students', {
      method: 'POST',
      body: JSON.stringify({ students: rows }),
    })
    const msg = [
      `Создано: ${res.created}`,
      `Пропущено: ${res.skipped}`,
      res.errors?.length > 0 ? `Ошибки:\n${res.errors.map(e => `  Строка ${e.row}: ${e.error}`).join('\n')}` : '',
    ].join('\n')
    setAlertMsg(msg)
    fetchStudents()
  }

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Студенты</h1>
        <div className={styles.headerActions}>
          <button className={styles.rosterBtn} onClick={handleRosterPrintClick}>
            Печать списка дежурного
          </button>
          <button className={styles.rosterBtn} onClick={handleExportExcel}>
            📥 Excel
          </button>
          <ImportButton
            label="📤 Импорт"
            mapping={IMPORT_MAPPING}
            onImport={handleImportStudents}
            onError={(msg) => setAlertMsg(msg)}
          />
          <button className={styles.addBtn} onClick={handleAdd}>
            + Добавить студента
          </button>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.statusTabs}>
          <button
            className={`${styles.statusTab} ${statusFilter === 'active' ? styles.statusTabActive : ''}`}
            onClick={() => setStatusFilter('active')}
          >
            Активные
          </button>
          <button
            className={`${styles.statusTab} ${statusFilter === 'former' ? styles.statusTabActive : ''}`}
            onClick={() => setStatusFilter('former')}
          >
            Выселенные
          </button>
          <button
            className={`${styles.statusTab} ${statusFilter === 'all' ? styles.statusTabActive : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            Все
          </button>
        </div>
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
          <div className={styles.empty}>{statusFilter === 'former' ? 'Выселенные студенты не найдены' : 'Студенты не найдены'}</div>
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
                <SortTh column="movedIn" currentColumn={sortColumn} sortDir={sortDir} onSort={handleSort}>Заселение</SortTh>
                <SortTh column="status" currentColumn={sortColumn} sortDir={sortDir} onSort={handleSort}>Статус</SortTh>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((s) => (
                <React.Fragment key={s.id}>
                  <tr
                    key={s.id}
                    className={expandedId === s.id ? styles.rowExpanded : styles.rowClickable}
                    onClick={async () => {
                      if (expandedId === s.id) {
                        setExpandedId(null)
                        return
                      }
                      setExpandedId(s.id)
                      if (!paymentHistory[s.id]) {
                        try {
                          const data = await api(`/students/${s.id}/payments`)
                          setPaymentHistory(prev => ({ ...prev, [s.id]: data }))
                        } catch { /* ignore */ }
                      }
                    }}
                  >
                    <td>{s.fullName}</td>
                    <td>{s.group}</td>
                    <td>{s.course}</td>
                    <td>{s.phone || '—'}</td>
                    <td>{s.room ? `${s.room.number} (${s.room.floor} эт.)` : '—'}</td>
                    <td>{formatDate(s.movedIn)}</td>
                    <td>
                      {s.movedOut ? (
                        <span className={styles.badgeMovedOut}>Выселен</span>
                      ) : !s.roomId ? (
                        <span className={styles.badgeUnassigned}>Не заселён</span>
                      ) : s.currentAbsence && s.currentAbsence.status === 'ACTIVE' ? (
                        <span className={styles.badgeLeave}>В убытии</span>
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
                        {!s.movedOut && s.roomId && (
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
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setConfirm({
                                    message: 'Подтвердить подписание заявления?',
                                    action: () => handleConfirm(s.id),
                                    variant: 'default',
                                  })
                                }}
                              >
                                Подтвердить
                              </button>
                            )}
                            {s.status === 'ACTIVE' && (
                              <button
                                className={styles.leaveBtn}
                                onClick={(e) => { e.stopPropagation(); setLeaveStudent(s) }}
                              >
                                Убытие
                              </button>
                            )}
                            <button
                              className={styles.checkoutBtn}
                              onClick={(e) => {
                                e.stopPropagation()
                                setConfirm({
                                  message: 'Выселить студента?',
                                  action: () => handleCheckout(s.id),
                                  variant: 'danger',
                                })
                              }}
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
                            <span className={styles.detailLabel}>Дата выселения</span>
                            <span className={styles.detailValue}>{formatDate(s.movedOut)}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Статус</span>
                            <span className={styles.detailValue}>
                              {s.movedOut
                                ? `Выселен ${formatDate(s.movedOut)}`
                                : !s.roomId
                                  ? 'Не заселён'
                                  : s.status === 'PENDING'
                                    ? 'Ожидает подписания'
                                    : 'Заселён'
                              }
                            </span>
                          </div>
                          {s.currentAbsence && (
                            <div className={styles.detailItem}>
                              <span className={styles.detailLabel}>Убытие</span>
                              <span className={`${styles.detailValue} ${s.currentAbsence.status === 'OVERDUE' || new Date(s.currentAbsence.endDate) < new Date() ? styles.absenceOverdue : ''}`}>
                                {s.currentAbsence.status === 'OVERDUE'
                                  ? `Просрочено (${formatDate(s.currentAbsence.startDate)} – ${formatDate(s.currentAbsence.endDate)})`
                                  : s.currentAbsence.status === 'PENDING'
                                    ? 'Ожидает подписи'
                                    : new Date(s.currentAbsence.endDate) < new Date()
                                      ? `Просрочено до ${formatDate(s.currentAbsence.endDate)}`
                                      : `До ${formatDate(s.currentAbsence.endDate)}`
                                }
                              </span>
                            </div>
                          )}
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Оплата за текущий месяц</span>
                            {s.paidThisMonth ? (
                              <span className={styles.badgePaidInline}>Оплачено</span>
                            ) : (
                              <span className={styles.badgeUnpaidInline}>Не оплачено</span>
                            )}
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>История оплат</span>
                            <div className={styles.paymentHistoryList}>
                              {paymentHistory[s.id] && paymentHistory[s.id].length > 0 ? (
                                paymentHistory[s.id].map(p => (
                                  <div key={p.id} className={styles.paymentHistoryItem}>
                                    <span className={styles.paymentHistoryMonth}>
                                      {p.month}/{p.year}
                                    </span>
                                    <span className={styles.paymentHistoryAmount}>
                                      {p.amount.toLocaleString('ru-RU')} ₸
                                    </span>
                                    <span className={styles.paymentHistoryDate}>
                                      {new Date(p.paidAt).toLocaleDateString('ru-RU')}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <span className={styles.detailValue}>Нет оплат</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <PaginationBar page={page} totalPages={totalPages} onPage={setPage} />
          </>
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

      {leaveStudent && (
        <LeaveModal
          student={leaveStudent}
          onClose={() => setLeaveStudent(null)}
          onSaved={() => {
            setLeaveStudent(null)
            fetchStudents()
          }}
        />
      )}

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
        title="Результат импорта"
        message={alertMsg || ''}
        onClose={() => setAlertMsg(null)}
      />
    </>
  )
}
