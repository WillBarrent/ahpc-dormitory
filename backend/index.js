import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import roomRoutes from './routes/rooms.js'
import studentRoutes from './routes/students.js'
import paymentRoutes from './routes/payments.js'
import statsRoutes from './routes/stats.js'
import bookingRoutes from './routes/bookings.js'
import activityRoutes from './routes/activity.js'
import importRoutes from './routes/import.js'
import absenceRoutes from './routes/absences.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/activity', activityRoutes)
app.use('/api/import', importRoutes)
app.use('/api/absences', absenceRoutes)

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Внутренняя ошибка сервера' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
