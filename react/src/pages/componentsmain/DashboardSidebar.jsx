import { NavLink } from 'react-router-dom';
import { useDarkMode } from '../../components/useDarkMode';
import { 
  Users, 
  Package, 
  Clock, 
  LogOut,
  ChevronRight 
} from 'lucide-react';

export default function DashboardSidebar({ isMobile = false, onMobileClose }) {
  const { isDarkMode } = useDarkMode();

  const menuItems = [
    {
      to: '/dashboard/customer-database',
      label: 'Müştərilər',
      icon: Users,
      description: 'Müştəri məlumatları'
    },
    {
      to: '/dashboard/customerpanel',
      label: 'Sifarişlər',
      icon: Package,
      description: 'Sifariş idarəsi'
    },
    {
      to: '/dashboard/daily-process',
      label: 'Tarixçə və Performans',
      icon: Clock,
      description: 'Gündəlik proseslər və kuryer performansı'
    }
  ];

  const menuItemStyle = ({ isActive }) => ({
    padding: isMobile ? '12px 16px' : '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textDecoration: 'none',
    color: isActive 
      ? (isDarkMode ? '#60a5fa' : '#2563eb') 
      : (isDarkMode ? '#d1d5db' : '#374151'),
    backgroundColor: isActive 
      ? (isDarkMode ? 'rgba(30, 58, 138, 0.1)' : 'rgba(37, 99, 235, 0.05)') 
      : 'transparent',
    fontWeight: isActive ? '600' : '500',
    transition: 'all 0.3s ease',
    borderRadius: '12px',
    margin: isMobile ? '4px 8px' : '4px 12px',
    fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
    position: 'relative',
    cursor: 'pointer',
    fontSize: isMobile ? '0.9rem' : '1rem',
    border: isActive ? `1px solid ${isDarkMode ? '#1e3a8a' : '#3b82f6'}` : '1px solid transparent',
    boxShadow: isActive ? (isDarkMode ? '0 4px 12px rgba(30, 58, 138, 0.2)' : '0 4px 12px rgba(37, 99, 235, 0.1)') : 'none'
  });

  const sidebarContainerStyle = {
    width: isMobile ? '100%' : '280px',
    background: isDarkMode ? '#1f2937' : '#ffffff',
    boxShadow: isMobile 
      ? (isDarkMode ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.15)')
      : (isDarkMode ? '4px 0 10px rgba(0,0,0,0.3)' : '4px 0 10px rgba(0,0,0,0.08)'),
    transition: 'all 0.3s ease',
    fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
    position: isMobile ? 'fixed' : 'relative',
    top: isMobile ? 0 : 'auto',
    left: isMobile ? 0 : 'auto',
    right: isMobile ? 0 : 'auto',
    zIndex: isMobile ? 1000 : 'auto',
    maxHeight: isMobile ? 'auto' : '100vh',
    overflowY: isMobile ? 'auto' : 'visible',
    borderRight: isMobile ? 'none' : `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
  };

  const headerStyle = {
    padding: isMobile ? '20px' : '24px',
    fontSize: isMobile ? '1.25rem' : '1.5rem',
    borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
    color: isDarkMode ? '#ffffff' : '#111827',
    margin: 0,
    fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
    fontWeight: '700',
    textAlign: isMobile ? 'center' : 'left',
    background: isDarkMode ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    position: 'relative'
  };

  const navStyle = {
    padding: isMobile ? '12px 0' : '16px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const handleNavClick = () => {
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <div style={sidebarContainerStyle}>
      <h2 style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: isDarkMode ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
          }}>
            <Package size={20} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', lineHeight: '1.2' }}>
              SuMan Admin
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7, fontWeight: '400' }}>
              İdarəetmə Paneli
            </div>
          </div>
        </div>
      </h2>
      
      <nav style={navStyle}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink 
              key={item.to}
              to={item.to} 
              style={menuItemStyle} 
              className="sidebar-nav-link"
              onClick={handleNavClick}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: 'transparent',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}>
                  <IconComponent size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 'inherit', fontSize: 'inherit' }}>
                    {item.label}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    opacity: 0.7, 
                    fontWeight: '400',
                    marginTop: '2px'
                  }}>
                    {item.description}
                  </div>
                </div>
              </div>
              <ChevronRight size={16} style={{ opacity: 0.5 }} />
            </NavLink>
          );
        })}
        
        <div style={{ 
          margin: '16px 12px 8px 12px', 
          height: '1px', 
          background: isDarkMode ? '#374151' : '#e5e7eb' 
        }} />
        
        <NavLink 
          to="/login" 
          style={menuItemStyle} 
          className="sidebar-nav-link"
          onClick={handleNavClick}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: 'transparent',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}>
              <LogOut size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 'inherit', fontSize: 'inherit' }}>
                Çıxış
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                opacity: 0.7, 
                fontWeight: '400',
                marginTop: '2px'
              }}>
                Sistemdən çıxış
              </div>
            </div>
          </div>
          <ChevronRight size={16} style={{ opacity: 0.5 }} />
        </NavLink>
      </nav>

      <style>{`
        .sidebar-nav-link:hover {
          background-color: ${isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(37, 99, 235, 0.05)'} !important;
          transform: translateX(4px);
        }
        
        .sidebar-nav-link:hover .chevron-right {
          opacity: 1 !important;
        }

        /* Mobile-specific styles */
        @media (max-width: 767px) {
          .sidebar-nav-link {
            margin: 2px 8px !important;
            padding: 12px 16px !important;
          }
        }
      `}</style>
    </div>
  );
}