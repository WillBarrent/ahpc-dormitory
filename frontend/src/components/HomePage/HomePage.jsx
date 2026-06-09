import { Link } from 'react-router-dom'
import useT from '../../i18n/useT.js'
import LangSwitch from '../LangSwitch/LangSwitch.jsx'
import s from './HomePage.module.css'

function IconBuilding() {
  return (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 21V7L12 2L21 7V21H3Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M9 21V15H15V21" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M9 9H9.01M15 9H15.01M12 12H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function IconPhone() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 16.92V19.92C22 20.48 21.56 20.93 21 20.97C20.64 21 20.28 21 19.92 21C10.4 21 3 13.6 3 4.08C3 3.72 3 3.36 3.03 3C3.07 2.44 3.52 2 4.08 2H7.08C7.58 2 8.01 2.37 8.07 2.87C8.13 3.37 8.24 3.86 8.39 4.33C8.52 4.71 8.42 5.14 8.13 5.43L6.69 6.87C8.07 9.54 10.46 11.93 13.13 13.31L14.57 11.87C14.86 11.58 15.29 11.48 15.67 11.61C16.14 11.76 16.63 11.87 17.13 11.93C17.63 11.99 18 12.42 18 12.92V16.92" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

function IconCapacity() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21V19C17 16.79 15.21 15 13 15H5C2.79 15 1 16.79 1 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M23 21V19C23 17.36 21.93 15.96 20.44 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16.44 3.5C17.93 3.96 19 5.36 19 7C19 8.64 17.93 10.04 16.44 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconFloors() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 9H21M3 15H21" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconWifi() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12.55C7.15 10.36 9.44 9.25 12 9.25C14.56 9.25 16.85 10.36 19 12.55" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1.5 9C5.02 5.67 8.42 4 12 4C15.58 4 18.98 5.67 22.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.5 16.05C9.55 15.02 10.72 14.5 12 14.5C13.28 14.5 14.45 15.02 15.5 16.05" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="19.5" r="1" fill="currentColor"/>
    </svg>
  )
}

function IconKitchen() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 2V22H21V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 14H21" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="7" cy="18" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="18" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 2V6M12 2V6M17 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconLaundry() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="2" width="18" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="13" r="5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9.5 12C10.33 11 11.17 10.5 12 11C12.83 11.5 13.67 11 14.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="7" cy="6" r="1" fill="currentColor"/>
      <circle cx="10" cy="6" r="1" fill="currentColor"/>
    </svg>
  )
}

