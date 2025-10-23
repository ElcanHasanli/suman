import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: '600',
    borderRadius: '0.75rem',
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || loading ? 0.6 : 1,
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      color: 'white',
      boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.3)',
    },
    secondary: {
      background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
      color: 'white',
      boxShadow: '0 10px 25px -5px rgba(107, 114, 128, 0.3)',
    },
    success: {
      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
      color: 'white',
      boxShadow: '0 10px 25px -5px rgba(22, 163, 74, 0.3)',
    },
    danger: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.3)',
    },
    warning: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      color: 'white',
      boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.3)',
    },
    outline: {
      background: 'transparent',
      color: '#2563eb',
      border: '2px solid #2563eb',
      boxShadow: 'none',
    },
    ghost: {
      background: 'transparent',
      color: '#6b7280',
      border: 'none',
      boxShadow: 'none',
    }
  };

  const sizes = {
    small: {
      padding: '0.5rem 0.75rem',
      fontSize: '0.875rem',
      minHeight: '2rem',
    },
    medium: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      minHeight: '2.5rem',
    },
    large: {
      padding: '1rem 2rem',
      fontSize: '1.125rem',
      minHeight: '3rem',
    }
  };

  const hoverStyles = {
    transform: 'translateY(-2px)',
    boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.2)',
  };

  const buttonStyles = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size],
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={buttonStyles}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.target.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = variants[variant].boxShadow;
        }
      }}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
