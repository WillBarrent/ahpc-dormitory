import { useState } from 'react'
import { Link } from 'react-router-dom'
import useT from '../../i18n/useT.js'
import s from './BookingStatusPage.module.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const STATUS_LABELS = {
  PENDING: 'На рассмотрении',
  CONFIRMED: 'Подтверждена',
  REJECTED: 'Отклонена',
}

const STATUS_CLASSES = {
  PENDING: s.statusPending,
  CONFIRMED: s.statusConfirmed,
  REJECTED: s.statusRejected,
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function BookingStatusPage() {
  const t = useT()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [bookings, setBookings] = useState(null)
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheck = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setSearched(false)

    try {
      const params = new URLSearchParams({ fullName, phone })
      const res = await fetch(`${API_URL}/bookings/status?${params}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка при поиске')
      }

      setBookings(data)
      setSearched(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={s.page}>
      <header className={s.header}>
        <Link to="/" className={s.logo}>AHPC Living</Link>
        <Link to="/floors" className={s.backLink}>← К планировке</Link>
      </header>

      <main className={s.main}>
        <div className={s.card}>
          <div className={s.cardHeader}>
            <div className={s.illustration}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M15 15L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M7.5 10L9 11.5L12.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className={s.title}>Проверка статуса бронирования</h1>
            <p className={s.subtitle}>
              Введите ФИО и телефон, указанные при бронировании
            </p>
          </div>

          {!searched && (
            <div className={s.steps}>
              <div className={s.step}>
                <span className={s.stepNum}>1</span>
                <span className={s.stepText}>Введите ФИО и номер телефона</span>
              </div>
              <div className={s.stepDivider} />
              <div className={s.step}>
                <span className={s.stepNum}>2</span>
                <span className={s.stepText}>Нажмите «Проверить статус»</span>
              </div>
              <div className={s.stepDivider} />
              <div className={s.step}>
                <span className={s.stepNum}>3</span>
                <span className={s.stepText}>Узнайте решение по вашей заявке</span>
              </div>
            </div>
          )}

          <form className={s.form} onSubmit={handleCheck}>
            <div className={s.fields}>
              <div className={s.field}>
                <label className={s.fieldLabel}>ФИО</label>
                <input
                  className={s.input}
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Иванов Иван Иванович"
                  required
                />
              </div>
              <div className={s.field}>
                <label className={s.fieldLabel}>Телефон</label>
                <input
                  className={s.input}
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (777) 123-45-67"
                  required
                />
              </div>
            </div>

            {error && <div className={s.error}>{error}</div>}

            <button type="submit" className={s.submitBtn} disabled={loading}>
              {loading ? 'Поиск...' : 'Проверить статус'}
            </button>
          </form>

          {searched && (
            <div className={s.results}>
              {bookings.length === 0 ? (
                <div className={s.empty}>
                  <div className={s.emptyIcon}>🔍</div>
                  <p className={s.emptyTitle}>Бронирования не найдены</p>
                  <p className={s.emptyText}>
                    Проверьте правильность введённых данных. Если вы не бронировали комнату,
                    перейдите к{' '}
                    <Link to="/floors" className={s.emptyLink}>планировке общежития</Link>.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className={s.resultsTitle}>
                    Найдено бронирований: {bookings.length}
                  </h2>
                  <div className={s.bookingList}>
                    {bookings.map((b) => (
                      <div
                        key={b.id}
                        className={`${s.bookingCard} ${STATUS_CLASSES[b.status] || ''}`}
                      >
                        <div className={s.bookingHeader}>
                          <span className={s.bookingRoom}>
                            🏠 Комната {b.room?.number} ({b.room?.floor} этаж)
                          </span>
                          <span className={`${s.badge} ${STATUS_CLASSES[b.status] || ''}`}>
                            {STATUS_LABELS[b.status]}
                          </span>
                        </div>
                        <div className={s.bookingDetails}>
                          <div className={s.bookingDetail}>
                            <span className={s.detailLabel}>Место</span>
                            <span className={s.detailValue}>№{b.bedNumber}</span>
                          </div>
                          <div className={s.bookingDetail}>
                            <span className={s.detailLabel}>Дата заявки</span>
                            <span className={s.detailValue}>{formatDate(b.createdAt)}</span>
                          </div>
                        </div>

                        {b.status === 'CONFIRMED' && (
                          <div className={s.confirmedMsg}>
                            ✅ Ваша заявка одобрена! Для заселения обратитесь к администратору
                            общежития с документами.
                          </div>
                        )}
                        {b.status === 'REJECTED' && (
                          <div className={s.rejectedMsg}>
                            ❌ К сожалению, ваша заявка отклонена. Обратитесь в приёмную
                            комиссию для уточнения причин.
                          </div>
                        )}
                        {b.status === 'PENDING' && (
                          <div className={s.pendingMsg}>
                            ⏳ Ваша заявка находится на рассмотрении. Ожидайте решения
                            администратора.
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
