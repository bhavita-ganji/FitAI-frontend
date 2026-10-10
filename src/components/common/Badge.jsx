import React from 'react';

export const Badge = ({
  children,
  variant = 'sage', // 'sage', 'teal', 'coral', 'lavender', 'outline'
  style = {},
  className = '',
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`} style={style}>
      {children}
    </span>
  );
};
