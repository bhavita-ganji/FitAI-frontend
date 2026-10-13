import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, X } from 'lucide-react';

/**
 * BackendStatus — displays a non-intrusive banner when the Render backend
 * appears to be starting up (cold start). Automatically hides once the
 * backend responds successfully.
 *
 * Used in LoginPage and RegisterPage where the first API call is made.
 */
export const BackendStatus = ({ isLoading, hasError, onDismiss }) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isLoading && !dismissed) {
      // Show banner after 5 seconds of loading (likely a cold start)
      const timer = setTimeout(() => setVisible(true), 5000);
      return () => clearTimeout(timer);
    }
    if (!isLoading && !hasError) {
      setVisible(false);
    }
  }, [isLoading, hasError, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
    onDismiss?.();
  };

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9998,
        backgroundColor: '#1e293b',
        color: '#f1f5f9',
        borderRadius: '12px',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        maxWidth: 'calc(100vw - 3rem)',
        fontSize: '0.85rem',
        animation: 'slideUp 0.3s ease-out',
      }}
    >
      <Wifi size={16} color="#818cf8" style={{ flexShrink: 0 }} />
      <span>
        <strong style={{ color: '#a5b4fc' }}>Backend is warming up…</strong>
        {' '}Render free-tier services take ~20 seconds on first request. Please wait.
      </span>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        style={{
          background: 'transparent',
          border: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          padding: '0.15rem',
          flexShrink: 0,
        }}
      >
        <X size={14} />
      </button>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
};
