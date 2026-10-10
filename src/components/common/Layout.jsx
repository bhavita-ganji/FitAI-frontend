import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { X } from 'lucide-react';

export const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const getPageTitles = () => {
    switch (location.pathname) {
      case '/dashboard':
        return { title: 'Dashboard Overview', subtitle: 'Welcome back to your personalized fitness journey' };
      case '/workouts':
        return { title: 'Workout Plans & Logging', subtitle: 'Manage your training routines and track completed sets' };
      case '/exercises':
        return { title: 'Exercise Library', subtitle: 'Browse evidence-based movements, execution cues, and safety tips' };
      case '/nutrition':
        return { title: 'Nutrition & Meal Planner', subtitle: 'Track meals, log foods, and optimize daily macronutrients' };
      case '/analytics':
        return { title: 'Performance Analytics', subtitle: 'Visualize your workout volume, consistency, and biometric trends' };
      case '/assistant':
        return { title: 'FitAI Intelligent Coach', subtitle: 'RAG-enhanced personalized training and sports nutrition guidance' };
      case '/profile':
        return { title: 'User Profile & Settings', subtitle: 'Manage your biometrics, target goals, and preferences' };
      case '/admin':
        return { title: 'Administrator Dashboard', subtitle: 'System metrics, user role governance, and RAG knowledge base' };
      default:
        return { title: 'FitAI Assistant', subtitle: 'AI-Powered Fitness & Nutrition' };
    }
  };

  const { title, subtitle } = getPageTitles();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Desktop Sidebar */}
      <div className="desktop-sidebar-container">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(31, 36, 33, 0.5)',
            backdropFilter: 'blur(3px)',
          }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            style={{ width: '280px', height: '100%', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                zIndex: 1001,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
              }}
            >
              <X size={22} />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar
          onToggleMobile={() => setMobileOpen(true)}
          title={title}
          subtitle={subtitle}
        />
        <main style={{ flex: 1, padding: '2rem', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
