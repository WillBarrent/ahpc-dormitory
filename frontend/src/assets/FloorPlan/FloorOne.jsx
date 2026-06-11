import styles from "./FloorPlan.module.css";

export default function FloorOne({ roomMap, onRoomClick, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1283 883" {...props}>
      <title>FloorOne</title>

      {/* Контур здания */}
      <rect
        x="5" y="3" width="1275" height="877.5"
        fill="none" stroke="#000" strokeWidth="5"
      />

      {/* ====== ВЕРХНЯЯ ПОЛОВИНА ====== */}

      {/* Администрация — левое крыло */}
      <path
        className={styles.admin}
        d="M163.5,440.5V319.9H123.4V3.5H2.5v437Z"
        stroke="#000" strokeWidth="5"
      />
      <text transform="translate(25 280) rotate(-90)" fontSize="28" fontFamily="Montserrat" fontWeight="500">
        Администрация
      </text>

      {/* Пост охраны */}
      <path
        className={styles.security}
        d="M122.5,3.5v317h160V3.5Z"
        stroke="#000" strokeWidth="5"
      />
      <text x="202" y="148" textAnchor="middle" fontSize="28" fontFamily="Montserrat" fontWeight="500">Пост</text>
      <text x="202" y="183" textAnchor="middle" fontSize="28" fontFamily="Montserrat" fontWeight="500">охраны</text>

      {/* Вестибюль — центр */}
      <path
        className={styles.mainHall}
        d="M482.7,440.5H644.5V2.5h-242V359.4h80.2Z"
        stroke="#000" strokeWidth="5"
      />
      <text x="523" y="235" textAnchor="middle" fontSize="36" fontFamily="Montserrat" fontWeight="700">Вестибюль</text>

      {/* Зона отдыха — центр-право */}
      <path
        className={styles.lounge}
        d="M643.5,440.5V2.5h239V361.7h-82v78.8Z"
        stroke="#000" strokeWidth="5"
      />
      <text x="763" y="218" textAnchor="middle" fontSize="34" fontFamily="Montserrat" fontWeight="700">Зона</text>
      <text x="763" y="253" textAnchor="middle" fontSize="34" fontFamily="Montserrat" fontWeight="700">отдыха</text>

      {/* Кабинет коменданта */}
      <path
        className={styles.commandant}
        d="M1004.5,3.5v317h158V3.5Z"
        stroke="#000" strokeWidth="5"
      />
      <text x="1083" y="145" textAnchor="middle" fontSize="26" fontFamily="Montserrat" fontWeight="500">Кабинет</text>
      <text x="1083" y="180" textAnchor="middle" fontSize="26" fontFamily="Montserrat" fontWeight="500">коменданта</text>

      {/* Приемная — правое крыло верх */}
      <path
        className={styles.reception}
        d="M1124,442.5v-121h39V4h117.5V442.5Z"
        stroke="#000" strokeWidth="5"
      />
      <text transform="translate(1200 240) rotate(-90)" fontSize="30" fontFamily="Montserrat" fontWeight="500">
        Приемная
      </text>

      {/* ====== НИЖНЯЯ ПОЛОВИНА ====== */}

      {/* Администрация — левое крыло низ */}
      <path
        className={styles.admin}
        d="M163.5,440.5V561.9H123.4V880.5H2.5v-440Z"
        stroke="#000" strokeWidth="5"
      />
      <text transform="translate(25 720) rotate(-90)" fontSize="28" fontFamily="Montserrat" fontWeight="500">
        Администрация
      </text>

      {/* Кухня — низ лево */}
      <path
        className={styles.kitchen}
        d="M322.5,521h-159v40.9H123.4l1.1,318.6h198Z"
        stroke="#000" strokeWidth="5"
      />
      <text x="223" y="735" textAnchor="middle" fontSize="40" fontFamily="Montserrat" fontWeight="700">Кухня</text>

      {/* Буфет — низ право */}
      <path
        className={styles.buffet}
        d="M843.5,524.5H1124v40.4l39,.3V880.5H843.5Z"
        stroke="#000" strokeWidth="5"
      />
      <text x="1003" y="735" textAnchor="middle" fontSize="40" fontFamily="Montserrat" fontWeight="700">Буфет</text>

      {/* Приемная — правое крыло низ */}
      <path
        className={styles.reception}
        d="M1124,442.5V563.4h39V880.5h117.5v-438Z"
        stroke="#000" strokeWidth="5"
      />
      <text transform="translate(1200 680) rotate(-90)" fontSize="30" fontFamily="Montserrat" fontWeight="500">
        Приемная
      </text>

      {/* ====== СЛУЖЕБНЫЕ ПОМЕЩЕНИЯ ====== */}

      {/* Уборная — центр слева */}
      <path
        className={styles.toilet}
        d="M442.5,880.5v-359h-120v359Z"
        stroke="#000" strokeWidth="5"
      />
      <text transform="translate(382 760) rotate(-90)" fontSize="28" fontFamily="Montserrat" fontWeight="500">
        Уборная
      </text>

      {/* Уборная — центр справа */}
      <path
        className={styles.toilet}
        d="M843.5,880.5v-356h-120v356Z"
        stroke="#000" strokeWidth="5"
      />
      <text transform="translate(783 760) rotate(-90)" fontSize="28" fontFamily="Montserrat" fontWeight="500">
        Уборная
      </text>

      {/* Тех. помещение — центр */}
      <path
        className={styles.techRoom}
        d="M564.5,880.5V521H442.9V880.5Z"
        stroke="#000" strokeWidth="5"
      />
      <text transform="translate(503 760) rotate(-90)" fontSize="26" fontFamily="Montserrat" fontWeight="500">
        Тех. помещение
      </text>
    </svg>
  );
}
