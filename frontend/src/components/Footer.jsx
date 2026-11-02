import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      background: '#ffffff',
      borderTop: '1px solid #e8e3d8',
      marginTop: '60px',
      padding: '24px 0',
      textAlign: 'center',
    }}>
      <div className="container">
        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.88rem', fontWeight: 500 }}>
          @2026 StudentIdea and Startup Hub
        </p>
      </div>
    </footer>
  );
};

export default Footer;
