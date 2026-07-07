import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import ProblemCard from '../components/ProblemCard';
import EmptyState from '../components/EmptyState';
import FilterBar from '../components/FilterBar';

const PLATFORMS = ['', 'LEETCODE', 'CODEFORCES', 'OTHER'];
const STATUSES = ['', 'SOLVED', 'REVISIT'];

export default function ProblemList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [platform, setPlatform] = useState(searchParams.get('platform') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [patternId, setPatternId] = useState(searchParams.get('patternId') || '');

  const { data: patterns } = useApi('/patterns');

  const query = new URLSearchParams();
  if (searchParams.get('q')) query.set('q', searchParams.get('q'));
  if (searchParams.get('platform')) query.set('platform', searchParams.get('platform'));
  if (searchParams.get('status')) query.set('status', searchParams.get('status'));
  if (searchParams.get('patternId')) query.set('patternId', searchParams.get('patternId'));

  const { data: problems, loading, error, refetch } = useApi(
    `/problems?${query.toString()}`,
    [searchParams.toString()]
  );

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (search) params.q = search;
    if (platform) params.platform = platform;
    if (status) params.status = status;
    if (patternId) params.patternId = patternId;
    setSearchParams(params);
  };

  return (
    <div>
      <div className="page-header">
        <h1>DSA Problems</h1>
        <Link to="/problems/new" className="btn btn-primary">+ New Problem</Link>
      </div>

      <FilterBar
        search={search}
        setSearch={setSearch}
        placeholder="Search problems..."
        onSubmit={handleSearch}
      >
        <select
          value={platform}
          onChange={(e) => {
            setPlatform(e.target.value);
            const params = {};
            if (search) params.q = search;
            if (e.target.value) params.platform = e.target.value;
            if (status) params.status = status;
            setSearchParams(params);
          }}
          className="filter-select"
        >
          <option value="">All Platforms</option>
          {PLATFORMS.filter(Boolean).map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            const params = {};
            if (search) params.q = search;
            if (platform) params.platform = platform;
            if (e.target.value) params.status = e.target.value;
            if (patternId) params.patternId = patternId;
            setSearchParams(params);
          }}
          className="filter-select"
        >
          <option value="">All Statuses</option>
          {STATUSES.filter(Boolean).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={patternId}
          onChange={(e) => {
            setPatternId(e.target.value);
            const params = {};
            if (search) params.q = search;
            if (platform) params.platform = platform;
            if (status) params.status = status;
            if (e.target.value) params.patternId = e.target.value;
            setSearchParams(params);
          }}
          className="filter-select"
        >
          <option value="">All Patterns</option>
          {patterns?.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </FilterBar>

      {loading && <p className="status-text">Loading...</p>}
      {error && <p className="status-text error">{error}</p>}

      {problems && problems.length === 0 && (
        <EmptyState 
          message="No problems found." 
          actionLink="/problems/new" 
          actionLabel="Create your first problem" 
        />
      )}

      <div className="card-grid">
        {problems?.map((problem) => (
          <ProblemCard key={problem.id} problem={problem} onDelete={refetch} />
        ))}
      </div>
    </div>
  );
}