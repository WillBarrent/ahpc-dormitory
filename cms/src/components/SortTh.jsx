import styles from './SortTh.module.css'

export default function SortTh({ children, column, currentColumn, sortDir, onSort }) {
  const isActive = column === currentColumn

  return (
    <th className={styles.th} onClick={() => onSort(column)}>
      <span className={styles.label}>{children}</span>
      {isActive ? (
        <span className={styles.arrow}>{sortDir === 'asc' ? '▲' : '▼'}</span>
      ) : (
        <span className={styles.arrowInactive}>▲</span>
      )}
    </th>
  )
}
