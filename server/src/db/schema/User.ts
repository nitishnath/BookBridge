import { Schema, model, Document } from 'mongoose'

// Interface for User document
interface User extends Document {
  username: string;
  email: string;
  password: string;
  googleId?: string;
  profilePicture?: string;
  history?: {
    bookId: string;
    title: string;
    timestamp: Date;
    summary?: string;
  }[];
}

const userSchema = new Schema<User>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Optional for Google auth
  googleId: { type: String, sparse: true }, // For Google authentication
  profilePicture: { type: String },
  history: [{
    bookId: { type: String, required: true },
    title: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    summary: { type: String }
  }]
}, {
  collection: 'users', // Specify the collection name
  timestamps: true // Adds createdAt and updatedAt fields
})

// Create and export the model with type information
const User = model<User>('User', userSchema)

export { User }
