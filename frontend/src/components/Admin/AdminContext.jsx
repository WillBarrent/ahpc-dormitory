import { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext(null)

const API = 'http://localhost:3001/api'

export function AdminProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'))
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then(setAdmin)
      .catch(() => {
        localStorage.removeItem('admin_token')
        setToken(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  function login(newToken, adminData) {
    localStorage.setItem('admin_token', newToken)
    setToken(newToken)
    setAdmin(adminData)
  }

  function logout() {
    localStorage.removeItem('admin_token')
    setToken(null)
    setAdmin(null)
  }

  return (
    <AdminContext.Provider value={{ token, admin, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}

export { API }
