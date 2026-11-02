import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Register = () => {
  const [step, setStep] = useState(1); // Step 1: Form, Step 2: OTP
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const { name, email, password, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  // Step 1: Send OTP
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await API.post('/auth/register', formData);
      setSuccessMsg(res.data.msg || 'OTP sent successfully!');
      setStep(2); // Move to OTP step
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || 'Could not send verification OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const onVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await API.post('/auth/verify-otp', { email, otp });
      localStorage.setItem('token', res.data.token);
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || 'Invalid OTP code. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const onResendOTP = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await API.post('/auth/resend-otp', { email });
      setSuccessMsg(res.data.msg || 'New OTP sent to your email.');
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || 'Could not resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 20px 60px', background: '#fbf9f4' }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        
        {/* Back Link */}
        <div style={{ marginBottom: '14px' }}>
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

        {step === 1 ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
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
              <h1 style={{ margin: '0 0 6px', fontSize: '1.9rem', fontWeight: 800, color: '#111827' }}>Create Account</h1>
              <p style={{ color: '#4b5563', fontSize: '0.92rem', margin: 0, lineHeight: 1.5 }}>
                Join the Student Idea & Startup Hub community
              </p>
            </div>

            {errorMsg && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#991b1b',
                fontSize: '0.88rem',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span>🚫</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e8e3d8',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              padding: '30px',
            }}>
              <form onSubmit={onSubmit} style={{ margin: 0, padding: 0, background: 'transparent', border: 'none', boxShadow: 'none' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '6px', letterSpacing: '0.5px' }}>
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sunil Singh"
                    name="name"
                    value={name}
                    onChange={onChange}
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
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    name="email"
                    value={email}
                    onChange={onChange}
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
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                    minLength={6}
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

                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '8px', letterSpacing: '0.5px' }}>
                    I WANT TO JOIN AS
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'student' })}
                      style={{
                        background: role === 'student' ? '#2563eb' : '#ffffff',
                        border: '1px solid ' + (role === 'student' ? '#1d4ed8' : '#d1d5db'),
                        color: role === 'student' ? '#ffffff' : '#374151',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                        width: '100%',
                        margin: 0,
                      }}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'mentor' })}
                      style={{
                        background: role === 'mentor' ? '#2563eb' : '#ffffff',
                        border: '1px solid ' + (role === 'mentor' ? '#1d4ed8' : '#d1d5db'),
                        color: role === 'mentor' ? '#ffffff' : '#374151',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                        width: '100%',
                        margin: 0,
                      }}
                    >
                      Mentor
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '11px 18px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    background: '#2563eb',
                    color: '#ffffff',
                    border: '1px solid #1d4ed8',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    opacity: loading ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '16px 0 0',
                  }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#1d4ed8'; }}
                  onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#2563eb'; }}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP Verification'}
                </button>
              </form>
            </div>

            <p style={{ textAlign: 'center', marginTop: '18px', color: '#6b7280', fontSize: '0.88rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                Sign In
              </Link>
            </p>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
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
                <span style={{ fontSize: '28px' }}>📬</span>
              </div>
              <h1 style={{ margin: '0 0 6px', fontSize: '1.9rem', fontWeight: 800, color: '#111827' }}>Verify Your Email</h1>
              <p style={{ color: '#4b5563', fontSize: '0.92rem', margin: 0, lineHeight: 1.5 }}>
                We sent a 6-digit code to <strong style={{ color: '#111827' }}>{email}</strong>
              </p>
            </div>

            {errorMsg && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#991b1b',
                fontSize: '0.88rem',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span>🚫</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div style={{
                background: '#e6f9f0',
                border: '1px solid #a7f3d0',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#065f46',
                fontSize: '0.88rem',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span>✅</span>
                <span>{successMsg}</span>
              </div>
            )}

            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e8e3d8',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              padding: '30px',
            }}>
              <form onSubmit={onVerifyOTP} style={{ margin: 0, padding: 0, background: 'transparent', border: 'none', boxShadow: 'none' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '8px', textAlign: 'center', letterSpacing: '0.5px' }}>
                    ENTER 6-DIGIT OTP
                  </label>
                  <input
                    type="text"
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    required
                    autoFocus
                    style={{
                      width: '100%',
                      letterSpacing: '10px',
                      fontSize: '22px',
                      textAlign: 'center',
                      fontWeight: 700,
                      padding: '12px',
                      background: '#ffffff',
                      border: '1px solid #e2ddd5',
                      borderRadius: '10px',
                      color: '#111827',
                      boxSizing: 'border-box',
                      margin: 0,
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  style={{
                    width: '100%',
                    padding: '11px 18px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    background: '#2563eb',
                    color: '#ffffff',
                    border: '1px solid #1d4ed8',
                    borderRadius: '8px',
                    cursor: loading || otp.length < 6 ? 'not-allowed' : 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    opacity: loading || otp.length < 6 ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '16px 0 0',
                  }}
                  onMouseEnter={(e) => { if (!loading && otp.length === 6) e.currentTarget.style.background = '#1d4ed8'; }}
                  onMouseLeave={(e) => { if (!loading && otp.length === 6) e.currentTarget.style.background = '#2563eb'; }}
                >
                  {loading ? 'Verifying...' : 'Verify & Create Account'}
                </button>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <button
                    type="button"
                    onClick={onResendOTP}
                    disabled={loading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2563eb',
                      cursor: 'pointer',
                      padding: 0,
                      fontWeight: 600,
                    }}
                  >
                    🔄 Resend OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStep(1); setErrorMsg(''); setSuccessMsg(''); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    ← Change Email
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Register;