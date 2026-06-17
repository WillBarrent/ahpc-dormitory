import { STATUS_COLORS } from './Room'
import styles from '../App.module.css'

const ITEMS = [
  { label: 'Свободно', color: STATUS_COLORS.free },
  { label: 'Занято', color: STATUS_COLORS.occupied },
  { label: 'Ремонт', color: STATUS_COLORS.maintenance },
]

export default function Legend() {
  return (
    <div className={styles.legend}>
      {ITEMS.map((item) => (
        <div key={item.label} className={styles.legendItem}>
          <span
            className={styles.legendDot}
            style={{ background: item.color }}
          />
          <span className={styles.legendLabel}>{item.label}</span>
        </div>
      ))}
    </div>
  )
}
