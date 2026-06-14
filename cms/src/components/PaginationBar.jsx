import styles from './PaginationBar.module.css'

export default function PaginationBar({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null

  const pages = []
  const maxVisible = 5
  let start = Math.max(1, page - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages, start + maxVisible - 1)
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('…')
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push('…')
    pages.push(totalPages)
  }

  return (
    <div className={styles.bar}>
      <button
        className={styles.btn}
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
      >
        ← Назад
      </button>

      <div className={styles.pages}>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`dots-${i}`} className={styles.dots}>…</span>
          ) : (
            <button
              key={p}
              className={`${styles.pageBtn} ${p === page ? styles.active : ''}`}
              onClick={() => onPage(p)}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        className={styles.btn}
        disabled={page >= totalPages}
        onClick={() => onPage(page + 1)}
      >
        Вперёд →
      </button>
    </div>
  )
}
