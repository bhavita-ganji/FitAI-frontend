import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Dumbbell,
  BookOpen,
  UtensilsCrossed,
  LineChart,
  BotMessageSquare,
  User,
  ShieldCheck,
  LogOut,
  Sparkles,
  HeartPulse,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from './Badge';

export const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/workouts', label: 'Workout Plans', icon: Dumbbell },
    { to: '/exercises', label: 'Exercise Library', icon: BookOpen },
    { to: '/nutrition', label: 'Meal Planner', icon: UtensilsCrossed },
    { to: '/analytics', label: 'Progress Analytics', icon: LineChart },
    { to: '/assistant', label: 'FitAI Assistant', icon: BotMessageSquare, badge: 'RAG' },
    { to: '/profile', label: 'My Profile', icon: User },
  ];

  if (isAdmin) {
    navItems.push({ to: '/admin', label: 'Admin Console', icon: ShieldCheck, badge: 'ADMIN' });
  }

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      backgroundColor: '#FFFFFF',
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.5rem 1rem',
      zIndex: 100,
    }}>
      {/* Brand Header */}
      <div>
        <div
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem 0.75rem',
            marginBottom: '2rem',
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 10px rgba(45, 106, 79, 0.25)',
          }}>
            <HeartPulse size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
                Fit<span style={{ color: 'var(--color-primary)' }}>AI</span>
              </span>
              <Sparkles size={14} color="var(--color-accent-teal)" />
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', lineHeight: 1 }}>
              Personalized Wellness
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--color-primary)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--bg-sage-light)' : 'transparent',
                  transition: 'all 0.15s ease',
                  textDecoration: 'none',
                })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={19} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge variant={item.badge === 'ADMIN' ? 'coral' : 'sage'} style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                    {item.badge}
                  </Badge>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile & Logout */}
      <div style={{
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-light)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 0.5rem',
          borderRadius: '12px',
          backgroundColor: 'var(--bg-surface-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-sage-muted)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              flexShrink: 0,
            }}>
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.82rem', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.fullName || 'User'}
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#89939E',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: '8px',
              display: 'flex',
            }}
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
};
