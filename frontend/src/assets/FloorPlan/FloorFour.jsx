import styles from "./FloorPlan.module.css";

export default function FloorFour({ roomMap = {}, onRoomClick }) {
  function cls(roomNumber) {
    const status = roomMap[roomNumber]?.status
    if (status === 'occupied') return `${styles.room} ${styles.occupied}`
    if (status === 'reserved') return `${styles.room} ${styles.reserved}`
    return styles.room
  }

  function click(roomNumber) {
    if (onRoomClick) onRoomClick(roomNumber)
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1283.5 880">
      <title>FloorFour</title>
      <rect
        x="3"
        y="2.5"
        width="1278"
        height="877.5"
        fill="none"
        stroke="#000"
        strokeWidth="5"
      />

      {/* Room 405 */}
      <g onClick={() => click(405)} style={{ cursor: 'pointer' }}>
        <rect
          className={cls(405)}
          x="363"
          y="2.5"
          width="273.5"
          height="435"
          stroke="#000"
          strokeWidth="5"
        />
        <text transform="translate(478 221.25)" fontSize="32" fontFamily="Montserrat" fontWeight="700">405</text>
      </g>

      {/* Room 406 */}
      <g onClick={() => click(406)} style={{ cursor: 'pointer' }}>
        <path
          className={cls(406)}
          d="M918,2.5v435H636.5V2.5Z"
          stroke="#000"
          strokeWidth="5"
        />
        <text transform="translate(750 221.25)" fontSize="32" fontFamily="Montserrat" fontWeight="700">406</text>
      </g>

      {/* Room 404 */}
      <g onClick={() => click(404)} style={{ cursor: 'pointer' }}>
        <rect
          className={cls(404)}
          x="2.5"
          y="2.5"
          width="235.5"
          height="436.5"
          stroke="#000"
          strokeWidth="5"
        />
        <text transform="translate(95 221.25)" fontSize="32" fontFamily="Montserrat" fontWeight="700">404</text>
      </g>

      {/* Room 407 */}
      <g onClick={() => click(407)} style={{ cursor: 'pointer' }}>
        <rect
          className={cls(407)}
          x="1044.8"
          y="2.5"
          width="236.2"
          height="437.5"
          stroke="#000"
          strokeWidth="5"
        />
        <text transform="translate(1135 221.25)" fontSize="32" fontFamily="Montserrat" fontWeight="700">407</text>
      </g>

      {/* Room 403 */}
      <g onClick={() => click(403)} style={{ cursor: 'pointer' }}>
        <path
          className={cls(403)}
          d="M2.5,880H239V520.94L238,439H2.5Z"
          stroke="#000"
          strokeWidth="5"
        />
        <text transform="translate(95 658.5)" fontSize="32" fontFamily="Montserrat" fontWeight="700">403</text>
      </g>

      {/* Room 402 */}
      <g onClick={() => click(402)} style={{ cursor: 'pointer' }}>
        <path
          className={cls(402)}
          d="M359.5,520.5V880H239V520.5Z"
          stroke="#000"
          strokeWidth="5"
        />
        <text transform="translate(270 704.28)" fontSize="32" fontFamily="Montserrat" fontWeight="700">402</text>
      </g>

      {/* Room 409 */}
      <g onClick={() => click(409)} style={{ cursor: 'pointer' }}>
        <path
          className={cls(409)}
          d="M1044.8,520.5V880H838V520.5Z"
          stroke="#000"
          strokeWidth="5"
        />
        <text transform="translate(915 699)" fontSize="32" fontFamily="Montserrat" fontWeight="700">409</text>
      </g>

      {/* Room 408 */}
      <g onClick={() => click(408)} style={{ cursor: 'pointer' }}>
        <path
          className={cls(408)}
          d="M1044.8,880V440H1281V880Z"
          stroke="#000"
          strokeWidth="5"
        />
        <text transform="translate(1135 658.5)" fontSize="32" fontFamily="Montserrat" fontWeight="700">408</text>
      </g>

      {/* Toilets */}
      <path
        className={styles.toilet}
        d="M478,520.5V880H359.5V520.5Z"
        stroke="#000"
        strokeWidth="5"
      />
      <path
        className={styles.toilet}
        d="M838,520.5V880H683V520.5Z"
        stroke="#000"
        strokeWidth="5"
      />

      {/* Tech room */}
      <path
        className={styles.techRoom}
        d="M598,520.5V880H478V520.5Z"
        stroke="#000"
        strokeWidth="5"
      />

      <text transform="translate(545.15 825) rotate(-90)" fontSize="32" fontWeight="500" fontFamily="Montserrat">Тех. помещение</text>
      <text transform="translate(428.89 772.57) rotate(-90)" fontSize="32" fontWeight="500" fontFamily="Montserrat">Уборная</text>
      <text transform="translate(768.89 772.57) rotate(-90)" fontSize="32" fontWeight="500" fontFamily="Montserrat">Уборная</text>
    </svg>
  );
}
