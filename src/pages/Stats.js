import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:5003/stats")
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div className="stats-page">
      <div className="stats-header">
        <h1>Stats</h1>
        <Link to="/">
            <button>Home</button>
        </Link>
      </div>

    <div className="stats-container">
      <div className="stat-item"><strong>Total books:</strong> {stats.total_books}</div>
      <div className="stat-item"><strong>Favorite count:</strong> {stats.favorite_count}</div>
      <div className="stat-item"><strong>Average rating:</strong> {stats.average_rating.toFixed(2)}</div>

      <div className="stat-item"><strong>Read:</strong> {stats.read.count} books ({stats.read.percentage}%)</div>
      <div className="stat-item"><strong>Unread:</strong> {stats.unread.count} books ({stats.unread.percentage}%)</div>
      <div className="stat-item"><strong>Currently Reading:</strong> {stats.reading.count} books ({stats.reading.percentage}%)</div>
      <div className="stat-item"><strong>Did Not Finish:</strong> {stats.did_not_finish.count} books ({stats.did_not_finish.percentage}%)</div>

      <div className="stat-item" style={{ width: "100%" }}>
        <strong>Categories:</strong> {Object.entries(stats.categories).map(([key, value]) => `${key}: ${value}`).join(', ')}
      </div>

      <div className="stat-item">
        <strong>Countries:</strong>
        <ul>
          {stats.countries.map(([country, count]) => (
            <li key={country}><strong>{country}</strong>: {count}</li>
          ))}
        </ul>
      </div>

      <div className="stat-item">
        <strong>Languages:</strong>
        <ul>
          {stats.languages.map(([lang, count]) => (
            <li key={lang}><strong>{lang}</strong>: {count}</li>
          ))}
        </ul>
      </div>

      <div className="stat-item" style={{ flexBasis: "100%" }}>
        <strong>Most common authors:</strong> {stats.most_common_author.map(([author, count]) => `${author} (${count})`).join(', ')}
      </div>

      <div className="stat-item" style={{ flexBasis: "100%" }}>
        <h3>Top Rated Books</h3>
        <ul>
          {stats.highest_rated_books.map(([title, rating]) => (
            <li key={title}><strong>{title}</strong> — Rating: {rating}</li>
          ))}
        </ul>
      </div>
      </div>
    </div>
  );
}

export default Stats;