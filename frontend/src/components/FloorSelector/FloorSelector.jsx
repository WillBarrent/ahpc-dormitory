import useT from '../../i18n/useT.js'
import s from './FloorSelector.module.css'

export default function FloorSelector({ activeFloor, onSelect }) {
  const t = useT()

  return (
    <div className={s.selector}>
      <div className={s.label}>{t.floorLabel}</div>
      {[5, 4, 3, 2, 1].map((floor) => (
        <button
          key={floor}
          onClick={() => onSelect(floor)}
          className={`${s.button} ${activeFloor === floor ? s.active : ''}`}
        >
          {floor}
        </button>
      ))}
    </div>
  )
}
