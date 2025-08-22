import React from 'react';
import { User, MapPin, Phone, DollarSign, X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import AnimatedInput from './AnimatedInput';

const CustomerModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  onChange, 
  editMode, 
  isCreating, 
  isUpdating 
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
      maxWidth: '600px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      position: 'relative'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '2rem',
      paddingBottom: '1rem',
      borderBottom: '2px solid #f1f5f9'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: 0
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
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '1.5rem'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#374151'
    },
    submitButton: {
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      color: 'white',
      padding: '1rem 2rem',
      border: 'none',
      borderRadius: '0.75rem',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      width: '100%',
      marginTop: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    fullWidthInput: {
      gridColumn: '1 / -1'
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            {editMode ? 'Müştəri Redaktə Et' : 'Yeni Müştəri Əlavə Et'}
          </h2>
          <button 
            onClick={onClose} 
            style={styles.closeButton}
            title="Bağla"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <User size={16} color="#2563eb" />
                Ad
              </label>
              <AnimatedInput
                type="text"
                name="firstName"
                placeholder="Müştərinin adını daxil edin"
                value={formData.firstName}
                onChange={onChange}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <User size={16} color="#2563eb" />
                Soyad
              </label>
              <AnimatedInput
                type="text"
                name="lastName"
                placeholder="Soyadı daxil edin"
                value={formData.lastName}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div style={{ ...styles.inputGroup, ...styles.fullWidthInput }}>
            <label style={styles.label}>
              <MapPin size={16} color="#2563eb" />
              Ünvan
            </label>
            <AnimatedInput
              type="text"
              name="address"
              placeholder="Tam ünvanı daxil edin"
              value={formData.address}
              onChange={onChange}
              required
            />
          </div>

          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <Phone size={16} color="#2563eb" />
                Telefon
              </label>
              <AnimatedInput
                type="text"
                name="phone"
                placeholder="Telefon nömrəsini daxil edin"
                value={formData.phone}
                onChange={onChange}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <DollarSign size={16} color="#2563eb" />
                Bidon Qiyməti (AZN)
              </label>
              <AnimatedInput
                type="number"
                name="pricePerBidon"
                placeholder="Qiyməti daxil edin"
                value={formData.pricePerBidon}
                onChange={onChange}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            style={styles.submitButton}
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? (
              <>
                <LoadingSpinner size="small" color="white" />
                Yüklənir...
              </>
            ) : (
              editMode ? 'Müştərini Yenilə' : 'Müştəri Əlavə Et'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;
