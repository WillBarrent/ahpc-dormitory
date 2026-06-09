import { forwardRef } from 'react'
import styles from './ApplicationPrint.module.css'

const ApplicationPrint = forwardRef(function ApplicationPrint({ student }, ref) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '_______________'
    return new Date(dateStr).toLocaleDateString('ru-RU')
  }

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

      <h1 className={styles.title}>ЗАЯВЛЕНИЕ</h1>
      <p className={styles.subtitle}>на заселение в общежитие</p>

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
          курс <span className={styles.underline}>{student.course}</span> форма
          обучения <span className={styles.underline}>очная</span>
        </p>

        <p className={styles.request}>
          прошу предоставить мне место в общежитии на период обучения в университете.
        </p>

        <p className={styles.bold}>Обязуюсь:</p>
        <ol className={styles.list}>
          <li>Соблюдать правила внутреннего распорядка общежития.</li>
          <li>
            Бережно относиться к имуществу общежития и нести материальную
            ответственность за его сохранность.
          </li>
          <li>Своевременно вносить плату за проживание в установленном порядке.</li>
          <li>
            Поддерживать чистоту и порядок в жилом помещении и местах общего
            пользования.
          </li>
          <li>
            Освободить комнату в общежитии в установленные сроки по окончании
            обучения или при отчислении.
          </li>
        </ol>

        <div className={styles.signRow}>
          <span>Дата: {formatDate(student.movedIn)}</span>
          <span>Подпись студента: ___________________</span>
        </div>

        <hr className={styles.divider} />

        <p className={styles.bold}>КЕЛІСІЛДІ / СОГЛАСОВАНО</p>

        <p>
          Куратор: <span className={styles.underline}>&nbsp;</span>
        </p>
        <p className={styles.hint}>(тегі, аты, әкесінің аты / ФИО куратора)</p>

        <div className={styles.signRow}>
          <span>Дата: _______________</span>
          <span>Подпись куратора: ___________________</span>
        </div>
      </div>
    </div>
  )
})

export default ApplicationPrint
