import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const SubmitIdea = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const { title, description, domain } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await API.post('/ideas', formData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      const message = err?.response?.data?.msg || err?.response?.data || 'Failed to submit idea';

      if (status === 401) {
        setErrorMsg('You must be logged in to submit an idea.');
        navigate('/login');
      } else {
        setErrorMsg(typeof message === 'string' ? message : 'Failed to submit idea');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', padding: '24px 20px 60px', background: '#fbf9f4' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        
        {/* Back Link */}
        <div style={{ marginBottom: '16px' }}>
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
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#4b5563'; }}
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Header Icon + Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: '#e0f2fe',
            marginBottom: '14px',
            boxShadow: '0 4px 14px rgba(96,165,250,0.18)',
          }}>
            <span style={{ fontSize: '28px' }}>🚀</span>
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: '1.9rem', fontWeight: 800, color: '#111827' }}>
            Submit Your Startup Idea
          </h1>
          <p style={{ color: '#4b5563', fontSize: '0.92rem', margin: 0, lineHeight: 1.5 }}>
            Share your innovative idea with the community and get valuable feedback!
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#991b1b',
            fontSize: '0.88rem',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span>🚫</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Card */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e8e3d8',
          borderRadius: '20px',
          padding: '32px 34px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}>
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', margin: 0, padding: 0, background: 'transparent', border: 'none', boxShadow: 'none' }}>
            
            <div>
              <label htmlFor="title" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '6px', letterSpacing: '0.5px' }}>
                IDEA TITLE
              </label>
              <input
                type="text"
                id="title"
                placeholder="Give your ideas a catchy title"
                name="title"
                value={title}
                onChange={onChange}
                required
                style={{
                  width: '100%',
                  background: '#ffffff',
                  border: '1px solid #e2ddd5',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#111827',
                  fontSize: '0.92rem',
                  boxSizing: 'border-box',
                  margin: 0,
                }}
              />
            </div>
            
            <div>
              <label htmlFor="description" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '6px', letterSpacing: '0.5px' }}>
                DESCRIPTION
              </label>
              <textarea
                id="description"
                placeholder="Describe your ideas in detail..."
                name="description"
                value={description}
                onChange={onChange}
                required
                rows="5"
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
                  resize: 'vertical',
                }}
              />
            </div>
            
            <div>
              <label htmlFor="domain" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '6px', letterSpacing: '0.5px' }}>
                DOMAIN/CATEGORY
              </label>
              <input
                type="text"
                id="domain"
                placeholder="e.g., AI, Health, Education, Finance"
                name="domain"
                value={domain}
                onChange={onChange}
                required
                style={{
                  width: '100%',
                  background: '#ffffff',
                  border: '1px solid #e2ddd5',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#111827',
                  fontSize: '0.92rem',
                  boxSizing: 'border-box',
                  margin: 0,
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: '#2563eb',
                color: '#ffffff',
                border: '1px solid #1d4ed8',
                borderRadius: '8px',
                padding: '11px 18px',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                marginTop: '8px',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#1d4ed8'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#2563eb'; }}
            >
              {loading ? 'Submitting...' : 'Submit Idea'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default SubmitIdea;