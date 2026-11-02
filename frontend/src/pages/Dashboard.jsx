import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Dashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const navigate = useNavigate();

  const currentUser = (() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  })();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchIdeas = async () => {
      try {
        const res = await API.get('/ideas');
        setIdeas(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchIdeas();
  }, [navigate]);

  const handleUpvote = async (ideaId) => {
    try {
      const res = await API.post(`/ideas/${ideaId}/upvote`);
      setIdeas((prevIdeas) =>
        prevIdeas.map((idea) => (idea._id === ideaId ? res.data : idea))
      );
    } catch (err) {
      console.error('Upvote failed:', err.response?.data || err.message);
    }
  };

  const handleDeleteIdea = async (ideaId, ideaTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${ideaTitle}"? This cannot be undone.`)) {
      return;
    }
    try {
      const res = await API.delete(`/ideas/${ideaId}`);
      if (res.data?.success) {
        setIdeas((prev) => prev.filter((idea) => idea._id !== ideaId));
      }
    } catch (err) {
      console.error('Delete idea error:', err);
      alert(err.response?.data?.msg || 'Could not delete idea.');
    }
  };

  return (
    <div className="dashboard">
      <div className="hero-section">
        <h1>Welcome to Student Startup Hub</h1>
        <p>Discover, share, and collaborate on innovative startup ideas</p>
        <Link to="/submit-idea" className="cta-button">🚀 Submit your idea</Link>
      </div>
      <div className="container">
        <div className="guidance-section">
          <h2>🚀 Get Started</h2>
          <div className="guidance-cards">
            <div className="guidance-card">
              <h3>💡 Share Idea</h3>
              <p>Have a startup idea? Submit it here and get feedback from the community.</p>
            </div>
            <div className="guidance-card">
              <h3>🤝 Collaborate</h3>
              <p>Connect with like-minded students to build your team and turn ideas into reality.</p>
            </div>
            <div className="guidance-card">
              <h3>📝 Get Inspired</h3>
              <p>Browse trending ideas, upvote your favorites, and learn from successful startups.</p>
            </div>
            <div className="guidance-card">
              <h3>💬 Ask AI</h3>
              <p>Use our AI assistant for business advice, market research, guidance.</p>
            </div>
          </div>
        </div>
        <div className="dashboard-content">
          <h2>Latest Ideas</h2>
          <div className="idea-list">
            {ideas.map((idea) => {
              const isOwner = Boolean(
                currentUser && (
                  (idea.createdBy?._id && String(idea.createdBy._id) === String(currentUser.id)) ||
                  (typeof idea.createdBy === 'string' && String(idea.createdBy) === String(currentUser.id)) ||
                  currentUser.role === 'admin'
                )
              );

              return (
                <div key={idea._id} className="idea-card">
                  <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>{idea.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="domain-badge">{idea.domain}</span>
                      {isOwner && (
                        <button
                          onClick={() => handleDeleteIdea(idea._id, idea.title)}
                          title="Delete your idea"
                          style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#ef4444',
                            borderRadius: '8px',
                            padding: '4px 8px',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="idea-description">{idea.description}</p>
                  <div className="card-footer">
                    <span className="author">👤 {idea.createdBy?.name || 'Anonymous'}</span>
                    <button 
                      className={`like-button ${idea.hasLiked ? 'liked' : ''}`} 
                      onClick={() => handleUpvote(idea._id)}
                    >
                      {idea.hasLiked ? 'Liked' : 'Like'} ({idea.upvotes?.length || 0})
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    <Link to={`/idea/${idea._id}`} className="view-details" style={{ flex: 1, textAlign: 'center', margin: 0 }}>
                      View Details
                    </Link>
                    {!isOwner && (
                      <Link
                        to={`/messages?partnerId=${idea.createdBy?._id || idea.createdBy}&ideaId=${idea._id}`}
                        title={`Chat directly with ${idea.createdBy?.name || 'the founder'}`}
                        style={{
                          background: '#e6f9f0',
                          color: '#059669',
                          border: '1px solid rgba(5, 150, 105, 0.25)',
                          padding: '8px 18px',
                          borderRadius: '50px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#d1f4e4'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#e6f9f0'; }}
                      >
                        ● Chat
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;