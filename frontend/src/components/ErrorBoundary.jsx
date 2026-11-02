import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#fbf9f4',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e8e3d8',
            padding: '36px 28px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div>
            <h2 style={{ margin: '0 0 10px', color: '#111827', fontSize: '1.4rem' }}>Something went wrong</h2>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.5 }}>
              {this.state.error?.message || 'An unexpected error occurred. Please try reloading the page.'}
            </p>
            <button
              onClick={() => { window.location.href = '/dashboard'; }}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: '1px solid #1d4ed8',
                borderRadius: '8px',
                padding: '10px 20px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
