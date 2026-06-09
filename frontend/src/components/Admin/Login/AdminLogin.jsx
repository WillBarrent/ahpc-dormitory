import { useState } from 'react'
import { useAdmin, API } from '../AdminContext.jsx'
import s from './AdminLogin.module.css'

export default function AdminLogin() {
  const { login } = useAdmin()
  const [form, setForm] = useState({ login: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ошибка авторизации')
        return
      }

      login(data.token, { name: data.name })
    } catch {
      setError('Сервер недоступен')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={s.page}>
      <form className={s.form} onSubmit={handleSubmit}>
        <h1 className={s.title}>Панель управления</h1>
        <p className={s.subtitle}>Общежитие АВПК</p>

        {error && <div className={s.error}>{error}</div>}

        <label className={s.label}>
          Логин
          <input
            className={s.input}
            type="text"
            value={form.login}
            onChange={(e) => setForm({ ...form, login: e.target.value })}
            autoComplete="username"
          />
        </label>

        <label className={s.label}>
          Пароль
          <input
            className={s.input}
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="current-password"
          />
        </label>

        <button className={s.button} type="submit" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  )
}
