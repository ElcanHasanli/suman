import React from 'react';
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

const Alert = ({ 
  children, 
  type = 'info',
  title = '',
  dismissible = false,
  onDismiss,
  className = '',
  style = {},
  ...props 
}) => {
  const baseStyles = {
    padding: '1rem 1.5rem',
    borderRadius: '0.75rem',
    border: '1px solid',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    transition: 'all 0.3s ease',
  };

  const types = {
    success: {
      background: '#f0fdf4',
      borderColor: '#bbf7d0',
      color: '#166534',
      iconColor: '#16a34a',
    },
    error: {
      background: '#fef2f2',
      borderColor: '#fecaca',
      color: '#dc2626',
      iconColor: '#ef4444',
    },
    warning: {
      background: '#fffbeb',
      borderColor: '#fed7aa',
      color: '#d97706',
      iconColor: '#f59e0b',
    },
    info: {
      background: '#eff6ff',
      borderColor: '#bfdbfe',
      color: '#1e40af',
      iconColor: '#3b82f6',
    }
  };

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const IconComponent = icons[type];

  const alertStyles = {
    ...baseStyles,
    ...types[type],
    ...style,
  };

  return (
    <div
      className={className}
      style={alertStyles}
      {...props}
    >
      <IconComponent 
        size={20} 
        style={{ 
          color: types[type].iconColor,
          flexShrink: 0,
          marginTop: '0.125rem'
        }} 
      />
      
      <div style={{ flex: 1 }}>
        {title && (
          <div style={{ 
            fontWeight: '600', 
            marginBottom: '0.25rem',
            fontSize: '0.875rem'
          }}>
            {title}
          </div>
        )}
        <div>{children}</div>
      </div>
      
      {dismissible && (
        <button
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: types[type].iconColor,
            padding: '0.25rem',
            borderRadius: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s ease',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.1)'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          <XCircle size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
