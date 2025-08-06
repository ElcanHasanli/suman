import { NavLink } from 'react-router-dom';
import { useDarkMode } from '../../components/useDarkMode'; // Dark mode hook-u import edin

export default function DashboardSidebar() {
  const { isDarkMode } = useDarkMode();

  const menuItemStyle = ({ isActive }) => ({
    padding: '15px 20px',
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
    margin: '2px 10px'
  });

  return (
    <div style={{ 
      width: '220px', 
      background: isDarkMode ? '#1f2937' : '#ffffff', 
      boxShadow: isDarkMode 
        ? '2px 0 5px rgba(0,0,0,0.3)' 
        : '2px 0 5px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease'
    }}>
      <h2 style={{ 
        padding: '20px', 
        fontSize: '1.2rem', 
        borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
        color: isDarkMode ? '#ffffff' : '#111827',
        margin: 0
      }}>
        Admin Panel
      </h2>
      <nav style={{ padding: '10px 0' }}>
        <NavLink to="/dashboard/customer-database" style={menuItemStyle}>
          Müştəri Bazası
        </NavLink>
        <NavLink to="/dashboard/payments" style={menuItemStyle}>
          Ödənişlər
        </NavLink>
        <NavLink to="/dashboard/balance" style={menuItemStyle}>
          Qalıqlar
        </NavLink>
        <NavLink to="/dashboard/daily-process" style={menuItemStyle}>
          Günlük Proseslər
        </NavLink>
        <NavLink to="/dashboard/customerpanel" style={menuItemStyle}>
          Sifarişlər
        </NavLink>
        <NavLink to="/login" style={menuItemStyle}>
          Çıxış
        </NavLink>
      </nav>
    </div>
  );
}