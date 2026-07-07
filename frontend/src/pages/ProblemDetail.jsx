import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import client from '../api/client';

const PLATFORM_LABELS = {
  LEETCODE: 'LeetCode',
  CODEFORCES: 'Codeforces',
  OTHER: 'Other',
};

const DIFFICULTY_COLORS = {
  EASY: '#00b8a3',
  MEDIUM: '#ffc01e',
  HARD: '#ff375f',
};

export default function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: problem, loading, error, refetch: refetchProblem } = useApi(`/problems/${id}`, [id]);
  const { data: patterns, refetch: refetchPatterns } = useApi('/patterns');

  const [selectedPatternId, setSelectedPatternId] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPatternName, setNewPatternName] = useState('');
  const [newPatternTrigger, setNewPatternTrigger] = useState('');
  const [linking, setLinking] = useState(false);

  if (loading) return <p className="status-text">Loading...</p>;
  if (error) return <p className="status-text error">{error}</p>;
  if (!problem) return null;

  const diffColor = DIFFICULTY_COLORS[problem.difficulty] || 'var(--text-muted)';

  const handleDelete = async () => {
    if (!confirm('Delete this problem?')) return;
    try {
      await client.delete(`/problems/${problem.id}`);
      navigate('/problems');
    } catch {
      alert('Failed to delete problem.');
    }
  };

  const handleLinkPattern = async (e) => {
    e.preventDefault();
    if (!selectedPatternId) return;
    setLinking(true);
    try {
      await client.patch(`/problems/${id}`, { patternId: selectedPatternId });
      refetchProblem();
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
      await client.patch(`/problems/${id}`, { patternId: newPattern.id });
      setShowCreateForm(false);
      setNewPatternName('');
      setNewPatternTrigger('');
      refetchProblem();
      refetchPatterns();
    } catch {
      alert('Failed to create and link pattern.');
    } finally {
      setLinking(false);
    }
  };

  const handleUnlinkPattern = async () => {
    if (!confirm('Unlink this pattern from the problem?')) return;
    setLinking(true);
    try {
      await client.patch(`/problems/${id}`, { patternId: null });
      refetchProblem();
    } catch {
      alert('Failed to unlink pattern.');
    } finally {
      setLinking(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Problem Detail</span>
          <h1 style={{ marginTop: '0.2rem' }}>{problem.title}</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleDelete} className="btn btn-danger">Delete</button>
          <Link to="/problems" className="btn btn-secondary">Back to Problems</Link>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        <span className="tag">{PLATFORM_LABELS[problem.platform]}</span>
        {problem.difficulty && (
          <span 
            className="lang-badge" 
            style={{ '--dot': diffColor, color: diffColor, background: 'rgba(255,255,255,0.03)' }}
          >
            {problem.difficulty}
          </span>
        )}
        <span className="tag" style={{ border: problem.status === 'SOLVED' ? '1px solid rgba(0, 184, 163, 0.3)' : '1px solid rgba(255, 192, 30, 0.3)', color: problem.status === 'SOLVED' ? '#00b8a3' : '#ffc01e' }}>
          {problem.status}
        </span>
        {problem.pattern && (
          <Link to={`/patterns/${problem.pattern.id}`} className="tag" style={{ border: '1px solid rgba(232, 163, 61, 0.3)', color: 'var(--accent)', textDecoration: 'none' }}>
            🧩 {problem.pattern.name}
          </Link>
        )}
      </div>

      {problem.tags && problem.tags.length > 0 && (
        <div style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          <strong style={{ color: 'var(--text)' }}>Tags:</strong>
          <span>{problem.tags.join(', ')}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '720px' }}>
        {/* Pattern linking widget */}
        <div className="snippet-card" style={{ padding: '1rem', background: 'var(--bg-elevated)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Associated Pattern</h3>
          
          {problem.pattern ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <Link to={`/patterns/${problem.pattern.id}`} style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', fontSize: '1.05rem' }}>
                  🧩 {problem.pattern.name}
                </Link>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Trigger: {problem.pattern.triggerSignal}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link 
                  to={`/patterns/${problem.pattern.id}`} 
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

        {/* Complexity Card */}
        {(problem.timeComplexity || problem.spaceComplexity) && (
          <div className="snippet-card" style={{ padding: '1rem', background: 'var(--bg-elevated)' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Big-O Complexity</h3>
            <div style={{ display: 'flex', gap: '2rem', fontFamily: 'var(--font-mono)' }}>
              {problem.timeComplexity && (
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Time Complexity:</span> {problem.timeComplexity}
                </div>
              )}
              {problem.spaceComplexity && (
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Space Complexity:</span> {problem.spaceComplexity}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes Card */}
        {problem.notes && (
          <div className="snippet-card" style={{ padding: '1rem', background: 'var(--bg-elevated)' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Notes & Explanation</h3>
            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {problem.notes}
            </p>
          </div>
        )}

        {problem.url && (
          <div>
            <a 
              href={problem.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary"
              style={{ display: 'inline-block', textDecoration: 'none' }}
            >
              Solve on {PLATFORM_LABELS[problem.platform]} ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
