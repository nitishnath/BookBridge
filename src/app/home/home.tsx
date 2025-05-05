import { FC, useEffect, useState } from "react";
import { useAuth } from "../../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  CircularProgress,
} from "@mui/material";
import BookService, { Book } from "../../utils/BookService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Home: FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!loading && !isAuthenticated) {
      navigate("/login");
    } else if (isAuthenticated) {
      loadBooks();
    }
  }, [isAuthenticated, loading, navigate]);

  const handleError = (error: unknown) => {
    console.error("API error:", error);

    if (axios.isAxiosError(error)) {
      // Handle session expiration
      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        navigate("/login");
        return;
      }

      // Handle other API errors
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
        return;
      }
    }

    // Generic error
    toast.error("An unexpected error occurred. Please try again.");
  };

  const loadBooks = async () => {
    if (!isAuthenticated) {
      toast.error("Authentication required. Please log in again.");
      navigate("/login");
      return;
    }

    setBooksLoading(true);
    try {
      const books = await BookService.getBooks();
      setBooks(books || []);
    } catch (error) {
      handleError(error);
    } finally {
      setBooksLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Please enter a book title");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Authentication required. Please log in again.");
      navigate("/login");
      return;
    }

    setSubmitting(true);
    try {
      const newBook = await BookService.createBook({
        title,
        author: author || undefined,
        content: content || undefined,
      });

      setBooks((prevBooks) => [newBook, ...prevBooks]);
      toast.success("Book added successfully!");
      setSelectedBook(newBook);

      // Reset form
      setTitle("");
      setAuthor("");
      setContent("");
    } catch (error) {
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <ToastContainer position="top-right" />
      <Box className="mb-8">
        <Typography variant="h4" component="h1" className="mb-4 text-amber-500">
          Welcome, {user?.username}!
        </Typography>
        <Typography variant="body1" className="mb-6">
          Add a new book to get an AI-generated summary.
        </Typography>

        <Paper elevation={3} className="p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <Typography variant="h5" component="h2" className="mb-4">
              Add New Book
            </Typography>
            <Box className="mb-4">
              <TextField
                label="Book Title"
                fullWidth
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-4"
              />
            </Box>
            <Box className="mb-4">
              <TextField
                label="Author (Optional)"
                fullWidth
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="mb-4"
              />
            </Box>
            <Box className="mb-4">
              <TextField
                label="Book Content (for summary generation)"
                fullWidth
                multiline
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mb-4"
                placeholder="Paste book content here to generate a summary"
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
              className="w-full bg-amber-500 hover:bg-amber-600"
            >
              {submitting ? "Adding Book..." : "Add Book"}
            </Button>
          </form>
        </Paper>

        <Box className="flex gap-4">
          <Box className="w-1/3">
            <Typography variant="h5" component="h2" className="mb-4">
              Your Books
            </Typography>
            {booksLoading ? (
              <CircularProgress />
            ) : books.length > 0 ? (
              <Paper elevation={2} className="p-4">
                {books.map((book) => (
                  <Box
                    key={book._id}
                    className={`p-3 mb-2 cursor-pointer rounded hover:bg-gray-100 ${
                      selectedBook?._id === book._id ? "bg-amber-100" : ""
                    }`}
                    onClick={() => handleBookClick(book)}
                  >
                    <Typography variant="h6">{book.title}</Typography>
                    {book.author && (
                      <Typography variant="body2" color="textSecondary">
                        by {book.author}
                      </Typography>
                    )}
                    <Typography variant="caption" color="textSecondary">
                      Added on {new Date(book.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            ) : (
              <Typography>No books added yet.</Typography>
            )}
          </Box>

          <Box className="w-2/3">
            <Typography variant="h5" component="h2" className="mb-4">
              Book Summary
            </Typography>
            {selectedBook ? (
              <Paper elevation={2} className="p-6">
                <Typography variant="h5" className="mb-2">
                  {selectedBook.title}
                </Typography>
                {selectedBook.author && (
                  <Typography variant="subtitle1" className="mb-4">
                    by {selectedBook.author}
                  </Typography>
                )}
                <Typography variant="h6" className="mb-2">
                  Summary:
                </Typography>
                {selectedBook.summary ? (
                  <Typography variant="body1">
                    {selectedBook.summary}
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="italic"
                  >
                    No summary available for this book.
                  </Typography>
                )}
              </Paper>
            ) : (
              <Paper elevation={2} className="p-6">
                <Typography className="text-center text-gray-500">
                  Select a book to view its summary
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
