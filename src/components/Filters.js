function Filters({
  categories,
  languages,
  statuses,
  selectedCategories,
  selectedLanguages,
  selectedStatuses,
  showFavoritesOnly,
  setSelectedCategories,
  setSelectedLanguages,
  setSelectedStatuses,
  setShowFavoritesOnly
}) {
  function toggle(setter, current, value) {
    setter(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  }

  return (
    <div style={{ display: "flex", gap: 20, marginBottom: 20 }} className="filters-container">
      <div>
        <h3>Category</h3>
        {categories.map(cat => (
          <label key={cat} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat)}
              onChange={() => toggle(setSelectedCategories, selectedCategories, cat)}
            />
            {cat}
          </label>
        ))}
      </div>

      <div>
        <h3>Language</h3>
        {languages.map(lang => (
          <label key={lang} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={selectedLanguages.includes(lang)}
              onChange={() => toggle(setSelectedLanguages, selectedLanguages, lang)}
            />
            {lang}
          </label>
        ))}
      </div>

      <div>
        <h3>Status</h3>
        {statuses.map(status => (
          <label key={status} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={selectedStatuses.includes(status)}
              onChange={() => toggle(setSelectedStatuses, selectedStatuses, status)}
            />
            {status}
          </label>
        ))}
      </div>

      <div>
        <h3>Favorites</h3>
        <label>
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={() => setShowFavoritesOnly(prev => !prev)}
          />
          Show favorites only
        </label>
      </div>
    </div>
  );
}

export default Filters;