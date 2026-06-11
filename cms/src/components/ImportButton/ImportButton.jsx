import { useRef, useState } from 'react'
import { parseExcelFile } from '../../utils/excel'
import styles from './ImportButton.module.css'

export default function ImportButton({ onImport, label = '📤 Импорт', mapping }) {
  const inputRef = useRef(null)
  const [loading, setLoading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLoading(true)
    try {
      const rawRows = await parseExcelFile(file)

      // Map Excel headers to our keys
      const rows = rawRows.map((raw) => {
        const obj = {}
        for (const [excelHeader, key] of Object.entries(mapping)) {
          obj[key] = raw[excelHeader] ?? null
        }
        return obj
      })

      onImport(rows)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
      // Reset input so the same file can be re-uploaded
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFile}
        style={{ display: 'none' }}
      />
      <button
        className={styles.btn}
        onClick={() => inputRef.current?.click()}
        disabled={loading}
      >
        {loading ? '⏳ Чтение...' : label}
      </button>
    </>
  )
}
