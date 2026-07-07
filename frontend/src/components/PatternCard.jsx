import { Link } from 'react-router-dom';
import client from '../api/client';

export default function PatternCard({ pattern, onDelete }) {
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete pattern "${pattern.name}"? This will unlink all associated snippets and problems.`)) return;
    try {
      await client.delete(`/patterns/${pattern.id}`);
      if (onDelete) onDelete();
    } catch {
      alert('Failed to delete pattern.');
    }
  };

  return (
    <Link
      to={`/patterns/${pattern.id}`}
      className="snippet-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        minHeight: '140px',
        textDecoration: 'none',
        position: 'relative',
      }}
    >
      <button 
        onClick={handleDelete} 
        style={{ 
          position: 'absolute', 
          top: '0.8rem', 
          right: '0.8rem', 
          background: 'rgba(209, 36, 47, 0.1)', 
          border: '1px solid rgba(209, 36, 47, 0.2)', 
          borderRadius: '4px',
          color: '#ff4d4d', 
          cursor: 'pointer',
          padding: '0.25rem 0.5rem',
          fontSize: '0.8rem',
          transition: 'all 0.2s',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(209, 36, 47, 0.2)';
          e.target.style.borderColor = 'rgba(209, 36, 47, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(209, 36, 47, 0.1)';
          e.target.style.borderColor = 'rgba(209, 36, 47, 0.2)';
        }}
        title="Delete Pattern"
      >
        Delete
      </button>

      <div style={{ paddingRight: '4.5rem' }}>
        <h3 className="card-title">
          {pattern.name}
        </h3>
      </div>

      <div className="card-subtext" style={{ fontSize: '0.85rem' }}>
        <span style={{ color: 'var(--accent)', marginRight: '0.4rem', fontFamily: 'var(--font-mono)' }}>» triggers when:</span>
        <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border)' }}>
          {pattern.triggerSignal}
        </code>
      </div>

      <div className="card-hint">
        View snippets →
      </div>
    </Link>
  );
}
