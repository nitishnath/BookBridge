interface NavLink {
  href: string;
  label: string;
}

// UI Book type for displaying in the UI
interface Book {
  title: string;
  author: string;
  imageUrl: string;
}

// API Book type returned from the backend
interface APIBook {
  _id: string;
  title: string;
  author?: string;
  content?: string;
  summary?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  email: string;
  avatarUrl: string;
}

export type { NavLink, Book, APIBook, UserProfile };
