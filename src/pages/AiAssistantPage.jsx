import React, { useState, useEffect, useRef } from 'react';
import {
  BotMessageSquare,
  Send,
  Sparkles,
  Plus,
  Trash2,
  BookOpen,
  Info,
  CheckCircle,
  HelpCircle,
  User,
} from 'lucide-react';
import { aiApi } from '../api/aiApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const AiAssistantPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDemoActive, setIsDemoActive] = useState(false);

  const messagesEndRef = useRef(null);
  const toast = useToast();

  const starterPrompts = [
    'How should I structure my progressive overload routine?',
    'What is the optimal daily protein intake for my goal?',
    'Is creatine monohydrate safe and how should I take it?',
    'How does sleep quality impact athletic muscle recovery?',
  ];

  const fetchConversations = async () => {
    try {
      const res = await aiApi.getConversations();
      if (res?.data) {
        setConversations(res.data);
        if (res.data.length > 0 && !activeConversationId) {
          loadConversation(res.data[0].id);
        }
      }
    } catch {
      // Quiet fail if no conversations yet
    }
  };

  const loadConversation = async (convId) => {
    setActiveConversationId(convId);
    try {
      const res = await aiApi.getMessages(convId);
      if (res?.data) {
        setMessages(res.data);
        const hasDemo = res.data.some((m) => m.demoResponse);
        setIsDemoActive(hasDemo);
      }
    } catch {
      toast.error('Failed to load chat history');
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (customPrompt) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || loading) return;

    const optimisticUserMsg = {
      id: Date.now(),
      senderRole: 'USER',
      content: textToSend,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticUserMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await aiApi.sendMessage(textToSend, activeConversationId);
      if (res?.data) {
        setActiveConversationId(res.data.conversationId);
        setIsDemoActive(res.data.demoMode);

        const assistantMsg = {
          id: res.data.messageId,
          senderRole: 'ASSISTANT',
          content: res.data.answer,
          ragSources: res.data.sources?.join(', '),
          demoResponse: res.data.demoMode,
          createdAt: res.data.createdAt,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        fetchConversations();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to receive AI response');
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    setIsDemoActive(false);
  };

  const handleDeleteConversation = async (id, e) => {
    e.stopPropagation();
    try {
      await aiApi.deleteConversation(id);
      toast.success('Conversation removed');
      if (activeConversationId === id) {
        handleStartNewChat();
      }
      fetchConversations();
    } catch {
      toast.error('Failed to delete conversation');
    }
  };

  // Helper to format basic markdown elements
  const renderFormattedContent = (content) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0.8rem 0 0.4rem', color: 'var(--text-main)' }}>{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('#### ')) {
        return <h5 key={idx} style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.6rem 0 0.3rem', color: 'var(--color-primary)' }}>{line.replace('#### ', '')}</h5>;
      }
      if (line.startsWith('- ')) {
        return (
          <li key={idx} style={{ marginLeft: '1.2rem', marginBottom: '0.25rem', fontSize: '0.88rem' }}>
            {line.replace('- ', '')}
          </li>
        );
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} style={{
            borderLeft: '3px solid var(--color-primary)',
            paddingLeft: '0.75rem',
            margin: '0.5rem 0',
            fontStyle: 'italic',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--bg-sage-light)',
            padding: '0.5rem 0.75rem',
            borderRadius: '4px',
          }}>
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      if (!line.trim()) {
        return <div key={idx} style={{ height: '0.5rem' }} />;
      }
      return <p key={idx} style={{ margin: '0 0 0.4rem 0', fontSize: '0.88rem', lineHeight: 1.55 }}>{line}</p>;
    });
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '260px 1fr',
      gap: '1.5rem',
      height: 'calc(100vh - 120px)',
      minHeight: '600px',
    }}>
      {/* Left Chat Sessions Drawer */}
      <Card padding="1rem" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <Button
          variant="primary"
          size="md"
          onClick={handleStartNewChat}
          icon={Plus}
          style={{ width: '100%', marginBottom: '1rem', justifyContent: 'center' }}
        >
          New Conversation
        </Button>

        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Recent Sessions ({conversations.length}):
        </span>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => loadConversation(conv.id)}
              style={{
                padding: '0.65rem 0.75rem',
                borderRadius: '10px',
                fontSize: '0.83rem',
                fontWeight: activeConversationId === conv.id ? 600 : 500,
                backgroundColor: activeConversationId === conv.id ? 'var(--bg-sage-light)' : 'transparent',
                color: activeConversationId === conv.id ? 'var(--color-primary)' : 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'background-color 0.15s ease',
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
                {conv.title}
              </span>
              <button
                onClick={(e) => handleDeleteConversation(conv.id, e)}
                style={{ background: 'transparent', border: 'none', color: '#89939E', cursor: 'pointer', padding: '0.2rem' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {conversations.length === 0 && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
              No previous chats found.
            </p>
          )}
        </div>
      </Card>

      {/* Main Chat Conversation Viewport */}
      <Card padding="0" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Top Chat Info Header */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-sage-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <BotMessageSquare size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>FitAI Personal Coach</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                RAG Retrieval • Profile-Bounded Prompting
              </span>
            </div>
          </div>

          {/* Demo Mode / Live LLM Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Badge variant={isDemoActive ? 'coral' : 'teal'}>
              <span className="pulse-dot" style={{ backgroundColor: isDemoActive ? '#E07A5F' : '#52B788' }} />
              {isDemoActive ? 'Demo Mode (FitAI KB)' : 'Live RAG Model'}
            </Badge>
          </div>
        </div>

        {/* Message Bubble Feed */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          backgroundColor: 'var(--bg-primary)',
        }}>
          {messages.length === 0 && (
            <div style={{ margin: 'auto', textAlign: 'center', maxWidth: '520px', padding: '2rem 1rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-sage-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}>
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
                How can FitAI guide your training today?
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.75rem' }}>
                Ask anything regarding workout structuring, progressive overload, recovery protocols, or daily macronutrients.
              </p>

              {/* Starter Prompt Chips */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {starterPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    style={{
                      padding: '0.65rem 1rem',
                      borderRadius: '12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.82rem',
                      color: 'var(--text-main)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    💬 "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => {
            const isUser = msg.senderRole === 'USER';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                }}
              >
                {!isUser && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}>
                    <BotMessageSquare size={16} />
                  </div>
                )}

                <div style={{
                  maxWidth: '75%',
                  padding: '1rem 1.25rem',
                  borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  backgroundColor: isUser ? 'var(--color-primary)' : '#FFFFFF',
                  color: isUser ? '#FFFFFF' : 'var(--text-main)',
                  boxShadow: isUser ? 'var(--shadow-sm)' : 'var(--shadow-md)',
                  border: isUser ? 'none' : '1px solid var(--border-light)',
                }}>
                  {isUser ? (
                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>{msg.content}</p>
                  ) : (
                    <div>
                      {renderFormattedContent(msg.content)}

                      {/* RAG Knowledge Citations Badge */}
                      {msg.ragSources && (
                        <div style={{
                          marginTop: '0.85rem',
                          paddingTop: '0.65rem',
                          borderTop: '1px solid var(--border-light)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.75rem',
                          color: 'var(--color-primary)',
                          fontWeight: 600,
                        }}>
                          <BookOpen size={13} />
                          <span>RAG Citations: {msg.ragSources}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-sage-muted)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}>
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <BotMessageSquare size={16} />
              </div>
              <div style={{ backgroundColor: '#FFFFFF', padding: '0.65rem 1rem', borderRadius: '12px', border: '1px solid var(--border-light)', display: 'flex', gap: '4px' }}>
                <span className="pulse-dot" style={{ backgroundColor: '#89939E' }} />
                <span className="pulse-dot" style={{ backgroundColor: '#89939E', animationDelay: '0.2s' }} />
                <span className="pulse-dot" style={{ backgroundColor: '#89939E', animationDelay: '0.4s' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '1rem 1.5rem',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--border-light)',
        }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
          >
            <input
              type="text"
              placeholder="Ask FitAI anything about workouts, diet, or recovery..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.75rem 1.1rem',
                borderRadius: '12px',
                border: '1px solid var(--border-light)',
                fontSize: '0.9rem',
                backgroundColor: 'var(--bg-surface-subtle)',
              }}
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              icon={Send}
              disabled={!inputMessage.trim()}
            >
              Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
