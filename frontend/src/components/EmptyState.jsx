import { Link } from 'react-router-dom';

export default function EmptyState({ message, actionLink, actionLabel }) {
  return (
    <div className="empty-state">
      <p style={{ margin: '0 0 1.2rem 0', color: 'var(--text-muted)', fontSize: '1rem' }}>
        {message || 'No items found.'}
      </p>
      {actionLink && actionLabel && (
        <Link to={actionLink} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
