import React, { useState } from 'react';
import API from '../services/api';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      await API.post('/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err?.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 140px)', padding: '40px 20px 60px' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%)',
        borderRadius: '16px',
        padding: '44px 32px',
        textAlign: 'center',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden',
        maxWidth: '680px',
        margin: '0 auto 32px',
      }}>
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '200px', height: '200px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', left: '-40px',
          width: '140px', height: '140px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '50%',
        }} />
        <div style={{
          width: '56px', height: '56px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '26px',
          margin: '0 auto 14px',
          backdropFilter: 'blur(8px)',
        }}>
          📬
        </div>
        <h1 style={{ margin: '0 0 8px', color: '#fff', fontSize: '1.85rem', fontWeight: 800 }}>
          Contact & Feedback
        </h1>
        <p style={{ margin: '0 auto', color: 'rgba(255,255,255,0.9)', fontSize: '0.98rem', maxWidth: '440px', lineHeight: 1.5 }}>
          Have questions, suggestions, or feedback? Send us a message and it will go directly to our email.
        </p>
      </div>

      {/* Centered Form Card */}
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{
          background: '#ffffff',
          border: '1px solid #e8e3d8',
          borderRadius: '16px',
          padding: '36px 32px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}>
          <h2 style={{ margin: '0 0 6px', color: '#111827', fontSize: '1.25rem', fontWeight: 700 }}>
            Send us a Message
          </h2>
          <p style={{ margin: '0 0 24px', color: '#6b7280', fontSize: '0.88rem' }}>
            Fill in the details below. We'll get back to you at your email.
          </p>

          {status === 'success' ? (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '32px 24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '44px', marginBottom: '10px' }}>✅</div>
              <h3 style={{ margin: '0 0 6px', color: '#15803d', fontWeight: 700 }}>Message Sent!</h3>
              <p style={{ margin: '0 0 20px', color: '#166534', fontSize: '0.92rem' }}>
                Thank you for your feedback! We will review your message shortly.
              </p>
              <button
                onClick={() => setStatus('idle')}
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  border: '1px solid #1d4ed8',
                  borderRadius: '8px',
                  padding: '9px 20px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ margin: 0, padding: 0, background: 'transparent', border: 'none', boxShadow: 'none' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.75rem', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: '8px',
                      border: '1px solid #d1d5db', background: '#ffffff',
                      fontSize: '0.9rem', color: '#111827', outline: 'none',
                      boxSizing: 'border-box', margin: 0,
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.75rem', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    YOUR EMAIL *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: '8px',
                      border: '1px solid #d1d5db', background: '#ffffff',
                      fontSize: '0.9rem', color: '#111827', outline: 'none',
                      boxSizing: 'border-box', margin: 0,
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.75rem', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                  SUBJECT (OPTIONAL)
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="e.g. Feature Suggestion, Bug Report..."
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '8px',
                    border: '1px solid #d1d5db', background: '#ffffff',
                    fontSize: '0.9rem', color: '#111827', outline: 'none',
                    boxSizing: 'border-box', margin: 0,
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.75rem', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                  MESSAGE *
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Share your feedback or message here..."
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '8px',
                    border: '1px solid #d1d5db', background: '#ffffff',
                    fontSize: '0.9rem', color: '#111827', outline: 'none',
                    resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6',
                    boxSizing: 'border-box', margin: 0,
                  }}
                />
              </div>

              {status === 'error' && (
                <div style={{
                  background: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: '8px', padding: '10px 14px',
                  color: '#dc2626', fontSize: '0.86rem', marginBottom: '16px',
                }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  width: '100%',
                  background: status === 'loading' ? '#93c5fd' : '#2563eb',
                  color: '#ffffff',
                  border: '1px solid #1d4ed8',
                  borderRadius: '8px',
                  padding: '11px 18px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  margin: 0,
                }}
                onMouseEnter={(e) => { if (status !== 'loading') e.currentTarget.style.background = '#1d4ed8'; }}
                onMouseLeave={(e) => { if (status !== 'loading') e.currentTarget.style.background = '#2563eb'; }}
              >
                {status === 'loading' ? (
                  <>
                    <span style={{
                      width: '16px', height: '16px',
                      border: '2px solid #ffffff',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      display: 'inline-block',
                    }} />
                    Sending...
                  </>
                ) : (
                  <>Send Message</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Contact;
