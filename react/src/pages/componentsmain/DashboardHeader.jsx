import { useDarkMode } from '../../components/useDarkMode';
import { useState, useEffect } from 'react';
import { Bell, Settings, User, Sun, Moon, Menu, X } from 'lucide-react';

export default function DashboardHeader() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isMobile, setIsMobile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const headerStyle = {
    padding: isMobile ? '16px 20px' : '20px 24px',
    background: isDarkMode 
      ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' 
      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
    marginTop: isMobile ? '60px' : '0',
    boxShadow: isDarkMode 
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    zIndex: 10
  };

  const titleStyle = {
    margin: 0, 
    fontSize: isMobile ? '1.25rem' : '1.5rem',
    color: isDarkMode ? '#ffffff' : '#111827',
    fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const welcomeStyle = {
    fontSize: isMobile ? '0.875rem' : '1rem', 
    color: isDarkMode ? '#9ca3af' : '#6b7280',
    fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
    fontWeight: '500'
  };

  const actionButtonsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const buttonStyle = {
    padding: '8px',
    background: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(107, 114, 128, 0.1)',
    border: 'none',
    borderRadius: '8px',
    color: isDarkMode ? '#d1d5db' : '#374151',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    position: 'relative'
  };

  const notificationBadgeStyle = {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
    width: '8px',
    height: '8px',
    background: '#ef4444',
    borderRadius: '50%',
    border: `2px solid ${isDarkMode ? '#1f2937' : '#ffffff'}`
  };

  return (
    <div style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: isDarkMode 
            ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
            : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
        }}>
          <User size={20} color="white" />
        </div>
        <div>
          <h3 style={titleStyle}>
            SuMan Admin Panel
          </h3>
          <span style={welcomeStyle}>
            Xoş gəldiniz, Admin
          </span>
        </div>
      </div>
      
      <div style={actionButtonsStyle}>
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.target.style.background = isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'rgba(107, 114, 128, 0.2)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(107, 114, 128, 0.1)';
            e.target.style.transform = 'scale(1)';
          }}
          title="Bildirişlər"
        >
          <Bell size={20} />
          <div style={notificationBadgeStyle}></div>
        </button>
        
        <button
          onClick={toggleDarkMode}
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.target.style.background = isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'rgba(107, 114, 128, 0.2)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(107, 114, 128, 0.1)';
            e.target.style.transform = 'scale(1)';
          }}
          title={isDarkMode ? 'Light moda keç' : 'Dark moda keç'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.target.style.background = isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'rgba(107, 114, 128, 0.2)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(107, 114, 128, 0.1)';
            e.target.style.transform = 'scale(1)';
          }}
          title="Tənzimləmələr"
        >
          <Settings size={20} />
        </button>
      </div>
      
      {/* Notifications Dropdown */}
      {showNotifications && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '24px',
          width: '320px',
          background: isDarkMode ? '#1f2937' : '#ffffff',
          border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
          borderRadius: '12px',
          boxShadow: isDarkMode 
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.3)' 
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          padding: '16px',
          marginTop: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
          }}>
            <h4 style={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: '600',
              color: isDarkMode ? '#ffffff' : '#111827'
            }}>
              Bildirişlər
            </h4>
            <button
              onClick={() => setShowNotifications(false)}
              style={{
                background: 'none',
                border: 'none',
                color: isDarkMode ? '#9ca3af' : '#6b7280',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={16} />
            </button>
          </div>
          
          <div style={{
            textAlign: 'center',
            padding: '24px 0',
            color: isDarkMode ? '#9ca3af' : '#6b7280'
          }}>
            <Bell size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              Yeni bildiriş yoxdur
            </p>
          </div>
        </div>
      )}
    </div>
  );
}