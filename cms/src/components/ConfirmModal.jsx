import { useEffect } from 'react'
import styles from './ConfirmModal.module.css'

export default function ConfirmModal({ open, title, message, confirmLabel, cancelLabel, variant, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title || 'Подтверждение'}</h2>
        </div>
        <div className={styles.body}>
          <p className={styles.message}>{message}</p>
        </div>
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            {cancelLabel || 'Отмена'}
          </button>
          <button
            className={`${styles.confirmBtn} ${variant === 'danger' ? styles.confirmDanger : ''}`}
            onClick={onConfirm}
          >
            {confirmLabel || 'Подтвердить'}
          </button>
        </div>
      </div>
    </div>
  )
}