function IconLounge() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 16V12C4 10.34 5.34 9 7 9H17C18.66 9 20 10.34 20 12V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M2 16C2 14.9 2.9 14 4 14V12H6V14H18V12H20V14C21.1 14 22 14.9 22 16V18H2V16Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M4 18V21M20 18V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconSecurity() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L3 7V12C3 17.25 6.75 21.75 12 23C17.25 21.75 21 17.25 21 12V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconStudy() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 19.5V4.5C4 3.67 4.67 3 5.5 3H18.5C19.33 3 20 3.67 20 4.5V19.5C20 20.33 19.33 21 18.5 21H5.5C4.67 21 4 20.33 4 19.5Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 7H16M8 11H16M8 15H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconEmail() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2 7L12 13L22 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function HomePage() {
  const t = useT()

  function scrollToContacts(e) {
    e.preventDefault()
    document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' })
  }

  const amenities = [
    { icon: <IconWifi />, name: t.amenityWifi, desc: t.amenityWifiDesc },
    { icon: <IconKitchen />, name: t.amenityKitchen, desc: t.amenityKitchenDesc },
    { icon: <IconLaundry />, name: t.amenityLaundry, desc: t.amenityLaundryDesc },
    { icon: <IconLounge />, name: t.amenityLounge, desc: t.amenityLoungeDesc },
    { icon: <IconSecurity />, name: t.amenitySecurity, desc: t.amenitySecurityDesc },
    { icon: <IconStudy />, name: t.amenityStudy, desc: t.amenityStudyDesc },
  ]

  const rules = [
    t.ruleCurfew,
    t.ruleOrder,
    t.ruleNoAlcohol,
    t.ruleYears,
    t.ruleStay,
  ]

  return (
    <div className={s.page}>
      {/* HEADER */}
      <header className={s.header}>
        <Link to="/" className={s.logo}>AHPC Living</Link>
        <LangSwitch />
      </header>

      {/* HERO */}
      <section className={s.hero}>
        <div className={s.heroInner}>
          <div className={s.heroText}>
            <div className={s.badge}>{t.badge}</div>
            <h1 className={s.heading}>
              <span className={s.headingLine}>{t.heroLine1}</span>
              <span className={s.headingLine}>{t.heroLine2}</span>
            </h1>
            <p className={s.subtitle}>{t.heroSubtitle}</p>
            <div className={s.actions}>
              <Link to="/floors" className={s.btnPrimary}>
                {t.btnDorm}
                <IconArrow />
              </Link>
              <a href="#contacts" onClick={scrollToContacts} className={s.btnOutline}>
                {t.btnContacts}
              </a>
            </div>
          </div>
          <div className={s.heroVisual}>
            <img
              src="/dormitory.jpg"
              alt="Общежитие АВПК"
              className={s.heroImg}
            />
          </div>
        </div>

        <div className={s.scrollHint}>
          <div className={s.scrollLine} />
        </div>
      </section>

      {/* ABOUT */}
      <section className={s.section}>
        <div className={s.sectionInner}>
          <div className={s.pillWrapper}>
            <span className={s.pill}>{t.aboutPill}</span>
          </div>
          <p className={s.aboutText}>{t.aboutText}</p>
          <div className={s.aboutImages}>
            <div className={s.aboutImgBlock}>
              <img
                src="/dormitory.jpg"
                alt={t.imgCampus}
                className={`${s.aboutImg} ${s.aboutImgTop}`}
              />
            </div>
            <div className={s.aboutImgBlock}>
              <img
                src="https://picsum.photos/seed/ahpc-city/700/500"
                alt={t.imgCity}
                className={s.aboutImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* DORMITORY */}
      <section className={s.section}>
        <div className={s.sectionInner}>
          <div className={s.pillWrapper}>
            <span className={s.pill}>{t.dormPill}</span>
          </div>
          <div className={s.dormCard}>
            <div className={s.dormImage}>
              <img
                src="/dormitory.jpg"
                alt={t.dormTitle}
                className={s.dormImg}
              />
            </div>
            <div className={s.dormInfo}>
              <h3 className={s.dormTitle}>{t.dormTitle}</h3>
              <div className={s.dormDetails}>
                <div className={s.dormDetail}>
                  <span className={s.dormDetailIcon}><IconPin /></span>
                  <div>
                    <span className={s.dormDetailLabel}>{t.dormAddress}</span>
                    <span className={s.dormDetailValue}>{t.dormAddressVal}</span>
                  </div>
                </div>
                <div className={s.dormDetail}>
                  <span className={s.dormDetailIcon}><IconFloors /></span>
                  <div>
                    <span className={s.dormDetailLabel}>{t.dormFloors}</span>
                    <span className={s.dormDetailValue}>{t.dormFloorsVal}</span>
                  </div>
                </div>
                <div className={s.dormDetail}>
                  <span className={s.dormDetailIcon}><IconCapacity /></span>
                  <div>
                    <span className={s.dormDetailLabel}>{t.dormCapacity}</span>
                    <span className={s.dormDetailValue}>{t.dormCapacityVal}</span>
                  </div>
                </div>
              </div>
              <Link to="/floors" className={s.dormLink}>
                {t.dormLink}
                <IconArrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AMENITIES */}
      <section className={s.section}>
        <div className={s.sectionInner}>
          <div className={s.pillWrapper}>
            <span className={s.pill}>{t.amenitiesPill}</span>
          </div>
          <div className={s.amenitiesGrid}>
            {amenities.map((item) => (
              <div className={s.amenityCard} key={item.name}>
                <span className={s.amenityIcon}>{item.icon}</span>
                <h4 className={s.amenityName}>{item.name}</h4>
                <p className={s.amenityDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RULES & PRICING */}
      <section className={s.rulesSection}>
        <div className={s.sectionInner}>
          <div className={s.rulesLayout}>
            <div className={s.rulesBlock}>
              <h2 className={s.rulesTitle}>{t.rulesTitle}</h2>
              <ul className={s.rulesList}>
                {rules.map((rule) => (
                  <li className={s.rulesItem} key={rule}>
                    <span className={s.rulesCheck}><IconCheck /></span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.priceBlock}>
              <span className={s.priceLabel}>{t.priceTitle}</span>
              <span className={s.priceValue}>{t.priceValue}</span>
              <span className={s.priceSub}>{t.priceLabel}</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className={s.processSection}>
        <div className={s.sectionInner}>
          <h2 className={s.processTitle}>{t.processTitle}</h2>
          <p className={s.processText}>{t.processText}</p>
          <Link to="/floors" className={s.btnPrimary}>
            {t.processBtn}
            <IconArrow />
          </Link>
        </div>
      </section>

      {/* CONTACTS */}
      <section className={s.contactSection} id="contacts">
        <div className={s.sectionInner}>
          <h2 className={s.contactTitle}>{t.contactsTitle}</h2>
          <div className={s.contactGrid}>
            <div className={s.contactCard}>
              <div className={s.contactCardHeader}>
                <span className={s.contactIcon}><IconPhone /></span>
                <span className={s.contactCardLabel}>{t.contactLabel}</span>
              </div>
              <p className={s.contactDesc}>{t.contactDesc}</p>
              <p className={s.contactValue}>+7 (771) 143 12 02</p>
              <div className={s.contactDivider} />
              <div className={s.contactCardHeader}>
                <span className={s.contactIcon}><IconPhone /></span>
                <span className={s.contactCardLabel}>{t.contactTrust}</span>
              </div>
              <p className={s.contactValue}>+7 (7132) 576 491</p>
              <div className={s.contactDivider} />
              <div className={s.contactCardHeader}>
                <span className={s.contactIcon}><IconEmail /></span>
                <span className={s.contactCardLabel}>{t.contactEmail}</span>
              </div>
              <p className={s.contactValue}>info@apk-edu.kz</p>
              <div className={s.contactDivider} />
              <div className={s.contactAddress}>
                <span className={s.contactIcon}><IconPin /></span>
                <span>{t.contactAddressFull}</span>
              </div>
            </div>
            <div className={s.contactCard}>
              <div className={s.contactCardHeader}>
                <span className={s.contactIcon}><IconClock /></span>
                <span className={s.contactCardLabel}>{t.scheduleLabel}</span>
              </div>
              <div className={s.scheduleBlock}>
                <p className={s.scheduleLabel}>{t.weekdays}</p>
                <p className={s.scheduleValue}>{t.weekdaysVal}</p>
              </div>
              <div className={s.scheduleBlock}>
                <p className={s.scheduleLabel}>{t.weekends}</p>
                <p className={s.scheduleValue}>{t.weekendsVal}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={s.footer}>
        <span className={s.footerLogo}>AHPC Living</span>
        <span className={s.footerCopy}>{t.footerCopy}</span>
      </footer>
    </div>
  )
}
