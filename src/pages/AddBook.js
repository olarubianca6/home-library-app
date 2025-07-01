import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddBook() {
    const [formData, setFormData] = useState({
        Title: "",
        Author: "",
        Category: "",
        Language: "",
        Country: "",
        Status: "",
        Rating: "",
        Review: "",
        Favorite: false
    });

    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        axios.post("http://127.0.0.1:5003/add", formData, {
            headers: { "Content-Type": "application/json" }
        })
        .then(() => {
            alert("Book added successfully");
            setFormData({
                Title: "",
                Author: "",
                Category: "",
                Language: "",
                Country: "",
                Status: "",
                Rating: "",
                Review: "",
                Favorite: false
            });
            navigate("/");
        })
        .catch(err => {
            if (err.response) {
                console.error("Server responded with status:", err.response.status);
                console.error("Response data:", err.response.data);
                alert("Error: " + (err.response.data.message || err.response.data));
            } else {
                console.error("Error:", err.message);
            }
        });
    }

    return (
        <div className="addbook-page">
            <h1 className="add-title">Add a New Book</h1>
            <form className="book-form" onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input type="text" name="Title" value={formData.Title} onChange={handleChange} required />
                </label>
                <label>
                    Author:
                    <input type="text" name="Author" value={formData.Author} onChange={handleChange} />
                </label>
                <label>
                    Category:
                    <select name="Category" value={formData.Category} onChange={handleChange} required>
                        <option value="">Select category</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Non-Fiction">Non-Fiction</option>
                        <option value="Poetry/Theatre/Art">Poetry/Theatre/Art</option>
                    </select>
                </label>
                <label>
                    Language:
                    <input type="text" name="Language" value={formData.Language} onChange={handleChange} required />
                </label>
                <label>
                    Country:
                    <input type="text" name="Country" value={formData.Country} onChange={handleChange} />
                </label>
                <label>
                    Status:
                    <select name="Status" value={formData.Status} onChange={handleChange} required>
                        <option value="">Select status</option>
                        <option value="0">Not Read</option>
                        <option value="1">Read</option>
                        <option value="2">Currently Reading</option>
                        <option value="3">Did Not Finish</option>
                    </select>
                </label>
                <label>
                    Rating:
                    <input type="number" name="Rating" min="0" max="10" step="0.1" value={formData.Rating} onChange={handleChange} />
                </label>
                <label>
                    Review:
                    <textarea name="Review" rows="3" value={formData.Review} onChange={handleChange} />
                </label>
                <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
                    <input
                        type="checkbox"
                        name="Favorite"
                        checked={formData.Favorite}
                        onChange={handleChange}
                        style={{ marginRight: 8 }}
                    />
                    <label htmlFor="Favorite">Mark as Favorite</label>
                </div>
                <button type="submit">Add Book</button>
            </form>
        </div>
    );
}

export default AddBook;