import { useAdmin } from '../AdminContext.jsx'
import s from './AdminDashboard.module.css'

export default function AdminDashboard() {
  const { admin, logout } = useAdmin()

  return (
    <div className={s.layout}>
      <aside className={s.sidebar}>
        <div className={s.brand}>AHPC Admin</div>
        <nav className={s.nav}>
          <span className={s.navItem}>Комнаты</span>
          <span className={s.navItem}>Студенты</span>
        </nav>
        <div className={s.sidebarFooter}>
          <span className={s.adminName}>{admin?.name}</span>
          <button className={s.logoutBtn} onClick={logout}>Выйти</button>
        </div>
      </aside>

      <main className={s.main}>
        <h1 className={s.title}>Панель управления</h1>
        <p className={s.subtitle}>
          Добро пожаловать. Выберите раздел в боковом меню.
        </p>
      </main>
    </div>
  )
}
