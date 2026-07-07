import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import PatternCard from '../components/PatternCard';
import client from '../api/client';

export default function PatternList() {
  const { data: patterns, loading, error, refetch } = useApi('/patterns');
  const [name, setName] = useState('');
  const [triggerSignal, setTriggerSignal] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

 const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !triggerSignal) return;
    setCreating(true);
    setCreateError(null);
    try {
      await client.post('/patterns', { name, triggerSignal });
      setName('');
      setTriggerSignal('');
      refetch();
    } catch (err) {
      setCreateError(err.response?.data?.error || 'Failed to create pattern.');
    } finally {
       setCreating(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Coding Patterns</h1>
      </div>

      <form onSubmit={handleCreate} className="filter-bar" style={{ flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Pattern Name (e.g., Sliding Window)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="search-input"
          style={{ flex: '2 1 200px' }}
          required
        />
        <input
          type="text"
          placeholder="Trigger Signal (e.g., Subarray, contiguous)"
          value={triggerSignal}
          onChange={(e) => setTriggerSignal(e.target.value)}
          className="search-input"
          style={{ flex: '2 1 200px' }}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={creating} style={{ flex: '1 1 100px' }}>
          {creating ? 'Adding...' : '+ Add Pattern'}
        </button>
      </form>

      {createError && <p className="status-text error">{createError}</p>}
      {loading && <p className="status-text">Loading...</p>}
      {error && <p className="status-text error">{error}</p>}

      {patterns && patterns.length === 0 && (
        <div className="empty-state">
          <p>No coding patterns created yet.</p>
        </div>
      )}

      <div className="card-grid">
        {patterns?.map((pattern) => (
          <PatternCard key={pattern.id} pattern={pattern} onDelete={refetch} />
        ))}
      </div>
    </div>
  );
}