import { Outlet } from 'react-router-dom';
import DashboardSidebar from './componentsmain/DashboardSidebar'
import DashboardHeader from './componentsmain/DashboardHeader';
import { useDarkMode } from '../components/useDarkMode'; // Dark mode hook-u import edin
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const containerStyle = {
    display: 'flex',
    height: '100vh',
    flexDirection: isMobile ? 'column' : 'row'
  };

  const mainContentStyle = {
    flex: 1,
    background: isDarkMode ? '#111827' : '#f9fafb',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  const contentAreaStyle = {
    flex: 1,
    padding: isMobile ? '15px' : '20px',
    overflowY: 'auto',
    backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
    color: isDarkMode ? '#ffffff' : '#111827'
  };

  const mobileMenuButtonStyle = {
    position: 'fixed',
    top: '15px',
    left: '15px',
    zIndex: 1001,
    padding: '8px',
    background: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '8px',
    color: isDarkMode ? '#ffffff' : '#111827',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease'
  };

  return (
    <div 
      className={`${isDarkMode ? 'dark' : ''}`}
      style={containerStyle}
    >
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={mobileMenuButtonStyle}
          title={mobileMenuOpen ? 'Menunu bağla' : 'Menunu aç'}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Sidebar - Hidden on mobile when menu is closed */}
      {(!isMobile || mobileMenuOpen) && (
        <DashboardSidebar 
          isMobile={isMobile} 
          onMobileClose={() => setMobileMenuOpen(false)}
        />
      )}

      <div style={mainContentStyle}>
        {/* Header - Always visible */}
        <DashboardHeader />
        
        {/* Content Area */}
        <div style={contentAreaStyle}>
          <Outlet />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
        />
      )}
    </div>
  );
}