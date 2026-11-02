import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: '#ffffff',
      borderTop: '1px solid #e8e3d8',
      marginTop: '60px',
      padding: '40px 0 20px',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: '40px',
          marginBottom: '32px',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '22px' }}>🚀</span>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827' }}>
                StudentIdea & Startup Hub
              </span>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.88rem', lineHeight: '1.7', margin: '0 0 16px', maxWidth: '300px' }}>
              A platform where student entrepreneurs connect, share ideas, collaborate, and build the future together.
            </p>
            <a
              href="mailto:startuphub695@gmail.com"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                color: '#3b82f6', fontWeight: 600, fontSize: '0.85rem',
                textDecoration: 'none',
              }}
            >
              📧 startuphub695@gmail.com
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ margin: '0 0 14px', color: '#111827', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { to: '/dashboard', label: '🏠 Dashboard' },
                { to: '/submit-idea', label: '💡 Submit Idea' },
                { to: '/messages', label: '💬 Messages' },
                { to: '/profile', label: '👤 Profile' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    color: '#6b7280', fontSize: '0.88rem', textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
                  onMouseLeave={(e) => e.target.style.color = '#6b7280'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ margin: '0 0 14px', color: '#111827', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { to: '/contact', label: '📬 Contact Us' },
                { to: '/contact', label: '💭 Send Feedback' },
                { to: '/register', label: '✨ Get Started' },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  style={{
                    color: '#6b7280', fontSize: '0.88rem', textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
                  onMouseLeave={(e) => e.target.style.color = '#6b7280'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #f0ece4',
          paddingTop: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.82rem' }}>
            © 2026 StudentIdea and Startup Hub. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link
              to="/contact"
              style={{ color: '#9ca3af', fontSize: '0.82rem', textDecoration: 'none' }}
              onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
              onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
            >
              Feedback
            </Link>
            <span style={{ color: '#e8e3d8' }}>|</span>
            <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Made with ❤️ for students</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
