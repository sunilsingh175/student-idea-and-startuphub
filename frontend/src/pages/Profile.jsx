import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
    fetchUserIdeas();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/auth/me');
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        setName(res.data.user.name || '');
        setSkills(res.data.user.skills || []);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      // Fallback to localStorage if API fails
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setName(parsed.name || '');
        setSkills(parsed.skills || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserIdeas = async () => {
    try {
      const res = await API.get('/ideas/user/my-ideas');
      setIdeas(res.data || []);
    } catch (err) {
      console.error('Failed to load user ideas:', err);
    }
  };

  const handleDeleteIdea = async (ideaId, ideaTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${ideaTitle}"? This cannot be undone.`)) {
      return;
    }
    try {
      const res = await API.delete(`/ideas/${ideaId}`);
      if (res.data?.success) {
        setIdeas((prev) => prev.filter((i) => i._id !== ideaId));
        setMessage({ type: 'success', text: `"${ideaTitle}" deleted successfully.` });
      }
    } catch (err) {
      console.error('Delete idea error:', err);
      setMessage({ type: 'error', text: err.response?.data?.msg || 'Could not delete idea.' });
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      setMessage({ type: 'error', text: 'Skill already added!' });
      return;
    }
    setSkills([...skills, trimmed]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await API.put('/auth/profile', { name, skills });
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.msg || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(102,126,234,0.3)', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading profile...</p>
      </div>
    );
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const memberDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Recently';

  const totalVotes = ideas.reduce((acc, idea) => acc + (idea.upvotes?.length || 0), 0);

  return (
    <div className="container" style={{ padding: '36px 20px', maxWidth: '1020px', margin: '0 auto' }}>
      
      {/* ─── Hero Card ──────────────────────────────────────────────────────── */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e8e3d8',
        padding: '32px 36px',
        marginBottom: '28px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Initials Avatar */}
            <div style={{
              width: '74px',
              height: '74px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 800,
              color: 'white',
              boxShadow: '0 6px 20px rgba(99,102,241,0.3)',
              flexShrink: 0,
            }}>
              {initials}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: '1.85rem', fontWeight: 800, color: '#111827' }}>
                  {user?.name || 'User Profile'}
                </h1>
                <span style={{
                  background: '#e6f9f0',
                  color: '#059669',
                  border: '1px solid #a7f3d0',
                  padding: '3px 12px',
                  borderRadius: '50px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  {user?.role === 'mentor' ? 'MENTOR' : 'STUDENT'}
                </span>
              </div>
              <p style={{ margin: '6px 0 0', color: '#4b5563', fontSize: '0.92rem' }}>
                ✉️ {user?.email} • 🗓️ Joined {memberDate}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link
              to="/submit-idea"
              style={{
                background: '#2563eb',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.88rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                border: '1px solid #1d4ed8',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
            >
              + Submit Idea
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: '#ffffff',
                color: '#374151',
                border: '1px solid #d1d5db',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
            >
              Logout
            </button>
          </div>

        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
          marginTop: '28px',
          paddingTop: '24px',
          borderTop: '1px solid #f0ece3',
        }}>
          <div style={{ background: '#ffffff', padding: '18px 16px', borderRadius: '14px', textAlign: 'center', border: '1px solid #e8e3d8' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3b82f6' }}>{ideas.length}</div>
            <div style={{ fontSize: '0.76rem', color: '#4b5563', fontWeight: 700, marginTop: '4px', letterSpacing: '0.5px' }}>IDEAS SUBMITTED</div>
          </div>
          <div style={{ background: '#ffffff', padding: '18px 16px', borderRadius: '14px', textAlign: 'center', border: '1px solid #e8e3d8' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{totalVotes}</div>
            <div style={{ fontSize: '0.76rem', color: '#4b5563', fontWeight: 700, marginTop: '4px', letterSpacing: '0.5px' }}>TOTAL UPVOTES</div>
          </div>
          <div style={{ background: '#ffffff', padding: '18px 16px', borderRadius: '14px', textAlign: 'center', border: '1px solid #e8e3d8' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#8b5cf6' }}>{skills.length}</div>
            <div style={{ fontSize: '0.76rem', color: '#4b5563', fontWeight: 700, marginTop: '4px', letterSpacing: '0.5px' }}>SKILLS LISTED</div>
          </div>
        </div>

      </div>

      {/* ─── Feedback message ───────────────────────────────────────────────── */}
      {message.text && (
        <div style={{
          background: message.type === 'success' ? '#e6f9f0' : '#fee2e2',
          border: message.type === 'success' ? '1px solid #a7f3d0' : '1px solid #fca5a5',
          color: message.type === 'success' ? '#065f46' : '#991b1b',
          padding: '13px 20px',
          borderRadius: '12px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.9rem',
          fontWeight: 500,
        }}>
          <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{message.text}</span>
        </div>
      )}

      {/* ─── 2-Column Layout: Edit Profile + Submitted Ideas ───────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Edit Profile & Skills */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e8e3d8',
          padding: '28px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 20px', color: '#111827' }}>
            ✏️ Profile Settings
          </h2>

          <form onSubmit={handleSaveProfile} style={{ margin: 0, padding: 0, background: 'transparent', border: 'none', boxShadow: 'none' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '6px', letterSpacing: '0.5px' }}>
                DISPLAY NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: '#ffffff',
                  border: '1px solid #e2ddd5',
                  borderRadius: '10px',
                  padding: '11px 14px',
                  color: '#111827',
                  fontSize: '0.92rem',
                  boxSizing: 'border-box',
                  margin: 0,
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '6px', letterSpacing: '0.5px' }}>
                EMAIL (ACCOUNT IDENTIFIER)
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                style={{
                  width: '100%',
                  background: '#fbf9f4',
                  border: '1px solid #e8e3d8',
                  borderRadius: '10px',
                  padding: '11px 14px',
                  color: '#6b7280',
                  fontSize: '0.92rem',
                  cursor: 'not-allowed',
                  boxSizing: 'border-box',
                  margin: 0,
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '6px', letterSpacing: '0.5px' }}>
                PASSWORD
              </label>
              <input
                type="password"
                value={user?.email || '••••••••••••'}
                disabled
                style={{
                  width: '100%',
                  background: '#fbf9f4',
                  border: '1px solid #e8e3d8',
                  borderRadius: '10px',
                  padding: '11px 14px',
                  color: '#6b7280',
                  fontSize: '0.92rem',
                  cursor: 'not-allowed',
                  boxSizing: 'border-box',
                  margin: 0,
                }}
              />
            </div>

            {/* Skills */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '8px', letterSpacing: '0.5px' }}>
                SKILLS & EXPERTISE
              </label>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                {skills.length === 0 ? (
                  <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>No skills added yet.</span>
                ) : (
                  skills.map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: '#e0f2fe',
                        color: '#0369a1',
                        border: '1px solid #bae6fd',
                        borderRadius: '50px',
                        padding: '4px 12px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#0284c7',
                          padding: 0,
                          cursor: 'pointer',
                          fontSize: '14px',
                          lineHeight: 1,
                          fontWeight: 700,
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
                <input
                  type="text"
                  placeholder="e.g. Python, UI/UX, React"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  style={{
                    flex: '1 1 auto',
                    minWidth: 0,
                    background: '#ffffff',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '9px 12px',
                    color: '#111827',
                    fontSize: '0.88rem',
                    boxSizing: 'border-box',
                    margin: 0,
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  style={{
                    flexShrink: 0,
                    width: 'auto',
                    margin: 0,
                    background: '#2563eb',
                    border: '1px solid #1d4ed8',
                    color: '#ffffff',
                    padding: '9px 18px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontSize: '0.88rem',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#1d4ed8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#2563eb'; }}
                >
                  Add
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                width: '100%',
                padding: '11px 18px',
                background: '#2563eb',
                color: '#ffffff',
                border: '1px solid #1d4ed8',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                opacity: saving ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => { if (!saving) e.currentTarget.style.background = '#1d4ed8'; }}
              onMouseLeave={(e) => { if (!saving) e.currentTarget.style.background = '#2563eb'; }}
            >
              {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.82rem', color: '#6b7280' }}>
            Need an account? <Link to="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Register Now</Link>
          </p>
        </div>

        {/* Right Column: Submitted Ideas */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e8e3d8',
          padding: '28px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#111827' }}>
              💡 My Submitted Ideas ({ideas.length})
            </h2>
            <Link
              to="/submit-idea"
              style={{
                color: '#2563eb',
                fontSize: '0.88rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              + New Idea
            </Link>
          </div>

          {ideas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: '#6b7280' }}>
              <div style={{ fontSize: '42px', marginBottom: '12px' }}>🌱</div>
              <p style={{ margin: '0 0 16px', fontSize: '0.95rem', color: '#4b5563' }}>
                You haven't submitted any startup ideas yet.
              </p>
              <Link
                to="/submit-idea"
                style={{
                  background: 'linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%)',
                  color: 'white',
                  padding: '10px 22px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'inline-block',
                  boxShadow: '0 4px 14px rgba(96,165,250,0.3)',
                }}
              >
                Submit Your First Idea 🚀
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {ideas.map((idea) => (
                <div
                  key={idea._id}
                  style={{
                    background: '#fbf9f4',
                    border: '1px solid #e8e3d8',
                    borderRadius: '14px',
                    padding: '18px 20px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e8e3d8';
                    e.currentTarget.style.background = '#fbf9f4';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                    <Link
                      to={`/idea/${idea._id}`}
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        color: '#111827',
                        textDecoration: 'none',
                      }}
                    >
                      {idea.title}
                    </Link>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '3px 10px',
                      borderRadius: '50px',
                      background: '#f3f4f6',
                      color: '#4b5563',
                      border: '1px solid #e5e7eb',
                      letterSpacing: '0.5px',
                    }}>
                      {idea.status || 'SUBMITTED'}
                    </span>
                  </div>

                  <p style={{
                    margin: '0 0 12px',
                    color: '#4b5563',
                    fontSize: '0.88rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.5,
                  }}>
                    {idea.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#6b7280', flexWrap: 'wrap', gap: '10px' }}>
                    <span style={{
                      background: '#e6f9f0',
                      color: '#059669',
                      border: '1px solid #a7f3d0',
                      padding: '3px 10px',
                      borderRadius: '50px',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                    }}>
                      🏷️ {idea.domain}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: '#4b5563', fontWeight: 500 }}>👍 {idea.upvotes?.length || 0} votes</span>
                      <Link to={`/idea/${idea._id}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
                        View →
                      </Link>
                      <button
                        onClick={() => handleDeleteIdea(idea._id, idea.title)}
                        title="Delete this idea"
                        style={{
                          background: '#fee2e2',
                          border: '1px solid #fca5a5',
                          color: '#dc2626',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#fecaca'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Profile;
