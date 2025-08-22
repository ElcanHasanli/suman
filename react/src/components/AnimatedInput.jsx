import React from 'react';

const AnimatedInput = ({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  required = false,
  min,
  step,
  onFocus,
  onBlur,
  style = {},
  className = '',
  ...props
}) => {
  const inputStyles = {
    position: 'relative',
    width: '100%'
  };

  const inputElementStyles = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid transparent',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease-in-out',
    outline: 'none',
    backgroundColor: '#f9fafb',
    color: '#374151',
    ...style
  };

  const outlineSpanStyles = {
    position: 'absolute',
    backgroundColor: '#3cefff',
    transition: 'transform 0.5s ease'
  };

  const bottomStyles = {
    ...outlineSpanStyles,
    height: '2px',
    left: 0,
    right: 0,
    bottom: 0,
    transform: 'scaleX(0)',
    transformOrigin: 'bottom right'
  };

  const topStyles = {
    ...outlineSpanStyles,
    height: '2px',
    left: 0,
    right: 0,
    top: 0,
    transform: 'scaleX(0)',
    transformOrigin: 'top left'
  };

  const leftStyles = {
    ...outlineSpanStyles,
    width: '2px',
    top: 0,
    bottom: 0,
    left: 0,
    transform: 'scaleY(0)',
    transformOrigin: 'bottom left'
  };

  const rightStyles = {
    ...outlineSpanStyles,
    width: '2px',
    top: 0,
    bottom: 0,
    right: 0,
    transform: 'scaleY(0)',
    transformOrigin: 'top right'
  };

  return (
    <div style={inputStyles} className={`input-wrapper ${className}`}>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        style={inputElementStyles}
        required={required}
        min={min}
        step={step}
        {...props}
      />
      <span style={bottomStyles}></span>
      <span style={rightStyles}></span>
      <span style={topStyles}></span>
      <span style={leftStyles}></span>
    </div>
  );
};

export default AnimatedInput;
