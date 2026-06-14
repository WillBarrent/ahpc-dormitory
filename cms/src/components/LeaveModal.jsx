import { useState, useEffect } from 'react'
import styles from './LeaveModal.module.css'
import { api } from '../utils/api'

function todayStr() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

function addDays(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export default function LeaveModal({ student, onClose, onSaved }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const [startDate, setStartDate] = useState(todayStr())
  const [endDate, setEndDate] = useState(addDays(7))
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!startDate || !endDate) {
      setError('Заполните даты')
      return
    }

    if (!reason.trim()) {
      setError('Укажите причину убытия')
      return
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setError('Дата возвращения должна быть позже даты убытия')
      return
    }

    setSaving(true)
    try {
      await api(`/absences/student/${student.id}`, {
        method: 'POST',
        body: JSON.stringify({
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          reason: reason.trim(),
        }),
      })
      onSaved()
    } catch (err) {
      setError(err.message || 'Ошибка при создании убытия')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Оформить убытие</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.studentInfo}>
          <span className={styles.studentName}>{student.fullName}</span>
          {student.room && (
            <span className={styles.studentRoom}>
              Комната {student.room.number}, место {student.bedNumber || '—'}
            </span>
          )}
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Дата убытия</label>
            <input
              type="date"
              className={styles.input}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Дата возвращения</label>
            <input
              type="date"
              className={styles.input}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Причина убытия</label>
            <textarea
              className={styles.textarea}
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="По семейным обстоятельствам, на каникулы, по болезни…"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={saving}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={saving}
            >
              {saving ? 'Сохранение…' : 'Оформить убытие'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
