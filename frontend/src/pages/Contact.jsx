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
    <div className="page-container" style={{ minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%)',
        borderRadius: '20px',
        padding: '52px 40px',
        textAlign: 'center',
        marginBottom: '36px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '220px', height: '220px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', left: '-40px',
          width: '160px', height: '160px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '50%',
        }} />
        <div style={{
          width: '64px', height: '64px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '18px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '30px',
          margin: '0 auto 18px',
          backdropFilter: 'blur(8px)',
        }}>
          📬
        </div>
        <h1 style={{ margin: '0 0 10px', color: '#fff', fontSize: '2rem', fontWeight: 800 }}>
          Contact & Feedback
        </h1>
        <p style={{ margin: '0 auto', color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', maxWidth: '480px' }}>
          We'd love to hear from you! Share your thoughts, suggestions, or questions with the StudentIdea team.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '24px', alignItems: 'start' }}>

        {/* Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { icon: '📧', title: 'Email Us', desc: 'startuphub695@gmail.com', sub: 'We reply within 24 hours' },
            { icon: '💡', title: 'Share Ideas', desc: 'Feature Requests', sub: 'Help us improve the platform' },
            { icon: '🐛', title: 'Report Issues', desc: 'Bug Reports', sub: 'Found a bug? Let us know' },
            { icon: '🤝', title: 'Collaborate', desc: 'Partnerships', sub: 'Mentors, investors & more' },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background: '#fff',
                border: '1px solid #e8e3d8',
                borderRadius: '14px',
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
              }}
            >
              <div style={{
                width: '44px', height: '44px', minWidth: '44px',
                background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px',
              }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>{item.title}</div>
                <div style={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.85rem' }}>{item.desc}</div>
                <div style={{ color: '#9ca3af', fontSize: '0.78rem', marginTop: '2px' }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e8e3d8',
          borderRadius: '20px',
          padding: '36px 32px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          <h2 style={{ margin: '0 0 6px', color: '#111827', fontSize: '1.3rem', fontWeight: 700 }}>
            Send us a Message
          </h2>
          <p style={{ margin: '0 0 28px', color: '#6b7280', fontSize: '0.9rem' }}>
            Fill in the form below and we'll get back to you shortly.
          </p>

          {status === 'success' ? (
            <div style={{
              background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
              border: '1px solid #bbf7d0',
              borderRadius: '14px',
              padding: '32px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '52px', marginBottom: '12px' }}>✅</div>
              <h3 style={{ margin: '0 0 8px', color: '#15803d', fontWeight: 700 }}>Message Sent!</h3>
              <p style={{ margin: '0 0 20px', color: '#166534', fontSize: '0.95rem' }}>
                Thank you for your feedback! We'll reply to your email soon.
              </p>
              <button
                onClick={() => setStatus('idle')}
                style={{
                  background: 'linear-gradient(135deg, #60a5fa, #93c5fd)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 28px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.75rem', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
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
                      width: '100%', padding: '11px 14px', borderRadius: '10px',
                      border: '1.5px solid #e8e3d8', background: '#fafaf8',
                      fontSize: '0.9rem', color: '#111827', outline: 'none',
                      transition: 'border-color 0.2s', boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#93c5fd'}
                    onBlur={(e) => e.target.style.borderColor = '#e8e3d8'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.75rem', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
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
                      width: '100%', padding: '11px 14px', borderRadius: '10px',
                      border: '1.5px solid #e8e3d8', background: '#fafaf8',
                      fontSize: '0.9rem', color: '#111827', outline: 'none',
                      transition: 'border-color 0.2s', boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#93c5fd'}
                    onBlur={(e) => e.target.style.borderColor = '#e8e3d8'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.75rem', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
                  SUBJECT (OPTIONAL)
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="e.g. Feature Request, Bug Report, General Feedback..."
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: '10px',
                    border: '1.5px solid #e8e3d8', background: '#fafaf8',
                    fontSize: '0.9rem', color: '#111827', outline: 'none',
                    transition: 'border-color 0.2s', boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#93c5fd'}
                  onBlur={(e) => e.target.style.borderColor = '#e8e3d8'}
                />
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.75rem', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
                  MESSAGE *
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell us what's on your mind..."
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: '10px',
                    border: '1.5px solid #e8e3d8', background: '#fafaf8',
                    fontSize: '0.9rem', color: '#111827', outline: 'none',
                    transition: 'border-color 0.2s', resize: 'vertical',
                    fontFamily: 'inherit', lineHeight: '1.6', boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#93c5fd'}
                  onBlur={(e) => e.target.style.borderColor = '#e8e3d8'}
                />
              </div>

              {status === 'error' && (
                <div style={{
                  background: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: '10px', padding: '12px 16px',
                  color: '#dc2626', fontSize: '0.88rem', marginBottom: '16px',
                }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  width: '100%',
                  background: status === 'loading'
                    ? '#e8e3d8'
                    : 'linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%)',
                  color: status === 'loading' ? '#9ca3af' : '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 28px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  letterSpacing: '0.3px',
                }}
              >
                {status === 'loading' ? (
                  <>
                    <span style={{
                      width: '18px', height: '18px',
                      border: '2.5px solid #9ca3af',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      display: 'inline-block',
                    }} />
                    Sending...
                  </>
                ) : (
                  <>📤 Send Message</>
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
