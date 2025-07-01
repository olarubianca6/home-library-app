import json
from collections import Counter
from flask_cors import CORS
from flask import Flask, jsonify, request, abort
import os
import logging

logging.getLogger('flask_cors').level = logging.DEBUG

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], allow_headers="*")
# JSON_FILE = "books.json"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_FILE = os.path.join(BASE_DIR, 'books.json')

def load_books():
    with open(JSON_FILE, encoding='utf-8') as f:
        raw_books = json.load(f)
        books = []
        for b in raw_books:
            book = {k: v.strip() if isinstance(v, str) else v for k, v in b.items()}
            if not book.get("Favorite"):
                book["Favorite"] = False
            elif isinstance(book["Favorite"], str):
                book["Favorite"] = book["Favorite"].lower() == "true"

            rating = book.get("Rating")
            if rating is None or rating == "":
                book["Rating"] = None
            else:
                try:
                    book["Rating"] = float(rating)
                except (ValueError, TypeError):
                    book["Rating"] = None

            # Fix corrupted statuses saved as "Unknown" by converting them back to "0"
            raw_status = str(book.get("Status", "")).strip()
            if raw_status == "Unknown" or raw_status == "":
                book["Status"] = "0"  # Default to Not Read
            else:
                book["Status"] = raw_status

            books.append(book)
        return books

def save_books(books):
    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(books, f, ensure_ascii=False, indent=2)

def find_book(books, title):
    return next((b for b in books if b.get('Title', '').lower() == title.lower()), None)

def update_book_metadata(books, title, status=0, rating=None, review=None, favorite=None):
    book = find_book(books, title)
    if not book:
        return False

    if status is not None:
        book["Status"] = str(status)
    if rating is not None:
        book["Rating"] = str(rating)
    if review is not None:
        book["Review"] = review
    if favorite is not None:
        book["Favorite"] = bool(favorite)

    return True

@app.route('/books', methods=['GET'])
def get_books():
    books = load_books()
    return jsonify(books)

@app.route('/books/<string:title>', methods=['PUT'])
def update_book(title):
    data = request.json
    if not data:
        abort(400, "Missing JSON data")

    books = load_books()
    book = find_book(books, title)
    if not book:
        abort(404, "Book not found")

    for field in ["Title", "Author", "Category", "Language", "Status", "Country", "Rating", "Review", "Favorite"]:
        if field in data:
            if field == "Favorite":
                book[field] = bool(data[field])
            elif field == "Status":
                # Only accept valid status codes "0", "1", "2", "3"
                if str(data[field]) in {"0", "1", "2", "3"}:
                    book[field] = str(data[field])
                else:
                    abort(400, "Invalid status code")
            else:
                book[field] = str(data[field]) if data[field] is not None else ""

    save_books(books)
    return jsonify({"message": "Book updated"}), 200

@app.route('/add', methods=['POST'])
def add_book():
    data = request.json
    if not data:
        abort(400, 'Missing json data')

    required_fields = ['Title', 'Category', 'Language', 'Status']
    for field in required_fields:
        if field not in data:
            abort(400, 'Missing ' + field)

    if str(data["Status"]) not in {"0", "1", "2", "3"}:
        abort(400, "Invalid status code")

    books = load_books()
    if find_book(books, data['Title']):
        abort(400, 'Book already exists')

    new_book = {
        "Title": data["Title"],
        "Author": data.get("Author", ""),
        "Category": data["Category"],
        "Language": data["Language"],
        "Status": str(data["Status"]),
        "Country": data.get("Country", ""),
        "Rating": str(data.get("Rating", "")),
        "Review": data.get("Review", ""),
        "Favorite": bool(data.get("Favorite", False))
    }

    books.append(new_book)
    save_books(books)
    return jsonify({'message': 'Book added'}), 201

@app.route('/books/<string:title>', methods=['DELETE'])
def delete_book(title):
    books = load_books()
    book = find_book(books, title)
    if not book:
        abort(404, 'Book not found')

    books.remove(book)
    save_books(books)
    return jsonify({'message': 'Book deleted'}), 200

@app.route('/stats', methods=['GET'])
def get_stats():
    books = load_books()

    total_books = len(books)
    ratings = []
    for b in books:
        r = b.get("Rating")
        if isinstance(r, (int, float)):
            ratings.append(float(r))
        elif isinstance(r, str) and r.replace('.', '', 1).isdigit():
            ratings.append(float(r))

    average_rating = sum(ratings) / len(ratings) if ratings else 0
    favorite_count = sum(1 for b in books if b.get("Favorite") == True)

    status_counts = Counter(str(b.get("Status", "")) for b in books if b.get("Status"))
    read = int(status_counts.get("1", 0))
    unread = int(status_counts.get("0", 0))
    reading = int(status_counts.get("2", 0))
    dnf = int(status_counts.get("3", 0))

    rated_books = [
        (b['Title'], float(b['Rating']))
        for b in books
        if isinstance(b.get('Rating'), (int, float)) or (
                    isinstance(b.get('Rating'), str) and b['Rating'].replace('.', '', 1).isdigit())
    ]

    highest_rated = sorted(rated_books, key=lambda x: x[1], reverse=True)[:10]

    def percent(part):
        return round(part / total_books * 100, 2) if total_books else 0

    category_counts = Counter(b.get("Category", "") for b in books if b.get("Category"))
    language_counts = Counter(b.get("Language", "") for b in books if b.get("Language"))
    country_counts = Counter(b.get("Country", "") for b in books if b.get("Country"))

    stats = {
        'total_books': total_books,
        'average_rating': average_rating,
        'favorite_count': favorite_count,
        'read': {'count': read, 'percentage': percent(read)},
        'unread': {'count': unread, 'percentage': percent(unread)},
        'reading': {'count': reading, 'percentage': percent(reading)},
        'did_not_finish': {'count': dnf, 'percentage': percent(dnf)},
        'categories': dict(category_counts),
        'countries': country_counts.most_common(5),
        'languages': sorted(language_counts.items(), key=lambda x: x[1], reverse=True),
        'most_common_author': Counter(b.get('Author', '') for b in books if b.get('Author')).most_common(3),
        'highest_rated_books': highest_rated
    }
    return jsonify(stats)

if __name__ == '__main__':
    app.run(debug=True, port=5003)