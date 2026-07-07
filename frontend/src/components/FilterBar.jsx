export default function FilterBar({ search, setSearch, placeholder, onSubmit, children }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <form className="filter-bar" onSubmit={handleSubmit} style={{ flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
      <input
        type="text"
        placeholder={placeholder || 'Search...'}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
        style={{ minWidth: '200px' }}
      />
      {children}
      <button type="submit" className="btn btn-secondary">Search</button>
    </form>
  );
}
