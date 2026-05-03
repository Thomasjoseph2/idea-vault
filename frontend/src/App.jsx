import { useState, useEffect } from 'react';
import axios from 'axios';
import { Lightbulb, Trash2, Plus, Server, Cloud } from 'lucide-react';
import './index.css';

// Using environment variable for API URL to allow easy switching between local and EC2
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/ideas';

function App() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web App'
  });

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setIdeas(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching ideas:', err);
      setError('Could not connect to the backend. Make sure the server is running!');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    
    try {
      const res = await axios.post(API_URL, formData);
      setIdeas([res.data, ...ideas]);
      setFormData({ title: '', description: '', category: 'Web App' });
    } catch (err) {
      console.error('Error creating idea:', err);
      setError('Failed to create idea.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setIdeas(ideas.filter(idea => idea._id !== id));
    } catch (err) {
      console.error('Error deleting idea:', err);
    }
  };

  return (
    <div className="app-wrapper">
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="header-title">Idea Vault</h1>
        <p className="subtitle">Capture your creative sparks before they vanish.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Cloud size={16} /> S3 Frontend Ready
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Server size={16} /> EC2 Backend Ready
          </span>
        </div>
      </header>

      {error && (
        <div className="glass-container animate-in" style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', marginBottom: '2rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          {error}
        </div>
      )}

      <div className="glass-container vault-form animate-in">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Idea Title</label>
              <input 
                type="text" 
                name="title" 
                placeholder="e.g. AI Recipe Generator" 
                value={formData.title} 
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange}>
                <option value="Web App">Web App</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Hardware">Hardware</option>
                <option value="Tool">Tool</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description" 
              placeholder="What makes this idea special?" 
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <button type="submit">
            <Plus size={18} /> Vault this Idea
          </button>
        </form>
      </div>

      {loading ? (
        <div className="loader"><Lightbulb size={48} className="animate-pulse" /></div>
      ) : (
        <div className="ideas-grid">
          {ideas.map((idea, index) => (
            <div 
              key={idea._id} 
              className="glass-container idea-card animate-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="idea-category">{idea.category}</span>
              <h3 className="idea-title">{idea.title}</h3>
              <p className="idea-desc">{idea.description}</p>
              
              <div className="idea-footer">
                <span className="idea-date">
                  {new Date(idea.createdAt).toLocaleDateString(undefined, {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </span>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(idea._id)}
                  title="Remove from vault"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {ideas.length === 0 && !error && (
            <div className="glass-container idea-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              <Lightbulb size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3 style={{ color: 'var(--text-muted)' }}>The vault is empty. Add your first great idea above!</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
