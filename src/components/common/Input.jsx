import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  name,
  style = {},
  ...props
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
      {label && (
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
          {label} {required && <span style={{ color: 'var(--color-accent-coral)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: '0.9rem', color: '#89939E', pointerEvents: 'none', display: 'flex' }}>
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          style={{
            width: '100%',
            padding: Icon ? '0.65rem 0.9rem 0.65rem 2.5rem' : '0.65rem 0.9rem',
            borderRadius: '10px',
            border: `1px solid ${error ? 'var(--color-accent-coral)' : 'var(--border-light)'}`,
            backgroundColor: disabled ? '#F4F7F4' : '#FFFFFF',
            color: 'var(--text-main)',
            fontSize: '0.9rem',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            ...style,
          }}
          onFocus={(e) => {
            if (!error) e.target.style.borderColor = 'var(--color-primary-light)';
            e.target.style.boxShadow = '0 0 0 3px rgba(64, 145, 108, 0.12)';
          }}
          onBlur={(e) => {
            if (!error) e.target.style.borderColor = 'var(--border-light)';
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        />
      </div>
      {error && <span style={{ fontSize: '0.78rem', color: 'var(--color-accent-coral)', fontWeight: 500 }}>{error}</span>}
      {!error && helperText && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{helperText}</span>}
    </div>
  );
};
