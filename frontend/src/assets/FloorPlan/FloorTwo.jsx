import styles from "./FloorPlan.module.css";

export default function FloorTwo({ roomMap = {}, onRoomClick }) {
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1283 883">
      <rect
        x="5"
        y="3"
        width="1275"
        height="877.5"
        fill="none"
        stroke="#000"
        strokeWidth="5"
      />

      {/* Room 207 */}
      <g onClick={() => click(207)} style={{ cursor: 'pointer' }}>
        <path
          className={cls(207)}
          d="M482.7,440.5H644.5V2.5h-242V359.4h80.2Z"
          stroke="#000"
          strokeWidth="5"
        />
        <text transform="translate(494.51 207.27)" fontSize="36" fontFamily="Montserrat" fontWeight="700">207</text>
      </g>

      {/* Room 209 */}
      <g onClick={() => click(209)} style={{ cursor: 'pointer' }}>
        <path
          className={cls(209)}
          d="M1004.5,3.5v317h158V3.5Z"
          stroke="#000"
          strokeWidth="5"
        />
        <text transform="translate(1053.1 185.1)" fontSize="36" fontFamily="Montserrat" fontWeight="700">209</text>
      </g>

      {/* Room 206 */}
      <g onClick={() => click(206)} style={{ cursor: 'pointer' }}>
        <path
          className={cls(206)}
          d="M122.5,3.5v317h160V3.5Z"
          stroke="#000"
          strokeWidth="5"
        />
        <text transform="translate(170.61 185.1)" fontSize="36" fontFamily="Montserrat" fontWeight="700">206</text>
      </g>

      {/* Room 208 */}
      <g onClick={() => click(208)} style={{ cursor: 'pointer' }}>
        <path
          className={cls(208)}
          d="M643.5,440.5V2.5h239V361.7h-82v78.8Z"
          stroke="#000"
          strokeWidth="5"
        />
        <text transform="translate(732.54 207.27)" fontSize="36" fontFamily="Montserrat" fontWeight="700">208</text>
      </g>

      {/* Room 210 */}
      <g onClick={() => click(210)} style={{ cursor: 'pointer' }}>
        <path
          className={cls(210)}
          d="M1124,442.5v-121h39V4h117.5V442.5Z"
          stroke="#000"
          strokeWidth="5"
        />
        <text transform="translate(1188.46 221.5)" fontSize="36" fontFamily="Montserrat" fontWeight="700">210</text>
      </g>

      {/* Room 205 */}
      <g onClick={() => click(205)} style={{ cursor: 'pointer' }}>
        <path
          className={cls(205)}
          d="M163.5,440.5V319.9H123.4V3.5H2.5v437Z"
          stroke="#000"
          strokeWidth="5"
        />
        <text transform="translate(32.98 242.81)" fontSize="36" fontFamily="Montserrat" fontWeight="700">205</text>
      </g>

      {/* Room 211 */}
      <g onClick={() => click(211)} style={{ cursor: 'pointer' }}>
        <path
          className={cls(211)}
          d="M1124,442.5V563.4h39V880.5h117.5v-438Z"
          stroke="#000"
          strokeWidth="5"
        />
        <text transform="translate(1188.46 661.5)" fontSize="36" fontFamily="Montserrat" fontWeight="700">211</text>
      </g>

      {/* Room 204 */}
      <g onClick={() => click(204)} style={{ cursor: 'pointer' }}>
        <path
          className={cls(204)}
          d="M163.5,440.5V561.9H123.4V880.5H2.5v-440Z"
          stroke="#000"
          strokeWidth="5"
        />
        <text transform="translate(32.98 661.5)" fontSize="36" fontFamily="Montserrat" fontWeight="700">204</text>
      </g>

      {/* Room 203 */}
      <g onClick={() => click(203)} style={{ cursor: 'pointer' }}>
        <path
          className={cls(203)}
          d="M322.5,521h-159v40.9H123.4l1.1,318.6h198Z"
          stroke="#000"
          strokeWidth="5"
        />
        <text transform="translate(202.5 710.19)" fontSize="36" fontFamily="Montserrat" fontWeight="700">203</text>
      </g>

      {/* Room 212 */}
      <g onClick={() => click(212)} style={{ cursor: 'pointer' }}>
        <path
          className={cls(212)}
          d="M843.5,521H1124v40.8l39,.3V880.5H843.5Z"
          stroke="#000"
          strokeWidth="5"
        />
        <text transform="translate(974.87 710.19)" fontSize="36" fontFamily="Montserrat" fontWeight="700">212</text>
      </g>

      {/* Tech room */}
      <path
        className={styles.techRoom}
        d="M564.5,880.5V521H442.9V880.5Z"
        stroke="#000"
        strokeWidth="5"
      />
      {/* Toilets */}
      <path
        className={styles.toilet}
        d="M442.5,880.5v-359h-120v359Z"
        stroke="#000"
        strokeWidth="5"
      />
      <path
        className={styles.toilet}
        d="M843.5,880.5V521h-120V880.5Z"
        stroke="#000"
        strokeWidth="5"
      />

      <text transform="translate(395 761.83) rotate(-90)" fontSize="32" fontWeight="500" fontFamily="Montserrat">Уборная</text>
      <text transform="translate(795 761.83) rotate(-90)" fontSize="32" fontWeight="500" fontFamily="Montserrat">Уборная</text>
      <text transform="translate(516.89 825) rotate(-90)" fontSize="32" fontWeight="500" fontFamily="Montserrat">Тех. помещение</text>
    </svg>
  );
}
