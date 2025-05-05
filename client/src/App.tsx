import { FC, ChangeEvent, useState, useEffect } from "react";
import "./App.css";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { NavLink, Book } from "./utils/interfaces";
import { useAuth } from "./utils/AuthContext";

const navLinks: NavLink[] = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#shop", label: "Shop" },
  { href: "#delivery", label: "Delivery Team" },
  { href: "#sellers", label: "Sellers" },
];

const bestPicksBooks: Book[] = [
  {
    title: "The Shadow Lines",
    author: "Amitav Ghosh",
    imageUrl: "../images/book1.jpg",
  },
  {
    title: "Cuckold",
    author: "Kiran Nagarkar",
    imageUrl: "../images/book2.jpg",
  },
  {
    title: "The Inheritance of Loss",
    author: "Kiran Desai",
    imageUrl: "../images/book3.jpg",
  },
  {
    title: "The Small-town Sea",
    author: "Anees Salim",
    imageUrl: "../images/book4.jpg",
  },
];

// const userProfile: UserProfile = {
//   email: "user@bookpoint.com",
//   avatarUrl: "../images/user-logo.png",
// };

const App: FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // If user is authenticated, they can optionally be redirected to the home page
    if (isAuthenticated) {
      // Uncomment if you want to auto-redirect authenticated users
      // navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = (): void => {
    setSearchQuery("");
  };

  const handleSearch = (): void => {
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const handleLoginClick = (): void => {
    navigate("/login");
  };

  const handleProfileClick = (): void => {
    navigate("/home");
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      // Optional: navigate to landing page after logout
      // navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo-container">
          <img
            src="../images/open-book.png"
            alt="Book Logo"
            className="book-logo"
          />
          {/* More sophisticated, could work well for new and used books */}
          <h1 className="text-2xl font-bold text-brand">BookBridge</h1>
        </div>
        <nav className="nav-links">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {/* <Button className="notification-btn" aria-label="Notifications">
            🔔
          </Button> */}
          {/* <div className="user-profile">
            <img src={userProfile.avatarUrl} alt="User" className="avatar" />
            <span className="user-email">{userProfile.email}</span>
          </div> */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Button
                variant="outlined"
                color="primary"
                onClick={handleProfileClick}
              >
                My Books
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogout}
              >
                Logout
              </Button>
              {user?.profilePicture && (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              )}
            </div>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleLoginClick}
            >
              Login
            </Button>
          )}
        </div>
      </header>

      <main className="hero-section">
        <h1 className="hero-title">The Book Lover's Dreamland Awaits!</h1>
        <p className="hero-description">
          Welcome to the ultimate book lover's paradise! Join our community and
          contribute to the ever-evolving library of stories, where every book
          has a chance to inspire someone new.
        </p>
        <div className="search-container">
          <div className="search-input-wrapper">
            <TextField
              type="text"
              placeholder="Search a Book"
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search books"
              sx={{
                "& .MuiInputBase-input": {
                  color: "white",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "white",
                  opacity: 0.4,
                },
              }}
            />
            {searchQuery && (
              <Button
                className="clear-search"
                onClick={handleClearSearch}
                aria-label="Clear search"
                sx={{
                  position: "absolute",
                  right: "10px",
                  top: "48%",
                  transform: "translateY(-50%)",
                  color: "white",
                  minWidth: "32px",
                  padding: "4px",
                  borderRadius: "50%",
                  marginLeft: "8px",
                }}
              >
                ×
              </Button>
            )}
          </div>
          <Button
            className="search-button"
            variant="contained"
            onClick={handleSearch}
            aria-label="Search"
          >
            Search
          </Button>
        </div>
        <div className="hero-image">
          <img
            src="../images/poetry.png"
            alt="Open Book"
            className="floating-book"
          />
        </div>

        <section className="best-picks">
          <h2 className="picks-title">Our Best Picks</h2>
          <div className="book-carousel">
            {bestPicksBooks.map((book, index) => (
              <div className="book-card" key={index}>
                <div className="special-offer">SPECIAL OFFER</div>
                <img src={book.imageUrl} alt={book.title} />
                <h3>{book.title}</h3>
                <p>{book.author}</p>
              </div>
            ))}
          </div>
          <div className="carousel-dots">
            <span className="dot"></span>
            <span className="dot active"></span>
          </div>
        </section>

        <section className="stats-section">
          <div className="book-shelf-container">
            <img
              src="../images/book-shelf.png"
              alt="Book Shelf"
              className="book-shelf"
            />
          </div>
          <div className="stats-content">
            <div className="stats-text-container">
              <h2>
                Your favourite <span className="highlight">Reads</span>
                <br />
                Are Here!
              </h2>
              <p>
                Buy your favorite books online with ease! Enjoy exclusive offers
                and discounts on selected titles. Dive into our collection and
                find special deals that make reading more affordable. Shop now
                and unlock more savings with every purchase!
              </p>
              <button className="explore-btn" onClick={() => navigate("/home")}>
                Explore More
              </button>
            </div>
            <div className="stats-numbers">
              <div className="stat-item">
                <span className="stat-value">800+</span>
                <span className="stat-label">Book Listing</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">1K+</span>
                <span className="stat-label">Registered Members</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">50+</span>
                <span className="stat-label">Branch Count</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
