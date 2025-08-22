import { useDarkMode } from '../../components/useDarkMode'; // Dark mode hook-u import edin
import { useState, useEffect } from 'react';

export default function DashboardHeader() {
  const { isDarkMode } = useDarkMode();
  const [isMobile, setIsMobile] = useState(false);

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
    padding: isMobile ? '10px 15px' : '15px 20px',
    backgroundColor: isDarkMode ? '#1f2937' : '#fff',
    borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
    marginTop: isMobile ? '60px' : '0' // Add top margin on mobile to account for fixed sidebar
  };

  const titleStyle = {
    margin: 0, 
    fontSize: isMobile ? '1rem' : '1.1rem',
    color: isDarkMode ? '#ffffff' : '#111827',
    fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
    fontWeight: '600'
  };

  const welcomeStyle = {
    fontSize: isMobile ? '0.8rem' : '0.9rem', 
    color: isDarkMode ? '#9ca3af' : '#6b7280',
    fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif"
  };

  return (
    <div style={headerStyle}>
      <h3 style={titleStyle}>
        SuMan Admin Panel
      </h3>
      <span style={welcomeStyle}>
        Xoş gəldiniz, Admin
      </span>
    </div>
  );
}