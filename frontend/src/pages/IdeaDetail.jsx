import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const IdeaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const currentUser = (() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  })();

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const res = await API.get(`/ideas/${id}`);
        setIdea(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await API.get(`/ideas/${id}/comments`);
        setComments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchIdea();
    fetchComments();
  }, [id]);

  const isOwner = Boolean(
    idea &&
    currentUser &&
    (
      (idea.createdBy?._id && String(idea.createdBy._id) === String(currentUser.id)) ||
      (typeof idea.createdBy === 'string' && String(idea.createdBy) === String(currentUser.id)) ||
      currentUser.role === 'admin'
    )
  );

  const handleDeleteIdea = async () => {
    if (!window.confirm(`Are you sure you want to delete "${idea.title}"? This action cannot be undone.`)) {
      return;
    }
    setIsDeleting(true);
    try {
      const res = await API.delete(`/ideas/${id}`);
      if (res.data?.success) {
        alert('Idea deleted successfully.');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Delete idea error:', err);
      alert(err.response?.data?.msg || 'Could not delete idea.');
      setIsDeleting(false);
    }
  };

  const handleUpvote = async () => {
    try {
      const res = await API.post(`/ideas/${id}/upvote`);
      setIdea(res.data);
    } catch (err) {
      console.error('Upvote error:', err.response?.data || err.message);
      alert(err.response?.data?.msg || 'Failed to upvote');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await API.post(`/ideas/${id}/comment`, { comment: newComment });
      setNewComment('');
      const res = await API.get(`/ideas/${id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to add comment');
    }
  };

  if (!idea) return (
    <div className="idea-detail-page">
      <div className="container">
        <div className="loading-card">
          <h2>Loading idea details...</h2>
        </div>
      </div>
    </div>
  );

  const authorName = idea.createdBy?.name || 'Anonymous';
  const authorRole = idea.createdBy?.role || 'student';
  const authorId = idea.createdBy?._id || idea.createdBy;

  return (
    <div className="idea-detail-page" style={{ minHeight: 'calc(100vh - 80px)', padding: '30px 20px 60px', background: '#fbf9f4' }}>
      <div className="container" style={{ maxWidth: '960px', margin: '0 auto' }}>
        <Link
          to="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#4b5563',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 600,
            marginBottom: '20px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#4b5563'; }}
        >
          ← Back to Dashboard
        </Link>
        
        {/* ─── Idea Main Content ─────────────────────────────────────────────── */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e8e3d8',
          borderRadius: '20px',
          padding: '36px',
          marginBottom: '28px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <h1 style={{ margin: '0 0 10px', fontSize: '2.1rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
                {idea.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{
                  background: '#e6f9f0',
                  color: '#059669',
                  border: '1px solid #a7f3d0',
                  padding: '4px 12px',
                  borderRadius: '50px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}>
                  🏷️ {idea.domain}
                </span>
                <span style={{ color: '#4b5563', fontSize: '0.9rem', fontWeight: 500 }}>
                  👤 By: {authorName} ({authorRole})
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {!isOwner && (
                <Link
                  to={`/messages?partnerId=${authorId}&ideaId=${idea._id}`}
                  style={{
                    background: '#e6f9f0',
                    color: '#059669',
                    border: '1px solid rgba(5, 150, 105, 0.3)',
                    padding: '9px 20px',
                    borderRadius: '50px',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(5,150,105,0.15)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#d1fae5'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#e6f9f0'; }}
                >
                  💬 Chat with Founder
                </Link>
              )}

              {isOwner && (
                <button
                  onClick={handleDeleteIdea}
                  disabled={isDeleting}
                  style={{
                    background: '#fee2e2',
                    border: '1px solid #fca5a5',
                    color: '#dc2626',
                    padding: '9px 18px',
                    borderRadius: '50px',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#fecaca'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                >
                  {isDeleting ? 'Deleting...' : '🗑️ Delete Idea'}
                </button>
              )}
            </div>
          </div>
          
          <div style={{ margin: '20px 0', padding: '16px 0', borderTop: '1px solid #f0ece3', borderBottom: '1px solid #f0ece3' }}>
            <p style={{ margin: 0, color: '#374151', fontSize: '1.02rem', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
              {idea.description}
            </p>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                className={`like-button ${idea.hasLiked ? 'liked' : ''}`}
                onClick={handleUpvote}
                style={{
                  background: idea.hasLiked ? '#e11d48' : '#ffffff',
                  color: idea.hasLiked ? '#ffffff' : '#374151',
                  border: '1px solid ' + (idea.hasLiked ? '#e11d48' : '#d1d5db'),
                  padding: '7px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  margin: 0,
                  width: 'auto',
                }}
              >
                {idea.hasLiked ? '❤️ Liked' : '🤍 Like'}
              </button>
              <span style={{ color: '#4b5563', fontSize: '0.92rem', fontWeight: 500 }}>
                {idea.upvotes?.length || 0} likes
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => window.open(`https://meet.jit.si/Idea-${id}`, '_blank')}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: '1px solid #1d4ed8',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  margin: 0,
                  width: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#2563eb'}
              >
                Start Video Meeting
              </button>
            </div>
          </div>
        </div>

        {/* ─── Comments & Discussion Section ────────────────────────────────── */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e8e3d8',
          borderRadius: '20px',
          padding: '32px 36px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '1.28rem', fontWeight: 800, color: '#111827' }}>
              💬 Comments & Feedback ({comments.length})
            </h2>
            {!isOwner && (
              <Link
                to={`/messages?partnerId=${authorId}&ideaId=${idea._id}`}
                style={{
                  color: '#059669',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Want to discuss privately? Chat with {authorName} →
              </Link>
            )}
          </div>

          <form onSubmit={handleComment} style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '0 0 24px', padding: 0, background: 'transparent', border: 'none', boxShadow: 'none' }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts, suggestions, or feedback..."
              required
              rows="3"
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1px solid #e2ddd5',
                borderRadius: '10px',
                padding: '12px 14px',
                color: '#111827',
                fontSize: '0.92rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                margin: 0,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button
                type="submit"
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: '1px solid #1d4ed8',
                  borderRadius: '8px',
                  padding: '9px 18px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  margin: 0,
                  width: 'auto',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#2563eb'}
              >
                Post Comment
              </button>
            </div>
          </form>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {comments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#6b7280', fontSize: '0.92rem' }}>
                No comments yet. Be the first to share your feedback!
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  style={{
                    background: '#fbf9f4',
                    border: '1px solid #e8e3d8',
                    borderLeft: '3px solid #60a5fa',
                    borderRadius: '12px',
                    padding: '14px 18px',
                  }}
                >
                  <p style={{ margin: '0 0 8px', color: '#111827', fontSize: '0.92rem', lineHeight: 1.5 }}>
                    {comment.comment}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem', color: '#6b7280' }}>
                    <span style={{ fontWeight: 600, color: '#374151' }}>👤 {comment.userId?.name || 'Anonymous'}</span>
                    <span>•</span>
                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default IdeaDetail;