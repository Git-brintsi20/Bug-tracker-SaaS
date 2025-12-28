import { Router } from 'express'
import { register, login, refresh, me, logout, oauthSuccess } from '../controllers/authController'
import { authenticate } from '../middleware/auth'
import passport from '../utils/passport'

const router = Router()

// Regular auth routes
router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)
router.post('/logout', logout)
router.get('/me', authenticate, me)

// GitHub OAuth routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }))
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/auth/login' }),
  oauthSuccess
)

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/login' }),
  oauthSuccess
)

export default router
