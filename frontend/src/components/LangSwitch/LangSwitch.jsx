import { useLanguage } from '../../i18n/LanguageContext.jsx'
import s from './LangSwitch.module.css'

export default function LangSwitch() {
  const { lang, toggle } = useLanguage()

  return (
    <button className={s.button} onClick={toggle}>
      {lang === 'ru' ? 'ҚАЗ' : 'РУС'}
    </button>
  )
}
