import { useEffect } from 'react'
import styles from './ConfirmModal.module.css'

export default function AlertModal({ open, title, message, onClose }) {
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title || 'Сообщение'}</h2>
        </div>
        <div className={styles.body}>
          <p className={styles.message}>{message}</p>
        </div>
        <div className={styles.footer}>
          <button className={`${styles.confirmBtn} ${styles.alertOkBtn}`} onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
