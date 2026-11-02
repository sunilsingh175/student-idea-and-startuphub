import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  // Login with Password
  const onPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await API.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  // Send Login OTP
  const onSendLoginOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address first.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await API.post('/auth/login-otp', { email });
      setSuccessMsg(res.data.msg || 'OTP sent! Please check your email.');
      setOtpSent(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || 'Could not send login OTP. Check your email or register.');
    } finally {
      setLoading(false);
    }
  };

  // Verify Login OTP
  const onVerifyLoginOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await API.post('/auth/verify-login-otp', { email, otp });
      localStorage.setItem('token', res.data.token);
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || 'Invalid OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 20px 60px', background: '#fbf9f4' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        
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
          <h1 style={{ margin: '0 0 6px', fontSize: '1.9rem', fontWeight: 800, color: '#111827' }}>Welcome Back</h1>
          <p style={{ color: '#4b5563', fontSize: '0.92rem', margin: 0, lineHeight: 1.5 }}>
            Sign in to access your ideas and mentorship hub feedback!
          </p>
        </div>

        {/* Method Toggle */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
          background: '#f4efe6',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid #e8e3d8',
          marginBottom: '18px',
        }}>
          <button
            type="button"
            onClick={() => { setLoginMethod('password'); setErrorMsg(''); setSuccessMsg(''); setOtpSent(false); }}
            style={{
              background: loginMethod === 'password' ? '#2563eb' : 'transparent',
              color: loginMethod === 'password' ? '#ffffff' : '#4b5563',
              border: loginMethod === 'password' ? '1px solid #1d4ed8' : '1px solid transparent',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.86rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
              boxShadow: 'none',
              width: '100%',
              margin: 0,
            }}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('otp'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              background: loginMethod === 'otp' ? '#2563eb' : 'transparent',
              color: loginMethod === 'otp' ? '#ffffff' : '#4b5563',
              border: loginMethod === 'otp' ? '1px solid #1d4ed8' : '1px solid transparent',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.86rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
              boxShadow: 'none',
              width: '100%',
              margin: 0,
            }}
          >
            Email OTP
          </button>
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

        {/* White Card Container */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e8e3d8',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          padding: '30px',
        }}>
          {loginMethod === 'password' ? (
            <form onSubmit={onPasswordSubmit} style={{ margin: 0, padding: 0, background: 'transparent', border: 'none', boxShadow: 'none' }}>
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

              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', letterSpacing: '0.5px' }}>
                    PASSWORD
                  </label>
                  <button
                    type="button"
                    onClick={() => { setLoginMethod('otp'); onSendLoginOTP({ preventDefault: () => {} }); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2563eb',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      padding: 0,
                      margin: 0,
                      width: 'auto',
                      fontWeight: 600,
                      boxShadow: 'none',
                    }}
                  >
                    Forgot? Use OTP
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  value={password}
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
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={otpSent ? onVerifyLoginOTP : onSendLoginOTP} style={{ margin: 0, padding: 0, background: 'transparent', border: 'none', boxShadow: 'none' }}>
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
                  disabled={otpSent}
                  required
                  style={{
                    width: '100%',
                    background: otpSent ? '#fbf9f4' : '#ffffff',
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

              {otpSent && (
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
                      padding: '10px',
                      background: '#ffffff',
                      border: '1px solid #e2ddd5',
                      borderRadius: '10px',
                      color: '#111827',
                      boxSizing: 'border-box',
                      margin: 0,
                    }}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (otpSent && otp.length < 6)}
                style={{
                  width: '100%',
                  padding: '11px 18px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  background: '#2563eb',
                  color: '#ffffff',
                  border: '1px solid #1d4ed8',
                  borderRadius: '8px',
                  cursor: loading || (otpSent && otp.length < 6) ? 'not-allowed' : 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  opacity: loading || (otpSent && otp.length < 6) ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '16px 0 0',
                }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#1d4ed8'; }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#2563eb'; }}
              >
                {loading ? 'Processing...' : otpSent ? 'Verify OTP & Login' : 'Send Login OTP'}
              </button>

              {otpSent && (
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <button
                    type="button"
                    onClick={onSendLoginOTP}
                    disabled={loading}
                    style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: 0, fontWeight: 600 }}
                  >
                    🔄 Resend OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtp(''); setErrorMsg(''); setSuccessMsg(''); }}
                    style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 0 }}
                  >
                    Change Email
                  </button>
                </div>
              )}
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '18px', color: '#6b7280', fontSize: '0.88rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
            Register Now
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;