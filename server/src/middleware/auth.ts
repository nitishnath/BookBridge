import type { Context } from 'hono'
import { verifyToken } from '../utils/auth.js'

export async function authMiddleware(c: Context, next: () => Promise<void>) {
  try {
    // Try to get token from cookie first
    const cookieHeader = c.req.header('Cookie')
    console.log('Cookie header received:', cookieHeader)
    
    // If no cookies, check if there's an authorization header (for backward compatibility)
    if (!cookieHeader || !cookieHeader.includes('token=')) {
      const authHeader = c.req.header('Authorization')
      console.log('No token cookie found, checking Authorization header:', authHeader)
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('No valid authorization header found')
        return c.json({ error: 'Unauthorized - No token provided' }, 401)
      }
      
      const token = authHeader.split(' ')[1]
      
      if (!token) {
        console.log('No token found in authorization header')
        return c.json({ error: 'Unauthorized - No token provided' }, 401)
      }
      
      try {
        console.log('Verifying token from header:', token.substring(0, 10) + '...')
        const decoded = verifyToken(token)
        console.log('Token verified successfully. User ID:', decoded.id)
        c.set('userId', decoded.id)
        await next()
      } catch (error) {
        console.error('Token verification failed:', error)
        return c.json({ error: 'Unauthorized - Invalid token' }, 401)
      }
    } else {
      // Extract token from cookie
      const tokenCookie = cookieHeader
        .split(';')
        .find(cookie => cookie.trim().startsWith('token='))
      
      if (!tokenCookie) {
        console.log('No token cookie found despite Cookie header containing "token="')
        return c.json({ error: 'Unauthorized - No token provided' }, 401)
      }
      
      const token = tokenCookie.split('=')[1].trim()
      
      try {
        console.log('Verifying token from cookie:', token.substring(0, 10) + '...')
        const decoded = verifyToken(token)
        console.log('Token verified successfully. User ID:', decoded.id)
        c.set('userId', decoded.id)
        await next()
      } catch (error) {
        console.error('Token verification failed:', error)
        return c.json({ error: 'Unauthorized - Invalid token' }, 401)
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return c.json({ error: 'Server error' }, 500)
  }
} 