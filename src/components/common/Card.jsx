import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  action,
  style = {},
  className = '',
  padding = '1.5rem',
  ...props
}) => {
  return (
    <div
      className={`card-white ${className}`}
      style={{
        padding,
        ...style,
      }}
      {...props}
    >
      {(title || action) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            {title && <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{title}</h3>}
            {subtitle && <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
