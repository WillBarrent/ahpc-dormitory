import BedIcon from '../BedIcon/BedIcon.jsx'
import s from './RoomView.module.css'

export default function RoomView({ room, onBack, onBook }) {
  const free = room.beds.filter((b) => !b.occupied).length
  const total = room.beds.length

  return (
    <div className={s.card}>
      <div className={s.header}>
        <div>
          <p className={s.label}>Комната</p>
          <h2 className={s.roomNumber}>{room.number}</h2>
          <p className={s.meta}>
            <span className={s.freeCount}>{free}</span> свободно · {total} мест
          </p>
        </div>
        <button onClick={onBack} className={s.backButton}>
          ← Назад
        </button>
      </div>

      <div className={s.grid}>
        {room.beds.map((bed, index) => (
          <div
            key={bed.id}
            className={`${s.bed} ${bed.occupied ? s.bedOccupied : ''}`}
          >
            <BedIcon occupied={bed.occupied} />
            <span
              className={`${s.bedStatus} ${bed.occupied ? s.bedStatusOccupied : ''}`}
            >
              {bed.occupied ? 'Занято' : 'Свободно'}
            </span>
            {!bed.occupied && onBook && (
              <button
                className={s.bookButton}
                onClick={() => onBook(index + 1)}
              >
                Забронировать
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
