import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  // Keep user profile in sync
  useEffect(() => {
    if (token) {
      API.get('/auth/me')
        .then((res) => {
          if (res.data?.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        })
        .catch(() => {});
    } else {
      setUser(null);
    }
  }, [token, location.pathname]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const initial = user?.name ? user.name[0].toUpperCase() : '👤';
  const displayName = user?.name ? user.name.split(' ')[0] : 'Profile';

  return (
    <nav>
      <div className="container">
        <div>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🚀</span>
            <span>Student Idea & Startup Hub</span>
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {token ? (
            <>
              <Link
                to="/dashboard"
                style={{
                  color: location.pathname === '/dashboard' || location.pathname === '/' ? '#111827' : '#4b5563',
                  fontWeight: location.pathname === '/dashboard' || location.pathname === '/' ? 700 : 500,
                  borderBottom: location.pathname === '/dashboard' || location.pathname === '/' ? '2px solid #111827' : 'none',
                  borderRadius: 0,
                  padding: '8px 10px',
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/messages"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: location.pathname === '/messages' ? '#111827' : '#4b5563',
                  fontWeight: location.pathname === '/messages' ? 700 : 500,
                  borderBottom: location.pathname === '/messages' ? '2px solid #111827' : 'none',
                  borderRadius: 0,
                  padding: '8px 10px',
                }}
              >
                💬 Chats
              </Link>
              <Link
                to="/submit-idea"
                style={{
                  color: location.pathname === '/submit-idea' ? '#111827' : '#4b5563',
                  fontWeight: location.pathname === '/submit-idea' ? 700 : 500,
                  borderBottom: location.pathname === '/submit-idea' ? '2px solid #111827' : 'none',
                  borderRadius: 0,
                  padding: '8px 10px',
                }}
              >
                Submit Idea
              </Link>
              <Link
                to="/contact"
                style={{
                  color: location.pathname === '/contact' ? '#111827' : '#4b5563',
                  fontWeight: location.pathname === '/contact' ? 700 : 500,
                  borderBottom: location.pathname === '/contact' ? '2px solid #111827' : 'none',
                  borderRadius: 0,
                  padding: '8px 10px',
                }}
              >
                Contact
              </Link>

              {/* Profile Badge Link */}
              <Link
                to="/profile"
                title="View & Edit Profile"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#ffffff',
                  border: '1px solid #e2ddd5',
                  padding: '4px 12px 4px 4px',
                  borderRadius: '50px',
                  color: '#111827',
                  textDecoration: 'none',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s ease',
                  marginLeft: '4px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2ddd5';
                  e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)';
                }}
              >
                <span
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  {initial}
                </span>
                <span>{displayName}</span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    background: '#dcfce7',
                    color: '#16a34a',
                    padding: '2px 7px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                  }}
                >
                  {user?.role === 'mentor' ? 'Mentor' : 'Student'}
                </span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={logout}
                style={{
                  background: '#ffffff',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s',
                  marginLeft: '4px',
                  margin: 0,
                  width: 'auto',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link
                to="/register"
                style={{
                  background: '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  border: '1px solid #1d4ed8',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  textDecoration: 'none',
                }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;