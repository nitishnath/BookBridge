import axios from 'axios'

// Create a properly configured axios instance for the entire app
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to handle errors consistently
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration consistently
    if (error.response && error.response.status === 401) {
      console.error('Authentication error:', error)
      // You could redirect to login here or handle in component
    }
    return Promise.reject(error)
  }
)

export default api 