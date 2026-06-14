import { useState, useEffect, useMemo } from 'react'

export default function usePagination(data, pageSize = 20) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))

  // Сброс на первую страницу при изменении данных (новый поиск/фильтр)
  useEffect(() => {
    setPage(1)
  }, [data.length])

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, page, pageSize])

  return { paginatedData, page, totalPages, setPage }
}
