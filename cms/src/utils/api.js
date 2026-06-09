const API_URL = 'http://localhost:3001/api'

export function getToken() {
  return localStorage.getItem('token')
}

export function setToken(token) {
  localStorage.setItem('token', token)
}

export function removeToken() {
  localStorage.removeItem('token')
}

export async function api(endpoint, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json' }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  })

  if (res.status === 401) {
    removeToken()
    window.location.href = '/login'
    return
  }

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Ошибка сервера')
  }

  return data
}
