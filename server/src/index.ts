import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import connectDB from './db/db.js'
import { User } from './db/schema/User.js'
import { Book } from './db/schema/Book.js'
import { hashPassword, comparePassword, generateToken } from './utils/auth.js'
import { generateBookSummary } from './utils/openai.js'
import { authMiddleware } from './middleware/auth.js'
import dotenv from 'dotenv'
import { Types } from 'mongoose'

// Load environment variables
dotenv.config()

// Connect to MongoDB
connectDB()

const app = new Hono()

// Use CORS middleware with proper configuration for credentials
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Frontend URLs
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Important for cookies
  exposeHeaders: ['Set-Cookie'], // Allow client to see Set-Cookie header
  maxAge: 86400, // 24 hours
}))

// Set secure cookie - helper function
const setAuthCookie = (c: any, token: string) => {
  // Determine if in production or development
  const isProduction = process.env.NODE_ENV === 'production'
  
  // Set the cookie
  c.header('Set-Cookie', 
    `token=${token}; ` +
    `HttpOnly; ` +
    `Path=/; ` +
    `Max-Age=${60 * 60 * 24 * 7}; ` + // 7 days
    `SameSite=${isProduction ? 'None' : 'Lax'}; ` +
    `${isProduction ? 'Secure;' : ''}`
  )
}

// User registration
app.post('/api/signup', async (c) => {
  try {
    const { username, email, password } = await c.req.json()
    
    // Validate input
    if (!username) {
      return c.json({ error: 'Username is required' }, 400)
    } else if (!email) {
      return c.json({ error: 'Email is required' }, 400)
    } else if (!password) {
      return c.json({ error: 'Password is required' }, 400)
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }]
    })
    
    if (existingUser) {
      return c.json({ error: 'User already exists with that email or username' }, 400)
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password)
    
    // Create user
    const user = await User.create({ 
      username, 
      email, 
      password: hashedPassword 
    })
    
    // Generate token
    const userId = user._id?.toString() || ''
    const token = generateToken(userId)
    
    // Set the token as an HTTP-only cookie using helper function
    setAuthCookie(c, token)
    
    return c.json({ 
      message: 'User created successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    }, 201)
  } catch (error) {
    console.error('Signup error:', error)
    return c.json({ error: 'Server error' }, 500)
  }
})

// User login
app.post('/api/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    // Validate input
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }
    
    // Find user
    const user = await User.findOne({ email })
    
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }
    
    // Check if user is using password auth (not Google)
    if (!user.password) {
      return c.json({ error: 'This account uses Google authentication' }, 400)
    }
    
    // Compare password
    const isMatch = await comparePassword(password, user.password)
    
    if (!isMatch) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }
    
    // Generate token
    const userId = user._id?.toString() || ''
    const token = generateToken(userId)
    
    // Set the token as an HTTP-only cookie using helper function
    setAuthCookie(c, token)
    
    return c.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Server error' }, 500)
  }
})

// Logout endpoint
app.post('/api/logout', async (c) => {
  try {
    // Clear the token cookie
    const isProduction = process.env.NODE_ENV === 'production'
    c.header('Set-Cookie', 
      `token=; ` +
      `HttpOnly; ` +
      `Path=/; ` +
      `Max-Age=0; ` +
      `SameSite=${isProduction ? 'None' : 'Lax'}; ` +
      `${isProduction ? 'Secure;' : ''}`
    )
    
    return c.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    return c.json({ error: 'Server error' }, 500)
  }
})

// Custom type for augmenting Hono context variables
declare module 'hono' {
  interface ContextVariableMap {
    userId: string;
  }
}

// Protected routes
// Add book
app.post('/api/books', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId')
    const { title, author, content } = await c.req.json()
    
    if (!title) {
      return c.json({ error: 'Title is required' }, 400)
    }
    
    // Generate summary if content is provided
    let summary = null
    if (content) {
      summary = await generateBookSummary(content)
    }
    
    // Create book
    const book = await Book.create({
      title,
      author,
      content,
      summary,
      userId
    })
    
    // Add to user's history
    await User.findByIdAndUpdate(userId, {
      $push: {
        history: {
          bookId: book._id?.toString() || '',
          title: book.title,
          summary: book.summary
        }
      }
    })
    
    return c.json({
      message: 'Book added successfully',
      book: {
        _id: book._id,
        title: book.title,
        author: book.author,
        summary: book.summary
      }
    }, 201)
  } catch (error) {
    console.error('Add book error:', error)
    return c.json({ error: 'Server error' }, 500)
  }
})

// Get user's books
app.get('/api/books', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId')
    
    // Get user's books
    const books = await Book.find({ userId }).select('-content').sort({ createdAt: -1 })
    
    return c.json({ books })
  } catch (error) {
    console.error('Get books error:', error)
    return c.json({ error: 'Server error' }, 500)
  }
})

// Get specific book
app.get('/api/books/:id', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId')
    const bookId = c.req.param('id')
    
    const book = await Book.findOne({ _id: bookId, userId })
    
    if (!book) {
      return c.json({ error: 'Book not found' }, 404)
    }
    
    return c.json({ book })
  } catch (error) {
    console.error('Get book error:', error)
    return c.json({ error: 'Server error' }, 500)
  }
})

// Get user profile
app.get('/api/user', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId')
    
    const user = await User.findById(userId).select('-password')
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }
    
    return c.json({ user })
  } catch (error) {
    console.error('Get user profile error:', error)
    return c.json({ error: 'Server error' }, 500)
  }
})

// Define the port
const port = process.env.PORT || 3000
console.log(`Server is running on http://localhost:${port}`)

// Serve the app
serve({
  fetch: app.fetch,
  port: Number(port)
})
