import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const LANGUAGES = ['CPP', 'JS', 'PYTHON', 'JAVA'];

export default function SnippetForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', language: 'CPP', code: '', description: '', tags: '' });
  const [error, setError] = useState(null);

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });     //only update the changed field(s)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post('/snippets', {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      });
      navigate('/snippets');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <div>
      <h1>New Snippet</h1>
      {/* display error message if any */}
      {error && <p className="status-text error">{error}</p>}   

      <form className="form" onSubmit={handleSubmit}>
        <label>Title
          <input name="title" value={form.title} onChange={handleFormChange} required placeholder="e.g. Binary Search Template" />
        </label>

        <label>Language
          <select name="language" value={form.language} onChange={handleFormChange}>
            {LANGUAGES.map(language => <option key={language} value={language}>{language}</option>)}
          </select>
        </label>

        <label>Code
          <textarea name="code" value={form.code} onChange={handleFormChange} required rows={12}
            placeholder="Paste your code here..." style={{ fontFamily: 'var(--font-mono)' }} />
        </label>

        <label>Description (optional)
          <textarea name="description" value={form.description} onChange={handleFormChange} rows={3} />
        </label>

        <label>Tags (comma-separated)
          <input name="tags" value={form.tags} onChange={handleFormChange} placeholder="e.g. binary-search, array" />
        </label>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Create Snippet</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
