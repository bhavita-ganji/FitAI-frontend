import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type, message, duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((msg, dur) => addToast('success', msg, dur), [addToast]);
  const error = useCallback((msg, dur) => addToast('error', msg, dur), [addToast]);
  const info = useCallback((msg, dur) => addToast('info', msg, dur), [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      <div style={{
        position: 'fixed',
        top: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '420px',
        width: 'calc(100% - 3rem)',
        pointerEvents: 'none',
      }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.9rem 1.1rem',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(31, 36, 33, 0.12)',
              border: `1px solid ${
                t.type === 'success' ? '#A7D7C5' : t.type === 'error' ? '#F7C5BA' : '#CAD7EE'
              }`,
              borderLeft: `5px solid ${
                t.type === 'success' ? '#2D6A4F' : t.type === 'error' ? '#E07A5F' : '#4A6FA5'
              }`,
              color: '#1F2421',
              fontSize: '0.88rem',
              animation: 'slideIn 0.25s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {t.type === 'success' && <CheckCircle2 size={18} color="#2D6A4F" />}
              {t.type === 'error' && <AlertCircle size={18} color="#E07A5F" />}
              {t.type === 'info' && <Info size={18} color="#4A6FA5" />}
              <span style={{ fontWeight: 500 }}>{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#89939E',
                display: 'flex',
                alignItems: 'center',
                padding: '0.2rem',
              }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
