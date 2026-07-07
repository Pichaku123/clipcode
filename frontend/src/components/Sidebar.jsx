import { NavLink, Link } from 'react-router-dom';
 
const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/snippets', label: 'Snippets' },
  { to: '/problems', label: 'Problems' },
  { to: '/patterns', label: 'Patterns' },
];
 
export default function Sidebar() {
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
    </nav>
  );
}