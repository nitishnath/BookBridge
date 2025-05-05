import { Schema, model, Document, Types } from 'mongoose'

// Interface for Book document
interface Book extends Document {
  title: string;
  author?: string;
  content?: string;
  summary?: string;
  userId: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<Book>({
  title: { type: String, required: true },
  author: { type: String },
  content: { type: String },
  summary: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  collection: 'books',
  timestamps: true
})

// Create and export the model with type information
const Book = model<Book>('Book', bookSchema)

export { Book } 