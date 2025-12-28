import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { PrismaClient } from '../../../../prisma/node_modules/@prisma/client'
import { generateAccessToken, generateRefreshToken } from './jwt'

const prisma = new PrismaClient()

// Configure GitHub OAuth Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5001/api/auth/github/callback',
        scope: ['user:email'],
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          // Extract email from profile
          const email = profile.emails?.[0]?.value || `${profile.username}@github.oauth`
          const avatar = profile.photos?.[0]?.value

          // Find or create user
          let user = await prisma.user.findFirst({
            where: {
              OR: [
                { email },
                { githubId: profile.id },
              ],
            },
          })

          if (user) {
            // Update GitHub ID if not set
            if (!user.githubId) {
              user = await prisma.user.update({
                where: { id: user.id },
                data: { githubId: profile.id },
              })
            }
          } else {
            // Create new user
            user = await prisma.user.create({
              data: {
                email,
                username: profile.username || email.split('@')[0],
                firstName: profile.displayName?.split(' ')[0] || profile.username,
                lastName: profile.displayName?.split(' ').slice(1).join(' ') || '',
                avatar,
                githubId: profile.id,
                emailVerified: true, // OAuth users are pre-verified
              },
            })
          }

          return done(null, user)
        } catch (error) {
          return done(error, null)
        }
      }
    )
  )
}

// Configure Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/auth/google/callback',
        scope: ['profile', 'email'],
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          const email = profile.emails?.[0]?.value
          const avatar = profile.photos?.[0]?.value

          if (!email) {
            return done(new Error('No email found in Google profile'), null)
          }

          // Find or create user
          let user = await prisma.user.findFirst({
            where: {
              OR: [
                { email },
                { googleId: profile.id },
              ],
            },
          })

          if (user) {
            // Update Google ID if not set
            if (!user.googleId) {
              user = await prisma.user.update({
                where: { id: user.id },
                data: { googleId: profile.id },
              })
            }
          } else {
            // Create new user
            user = await prisma.user.create({
              data: {
                email,
                username: email.split('@')[0],
                firstName: profile.name?.givenName || '',
                lastName: profile.name?.familyName || '',
                avatar,
                googleId: profile.id,
                emailVerified: true, // OAuth users are pre-verified
              },
            })
          }

          return done(null, user)
        } catch (error) {
          return done(error, null)
        }
      }
    )
  )
}

export default passport
