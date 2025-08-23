import { NavLink } from 'react-router-dom';
import { useDarkMode } from '../../components/useDarkMode'; // Dark mode hook-u import edin

export default function DashboardSidebar({ isMobile = false, onMobileClose }) {
  const { isDarkMode } = useDarkMode();

  const menuItemStyle = ({ isActive }) => ({
    padding: isMobile ? '12px 16px' : '15px 20px',
    display: 'block',
    textDecoration: 'none',
    color: isActive 
      ? (isDarkMode ? '#60a5fa' : '#2563eb') 
      : (isDarkMode ? '#d1d5db' : '#374151'),
    backgroundColor: isActive 
      ? (isDarkMode ? '#1e3a8a' : '#e0f2fe') 
      : 'transparent',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'all 0.2s ease',
    borderRadius: '8px',
    margin: isMobile ? '2px 8px' : '2px 10px',
    fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
    position: 'relative',
    cursor: 'pointer',
    fontSize: isMobile ? '0.9rem' : '1rem'
  });

  const sidebarContainerStyle = {
    width: isMobile ? '100%' : '220px',
    background: isDarkMode ? '#1f2937' : '#ffffff',
    boxShadow: isMobile 
      ? (isDarkMode ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.1)')
      : (isDarkMode ? '2px 0 5px rgba(0,0,0,0.3)' : '2px 0 5px rgba(0,0,0,0.05)'),
    transition: 'all 0.3s ease',
    fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
    position: isMobile ? 'fixed' : 'relative',
    top: isMobile ? 0 : 'auto',
    left: isMobile ? 0 : 'auto',
    right: isMobile ? 0 : 'auto',
    zIndex: isMobile ? 1000 : 'auto',
    maxHeight: isMobile ? 'auto' : '100vh',
    overflowY: isMobile ? 'auto' : 'visible'
  };

  const headerStyle = {
    padding: isMobile ? '15px 20px' : '20px',
    fontSize: isMobile ? '1.1rem' : '1.2rem',
    borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
    color: isDarkMode ? '#ffffff' : '#111827',
    margin: 0,
    fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
    fontWeight: '600',
    textAlign: isMobile ? 'center' : 'left'
  };

  const navStyle = {
    padding: isMobile ? '8px 0' : '10px 0',
    display: 'flex',
    flexDirection: isMobile ? 'row' : 'column',
    flexWrap: isMobile ? 'wrap' : 'nowrap',
    justifyContent: isMobile ? 'center' : 'flex-start',
    gap: isMobile ? '8px' : '0'
  };

  const handleNavClick = () => {
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <div style={sidebarContainerStyle}>
      <h2 style={headerStyle}>
        Admin Panel
      </h2>
      <nav style={navStyle}>
        <NavLink 
          to="/dashboard/customer-database" 
          style={menuItemStyle} 
          className="sidebar-nav-link"
          onClick={handleNavClick}
        >
          <span>Müştəri Bazası</span>
        </NavLink>
        <NavLink 
          to="/dashboard/customerpanel" 
          style={menuItemStyle} 
          className="sidebar-nav-link"
          onClick={handleNavClick}
        >
          <span>Sifarişlər</span>
        </NavLink>
        <NavLink 
          to="/dashboard/daily-process" 
          style={menuItemStyle} 
          className="sidebar-nav-link"
          onClick={handleNavClick}
        >
          <span>Günlük Proseslər</span>
        </NavLink>
        <NavLink 
          to="/dashboard/payments" 
          style={menuItemStyle} 
          className="sidebar-nav-link"
          onClick={handleNavClick}
        >
          <span>Ödənişlər</span>
        </NavLink>
        <NavLink 
          to="/dashboard/balance" 
          style={menuItemStyle} 
          className="sidebar-nav-link"
          onClick={handleNavClick}
        >
          <span>Qalıqlar</span>
        </NavLink>
        
     
        <NavLink 
          to="/login" 
          style={menuItemStyle} 
          className="sidebar-nav-link"
          onClick={handleNavClick}
        >
          <span>Çıxış</span>
        </NavLink>
      </nav>

      <style>{`
        .sidebar-nav-link span {
          position: relative;
        }

        .sidebar-nav-link span::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #3cefff;
          transform-origin: bottom right;
          transform: scaleX(0);
          transition: transform 0.5s ease;
        }

        .sidebar-nav-link:hover span::before {
          transform-origin: bottom left;
          transform: scaleX(1);
        }

        /* Mobile-specific styles */
        @media (max-width: 767px) {
          .sidebar-nav-link {
            white-space: nowrap;
            min-width: fit-content;
          }
        }
      `}</style>
    </div>
  );
}