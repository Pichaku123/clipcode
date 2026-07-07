import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import SnippetCard from '../components/SnippetCard';
import client from '../api/client';

export default function PatternDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: pattern, loading, error } = useApi(`/patterns/${id}`, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this pattern? It will unlink all associated snippets and problems.')) return;
    try {
      await client.delete(`/patterns/${pattern.id}`);
      navigate('/patterns');
    } catch {
      alert('Failed to delete pattern.');
    }
  };

  if (loading) return <p className="status-text">Loading...</p>;
  if (error) return <p className="status-text error">{error}</p>;
  if (!pattern) return null;

  return (
    <div>
      <div className="page-header">
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Pattern Detail</span>
          <h1 style={{ marginTop: '0.2rem' }}>{pattern.name}</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleDelete} className="btn btn-danger">Delete</button>
          <Link to="/patterns" className="btn btn-secondary">Back to Patterns</Link>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Trigger Signal</h4>
        <div className="lang-badge" style={{ fontSize: '0.9rem', display: 'inline-block' }}>
          {pattern.triggerSignal}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            Snippets ({pattern.snippets?.length || 0})
          </h2>
          {(!pattern.snippets || pattern.snippets.length === 0) ? (
            <p className="status-text">No snippets linked to this pattern.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pattern.snippets.map((snippet) => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            problems ({pattern.problems?.length || 0})
          </h2>
          {(!pattern.problems || pattern.problems.length === 0) ? (
            <p className="status-text">No problems linked to this pattern.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pattern.problems.map((problem) => (
                <div key={problem.id} className="snippet-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div className="snippet-card-header">
                    <h4>{problem.title}</h4>
                    <span className="lang-badge">{problem.difficulty}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>{problem.platform}</span>
                    {problem.url && (
                      <a href={problem.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                        Solve ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}