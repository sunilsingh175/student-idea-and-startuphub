import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Messages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialIdeaId = searchParams.get('ideaId');
  const initialPartnerId = searchParams.get('partnerId');

  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [activeIdea, setActiveIdea] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const currentUser = (() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  })();

  // Initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // When initialIdeaId & initialPartnerId are present in URL, open or setup that chat
  useEffect(() => {
    if (initialIdeaId && initialPartnerId) {
      loadThread(initialPartnerId, initialIdeaId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialIdeaId, initialPartnerId]);

  // Polling for new messages in active thread
  useEffect(() => {
    if (!activePartner || !activeIdea) return;

    const interval = setInterval(() => {
      pollThread(activePartner._id, activeIdea._id);
    }, 3000);

    return () => clearInterval(interval);
  }, [activePartner, activeIdea]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await API.get('/messages/conversations');
      if (res.data?.success) {
        setConversations(res.data.conversations || []);

        // If no active chat selected yet and no URL params, select first conversation
        if (!initialPartnerId && res.data.conversations?.length > 0 && !activePartner) {
          const first = res.data.conversations[0];
          loadThread(first.partner._id, first.idea._id);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadThread = async (partnerId, ideaId) => {
    try {
      const res = await API.get(`/messages/thread?partnerId=${partnerId}&ideaId=${ideaId}`);
      if (res.data?.success) {
        setActivePartner(res.data.partner);
        setActiveIdea(res.data.idea);
        setMessages(res.data.messages || []);
        setSearchParams({ partnerId, ideaId });
      }
    } catch (err) {
      console.error('Failed to load chat thread:', err);
    }
  };

  const pollThread = async (partnerId, ideaId) => {
    try {
      const res = await API.get(`/messages/thread?partnerId=${partnerId}&ideaId=${ideaId}`);
      if (res.data?.success) {
        setMessages(res.data.messages || []);
      }
    } catch (err) {
      // Quiet error on polling
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !activePartner || !activeIdea || sending) return;

    const textToSend = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const res = await API.post('/messages/send', {
        recipientId: activePartner._id,
        ideaId: activeIdea._id,
        message: textToSend,
      });

      if (res.data?.success && res.data.message) {
        setMessages((prev) => [...prev, res.data.message]);
        fetchConversations();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      alert(err.response?.data?.msg || 'Could not send message.');
    } finally {
      setSending(false);
    }
  };

  const quickSend = (text) => {
    setNewMessage(text);
  };

  const filteredConversations = conversations.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      c.partner?.name?.toLowerCase().includes(q) ||
      c.idea?.title?.toLowerCase().includes(q) ||
      c.lastMessage?.text?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="chat-container">
      
      {/* WhatsApp-style Main Frame */}
      <div className="chat-frame">

        {/* ─── LEFT PANEL: CONVERSATIONS LIST ─────────────────────────────────── */}
        <div style={{
          width: '100%',
          maxWidth: '100%',
          background: '#fdfcf9',
          borderRight: '1px solid #e8e3d8',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          boxSizing: 'border-box',
          minWidth: 0,
        }}>
          
          {/* Top Bar */}
          <div style={{
            padding: '14px 16px',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #ede8de',
            boxSizing: 'border-box',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '15px',
                fontWeight: 700,
                color: 'white',
                flexShrink: 0,
              }}>
                {currentUser?.name?.[0]?.toUpperCase() || '👤'}
              </div>
              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem', lineHeight: 1.2 }}>Chats</div>
                <div style={{ fontSize: '0.74rem', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser?.name || 'User'}
                </div>
              </div>
            </div>

            <Link
              to="/dashboard"
              title="Browse more startup ideas"
              style={{
                color: '#4b5563',
                fontSize: '0.78rem',
                fontWeight: 600,
                textDecoration: 'none',
                background: '#f4efe6',
                border: '1px solid #e2ddd5',
                padding: '5px 12px',
                borderRadius: '20px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              + Find Ideas
            </Link>
          </div>

          {/* Search Box */}
          <div style={{ padding: '10px 14px', background: '#fdfcf9', borderBottom: '1px solid #ede8de', boxSizing: 'border-box' }}>
            <div style={{
              background: '#f4efe6',
              border: '1px solid #e2ddd5',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 10px',
            }}>
              <span style={{ color: '#9ca3af', marginRight: '6px', fontSize: '13px' }}>🔍</span>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#111827',
                  padding: '8px 0',
                  margin: 0,
                  fontSize: '0.86rem',
                  outline: 'none',
                  boxShadow: 'none',
                  width: '100%',
                }}
              />
            </div>
          </div>

          {/* Chats List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '30px 16px', textAlign: 'center', color: '#6b7280', fontSize: '0.86rem' }}>
                Loading your chats...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div style={{ padding: '30px 16px', textAlign: 'center', color: '#6b7280' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
                <p style={{ margin: '0 0 8px', fontSize: '0.88rem', fontWeight: 600, color: '#111827' }}>No chats yet</p>
                <p style={{ fontSize: '0.78rem', color: '#6b7280', lineHeight: 1.4, margin: '0 0 12px' }}>
                  Click <strong>"Chat with Founder"</strong> on any idea to start discussing!
                </p>
                <Link
                  to="/dashboard"
                  style={{
                    display: 'inline-block',
                    background: 'var(--gradient)',
                    color: 'white',
                    padding: '6px 14px',
                    borderRadius: '16px',
                    fontSize: '0.78rem',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Explore Ideas 🚀
                </Link>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected =
                  activePartner?._id === conv.partner._id &&
                  activeIdea?._id === conv.idea._id;

                const timeStr = conv.lastMessage?.createdAt
                  ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '';

                return (
                  <div
                    key={conv.key}
                    onClick={() => loadThread(conv.partner._id, conv.idea._id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 14px',
                      cursor: 'pointer',
                      background: isSelected ? '#ede8de' : 'transparent',
                      borderBottom: '1px solid #ede8de',
                      transition: 'background 0.15s ease',
                      boxSizing: 'border-box',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = '#f5f0e6';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: conv.partner.role === 'mentor' ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' : 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'white',
                      flexShrink: 0,
                    }}>
                      {conv.partner?.name?.[0]?.toUpperCase() || '👤'}
                    </div>

                    {/* Chat Item Details */}
                    <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {conv.partner.name}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: conv.unreadCount > 0 ? '#10b981' : '#9ca3af', flexShrink: 0, marginLeft: '6px' }}>
                          {timeStr}
                        </span>
                      </div>

                      {/* Idea Topic Tag */}
                      <div style={{
                        fontSize: '0.72rem',
                        color: '#2563eb',
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginBottom: '2px',
                      }}>
                        💡 {conv.idea?.title}
                      </div>

                      {/* Last message + unread */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          fontSize: '0.78rem',
                          color: '#6b7280',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {conv.lastMessage?.text || 'No messages yet'}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span style={{
                            background: '#10b981',
                            color: 'white',
                            borderRadius: '10px',
                            padding: '1px 6px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            marginLeft: '6px',
                            flexShrink: 0,
                          }}>
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* ─── RIGHT PANEL: ACTIVE CHAT ──────────────────────────────────────── */}
        {activePartner && activeIdea ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            background: '#fbf9f4',
            minWidth: 0,
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}>
            
            {/* Active Header */}
            <div style={{
              padding: '12px 18px',
              background: '#ffffff',
              borderBottom: '1px solid #e8e3d8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              boxSizing: 'border-box',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: activePartner.role === 'mentor' ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' : 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'white',
                  flexShrink: 0,
                }}>
                  {activePartner.name?.[0]?.toUpperCase() || '👤'}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.98rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {activePartner.name}
                    </span>
                    <span style={{
                      fontSize: '0.68rem',
                      background: '#dcfce7',
                      color: '#16a34a',
                      padding: '2px 7px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      flexShrink: 0,
                    }}>
                      {activePartner.role}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>●</span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Direct chat regarding startup idea
                    </span>
                  </div>
                </div>
              </div>

              {/* Idea Badge with Link */}
              <Link
                to={`/idea/${activeIdea._id}`}
                title="View full idea details"
                style={{
                  background: '#f4efe6',
                  border: '1px solid #e2ddd5',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  color: '#111827',
                  textDecoration: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                <span>💡 {activeIdea.title}</span>
                <span style={{ color: '#2563eb' }}>View Idea →</span>
              </Link>
            </div>

            {/* Messages Wallpaper Area with delicate dot grid */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              backgroundColor: '#fbf9f4',
              backgroundImage: 'radial-gradient(#d5cebe 1.2px, transparent 1.2px)',
              backgroundSize: '20px 20px',
              boxSizing: 'border-box',
              minWidth: 0,
            }}>
              
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', margin: 'auto', color: '#6b7280', maxWidth: '360px', padding: '20px' }}>
                  <div style={{ fontSize: '38px', marginBottom: '10px' }}>👋</div>
                  <h3 style={{ color: '#111827', margin: '0 0 6px', fontSize: '1.05rem' }}>Start the conversation</h3>
                  <p style={{ fontSize: '0.82rem', lineHeight: 1.5, margin: 0, color: '#6b7280' }}>
                    Discuss collaboration, mentorship, tech stack, or investment directly with {activePartner.name}.
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isSelf = String(msg.sender?._id || msg.sender) === String(currentUser?.id);
                  const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={msg._id}
                      style={{
                        alignSelf: isSelf ? 'flex-end' : 'flex-start',
                        maxWidth: '72%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div style={{
                        background: isSelf ? '#dcfce7' : '#e0f2fe',
                        color: isSelf ? '#064e3b' : '#0f172a',
                        border: isSelf ? '1px solid #bbf7d0' : '1px solid #bae6fd',
                        padding: '9px 14px 6px',
                        borderRadius: isSelf ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                        fontSize: '0.9rem',
                        lineHeight: 1.45,
                        wordBreak: 'break-word',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        position: 'relative',
                      }}>
                        {!isSelf && (
                          <div style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: activePartner.role === 'mentor' ? '#059669' : '#2563eb',
                            marginBottom: '2px',
                          }}>
                            {activePartner.name}
                          </div>
                        )}
                        <div>{msg.message}</div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '4px',
                          fontSize: '0.66rem',
                          color: isSelf ? 'rgba(6, 78, 59, 0.7)' : 'rgba(15, 23, 42, 0.6)',
                          marginTop: '3px',
                        }}>
                          <span>{time}</span>
                          {isSelf && (
                            <span style={{ color: msg.read ? '#0284c7' : 'rgba(6, 78, 59, 0.5)', fontWeight: 700, fontSize: '0.78rem' }}>
                              ✓✓
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="chat-chips" style={{
              padding: '8px 16px',
              background: '#ffffff',
              borderTop: '1px solid #e8e3d8',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              flexShrink: 0,
              boxSizing: 'border-box',
              minWidth: 0,
            }}>
              {[
                '👋 Hi! Love this startup idea.',
                '🤝 Would love to collaborate with you!',
                '💡 Can we discuss tech stack & timeline?',
                '🚀 Are you looking for student teammates?',
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => quickSend(chip)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2ddd5',
                    color: '#4b5563',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    width: 'auto',
                    margin: 0,
                    flexShrink: 0,
                    transition: 'all 0.15s',
                    boxShadow: 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; e.currentTarget.style.background = '#f4efe6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#4b5563'; e.currentTarget.style.background = '#ffffff'; }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Bottom Message Input Bar */}
            <form
              onSubmit={handleSendMessage}
              style={{
                padding: '12px 16px',
                background: '#ffffff',
                borderTop: '1px solid #e8e3d8',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                margin: 0,
                maxWidth: 'none',
                boxShadow: 'none',
                borderRadius: 0,
                border: 'none',
                boxSizing: 'border-box',
                flexShrink: 0,
              }}
            >
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{
                  flex: 1,
                  background: '#f4efe6',
                  border: '1px solid #e2ddd5',
                  borderRadius: '50px',
                  padding: '10px 18px',
                  color: '#111827',
                  fontSize: '0.92rem',
                  outline: 'none',
                  margin: 0,
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                style={{
                  background: 'linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '42px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: sending || !newMessage.trim() ? 'not-allowed' : 'pointer',
                  opacity: sending || !newMessage.trim() ? 0.6 : 1,
                  fontSize: '16px',
                  padding: 0,
                  margin: 0,
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(96, 165, 250, 0.35)',
                }}
              >
                ➤
              </button>
            </form>

          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fbf9f4',
            color: '#6b7280',
            padding: '40px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '56px', marginBottom: '14px' }}>💬</div>
            <h2 style={{ color: '#111827', marginBottom: '8px', fontSize: '1.3rem' }}>Student Startup Hub Web</h2>
            <p style={{ maxWidth: '380px', lineHeight: 1.5, fontSize: '0.88rem', margin: 0, color: '#6b7280' }}>
              Select a conversation from the left or click <strong>"Chat with Founder"</strong> on any idea card to discuss projects, team up, or connect with mentors in private.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};

export default Messages;
