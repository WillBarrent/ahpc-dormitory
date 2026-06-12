import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from '../components/HomePage/HomePage.jsx'
import Navbar from '../components/Navbar/Navbar.jsx'
import FloorSelector from '../components/FloorSelector/FloorSelector.jsx'
import RoomView from '../components/RoomView/RoomView.jsx'
import BookingForm from '../components/BookingForm/BookingForm.jsx'
import BookingSuccess from '../components/BookingSuccess/BookingSuccess.jsx'
import BookingStatusPage from '../components/BookingStatusPage/BookingStatusPage.jsx'
import useT from '../i18n/useT.js'
import { fetchRoomMap } from '../data/roomsData.js'
import FloorOne from '../assets/FloorPlan/FloorOne.jsx'
import FloorTwo from '../assets/FloorPlan/FloorTwo.jsx'
import FloorThree from '../assets/FloorPlan/FloorThree.jsx'
import FloorFour from '../assets/FloorPlan/FloorFour.jsx'
import FloorFive from '../assets/FloorPlan/FloorFive.jsx'
import s from './App.module.css'

const FLOOR_PLANS = {
  1: FloorOne,
  2: FloorTwo,
  3: FloorThree,
  4: FloorFour,
  5: FloorFive,
}

function FloorsPage() {
  const [activeFloor, setActiveFloor] = useState(2)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [bookingBed, setBookingBed] = useState(null)
  const [submittedBooking, setSubmittedBooking] = useState(null)
  const [legendOpen, setLegendOpen] = useState(false)
  const [roomMap, setRoomMap] = useState({})
  const t = useT()

  useEffect(() => {
    fetchRoomMap(activeFloor).then(setRoomMap)
  }, [activeFloor])

  const Floor = FLOOR_PLANS[activeFloor]

  function handleFloorChange(floor) {
    setActiveFloor(floor)
    setSelectedRoom(null)
    setBookingBed(null)
    setSubmittedBooking(null)
  }

  function handleRoomClick(roomNumber) {
    setSelectedRoom(roomMap[roomNumber] || null)
    setBookingBed(null)
    setSubmittedBooking(null)
  }

  function handleBook(bedNumber) {
    setBookingBed(bedNumber)
  }

  function handleBookingSuccess(booking) {
    setSubmittedBooking(booking)
    setBookingBed(null)
    fetchRoomMap(activeFloor).then(setRoomMap)
  }

  function handleBookingCancel() {
    setBookingBed(null)
  }

  function handleBackToFloorPlan() {
    setSelectedRoom(null)
    setBookingBed(null)
    setSubmittedBooking(null)
  }

  return (
    <div className={s.app}>
      <Navbar />

      <div className={s.content}>
        <FloorSelector activeFloor={activeFloor} onSelect={handleFloorChange} />

        <main className={s.main}>
          {submittedBooking ? (
            <div className={s.roomView}>
              <BookingSuccess
                room={selectedRoom}
                bedNumber={submittedBooking.bedNumber}
                onBack={handleBackToFloorPlan}
              />
            </div>
          ) : selectedRoom && bookingBed ? (
            <div className={s.roomView}>
              <BookingForm
                room={selectedRoom}
                bedNumber={bookingBed}
                onSuccess={handleBookingSuccess}
                onCancel={handleBookingCancel}
              />
            </div>
          ) : selectedRoom ? (
            <div className={s.roomView}>
              <RoomView
                room={selectedRoom}
                onBack={() => setSelectedRoom(null)}
                onBook={handleBook}
              />
            </div>
          ) : (
            <>
              <div className={s.floorPlan}>
                <Floor roomMap={roomMap} onRoomClick={handleRoomClick} />
              </div>
              <div className={s.legend}>
                <button className={s.legendToggle} onClick={() => setLegendOpen(prev => !prev)}>
                  {legendOpen ? '▾' : '▸'} {t.legendTitle}
                </button>
                {legendOpen && (
                  <div className={s.legendItems}>
                    <div className={s.legendItem}><span className={`${s.legendColor} ${s.legendFree}`} />{t.legendFree}</div>
                    <div className={s.legendItem}><span className={`${s.legendColor} ${s.legendReserved}`} />{t.legendReserved}</div>
                    <div className={s.legendItem}><span className={`${s.legendColor} ${s.legendOccupied}`} />{t.legendOccupied}</div>
                    <div className={s.legendItem}><span className={`${s.legendColor} ${s.legendNonResidental}`} />{t.legendNonResidental}</div>
                    <div className={s.legendItem}><span className={`${s.legendColor} ${s.legendToilet}`} />{t.legendToilet}</div>
                    <div className={s.legendItem}><span className={`${s.legendColor} ${s.legendTech}`} />{t.legendTech}</div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/floors" element={<FloorsPage />} />
      <Route path="/booking-status" element={<BookingStatusPage />} />
    </Routes>
  )
}
