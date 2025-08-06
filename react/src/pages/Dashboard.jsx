import { Outlet } from 'react-router-dom';
import DashboardSidebar from './componentsmain/DashboardSidebar'
import DashboardHeader from './componentsmain/DashboardHeader';
import { useDarkMode } from '../components/useDarkMode'; // Dark mode hook-u import edin
import { Sun, Moon } from 'lucide-react';

export default function Dashboard() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div 
      className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}
      style={{ display: 'flex', height: '100vh' }}
    >
      <DashboardSidebar />

      <div 
        className={`flex-1 flex flex-col transition-colors duration-200 ${
          isDarkMode 
            ? 'bg-gray-900' 
            : 'bg-gray-50'
        }`}
        style={{ 
          flex: 1, 
          background: isDarkMode ? '#111827' : '#f9fafb', 
          display: 'flex', 
          flexDirection: 'column' 
        }}
      >
        <DashboardHeader />
        <div 
          className={`flex-1 p-5 overflow-y-auto transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-gray-900 text-white' 
              : 'bg-gray-50 text-gray-900'
          }`}
          style={{ 
            flex: 1, 
            padding: '20px', 
            overflowY: 'auto',
            backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
            color: isDarkMode ? '#ffffff' : '#111827'
          }}
        >
          <Outlet /> {/* İç səhifələr burada göstəriləcək */}
        </div>
      </div>

      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '12px',
          background: isDarkMode 
            ? 'rgba(55, 65, 81, 0.8)'
            : 'rgba(255, 255, 255, 0.2)',
          border: isDarkMode 
            ? '1px solid rgba(75, 85, 99, 0.5)'
            : '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '12px',
          color: 'white',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          zIndex: 1000,
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.background = isDarkMode 
            ? 'rgba(75, 85, 99, 0.9)'
            : 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.background = isDarkMode 
            ? 'rgba(55, 65, 81, 0.8)'
            : 'rgba(255, 255, 255, 0.2)';
        }}
        title={isDarkMode ? 'Light moda keç' : 'Dark moda keç'}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
}