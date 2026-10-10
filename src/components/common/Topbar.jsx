import React, { useState } from 'react';
import { Bell, Menu, X, Sparkles, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Topbar = ({ onToggleMobile, title, subtitle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header style={{
      height: '70px',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--border-light)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 90,
    }}>
      {/* Page Title & Mobile Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleMobile}
          className="mobile-only-btn"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            padding: '0.4rem',
            display: 'none', // Handled via responsive CSS
          }}
        >
          <Menu size={22} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
            {title || 'Dashboard'}
          </h2>
          {subtitle && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Controls: AI status badge, notification bell, profile dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* FitAI Coach Quick Action Pill */}
        <div
          onClick={() => navigate('/assistant')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--bg-sage-light)',
            color: 'var(--color-primary)',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            border: '1px solid rgba(45, 106, 79, 0.15)',
          }}
        >
          <Sparkles size={15} color="var(--color-primary)" />
          <span>Ask FitAI Coach</span>
        </div>

        {/* Notifications Icon with popover */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <Bell size={18} />
            <span style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-accent-coral)',
            }} />
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '300px',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-light)',
              padding: '1rem',
              zIndex: 1000,
            }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Notifications</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px', fontSize: '0.8rem' }}>
                  <p style={{ fontWeight: 600, margin: 0 }}>Workout Reminder 🎯</p>
                  <p style={{ color: 'var(--text-muted)', margin: 0, marginTop: '0.2rem' }}>You're 1 workout away from hitting your weekly streak goal!</p>
                </div>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px', fontSize: '0.8rem' }}>
                  <p style={{ fontWeight: 600, margin: 0 }}>Hydration Check 💧</p>
                  <p style={{ color: 'var(--text-muted)', margin: 0, marginTop: '0.2rem' }}>Stay on track with 2.5L daily target.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Menu */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowMenu(!showMenu)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-sage-muted)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: '2px solid var(--border-light)',
            }}
          >
            {user?.fullName?.charAt(0) || 'U'}
          </div>

          {showMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '200px',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-light)',
              padding: '0.5rem',
              zIndex: 1000,
            }}>
              <button
                onClick={() => { setShowMenu(false); navigate('/profile'); }}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '0.85rem',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                }}
              >
                <User size={16} />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => { setShowMenu(false); logout(); navigate('/login'); }}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '0.85rem',
                  color: 'var(--color-accent-coral)',
                  cursor: 'pointer',
                }}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
