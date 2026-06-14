import XLSX from 'xlsx-js-style'

// Базовый стиль ячейки с рамкой (гарантированно работает во всех версиях Excel)
const BORDER = {
  top: { style: 'thin' },
  bottom: { style: 'thin' },
  left: { style: 'thin' },
  right: { style: 'thin' },
}

const HEADER_STYLE = {
  font: { bold: true, sz: 11 },
  border: BORDER,
  alignment: { horizontal: 'center', vertical: 'center' },
}

const BODY_STYLE = {
  font: { sz: 11 },
  border: BORDER,
  alignment: { vertical: 'center' },
}

/**
 * Format an array of objects into a styled .xlsx file.
 */
export function exportToExcel(rows, columns, labels, filename) {
  const headers = columns.map((col) => labels[col] || col)

  const data = [headers]
  for (const row of rows) {
    data.push(columns.map((col) => row[col] ?? ''))
  }

  const ws = XLSX.utils.aoa_to_sheet(data)

  // Column widths
  ws['!cols'] = columns.map((col, ci) => {
    let maxLen = (labels[col] || col).length
    for (const row of rows) {
      maxLen = Math.max(maxLen, String(row[col] ?? '').length)
    }
    return { wch: Math.min(maxLen + 4, 42) }
  })

  // Auto-filter + freeze
  const range = XLSX.utils.decode_range(ws['!ref'])
  ws['!autofilter'] = { ref: XLSX.utils.encode_range(range) }
  ws['!freeze'] = { xSplit: 0, ySplit: 1 }

  // Cell styles — loop all cells for full control
  for (let R = range.s.r; R <= range.e.r; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {
      const addr = XLSX.utils.encode_cell({ r: R, c: C })
      if (!ws[addr]) continue

      if (R === 0) {
        ws[addr].s = HEADER_STYLE
      } else {
        const isNum = typeof rows[R - 1]?.[columns[C]] === 'number'
        ws[addr].s = { ...BODY_STYLE, alignment: { vertical: 'center', horizontal: isNum ? 'center' : 'left' } }
      }
    }
  }

  // Print settings — landscape, fit to width, repeat header row
  ws['!pageSetup'] = {
    orientation: 'landscape',
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
  }

  // Repeat header row on every printed page
  ws['!printHeader'] = { rows: [0] }

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Лист1')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

/**
 * Parse an uploaded .xlsx file and return an array of objects.
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
