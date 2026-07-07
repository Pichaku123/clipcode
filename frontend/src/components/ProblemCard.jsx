import { Link } from 'react-router-dom';
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

export default function ProblemCard({ problem, onDelete }) {
  const diffColor = DIFFICULTY_COLORS[problem.difficulty] || 'var(--text-muted)';

  const handleDelete = async () => {
    if (!confirm('Delete this problem?')) return;
    try {
      await client.delete(`/problems/${problem.id}`);
      onDelete();
    } catch {
      alert('Failed to delete problem.');
    }
  };

  return (
    <div className="snippet-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', position: 'relative', minHeight: '200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.2rem' }}>
        <Link to={`/problems/${problem.id}`} style={{ textDecoration: 'none', flex: 1, minWidth: 0 }}>
          <h3 className="card-title" style={{ fontSize: '1.1rem', color: 'var(--text)', cursor: 'pointer', margin: 0, wordBreak: 'break-word' }}>
            {problem.title}
          </h3>
        </Link>
        <button 
          onClick={handleDelete} 
          style={{ 
            background: 'rgba(209, 36, 47, 0.1)', 
            border: '1px solid rgba(209, 36, 47, 0.2)', 
            borderRadius: '4px',
            color: '#ff4d4d', 
            cursor: 'pointer',
            padding: '0.25rem 0.5rem',
            fontSize: '0.8rem',
            transition: 'all 0.2s',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(209, 36, 47, 0.2)';
            e.target.style.borderColor = 'rgba(209, 36, 47, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(209, 36, 47, 0.1)';
            e.target.style.borderColor = 'rgba(209, 36, 47, 0.2)';
          }}
          title="Delete Problem"
        >
          Delete
        </button>
      </div>
 
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
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
          <span className="tag" style={{ border: '1px solid rgba(232, 163, 61, 0.3)', color: 'var(--accent)' }}>
            🧩 {problem.pattern.name}
          </span>
        )}
      </div>
 
      {problem.tags && problem.tags.length > 0 && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          <span style={{ fontWeight: 650, color: 'var(--text)' }}>Tags:</span>
          <span>{problem.tags.join(', ')}</span>
        </div>
      )}
 
      {(problem.timeComplexity || problem.spaceComplexity) && (
        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {problem.timeComplexity && <span>Time: {problem.timeComplexity}</span>}
          {problem.spaceComplexity && <span>Space: {problem.spaceComplexity}</span>}
        </div>
      )}
 
      <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem', alignItems: 'center', paddingTop: '0.5rem' }}>
        <Link 
          to={`/problems/${problem.id}`}
          className="btn btn-secondary"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderColor: 'rgba(255, 255, 255, 0.35)' }}
        >
          View Details
        </Link>
        {problem.url && (
          <a 
            href={problem.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="card-hint"
            style={{ opacity: 0.8, color: 'var(--accent)', marginTop: 0 }}
          >
            Solve Problem ↗
          </a>
        )}
      </div>
    </div>
  );
}
