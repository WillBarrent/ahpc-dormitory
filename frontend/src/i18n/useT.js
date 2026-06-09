import { useLanguage } from './LanguageContext.jsx'
import translations from './translations.js'

export default function useT() {
  const { lang } = useLanguage()
  return translations[lang]
}
