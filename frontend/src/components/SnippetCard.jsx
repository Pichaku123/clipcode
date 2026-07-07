import { Link } from 'react-router-dom';
import client from '../api/client';

const LANG_COLORS = {
  CPP: '#f34b7d',
  JS: '#f7df1e',
  PYTHON: '#3572A5',
  JAVA: '#b07219',
};

export default function SnippetCard({ snippet, onDelete }) {
  const dotColor = LANG_COLORS[snippet.language] || 'var(--text-muted)';

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete snippet "${snippet.title}"?`)) return;
    try {
      await client.delete(`/snippets/${snippet.id}`);
      if (onDelete) onDelete();
    } catch {
      alert('Failed to delete snippet.');
    }
  };

  return (
    <Link to={`/snippets/${snippet.id}`} className="snippet-card" style={{ position: 'relative', display: 'block', textDecoration: 'none' }}>  
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
        title="Delete Snippet"
      >
        Delete
      </button>

      <div className="snippet-card-header" style={{ paddingRight: '4.5rem' }}>
        <h3>{snippet.title}</h3>
        <span className="lang-badge" style={{ '--dot': dotColor }}>
          {snippet.language}
        </span>
      </div>
      {/* snippet preview */}
      <pre className="snippet-card-preview">{snippet.code.slice(0, 150)}</pre>
      {snippet.tags?.length > 0 && (
        <div className="snippet-card-tags">
          {/* snippet tags */}
          {snippet.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
    </Link>
  );
}
