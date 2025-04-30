import api from './api'

export interface Book {
  _id: string
  title: string
  author?: string
  content?: string
  summary?: string
  userId: string
  createdAt: string
  updatedAt: string
}

class BookService {
  // Create a new book
  async createBook(bookData: { title: string; author?: string; content?: string }) {
    try {
      const response = await api.post('/books', bookData)
      return response.data.book
    } catch (error) {
      console.error('Error creating book:', error)
      throw error
    }
  }

  // Get all books for the current user
  async getBooks() {
    try {
      const response = await api.get('/books')
      return response.data.books
    } catch (error) {
      console.error('Error fetching books:', error)
      throw error
    }
  }

  // Get a specific book
  async getBook(id: string) {
    try {
      const response = await api.get(`/books/${id}`)
      return response.data.book
    } catch (error) {
      console.error(`Error fetching book ${id}:`, error)
      throw error
    }
  }
}

export default new BookService() 