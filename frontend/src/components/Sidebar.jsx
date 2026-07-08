import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
 
const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/snippets', label: 'Snippets' },
  { to: '/problems', label: 'Problems' },
  { to: '/patterns', label: 'Patterns' },
];
 
export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sidebar">
      <Link to="/" className="sidebar-logo-link">
        <div className="sidebar-logo">
          <span style={{ color: 'var(--text-muted)', opacity: 0.5 }}>&lt;</span>
          <span style={{ color: 'var(--accent)' }}>clip</span>
          <span style={{ color: 'var(--text)' }}>code</span>
          <span style={{ color: 'var(--text-muted)', opacity: 0.5 }}>/&gt;</span>
        </div>
      </Link>
      <div className="sidebar-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => 
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
      {user && (
        <div style={styles.userContainer}>
          <div style={styles.userEmail} title={user.email}>
            👤 {user.email.split('@')[0]}
          </div>
          <button onClick={logout} style={styles.logoutBtn}>
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
}

const styles = {
  userContainer: {
    marginTop: 'auto',
    padding: '16px 12px 4px 12px',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'stretch'
  },
  userEmail: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-h)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'left'
  },
  logoutBtn: {
    padding: '7px 12px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    background: 'var(--code-bg)',
    color: 'var(--text)',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.15s ease'
  }
};