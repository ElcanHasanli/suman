import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const NotificationModal = ({ 
  isOpen, 
  onClose, 
  type = 'info', // 'success', 'error', 'warning', 'info'
  title, 
  message, 
  showConfirmButton = false,
  confirmText = 'Təsdiq Et',
  onConfirm,
  isLoading = false
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={24} color="#10b981" />;
      case 'error':
        return <AlertCircle size={24} color="#ef4444" />;
      case 'warning':
        return <AlertCircle size={24} color="#f59e0b" />;
      default:
        return <Info size={24} color="#3b82f6" />;
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      default:
        return '#3b82f6';
    }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    },
    modal: {
      background: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      maxWidth: '500px',
      width: '100%',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      position: 'relative'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem'
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: getTitleColor(),
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '0.5rem',
      color: '#6b7280',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    content: {
      marginBottom: '2rem'
    },
    message: {
      fontSize: '1rem',
      color: '#374151',
      lineHeight: '1.6',
      margin: 0
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end'
    },
    closeButtonStyle: {
      background: '#f3f4f6',
      color: '#374151',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    confirmButton: {
      background: getTitleColor(),
      color: 'white',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            {getIcon()}
            {title}
          </h2>
          <button 
            onClick={onClose} 
            style={styles.closeButton}
            title="Bağla"
          >
            <X size={20} />
          </button>
        </div>

        <div style={styles.content}>
          <p style={styles.message}>{message}</p>
        </div>

        <div style={styles.buttonGroup}>
          <button
            onClick={onClose}
            style={styles.closeButtonStyle}
            disabled={isLoading}
          >
            Bağla
          </button>
          {showConfirmButton && (
            <button
              onClick={onConfirm}
              style={styles.confirmButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" color="white" />
                  Yüklənir...
                </>
              ) : (
                confirmText
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
