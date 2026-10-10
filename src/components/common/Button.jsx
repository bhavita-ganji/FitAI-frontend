import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost', 'danger'
  size = 'md',        // 'sm', 'md', 'lg'
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  icon: Icon,
  style = {},
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: 'var(--bg-sage-light)',
          color: 'var(--color-primary)',
          border: '1px solid rgba(45, 106, 79, 0.2)',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-main)',
          border: '1px solid var(--border-light)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-muted)',
          border: 'none',
        };
      case 'danger':
        return {
          backgroundColor: 'var(--color-accent-coral)',
          color: '#FFFFFF',
          border: 'none',
        };
      case 'primary':
      default:
        return {
          backgroundColor: 'var(--color-primary)',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: 'var(--shadow-sm)',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '8px' };
      case 'lg':
        return { padding: '0.85rem 1.75rem', fontSize: '1rem', borderRadius: '14px' };
      case 'md':
      default:
        return { padding: '0.6rem 1.25rem', fontSize: '0.9rem', borderRadius: '10px' };
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontWeight: 600,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.18s ease',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      className={className}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={16} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
    </button>
  );
};
