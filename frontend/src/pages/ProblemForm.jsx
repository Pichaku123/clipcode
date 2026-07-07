import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import client from '../api/client';

const PLATFORMS = ['LEETCODE', 'CODEFORCES', 'OTHER'];
const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];
const STATUSES = ['SOLVED', 'REVISIT'];

export default function ProblemForm() {
  const navigate = useNavigate();
  const { data: patterns } = useApi('/patterns');

  const [form, setForm] = useState({
    title: '',
    url: '',
    platform: 'LEETCODE',
    difficulty: 'EASY',
    timeComplexity: '',
    spaceComplexity: '',
    notes: '',
    status: 'SOLVED',
    patternId: '',
    tags: '',
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await client.post('/problems', {
        ...form,
        url: form.url || undefined,
        difficulty: form.difficulty || undefined,
        timeComplexity: form.timeComplexity || undefined,
        spaceComplexity: form.spaceComplexity || undefined,
        notes: form.notes || undefined,
        patternId: form.patternId || null,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      });
      navigate('/problems');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1>New Problem</h1>
      {error && <p className="status-text error">{error}</p>}

      <form className="form" onSubmit={handleSubmit} style={{ maxWidth: '580px' }}>
        <label>Title
          <input name="title" value={form.title} onChange={set} required placeholder="e.g. 3Sum" />
        </label>

        <label>URL (optional)
          <input name="url" value={form.url} onChange={set} placeholder="e.g. https://leetcode.com/problems/3sum/" />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <label>Platform
            <select name="platform" value={form.platform} onChange={set}>
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>

          <label>Difficulty
            <select name="difficulty" value={form.difficulty} onChange={set}>
              <option value="">None</option>
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <label>Time Complexity
            <input name="timeComplexity" value={form.timeComplexity} onChange={set} placeholder="e.g. O(N log N)" />
          </label>

          <label>Space Complexity
            <input name="spaceComplexity" value={form.spaceComplexity} onChange={set} placeholder="e.g. O(N)" />
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <label>Status
            <select name="status" value={form.status} onChange={set}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          <label>Linked Pattern (optional)
            <select name="patternId" value={form.patternId} onChange={set}>
              <option value="">None</option>
              {patterns?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
        </div>

        <label>Notes
          <textarea name="notes" value={form.notes} onChange={set} rows={3} placeholder="Key insights, gotchas, etc." />
        </label>

        <label>Tags (comma-separated)
          <input name="tags" value={form.tags} onChange={set} placeholder="e.g. dynamic-programming, array" />
        </label>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Creating...' : 'Create Problem'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
