import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { removeToken } from '../utils/api'
import styles from './Layout.module.css'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Главная', icon: 'dashboard' },
  { to: '/students',  label: 'Студенты', icon: 'students' },
  { to: '/bookings',  label: 'Бронирования', icon: 'bookings' },
  { to: '/leaves',    label: 'Убытия', icon: 'leaves' },
  { to: '/rooms',     label: 'Комнаты', icon: 'rooms' },
  { to: '/payments',  label: 'Оплата', icon: 'payments' },
]

function NavIcon({ name }) {
  switch (name) {
    case 'dashboard':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
      )
    case 'students':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="9" cy="7" r="4"/>
          <path d="M1 21v-2c0-2.2 3.6-4 8-4s8 1.8 8 4v2"/>
          <path d="M17 9c1.7 0 3 1.3 3 3s-1.3 3-3 3"/>
          <path d="M23 21v-2c0-1.1-.9-2.3-2.4-3.2"/>
        </svg>
      )
    case 'bookings':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <path d="M16 2v4M8 2v4M3 10h18"/>
          <path d="M9 14h.01M12 14h.01M15 14h.01"/>
        </svg>
      )
    case 'leaves':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M17 8l4 4-4 4"/>
          <path d="M3 12h16"/>
          <path d="M11 4l-4 4 4 4"/>
        </svg>
      )
    case 'rooms':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M3 21V7l9-5 9 5v14"/>
          <path d="M9 21v-6h6v6"/>
          <rect x="9" y="8" width="2" height="2" rx="0.5"/>
          <rect x="13" y="8" width="2" height="2" rx="0.5"/>
        </svg>
      )
    case 'payments':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <rect x="2" y="5" width="20" height="14" rx="2"/>
          <path d="M2 10h20"/>
          <circle cx="6" cy="15" r="1.5" fill="currentColor"/>
          <circle cx="10" cy="15" r="1.5" fill="currentColor"/>
        </svg>
      )
    default:
      return null
  }
}

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
        <div className={styles.logo}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 21V7l9-5 9 5v14"/>
            <path d="M9 21v-6h6v6"/>
            <path d="M12 10v2"/>
          </svg>
          <div>
            <span className={styles.logoTitle}>АВПК</span>
            <span className={styles.logoSub}>Общежитие</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              <NavIcon name={item.icon} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Выйти
        </button>
      </aside>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}
