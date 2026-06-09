import { Link } from 'react-router-dom'
import LangSwitch from '../LangSwitch/LangSwitch.jsx'
import s from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={s.nav}>
      <Link to="/" className={s.logo}>AHPC Living</Link>
      <LangSwitch />
    </nav>
  )
}
