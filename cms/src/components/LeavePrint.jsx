import { forwardRef } from 'react'
import styles from './LeavePrint.module.css'

const LeavePrint = forwardRef(function LeavePrint({ absence, student }, ref) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '_______________'
    return new Date(dateStr).toLocaleDateString('ru-RU')
  }

  const roomInfo = student.room
    ? `${student.room.number} (${student.room.floor} эт.)`
    : '_______________'

  return (
    <div ref={ref} className={styles.page}>
      <div className={styles.header}>
        <p className={styles.ministry}>
          МИНИСТЕРСТВО НАУКИ И ВЫСШЕГО ОБРАЗОВАНИЯ
          <br />
          РЕСПУБЛИКИ КАЗАХСТАН
        </p>
        <p className={styles.hint}>(атауы / наименование учебного заведения)</p>
      </div>

      <h1 className={styles.title}>РАСПИСКА</h1>

      <div className={styles.body}>
        <p>
          Я, <span className={styles.underline}>{student.fullName}</span>
        </p>
        <p className={styles.hint}>(тегі, аты, әкесінің аты / фамилия, имя, отчество полностью)</p>

        <p>
          студент(ка) группы <span className={styles.underline}>{student.group}</span>
        </p>
        <p className={styles.hint}>(номер группы)</p>

        <p>
          курс <span className={styles.underline}>{student.course}</span>,
          проживающий(ая) в комнате №<span className={styles.underline}>{roomInfo}</span>,
          место <span className={styles.underline}>{student.bedNumber || '—'}</span>
        </p>

        <p className={styles.bold}>Обязуюсь:</p>
        <ol className={styles.list}>
          <li>
            Вернуться в общежитие до{' '}
            <span className={styles.underline}>{formatDate(absence.endDate)}</span>.
          </li>
          <li>
            Нести полную материальную ответственность за сохранность своих личных
            вещей, оставленных в комнате на период отсутствия.
          </li>
          <li>
            Соблюдать правила внутреннего распорядка общежития по возвращении.
          </li>
        </ol>

        <p className={styles.bold}>Причина отсутствия:</p>
        <p className={styles.reason}>{absence.reason}</p>

        <p className={styles.bold}>Период отсутствия:</p>
        <p>
          с <span className={styles.underline}>{formatDate(absence.startDate)}</span>
          {' '}по{' '}
          <span className={styles.underline}>{formatDate(absence.endDate)}</span>
        </p>

        <hr className={styles.divider} />

        <p className={styles.bold}>СОГЛАСОВАНО</p>

        <div className={styles.signRow}>
          <span>Дата: {formatDate(absence.createdAt)}</span>
          <span>Подпись студента: ___________________</span>
        </div>

        <div className={styles.signRow}>
          <span>Дата: _______________</span>
          <span>Подпись коменданта: ___________________</span>
        </div>
      </div>
    </div>
  )
})

export default LeavePrint
