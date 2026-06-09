import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import styles from './RoomsPage.module.css'

const FLOORS = [2, 3, 4, 5]

const TYPE_LABELS = {
  RESIDENTIAL: 'Жилая',
  NON_RESIDENTIAL: 'Нежилая',
  TOILET: 'Санузел',
  TECH: 'Техническая',
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [floor, setFloor] = useState(2)
  const [loading, setLoading] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [roomDetail, setRoomDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    api(`/rooms?floor=${floor}`).then((data) => {
      setRooms(data)
      setLoading(false)
    })
  }, [floor])

  const handleFloorChange = (f) => {
    setFloor(f)
    setSelectedRoom(null)
    setRoomDetail(null)
  }

  const handleRoomClick = async (room) => {
    setSelectedRoom(room)
    setDetailLoading(true)
    const detail = await api(`/rooms/${room.id}`)
    setRoomDetail(detail)
    setDetailLoading(false)
  }

  const handleBack = () => {
    setSelectedRoom(null)
    setRoomDetail(null)
  }

  const getStatusClass = (occupied, total) => {
    if (occupied === 0) return styles.statusFree
    if (occupied >= total) return styles.statusOccupied
    return styles.statusPartial
  }

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Комнаты</h1>
      </div>

      <div className={styles.floorSelector}>
        <span className={styles.floorLabel}>Этаж</span>
        {FLOORS.map((f) => (
          <button
            key={f}
            className={`${styles.floorBtn} ${floor === f ? styles.floorBtnActive : ''}`}
            onClick={() => handleFloorChange(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : selectedRoom && roomDetail ? (
          <RoomDetailView
            room={selectedRoom}
            detail={roomDetail}
            onBack={handleBack}
          />
        ) : selectedRoom && detailLoading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : (
          <div className={styles.grid}>
            {rooms.map((room) => (
              <div
                key={room.id}
                className={styles.card}
                onClick={() => handleRoomClick(room)}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.roomNumber}>№{room.number}</span>
                  <span
                    className={
                      room.type === 'RESIDENTIAL'
                        ? styles.typeResidential
                        : room.type === 'TOILET'
                          ? styles.typeToilet
                          : room.type === 'TECH'
                            ? styles.typeTech
                            : styles.typeNonResidential
                    }
                  >
                    {TYPE_LABELS[room.type]}
                  </span>
                </div>

                {room.type === 'RESIDENTIAL' && (
                  <div className={styles.occupancy}>
                    <span className={styles.occupancyText}>
                      <span className={getStatusClass(room.occupiedBeds, room.totalBeds)}>
                        {room.occupiedBeds}
                      </span>
                      {' / '}{room.totalBeds} мест
                    </span>
                    <div className={styles.bedDots}>
                      {Array.from({ length: room.totalBeds }).map((_, i) => (
                        <span
                          key={i}
                          className={`${styles.dot} ${i < room.occupiedBeds ? styles.dotOccupied : styles.dotFree}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function RoomDetailView({ room, detail, onBack }) {
  const occupiedBeds = detail.students.length
  const freeBeds = detail.totalBeds - occupiedBeds

  const occupiedBedNumbers = detail.students
    .map((s) => s.bedNumber)
    .filter((n) => n != null)

  const beds = Array.from({ length: detail.totalBeds }, (_, i) => {
    const bedNum = i + 1
    const student = detail.students.find((s) => s.bedNumber === bedNum)
    return { number: bedNum, student }
  })

  return (
    <div className={styles.detail}>
      <div className={styles.detailTop}>
        <button onClick={onBack} className={styles.backBtn}>← Назад</button>
      </div>

      <div className={styles.detailBody}>
        <div className={styles.detailSidebar}>
          <p className={styles.detailLabel}>Комната</p>
          <h2 className={styles.detailNumber}>{detail.number}</h2>
          <p className={styles.detailMeta}>
            <span className={styles.detailFree}>{freeBeds}</span> свободно · {detail.totalBeds} мест
          </p>

          <div className={styles.detailInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Этаж</span>
              <span className={styles.infoValue}>{detail.floor}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Тип</span>
              <span className={styles.infoValue}>{TYPE_LABELS[detail.type]}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Заселено</span>
              <span className={styles.infoValue}>{occupiedBeds} из {detail.totalBeds}</span>
            </div>
          </div>
        </div>

        <div className={styles.bedsSection}>
          <h3 className={styles.bedsTitle}>Места</h3>
          <div className={styles.bedsGrid}>
            {beds.map((bed) => (
              <div
                key={bed.number}
                className={`${styles.bedCard} ${bed.student ? styles.bedCardOccupied : ''}`}
              >
                <div className={styles.bedNumber}>Место {bed.number}</div>
                {bed.student ? (
                  <div className={styles.bedStudent}>
                    <span className={styles.studentName}>{bed.student.fullName}</span>
                    <span className={styles.studentInfo}>
                      {bed.student.course} курс · {bed.student.group}
                    </span>
                  </div>
                ) : (
                  <div className={styles.bedFree}>Свободно</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
