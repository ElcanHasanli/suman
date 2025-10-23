import React from 'react';
import { Search, X } from 'lucide-react';

const Input = ({ 
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  error = false,
  success = false,
  icon = null,
  clearable = false,
  className = '',
  style = {},
  ...props 
}) => {
  const baseStyles = {
    width: '100%',
    padding: icon ? '0.875rem 1rem 0.875rem 2.5rem' : '0.875rem 1rem',
    paddingRight: clearable && value ? '2.5rem' : '1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    background: '#f9fafb',
    color: '#374151',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const getBorderColor = () => {
    if (error) return '#ef4444';
    if (success) return '#16a34a';
    return '#e5e7eb';
  };

  const getFocusStyles = () => ({
    borderColor: error ? '#ef4444' : success ? '#16a34a' : '#3b82f6',
    boxShadow: `0 0 0 3px ${error ? 'rgba(239, 68, 68, 0.1)' : success ? 'rgba(22, 163, 74, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`,
    background: '#ffffff',
  });

  const inputStyles = {
    ...baseStyles,
    borderColor: getBorderColor(),
    ...style,
  };

  const handleFocus = (e) => {
    Object.assign(e.target.style, getFocusStyles());
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = getBorderColor();
    e.target.style.boxShadow = 'none';
    e.target.style.background = '#f9fafb';
    onBlur?.(e);
  };

  const handleClear = () => {
    if (onChange) {
      const event = {
        target: { value: '' }
      };
      onChange(event);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {icon && (
        <div style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
          color: '#6b7280',
          pointerEvents: 'none',
        }}>
          {icon}
        </div>
      )}
      
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        className={className}
        style={inputStyles}
        {...props}
      />
      
      {clearable && value && (
        <button
          type="button"
          onClick={handleClear}
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7280',
            padding: '0.25rem',
            borderRadius: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => e.target.style.color = '#374151'}
          onMouseLeave={(e) => e.target.style.color = '#6b7280'}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Input;
