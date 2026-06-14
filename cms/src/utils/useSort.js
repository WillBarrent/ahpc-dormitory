import { useState, useMemo } from 'react'

/** Достаёт вложенное значение по ключу с точками (напр. "room.number") */
function resolveKey(obj, key) {
  return key.split('.').reduce((acc, part) => (acc != null ? acc[part] : acc), obj)
}

/**
 * Хук сортировки таблицы.
 * @param {Object[]} data        — исходный массив
 * @param {string}   defaultColumn — колонка сортировки по умолчанию
 * @returns {{ sortedData, sortColumn, sortDir, handleSort }}
 */
export default function useSort(data, defaultColumn = '') {
  const [sortColumn, setSortColumn] = useState(defaultColumn)
  const [sortDir, setSortDir] = useState('asc')

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(column)
      setSortDir('asc')
    }
  }

  const sortedData = useMemo(() => {
    if (!sortColumn) return data

    return [...data].sort((a, b) => {
      let aVal = resolveKey(a, sortColumn)
      let bVal = resolveKey(b, sortColumn)

      // null/undefined — в конец
      if (aVal == null) return 1
      if (bVal == null) return -1

      // Числа — числовое сравнение
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      }

      // Даты — строковые даты сравниваем как строки (они в формате ISO)
      // или как числа, если это числа
      // Строки — localeCompare
      aVal = String(aVal)
      bVal = String(bVal)
      const cmp = aVal.localeCompare(bVal, 'ru')
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortColumn, sortDir])

  return { sortedData, sortColumn, sortDir, handleSort }
}
