import { useState, useEffect } from "react";

function UpdateBook({ book, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    Title: "",
    Author: "",
    Category: "",
    Language: "",
    Country: "",
    Status: "",
    Rating: "",
    Review: "",
    Favorite: false,
  });

  useEffect(() => {
    if (book) {
      setFormData({
        Title: book.Title || "",
        Author: book.Author || "",
        Category: book.Category || "",
        Language: book.Language || "",
        Country: book.Country || "",
        Status: book.Status || "",
        Rating: book.Rating || "",
        Review: book.Review || "",
        Favorite: !!book.Favorite,
      });
    }
  }, [book]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch(`http://127.0.0.1:5003/books/${encodeURIComponent(book.Title)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(res => {
        if (!res.ok) throw new Error("Update failed");
        return res.json();
      })
      .then(() => {
        onUpdate();
        onClose();
      })
      .catch(err => alert(err.message));
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update Book: {book.Title}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              type="text"
              name="Title"
              value={formData.Title}
              onChange={handleChange}
              required
              disabled
            />
          </label>

          <label>
            Author:
            <input
              type="text"
              name="Author"
              value={formData.Author}
              onChange={handleChange}
            />
          </label>

          <label>
            Category:
            <select
              name="Category"
              value={formData.Category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Poetry/Theatre">Poetry/Theatre</option>
            </select>
          </label>

          <label>
            Language:
            <input
              type="text"
              name="Language"
              value={formData.Language}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Country:
            <input
              type="text"
              name="Country"
              value={formData.Country}
              onChange={handleChange}
            />
          </label>

          <label>
            Status:
            <select
              name="Status"
              value={formData.Status}
              onChange={handleChange}
              required
            >
              <option value="">Select status</option>
              <option value="0">Not Read</option>
              <option value="1">Read</option>
              <option value="2">Currently Reading</option>
              <option value="3">Did Not Finish</option>
            </select>
          </label>

          <label>
            Rating:
            <input
              type="number"
              name="Rating"
              min="0"
              max="10"
              step="0.1"
              value={formData.Rating}
              onChange={handleChange}
            />
          </label>

          <label>
            Review:
            <textarea
              name="Review"
              rows="3"
              value={formData.Review}
              onChange={handleChange}
            />
          </label>

          <label>
            <input
              type="checkbox"
              name="Favorite"
              checked={formData.Favorite}
              onChange={handleChange}
            />
            Mark as Favorite
          </label>

          <div className="modal-buttons">
            <button type="submit" className="update-btn">
              Save
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateBook;