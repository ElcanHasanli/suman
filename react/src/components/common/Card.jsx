import React from 'react';

const Card = ({ 
  children, 
  variant = 'default',
  padding = 'medium',
  className = '',
  style = {},
  onClick,
  hover = false,
  ...props 
}) => {
  const baseStyles = {
    background: 'white',
    borderRadius: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #f1f5f9',
    transition: 'all 0.3s ease',
    cursor: onClick ? 'pointer' : 'default',
  };

  const variants = {
    default: {
      background: 'white',
      border: '1px solid #f1f5f9',
    },
    elevated: {
      background: 'white',
      border: '1px solid #f1f5f9',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    outlined: {
      background: 'transparent',
      border: '2px solid #e5e7eb',
      boxShadow: 'none',
    },
    filled: {
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      boxShadow: 'none',
    }
  };

  const paddings = {
    none: { padding: '0' },
    small: { padding: '1rem' },
    medium: { padding: '1.5rem' },
    large: { padding: '2rem' },
  };

  const hoverStyles = hover ? {
    transform: 'translateY(-2px)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  } : {};

  const cardStyles = {
    ...baseStyles,
    ...variants[variant],
    ...paddings[padding],
    ...style,
  };

  return (
    <div
      className={className}
      style={cardStyles}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hover) {
          Object.assign(e.target.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = cardStyles.boxShadow;
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
