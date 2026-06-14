import styles from './BedIcon.module.css'

export default function BedIcon({ occupied = false }) {
  return (
    <svg
      width="80"
      height="44"
      viewBox="0 0 80 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${styles.icon} ${occupied ? styles.iconOccupied : styles.iconFree}`}
    >
      <rect x="1" y="14" width="78" height="29" rx="2" stroke="currentColor" strokeWidth="2" fill={occupied ? '#e7e5e4' : 'transparent'} />
      <rect x="1" y="1" width="20" height="42" rx="2" stroke="currentColor" strokeWidth="2" fill={occupied ? '#d6d3d1' : 'transparent'} />
      <rect x="5" y="18" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill={occupied ? '#a8a29e' : '#F5F0E8'} />
      <line x1="24" y1="22" x2="76" y2="22" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
