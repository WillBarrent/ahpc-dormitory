import * as XLSX from 'xlsx'

/**
 * Download an array of objects as an .xlsx file.
 * @param {Object[]} rows      - data rows
 * @param {string[]} columns   - column keys to include
 * @param {Object}   labels    - { key: 'Display Name' } for column headers
 * @param {string}   filename  - file name without extension
 */
export function exportToExcel(rows, columns, labels, filename) {
  const data = rows.map((row) => {
    const obj = {}
    for (const col of columns) {
      obj[labels[col] || col] = row[col] ?? ''
    }
    return obj
  })

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Лист1')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

/**
 * Parse an uploaded .xlsx file and return an array of objects.
 * @param {File} file - the file from <input type="file">
 * @returns {Promise<Object[]>}
 */
export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(ws)
        resolve(data)
      } catch (err) {
        reject(new Error('Не удалось прочитать файл'))
      }
    }
    reader.onerror = () => reject(new Error('Ошибка чтения файла'))
    reader.readAsArrayBuffer(file)
  })
}
