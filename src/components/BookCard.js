import React from "react";

function BookCard({ book, onDelete, onUpdate }) {
  return (
    <div className="book-card" style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
      <h3>{book.Title}</h3>
      <p><strong>Author:</strong> {book.Author}</p>
      <p><strong>Category:</strong> {book.Category}</p>
      <p><strong>Status:</strong> {book.StatusLabel || book.Status}</p>
      <p><strong>Language:</strong> {book.Language}</p>
      <p><strong>Country:</strong> {book.Country}</p>
      {book.Rating && <p><strong>Rating:</strong> {book.Rating}</p>}
      {book.Review && <p><strong>Review:</strong> {book.Review}</p>}

      <div className="book-card-buttons">
        <button
          className="update-btn"
          onClick={onUpdate}
        >
          Update
        </button>
        <button
          className="delete-btn"
          onClick={() => {
              onDelete(book.Title);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default BookCard;