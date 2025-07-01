import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";
import Filters from "../components/Filters";
import UpdateBook from "../components/UpdateBook";
import { Link } from "react-router-dom";

function Library() {
  const [books, setBooks] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [bookToUpdate, setBookToUpdate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const STATUS_LABELS = {
    "0": "Not Read",
    "1": "Read",
    "2": "Currently Reading",
    "3": "Did Not Finish",
  };

  const fetchBooks = () => {
    axios
      .get("http://127.0.0.1:5003/books")
      .then(res => {
        console.log("Raw statuses:", res.data.map(b => b.Status));
        setBooks(res.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const booksWithLabels = useMemo(
    () =>
      books.map((book) => ({
        ...book,
        StatusLabel: STATUS_LABELS[String(book.Status)] || "Unknown",
      })),
    [books, STATUS_LABELS]
  );

  const categories = useMemo(
    () => [...new Set(booksWithLabels.map((b) => b.Category).filter(Boolean))],
    [booksWithLabels]
  );
  const languages = useMemo(
    () => [...new Set(booksWithLabels.map((b) => b.Language).filter(Boolean))],
    [booksWithLabels]
  );
  const statuses = useMemo(
    () => [...new Set(booksWithLabels.map((b) => b.StatusLabel).filter(Boolean))],
    [booksWithLabels]
  );

  function handleDelete(title) {
    if (!window.confirm(`Delete book "${title}"?`)) return;
    axios
      .delete(`http://127.0.0.1:5003/books/${encodeURIComponent(title)}`)
      .then(() => {
        setBooks((prevBooks) => prevBooks.filter((book) => book.Title !== title));
      })
      .catch((err) => {
        console.error("Failed to delete book:", err);
        alert("Failed to delete the book.");
      });
  }

  function handleUpdate(updatedBook) {
    setBooks((prevBooks) =>
      prevBooks.map((book) => (book.Title === updatedBook.Title ? updatedBook : book))
    );
    setBookToUpdate(null);
  }

  const filteredBooks = booksWithLabels
    .filter((book) => {
      const categoryMatch =
        selectedCategories.length === 0 || selectedCategories.includes(book.Category);
      const languageMatch =
        selectedLanguages.length === 0 || selectedLanguages.includes(book.Language);
      const statusMatch =
        selectedStatuses.length === 0 || selectedStatuses.includes(book.StatusLabel);
      const favoriteMatch = !showFavoritesOnly || book.Favorite === true || book.Favorite === "True";
      const searchMatch = book.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.Author?.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && languageMatch && statusMatch && favoriteMatch && searchMatch;
    })
    .sort((a, b) => a.Title.localeCompare(b.Title));

  return (
    <div>
      <div className="library-header">
        <h1>Owned Books</h1>

        <div style={{ marginBottom: 20 }} className="library-buttons">
          <Link to="/add" style={{ marginRight: 10 }}>
            <button>Add Book</button>
          </Link>
          <Link to="/stats">
            <button>View Stats</button>
          </Link>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by title or author"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "10px",
            width: "50%",
            maxWidth: "400px",
            border: "1px solid #ccc",
            borderRadius: "6px"
          }}
        />
      </div>

      <Filters
        categories={categories}
        languages={languages}
        statuses={statuses}
        selectedCategories={selectedCategories}
        selectedLanguages={selectedLanguages}
        selectedStatuses={selectedStatuses}
        showFavoritesOnly={showFavoritesOnly}
        setSelectedCategories={setSelectedCategories}
        setSelectedLanguages={setSelectedLanguages}
        setSelectedStatuses={setSelectedStatuses}
        setShowFavoritesOnly={setShowFavoritesOnly}
      />

      <div className="book-grid">
        {filteredBooks.length === 0 ? (
          <p>No books match the selected filters.</p>
        ) : (
          filteredBooks.map((book) => (
            <BookCard
              key={book.Title}
              book={book}
              onDelete={handleDelete}
              onUpdate={() => setBookToUpdate(book)}
            />
          ))
        )}
      </div>

      {bookToUpdate && (
        <UpdateBook
          book={bookToUpdate}
          onClose={() => setBookToUpdate(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default Library;