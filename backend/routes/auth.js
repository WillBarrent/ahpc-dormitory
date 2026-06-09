import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../prisma/client.js'
import requireAuth from '../middleware/auth.js'

const router = Router()

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { login, password } = req.body

  if (!login || !password) {
    return res.status(400).json({ error: 'Введите логин и пароль' })
  }

  const admin = await prisma.admin.findUnique({ where: { login } })
  if (!admin) {
    return res.status(401).json({ error: 'Неверный логин или пароль' })
  }

  const valid = await bcrypt.compare(password, admin.password)
  if (!valid) {
    return res.status(401).json({ error: 'Неверный логин или пароль' })
  }

  const token = jwt.sign(
    { id: admin.id, login: admin.login },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  )

  res.json({ token, name: admin.name })
})

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  const admin = await prisma.admin.findUnique({
    where: { id: req.admin.id },
    select: { id: true, login: true, name: true },
  })
  res.json(admin)
})

export default router
