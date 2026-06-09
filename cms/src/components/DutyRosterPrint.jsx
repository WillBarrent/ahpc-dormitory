import { forwardRef } from 'react'
import styles from './DutyRosterPrint.module.css'

const DutyRosterPrint = forwardRef(function DutyRosterPrint({ students }, ref) {
  const housed = students
    .filter((s) => s.roomId && s.room)
    .sort((a, b) => {
      if (a.room.floor !== b.room.floor) return a.room.floor - b.room.floor
      const roomA = parseInt(a.room.number, 10) || 0
      const roomB = parseInt(b.room.number, 10) || 0
      if (roomA !== roomB) return roomA - roomB
      return (a.bedNumber || 0) - (b.bedNumber || 0)
    })

  const today = new Date().toLocaleDateString('ru-RU')

  return (
    <div ref={ref} className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Список студентов общежития</h1>
        <p className={styles.subtitle}>Лист дежурного преподавателя</p>
        <div className={styles.meta}>
          <span>Дата: {today}</span>
          <span>Дежурный: ____________________________</span>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.colCheck}>✓</th>
            <th className={styles.colFloor}>Этаж</th>
            <th className={styles.colRoom}>Комн.</th>
            <th className={styles.colBed}>Место</th>
            <th className={styles.colName}>ФИО</th>
            <th className={styles.colGroup}>Группа</th>
            <th className={styles.colCourse}>Курс</th>
            <th className={styles.colNote}>Примечание</th>
          </tr>
        </thead>
        <tbody>
          {housed.map((s) => (
            <tr key={s.id}>
              <td className={styles.checkCell}><span className={styles.checkbox} /></td>
              <td>{s.room.floor}</td>
              <td>{s.room.number}</td>
              <td>{s.bedNumber || '—'}</td>
              <td className={styles.nameCell}>{s.fullName}</td>
              <td>{s.group}</td>
              <td>{s.course}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.footer}>
        <p>Всего студентов: {housed.length}</p>
        <p>Подпись дежурного: ____________________________</p>
      </div>
    </div>
  )
})

export default DutyRosterPrint
