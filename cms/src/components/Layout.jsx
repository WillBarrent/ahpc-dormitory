import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { removeToken } from '../utils/api'
import styles from './Layout.module.css'

export default function Layout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    removeToken()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    isActive ? styles.navLinkActive : styles.navLink

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>АВПК CMS</div>
        <nav className={styles.nav}>
          <NavLink to="/dashboard" className={linkClass}>
            Главная
          </NavLink>
          <NavLink to="/students" className={linkClass}>
            Студенты
          </NavLink>
          <NavLink to="/rooms" className={linkClass}>
            Комнаты
          </NavLink>
          <NavLink to="/payments" className={linkClass}>
            Оплата
          </NavLink>
        </nav>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Выйти
        </button>
      </aside>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}
