import { useState, useEffect, useCallback } from 'react'
import { api } from '../utils/api'
import styles from './PaymentsPage.module.css'

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

const AMOUNT = 10000

export default function PaymentsPage() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [floor, setFloor] = useState('')
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

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

  const handleMarkPaid = async (studentId) => {
    await api('/payments', {
      method: 'POST',
      body: JSON.stringify({ studentId, month, year, amount: AMOUNT }),
    })
    fetchPayments()
  }

  const handleRemovePayment = async (paymentId) => {
    if (!window.confirm('Отменить оплату?')) return
    await api(`/payments/${paymentId}`, { method: 'DELETE' })
    fetchPayments()
  }

  const paidCount = students.filter((s) => s.paid).length
  const unpaidCount = students.length - paidCount

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('ru-RU')
  }

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Оплата</h1>
        <div className={styles.stats}>
          <span className={styles.statPaid}>{paidCount} оплатили</span>
          <span className={styles.statUnpaid}>{unpaidCount} не оплатили</span>
        </div>
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
          {[2025, 2026, 2027].map((y) => (
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

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : students.length === 0 ? (
          <div className={styles.empty}>Нет заселённых студентов</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Группа</th>
                <th>Комната</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th>Дата оплаты</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.fullName}</td>
                  <td>{s.group}</td>
                  <td>{s.room ? `${s.room.number} (${s.room.floor} эт.)` : '—'}</td>
                  <td>{AMOUNT.toLocaleString('ru-RU')} ₸</td>
                  <td>
                    {s.paid ? (
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
                        onClick={() => handleRemovePayment(s.payment.id)}
                      >
                        Отменить
                      </button>
                    ) : (
                      <button
                        className={styles.payBtn}
                        onClick={() => handleMarkPaid(s.id)}
                      >
                        Отметить оплату
                      </button>
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
