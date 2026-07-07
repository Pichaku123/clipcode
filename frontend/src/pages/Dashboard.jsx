import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

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

export default function Dashboard() {
  const { data: snippets, loading: loadingSnippets, error: errorSnippets } = useApi('/snippets');
  const { data: problems, loading: loadingProblems, error: errorProblems } = useApi('/problems');
  const { data: patterns, loading: loadingPatterns, error: errorPatterns } = useApi('/patterns');

  const loading = loadingSnippets || loadingProblems || loadingPatterns;
  const error = errorSnippets || errorProblems || errorPatterns;

  if (loading) return <div style={{ padding: '2rem' }}><p className="status-text">Loading Dashboard...</p></div>;
  if (error) return <div style={{ padding: '2rem' }}><p className="status-text error">{error}</p></div>;

  // 1. Language Breakdown count
  const langCounts = (snippets || []).reduce((acc, s) => {
    acc[s.language] = (acc[s.language] || 0) + 1;
    return acc;
  }, {});

  const langStrings = Object.entries(langCounts)
    .map(([lang, count]) => `${lang}: ${count}`)
    .join(', ');

  // 2. Success Rate Calculation
  const totalProblems = problems?.length || 0;
  const solvedProblems = (problems || []).filter((p) => p.status === 'SOLVED').length;
  const successPercentage = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

  // 3. Difficulty dot calculations
  const diffCounts = (problems || []).reduce(
    (acc, p) => {
      if (p.difficulty) acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
      return acc;
    },
    { EASY: 0, MEDIUM: 0, HARD: 0 }
  );

  // 4. Platform dot calculations
  const platformCounts = (problems || []).reduce(
    (acc, p) => {
      acc[p.platform] = (acc[p.platform] || 0) + 1;
      return acc;
    },
    { LEETCODE: 0, CODEFORCES: 0, OTHER: 0 }
  );

  // 5. Needs Revisit
  const revisitProblems = (problems || []).filter((p) => p.status === 'REVISIT');

  // 6. Recently Added (sorted by createdAt)
  const sortedSnippets = [...(snippets || [])]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const sortedProblems = [...(problems || [])]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // 7. Patterns with no snippets yet
  const snippetPatternIds = new Set((snippets || []).map((s) => s.patternId).filter(Boolean));
  const emptyPatterns = (patterns || []).filter((p) => !snippetPatternIds.has(p.id));

  // Helper to render dot counts
  const renderDotRow = (label, count, color) => {
    const dotsString = '● '.repeat(count).trim();
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {count > 0 && (
            <span style={{ color, letterSpacing: '2px', fontSize: '1rem', fontWeight: 'bold' }}>{dotsString}</span>
          )}
          <span style={{ fontSize: '0.85rem', color: 'var(--text)', minWidth: '24px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
            ({count})
          </span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '0.5rem' }}>
      {/* Page Header & Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>Dashboard</h1>
          <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Welcome back! Here is a summary of your workspace.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <Link to="/snippets/new" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
            + Add Snippet
          </Link>
          <Link to="/problems/new" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
            + Add Problem
          </Link>
          <Link to="/patterns" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderColor: 'rgba(255,255,255,0.2)' }}>
            🧩 Manage Patterns
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
        {/* Patterns Stat */}
        <div className="snippet-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', padding: '1.2rem 1.5rem' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Patterns</span>
          <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--accent)' }}>{patterns?.length || 0}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Categorized design patterns</span>
        </div>

        {/* Snippets Stat */}
        <div className="snippet-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', padding: '1.2rem 1.5rem' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Snippets</span>
          <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--accent)' }}>{snippets?.length || 0}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {langStrings ? langStrings : 'No snippets languages tracked yet'}
          </span>
        </div>

        {/* Problems Stat */}
        <div className="snippet-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', padding: '1.2rem 1.5rem' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Problems solved</span>
          <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--accent)' }}>
            {solvedProblems} <span style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ {totalProblems}</span>
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Success Rate: <strong style={{ color: '#00b8a3' }}>{successPercentage}%</strong>
          </span>
        </div>
      </div>

      {/* Breakdowns Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Difficulty Breakdown */}
        <div className="snippet-card" style={{ padding: '1.2rem 1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', fontWeight: 600 }}>
            Difficulty Breakdown
          </h3>
          {renderDotRow('Easy', diffCounts.EASY, DIFFICULTY_COLORS.EASY)}
          {renderDotRow('Medium', diffCounts.MEDIUM, DIFFICULTY_COLORS.MEDIUM)}
          {renderDotRow('Hard', diffCounts.HARD, DIFFICULTY_COLORS.HARD)}
        </div>

        {/* Platform Breakdown */}
        <div className="snippet-card" style={{ padding: '1.2rem 1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', fontWeight: 600 }}>
            Platform Breakdown
          </h3>
          {renderDotRow('LeetCode', platformCounts.LEETCODE, 'var(--accent)')}
          {renderDotRow('Codeforces', platformCounts.CODEFORCES, '#38bdf8')}
          {renderDotRow('Other', platformCounts.OTHER, '#a78bfa')}
        </div>
      </div>

      {/* Lists Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* Needs Revisit */}
        <div className="snippet-card" style={{ padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 0.8rem 0', fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', fontWeight: 600 }}>
            Needs Revisit ({revisitProblems.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', maxHeight: '200px' }}>
            {revisitProblems.length > 0 ? (
              revisitProblems.map((prob) => (
                <div key={prob.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <Link to={`/problems/${prob.id}`} style={{ color: 'var(--text)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                    {prob.title}
                  </Link>
                  <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255, 192, 30, 0.1)', color: '#ffc01e', border: '1px solid rgba(255, 192, 30, 0.2)' }}>
                    {PLATFORM_LABELS[prob.platform]}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>All clean! No problems need revisit.</p>
            )}
          </div>
        </div>

        {/* Recently Added Snippets */}
        <div className="snippet-card" style={{ padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 0.8rem 0', fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', fontWeight: 600 }}>
            Recently Added Snippets
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {sortedSnippets.length > 0 ? (
              sortedSnippets.map((snip) => (
                <div key={snip.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <Link to={`/snippets/${snip.id}`} style={{ color: 'var(--text)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                    {snip.title}
                  </Link>
                  <span className="lang-badge" style={{ fontSize: '0.65rem' }}>{snip.language}</span>
                </div>
              ))
            ) : (
              <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>No code snippets yet.</p>
            )}
          </div>
        </div>

        {/* Recently Added Problems */}
        <div className="snippet-card" style={{ padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 0.8rem 0', fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', fontWeight: 600 }}>
            Recently Added Problems
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {sortedProblems.length > 0 ? (
              sortedProblems.map((prob) => (
                <div key={prob.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <Link to={`/problems/${prob.id}`} style={{ color: 'var(--text)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                    {prob.title}
                  </Link>
                  <span 
                    style={{ 
                      fontSize: '0.65rem', 
                      color: DIFFICULTY_COLORS[prob.difficulty] || 'var(--text-muted)', 
                      fontWeight: 600,
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    {prob.difficulty || 'NONE'}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>No problems yet.</p>
            )}
          </div>
        </div>

        {/* Empty Patterns */}
        <div className="snippet-card" style={{ padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 0.8rem 0', fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', fontWeight: 600 }}>
            Missing Snippet Coverage
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {emptyPatterns.length > 0 ? (
              emptyPatterns.map((pat) => (
                <Link
                  key={pat.id}
                  to={`/patterns/${pat.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <span 
                    className="tag" 
                    style={{ 
                      border: '1px solid rgba(209, 36, 47, 0.3)', 
                      color: '#ff4d4d', 
                      background: 'rgba(209, 36, 47, 0.05)',
                      fontSize: '0.75rem',
                      display: 'inline-block',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(209, 36, 47, 0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(209, 36, 47, 0.05)'}
                  >
                    🧩 {pat.name}
                  </span>
                </Link>
              ))
            ) : (
              <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>All patterns are covered by examples!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
