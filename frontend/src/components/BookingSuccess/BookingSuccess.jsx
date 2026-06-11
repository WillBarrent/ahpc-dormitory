import s from './BookingSuccess.module.css'

export default function BookingSuccess({ room, bedNumber, onBack }) {
  return (
    <div className={s.card}>
      <div className={s.icon}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h2 className={s.title}>Заявка отправлена!</h2>
      <p className={s.text}>
        Вы забронировали место <strong>{bedNumber}</strong> в комнате{' '}
        <strong>{room.number}</strong>.
      </p>
      <p className={s.subtext}>
        Администратор рассмотрит вашу заявку и свяжется с вами.
      </p>
      <button onClick={onBack} className={s.backButton}>
        К планировке
      </button>
    </div>
  )
}
