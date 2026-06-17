import { useState, useEffect, useCallback } from 'react'
import { api } from '../utils/api'
import { exportToExcel } from '../utils/excel'
import ConfirmModal from '../components/ConfirmModal'
import SortTh from '../components/SortTh'
import useSort from '../utils/useSort'
import usePagination from '../utils/usePagination'
import PaginationBar from '../components/PaginationBar'
import styles from './PaymentsPage.module.css'

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

export default function PaymentsPage() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [floor, setFloor] = useState('')
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState(null)
  const [amount, setAmount] = useState(10000)
  const [editingAmount, setEditingAmount] = useState(false)
  const [editAmountValue, setEditAmountValue] = useState('')

  function getPeriodStatus(student, month, year) {
    if (!student.movedIn) return 'not_housed'
    const paymentEnd = new Date(year, month, 0)
    const paymentStart = new Date(year, month - 1, 1)
    if (new Date(student.movedIn) > paymentEnd) return 'not_yet'
    if (student.movedOut && new Date(student.movedOut) < paymentStart) return 'moved_out'
    return 'valid'
  }

  const fetchPayments = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ month, year })
    if (floor) params.set('floor', floor)
    const data = await api(`/payments?${params}`)
    setStudents(data)
    setLoading(false)
  }, [month, year, floor])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  useEffect(() => {
    api('/payments/config').then((c) => { if (c.amount) setAmount(c.amount) }).catch(() => {})
  }, [])

  const yearRange = [
    now.getFullYear() - 1,
    now.getFullYear(),
    now.getFullYear() + 1,
  ]

  const isFutureMonth = year > now.getFullYear() ||
    (year === now.getFullYear() && month > now.getMonth() + 1)

  const handleMarkPaid = async (studentId) => {
    await api('/payments', {
      method: 'POST',
      body: JSON.stringify({ studentId, month, year, amount }),
    })
    fetchPayments()
  }

  const handleRemovePayment = async (paymentId) => {
    await api(`/payments/${paymentId}`, { method: 'DELETE' })
    fetchPayments()
  }

  const paidCount = students.filter((s) => s.paid).length
  const unpaidCount = students.length - paidCount

  const { sortedData, sortColumn, sortDir, handleSort } = useSort(students, '')
  const { paginatedData, page, totalPages, setPage } = usePagination(sortedData)

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('ru-RU')
  }

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Оплата</h1>
        <div className={styles.amountDisplay}>
          {editingAmount ? (
            <div className={styles.amountEdit}>
              <input
                className={styles.amountInput}
                type="number"
                value={editAmountValue}
                onChange={(e) => setEditAmountValue(e.target.value)}
              />
              <button
                className={styles.amountSaveBtn}
                onClick={async () => {
                  const val = Number(editAmountValue)
                  if (val < 1) return
                  await api('/payments/config', {
                    method: 'PUT',
                    body: JSON.stringify({ amount: val }),
                  })
                  setAmount(val)
                  setEditingAmount(false)
                }}
              >
                Сохранить
              </button>
              <button
                className={styles.amountCancelBtn}
                onClick={() => setEditingAmount(false)}
              >
                Отмена
              </button>
            </div>
          ) : (
            <button
              className={styles.amountButton}
              onClick={() => {
                setEditAmountValue(String(amount))
                setEditingAmount(true)
              }}
            >
              {amount.toLocaleString('ru-RU')} ₸/мес ✏️
            </button>
          )}
        </div>
        <div className={styles.stats}>
          <span className={styles.statPaid}>{paidCount} оплатили</span>
          <span className={styles.statUnpaid}>{unpaidCount} не оплатили</span>
        </div>
        <button className={styles.exportBtn} onClick={() => {
          const data = students.map((s) => ({
            fullName: s.fullName,
            group: s.group,
            roomNumber: s.room ? s.room.number : '',
            amount: amount.toLocaleString('ru-RU') + ' ₸',
            paid: s.paid ? 'Оплачено' : 'Не оплачено',
            paidAt: s.payment ? formatDate(s.payment.paidAt) : '—',
          }))
          exportToExcel(
            data,
            ['fullName', 'group', 'roomNumber', 'amount', 'paid', 'paidAt'],
            { fullName: 'ФИО', group: 'Группа', roomNumber: 'Комната', amount: 'Сумма', paid: 'Статус', paidAt: 'Дата оплаты' },
            'оплата'
          )
        }}>
          📥 Excel
        </button>
      </div>

      <div className={styles.filters}>
        <select
          className={styles.select}
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {MONTH_NAMES.map((name, i) => (
            <option key={i} value={i + 1}>{name}</option>
          ))}
        </select>
        <select
          className={styles.select}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {yearRange.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select
          className={styles.select}
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

      {isFutureMonth && (
        <div className={styles.futureWarning}>
          Выбран будущий месяц. Оплата будет записана авансом.
        </div>
      )}

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : students.length === 0 ? (
          <div className={styles.empty}>Нет заселённых студентов</div>
        ) : (
          <>
          <table className={styles.table}>
            <thead>
              <tr>
                <SortTh column="fullName" currentColumn={sortColumn} sortDir={sortDir} onSort={handleSort}>ФИО</SortTh>
                <SortTh column="group" currentColumn={sortColumn} sortDir={sortDir} onSort={handleSort}>Группа</SortTh>
                <SortTh column="room.number" currentColumn={sortColumn} sortDir={sortDir} onSort={handleSort}>Комната</SortTh>
                <th>Сумма</th>
                <SortTh column="paid" currentColumn={sortColumn} sortDir={sortDir} onSort={handleSort}>Статус</SortTh>
                <SortTh column="payment.paidAt" currentColumn={sortColumn} sortDir={sortDir} onSort={handleSort}>Дата оплаты</SortTh>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((s) => {
                const periodStatus = getPeriodStatus(s, month, year)
                return (
                <tr key={s.id}>
                  <td>{s.fullName}</td>
                  <td>{s.group}</td>
                  <td>{s.room ? `${s.room.number} (${s.room.floor} эт.)` : '—'}</td>
                  <td>{amount.toLocaleString('ru-RU')} ₸</td>
                  <td>
                    {periodStatus === 'not_yet' ? (
                      <span className={styles.badgeFuture}>Заселится позже</span>
                    ) : periodStatus === 'moved_out' ? (
                      <span className={styles.badgeLeft}>Выселен {formatDate(s.movedOut)}</span>
                    ) : periodStatus === 'not_housed' ? (
                      <span className={styles.badgeDisabled}>Не в общежитии</span>
                    ) : s.paid ? (
                      <span className={styles.badgePaid}>Оплачено</span>
                    ) : (
                      <span className={styles.badgeUnpaid}>Не оплачено</span>
                    )}
                  </td>
                  <td>{s.payment ? formatDate(s.payment.paidAt) : '—'}</td>
                  <td>
                    {s.paid ? (
                      <button
                        className={styles.cancelBtn}
                        onClick={() => setConfirm({
                          message: 'Отменить оплату?',
                          action: () => handleRemovePayment(s.payment.id),
                          variant: 'danger',
                        })}
                      >
                        Отменить
                      </button>
                    ) : periodStatus === 'valid' ? (
                      <button
                        className={styles.payBtn}
                        onClick={() => handleMarkPaid(s.id)}
                      >
                        Отметить оплату
                      </button>
                    ) : (
                      <span className={styles.noAction}>—</span>
                    )}
                  </td>
                </tr>
                )
              })}
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
    </>
  )
}
