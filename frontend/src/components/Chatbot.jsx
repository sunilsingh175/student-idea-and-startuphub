import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      text: "👋 Hi! I'm your AI Startup Mentor. Ask me anything about validating ideas, tech stacks, business models, or pitch deck advice!",
      sender: 'ai',
    },
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  const sendMessage = async () => {
    const textToSend = input.trim();
    if (!textToSend || loading) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to chat with the AI Assistant.');
      navigate('/login');
      return;
    }

    const userMessage = { text: textToSend, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await API.post('/chat', { message: textToSend });
      const aiResponseText = res.data?.response || "I'm here to help with your startup ideas!";
      const aiMessage = { text: aiResponseText, sender: 'ai' };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chatbot request failed:', err);

      const status = err?.response?.status;
      const backendMessage =
        err?.response?.data?.msg ||
        err?.response?.data?.response ||
        err?.response?.data ||
        "Sorry, I couldn't process that.";

      if (status === 401 || /token is not valid/i.test(backendMessage)) {
        localStorage.removeItem('token');
        alert('Your session has expired. Please log in again to use the chat.');
        navigate('/login');
        return;
      }

      const errorMessage = { text: backendMessage, sender: 'ai' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <div
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? 'Close AI Assistant' : 'Chat with AI Startup Assistant'}
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? '✕' : '💬'}
      </div>

      {isOpen && (
        <div className="chatbot">
          <div className="chatbot-header">
            <h3>🤖 AI Startup Mentor</h3>
            <button onClick={() => setIsOpen(false)} title="Close Assistant">
              ×
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender}`}
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div
                className="message ai"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--accent)',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                }}
              >
                <span>✨ Thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me about startup ideas, tech stack..."
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}>
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;