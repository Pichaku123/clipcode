import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import CodeBlock from '../components/CodeBlock';
import client from '../api/client';

export default function SnippetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: snippet, loading, error, refetch: refetchSnippet } = useApi(`/snippets/${id}`, [id]);
  const { data: patterns, refetch: refetchPatterns } = useApi('/patterns');

  const [selectedPatternId, setSelectedPatternId] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPatternName, setNewPatternName] = useState('');
  const [newPatternTrigger, setNewPatternTrigger] = useState('');
  const [linking, setLinking] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this snippet?')) return;
    try {
      await client.delete(`/snippets/${id}`);
      alert('Snippet deleted successfully.');
      navigate('/snippets');
    } catch {
      alert('Failed to delete.');
    }
  };

  const handleLinkPattern = async (e) => {
    e.preventDefault();
    if (!selectedPatternId) return;
    setLinking(true);
    try {
      await client.patch(`/snippets/${id}`, { patternId: selectedPatternId });
      refetchSnippet();
    } catch {
      alert('Failed to link pattern.');
    } finally {
      setLinking(false);
    }
  };

  const handleCreateAndLinkPattern = async (e) => {
    e.preventDefault();
    if (!newPatternName || !newPatternTrigger) return;
    setLinking(true);
    try {
      const res = await client.post('/patterns', {
        name: newPatternName,
        triggerSignal: newPatternTrigger
      });
      const newPattern = res.data;
      await client.patch(`/snippets/${id}`, { patternId: newPattern.id });
      setShowCreateForm(false);
      setNewPatternName('');
      setNewPatternTrigger('');
      refetchSnippet();
      refetchPatterns();
    } catch {
      alert('Failed to create and link pattern.');
    } finally {
      setLinking(false);
    }
  };

  const handleUnlinkPattern = async () => {
    if (!confirm('Unlink this pattern from the snippet?')) return;
    setLinking(true);
    try {
      await client.patch(`/snippets/${id}`, { patternId: null });
      refetchSnippet();
    } catch {
      alert('Failed to unlink pattern.');
    } finally {
      setLinking(false);
    }
  };

  if (loading) return <p className="status-text">Loading...</p>;
  if (error) return <p className="status-text error">{error}</p>;
  if (!snippet) return null;

  return (
    <div>
      <div className="page-header">
        <h1>{snippet.title}</h1>
        <div className="header-actions">
          <Link to={`/snippets/${id}/edit`} className="btn btn-secondary">Edit</Link>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      <div className="detail-meta" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span className="lang-badge">{snippet.language}</span>
        {snippet.pattern && (
          <Link to={`/patterns/${snippet.pattern.id}`} className="tag" style={{ border: '1px solid rgba(232, 163, 61, 0.3)', color: 'var(--accent)', textDecoration: 'none' }}>
            🧩 {snippet.pattern.name}
          </Link>
        )}
      </div>

      {/* Pattern linking widget (placed below heading/meta but above code) */}
      <div className="snippet-card" style={{ padding: '1rem', background: 'var(--bg-elevated)', marginBottom: '1.5rem', maxWidth: '720px' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Associated Pattern</h3>
        
        {snippet.pattern ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <Link to={`/patterns/${snippet.pattern.id}`} style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', fontSize: '1.05rem' }}>
                🧩 {snippet.pattern.name}
              </Link>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Trigger: {snippet.pattern.triggerSignal}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link 
                to={`/patterns/${snippet.pattern.id}`} 
                className="btn btn-secondary"
                style={{ textDecoration: 'none', color: 'var(--accent)', borderColor: 'var(--accent)', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
              >
                View Pattern Page ↗
              </Link>
              <button 
                onClick={handleUnlinkPattern} 
                className="btn btn-secondary" 
                style={{ borderColor: '#d1242f', color: '#d1242f', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                disabled={linking}
              >
                Unlink
              </button>
            </div>
          </div>
        ) : (
          <div>
            {!showCreateForm ? (
              <form onSubmit={handleLinkPattern} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <select 
                  value={selectedPatternId} 
                  onChange={e => setSelectedPatternId(e.target.value)}
                  className="filter-select"
                  style={{ background: 'var(--bg)', margin: 0 }}
                >
                  <option value="">-- Choose Existing Pattern --</option>
                  {patterns?.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }} disabled={!selectedPatternId || linking}>
                  Link Pattern
                </button>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>or</span>
                <button 
                  type="button" 
                  onClick={() => setShowCreateForm(true)} 
                  className="btn btn-secondary"
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
                >
                  + Create New Pattern
                </button>
              </form>
            ) : (
              <form onSubmit={handleCreateAndLinkPattern} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)' }}>Create & Link New Pattern</div>
                <input 
                  type="text" 
                  placeholder="Pattern Name (e.g. Sliding Window)" 
                  value={newPatternName} 
                  onChange={e => setNewPatternName(e.target.value)}
                  required
                  style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                />
                <input 
                  type="text" 
                  placeholder="Trigger Signal (e.g. contiguous subarray, size k)" 
                  value={newPatternTrigger} 
                  onChange={e => setNewPatternTrigger(e.target.value)}
                  required
                  style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} disabled={linking}>
                    Create & Link
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewPatternName('');
                      setNewPatternTrigger('');
                    }} 
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {snippet.description && (
        <p className="snippet-description">{snippet.description}</p>
      )}

      <CodeBlock code={snippet.code} language={snippet.language} />

      {snippet.tags?.length > 0 && (
        <div className="snippet-card-tags" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
          {snippet.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}
