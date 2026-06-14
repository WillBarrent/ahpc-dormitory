import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import styles from './StudentModal.module.css'

export default function StudentModal({ student, onClose, onSaved }) {
  const isEditing = !!student

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const [fullName, setFullName] = useState(student?.fullName || '')
  const [course, setCourse] = useState(student?.course || 1)
  const [group, setGroup] = useState(student?.group || '')
  const [phone, setPhone] = useState(student?.phone || '')
  const [roomId, setRoomId] = useState(student?.roomId || '')
  const [bedNumber, setBedNumber] = useState(student?.bedNumber || '')
  const [rooms, setRooms] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api('/rooms').then(setRooms)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const body = {
      fullName,
      course: Number(course),
      group,
      phone: phone || null,
      roomId: roomId ? Number(roomId) : null,
      bedNumber: bedNumber ? Number(bedNumber) : null,
    }

    try {
      if (isEditing) {
        await api(`/students/${student.id}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        })
      } else {
        await api('/students', {
          method: 'POST',
          body: JSON.stringify(body),
        })
      }
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const selectedRoom = rooms.find((r) => r.id === Number(roomId))

  // Собираем номера занятых мест (чтобы не предлагать их в выпадающем списке)
  const takenBedNumbers = new Set(
    (selectedRoom?.takenBeds || [])
      .filter((tb) => tb.status === 'occupied')
      .map((tb) => tb.bedNumber)
  )
  // Если редактируем — убираем текущего студента из занятых, чтобы он мог остаться на своём месте
  if (isEditing && student?.bedNumber) {
    takenBedNumbers.delete(student.bedNumber)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {isEditing ? 'Редактировать студента' : 'Добавить студента'}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <label className={styles.label}>ФИО</label>
            <input
              className={styles.input}
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Иванов Иван Иванович"
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Курс</label>
              <select
                className={styles.select}
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              >
                <option value={1}>1 курс</option>
                <option value={2}>2 курс</option>
                <option value={3}>3 курс</option>
                <option value={4}>4 курс</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Группа</label>
              <input
                className={styles.input}
                type="text"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                placeholder="ИС-21"
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Телефон</label>
            <input
              className={styles.input}
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (777) 123-45-67"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Комната</label>
              <select
                className={styles.select}
                value={roomId}
                onChange={(e) => {
                  setRoomId(e.target.value)
                  setBedNumber('')
                }}
              >
                <option value="">Не назначена</option>
                {rooms
                  .filter((r) => r.type === 'RESIDENTIAL')
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      №{r.number} ({r.floor} эт.) — {r.occupiedBeds}/{r.totalBeds}
                    </option>
                  ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Место</label>
              <select
                className={styles.select}
                value={bedNumber}
                onChange={(e) => setBedNumber(e.target.value)}
                disabled={!roomId}
              >
                <option value="">—</option>
                {selectedRoom &&
                  Array.from({ length: selectedRoom.totalBeds }, (_, i) => i + 1).map(
                    (n) =>
                      takenBedNumbers.has(n) ? null : (
                        <option key={n} value={n}>
                          Место {n}
                        </option>
                      )
                  )}
              </select>
            </div>
          </div>
        </form>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Отмена
          </button>
          <button className={styles.saveBtn} onClick={handleSubmit} disabled={saving}>
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  )
}
