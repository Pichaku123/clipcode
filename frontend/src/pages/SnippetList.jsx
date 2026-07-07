import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import SnippetCard from '../components/SnippetCard';
import EmptyState from '../components/EmptyState';
import FilterBar from '../components/FilterBar';

const LANGUAGES = ['', 'CPP', 'JS', 'PYTHON', 'JAVA'];

export default function SnippetList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [language, setLanguage] = useState(searchParams.get('language') || '');

  const query = new URLSearchParams();
  if (searchParams.get('q')) query.set('q', searchParams.get('q'));
  if (searchParams.get('language')) query.set('language', searchParams.get('language'));

  // "/snippets?q=binary-search&language=CPP"  deps = ["q=binary-search&language=CPP"]
  const { data: snippets, loading, error, refetch } = useApi(
    `/snippets?${query.toString()}`,    
    [searchParams.toString()]      
  );    

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (search) params.q = search;
    if (language) params.language = language;
    setSearchParams(params);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Snippets</h1>
        <Link to="/snippets/new" className="btn btn-primary">+ New Snippet</Link>
      </div>

      <FilterBar
        search={search}
        setSearch={setSearch}
        placeholder="Search snippets..."
        onSubmit={handleSearch}
      >
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            const params = {};
            if (search) params.q = search;
            if (e.target.value) params.language = e.target.value;
            setSearchParams(params);
          }}
          className="filter-select"
        >
          <option value="">All Languages</option>
          {LANGUAGES.filter(Boolean).map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </FilterBar>

      {loading && <p className="status-text">Loading...</p>}
      {error && <p className="status-text error">{error}</p>}

      {snippets && snippets.length === 0 && (
        <EmptyState
          message="No snippets yet."
          actionLink="/snippets/new"
          actionLabel="Create your first snippet"
        />
      )}

      <div className="card-grid">
        {snippets?.map((s) => (
          <SnippetCard key={s.id} snippet={s} onDelete={refetch} />
        ))}
      </div>
    </div>
  );
}