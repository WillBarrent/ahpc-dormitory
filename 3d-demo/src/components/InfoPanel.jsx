import { STATUS_COLORS } from './Room'
import styles from '../App.module.css'

const STATUS_LABELS = {
  free: 'Свободно',
  occupied: 'Занято',
  maintenance: 'Ремонт',
}

export default function InfoPanel({ room, onClose }) {
  if (!room) return null

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitleRow}>
          <span
            className={styles.panelDot}
            style={{ background: STATUS_COLORS[room.status] }}
          />
          <span className={styles.panelRoomNumber}>Комната {room.number}</span>
        </div>
        <button className={styles.panelClose} onClick={onClose}>
          ✕
        </button>
      </div>

      <div className={styles.panelBody}>
        <div className={styles.panelRow}>
          <span className={styles.panelLabel}>Этаж</span>
          <span className={styles.panelValue}>{room.floor}</span>
        </div>
        <div className={styles.panelRow}>
          <span className={styles.panelLabel}>Статус</span>
          <span
            className={styles.panelStatus}
            style={{ color: STATUS_COLORS[room.status] }}
          >
            {STATUS_LABELS[room.status]}
          </span>
        </div>
        <div className={styles.panelRow}>
          <span className={styles.panelLabel}>Кол-во мест</span>
          <span className={styles.panelValue}>{room.beds}</span>
        </div>

        {room.occupants.length > 0 && (
          <div className={styles.panelOccupants}>
            <span className={styles.panelLabel}>Проживают</span>
            <ul className={styles.panelList}>
              {room.occupants.map((name, i) => (
                <li key={i} className={styles.panelOccupant}>
                  👤 {name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
