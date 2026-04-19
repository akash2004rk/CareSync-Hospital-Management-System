import React from 'react';

const UserAvatar = ({ name = 'User', size = 'md' }) => {
  const getInitials = (n) => {
    const parts = n.split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getGradient = (n) => {
    const colors = [
      ['#3b82f6', '#8b5cf6'],
      ['#10b981', '#3b82f6'],
      ['#f59e0b', '#ef4444'],
      ['#ec4899', '#8b5cf6'],
      ['#06b6d4', '#3b82f6']
    ];
    // Hash name to pick consistent color
    let hash = 0;
    for (let i = 0; i < n.length; i++) {
        hash = n.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return `linear-gradient(135deg, ${colors[index][0]}, ${colors[index][1]})`;
  };

  const szMap = {
    'sm': { size: '32px', fontSize: '13px' },
    'md': { size: '48px', fontSize: '18px' },
    'lg': { size: '64px', fontSize: '24px' },
    'xl': { size: '96px', fontSize: '36px' }
  };

  const { size: dim, fontSize } = szMap[size] || szMap['md'];

  return (
    <div style={{
      width: dim,
      height: dim,
      borderRadius: '50%',
      background: getGradient(name),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 600,
      fontSize,
      flexShrink: 0,
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      border: '2px solid rgba(255,255,255,0.1)'
    }}>
      {getInitials(name)}
    </div>
  );
};

export default UserAvatar;
