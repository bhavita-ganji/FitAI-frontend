import React from 'react';

export const Skeleton = ({
  width = '100%',
  height = '20px',
  borderRadius = '8px',
  style = {},
}) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: '#E7EFE9',
        backgroundImage: 'linear-gradient(90deg, #E7EFE9 0%, #F4F8F5 50%, #E7EFE9 100%)',
        backgroundSize: '200% 100%',
        animation: 'skeletonWave 1.6s infinite linear',
        ...style,
      }}
    />
  );
};
