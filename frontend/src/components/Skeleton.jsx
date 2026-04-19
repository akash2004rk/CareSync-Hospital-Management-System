import React from 'react';

const Skeleton = ({ width, height, borderRadius, style, count = 1 }) => {
  const elements = [];
  for (let i = 0; i < count; i++) {
    elements.push(
      <div 
        key={i}
        style={{
          width: width || '100%',
          height: height || '20px',
          borderRadius: borderRadius || '4px',
          background: 'var(--bg-card-hover)',
          animation: 'shimmer 1.5s infinite linear',
          backgroundImage: 'linear-gradient(to right, var(--bg-card-hover) 0%, var(--border) 20%, var(--bg-card-hover) 40%, var(--bg-card-hover) 100%)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1000px 100%',
          ...style
        }}
      />
    );
  }

  return count === 1 ? elements[0] : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{elements}</div>;
};

export default Skeleton;
