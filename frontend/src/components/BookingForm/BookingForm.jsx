import { useState } from 'react'
import useT from '../../i18n/useT.js'
import s from './BookingForm.module.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export default function BookingForm({ room, bedNumber, onSuccess, onCancel }) {
  const t = useT()

  const [fullName, setFullName] = useState('')
  const [course, setCourse] = useState(1)
  const [group, setGroup] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          course: Number(course),
          group,
          phone,
          roomId: room.roomId,
          bedNumber,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка при бронировании')
      }

      onSuccess(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={s.card}>
      <div className={s.header}>
        <div>
          <p className={s.label}>Бронирование</p>
          <h2 className={s.title}>
            Комната {room.number}, место {bedNumber}
          </h2>
        </div>
        <button onClick={onCancel} className={s.backButton}>
          ← Назад
        </button>
      </div>

      <form className={s.form} onSubmit={handleSubmit}>
        {error && <div className={s.error}>{error}</div>}

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

        <div className={s.row}>
          <div className={s.field}>
            <label className={s.fieldLabel}>Курс</label>
            <select
              className={s.select}
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
              <option value={1}>1 курс</option>
              <option value={2}>2 курс</option>
              <option value={3}>3 курс</option>
              <option value={4}>4 курс</option>
            </select>
          </div>
          <div className={s.field}>
            <label className={s.fieldLabel}>Группа</label>
            <input
              className={s.input}
              type="text"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              placeholder="ИС-21"
              required
            />
          </div>
        </div>

        <div className={s.field}>
          <label className={s.fieldLabel}>Телефон <span className={s.required}>*</span></label>
          <input
            className={s.input}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 (777) 123-45-67"
            pattern="^(\+7|8)?[\s\-]?\(?7\d{2}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$"
            title="Введите номер в формате: +7 (777) 123-45-67 или 8 777 123 45 67"
            required
          />
        </div>

        <div className={s.footer}>
          <button type="button" className={s.cancelBtn} onClick={onCancel}>
            Отмена
          </button>
          <button type="submit" className={s.submitBtn} disabled={submitting}>
            {submitting ? 'Отправка...' : 'Забронировать'}
          </button>
        </div>
      </form>
    </div>
  )
}
