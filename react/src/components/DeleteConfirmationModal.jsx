import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  customerName, 
  isLoading 
}) => {
  if (!isOpen) return null;

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
      color: '#dc2626',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
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
    customerName: {
      fontWeight: 'bold',
      color: '#1f2937'
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end'
    },
    cancelButton: {
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
    deleteButton: {
      background: '#dc2626',
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
            <AlertTriangle size={20} />
            Müştərini Sil
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
          <p style={styles.message}>
            <span style={styles.customerName}>{customerName}</span> adlı müştərini silmək istədiyinizə əminsiniz?
          </p>
          <p style={styles.message}>
            Bu əməliyyat geri alına bilməz.
          </p>
        </div>

        <div style={styles.buttonGroup}>
          <button
            onClick={onClose}
            style={styles.cancelButton}
            disabled={isLoading}
          >
            Ləğv Et
          </button>
          <button
            onClick={onConfirm}
            style={styles.deleteButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="small" color="white" />
                Silinir...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Sil
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
