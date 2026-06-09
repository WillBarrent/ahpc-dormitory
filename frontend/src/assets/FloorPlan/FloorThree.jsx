import styles from "./FloorPlan.module.css";

export default function FloorThree({ roomMap = {}, onRoomClick }) {
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1283.5 882.5">
      <title>FloorThree</title>
      <rect
        x="3"
        y="2.5"
        width="1278"
        height="877.5"
        fill="none"
        stroke="#000"
        strokeWidth="5"
      />

      {/* Room 305 */}
      <g onClick={() => click(305)} style={{ cursor: 'pointer' }}>
        <rect
          className={cls(305)}
          x="363"
          y="2.5"
          width="273.5"
          height="435"
          stroke="#000"
          strokeWidth="5"
        />
        <text transform="translate(478 249.28)" fontSize="32" fontWeight="bold" fontFamily="Montserrat">305</text>
      </g>

      {/* Room 306 */}
      <g onClick={() => click(306)} style={{ cursor: 'pointer' }}>
        <path
          className={cls(306)}
          d="M918,2.5v435H636.5V2.5Z"
          stroke="#000"
          strokeWidth="5"
        />
        <text transform="translate(760.5 249.28)" fontSize="32" fontWeight="bold" fontFamily="Montserrat">306</text>
      </g>

      {/* Room 304 */}
      <g onClick={() => click(304)} style={{ cursor: 'pointer' }}>
        <rect
          className={cls(304)}
          x="3"
          y="2.5"
          width="235.8"
          height="435"
          stroke="#000"
          strokeWidth="5"
        />
        <text transform="translate(93 249.28)" fontSize="32" fontWeight="bold" fontFamily="Montserrat">304</text>
      </g>

      {/* Room 307 */}
      <g onClick={() => click(307)} style={{ cursor: 'pointer' }}>
        <rect
          className={cls(307)}
          x="1045.1"
          y="2.5"
          width="235.9"
          height="437.5"
          stroke="#000"
          strokeWidth="5"
        />
        <text transform="translate(1141.84 249.28)" fontSize="32" fontWeight="bold" fontFamily="Montserrat">307</text>
      </g>

      {/* Non-residential areas */}
      <path
        className={styles.nonResidental}
        d="M2.5,880h357V520.9H239V439H2.5Z"
        stroke="#000"
        strokeWidth="5"
      />
      <path
        className={styles.nonResidental}
        d="M838,880V521.1h207.4V440H1281V880Z"
        stroke="#000"
        strokeWidth="5"
      />

      {/* Toilets */}
      <path
        className={styles.toilet}
        d="M478,520.5V880H359.5V520.5Z"
        stroke="#000"
        strokeWidth="5"
      />
      <path
        className={styles.toilet}
        d="M838,520.6V880H683V520.6Z"
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

      <text transform="translate(950 691.28)" fontSize="32" fontWeight="500" fontFamily="Montserrat">Актовый зал</text>
      <text transform="translate(50 700.3)" fontSize="32" fontWeight="500" fontFamily="Montserrat">Администрация</text>
      <text transform="translate(433.34 780) rotate(-90)" fontSize="32" fontWeight="500" fontFamily="Montserrat">Уборная</text>
      <text transform="translate(769.89 780) rotate(-90)" fontSize="32" fontWeight="500" fontFamily="Montserrat">Уборная</text>
      <text transform="translate(547.89 825) rotate(-90)" fontSize="32" fontWeight="500" fontFamily="Montserrat">Тех. помещение</text>
    </svg>
  );
}
