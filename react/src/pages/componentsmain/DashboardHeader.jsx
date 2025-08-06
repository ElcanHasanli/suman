import { useDarkMode } from '../../components/useDarkMode'; // Dark mode hook-u import edin

export default function DashboardHeader() {
  const { isDarkMode } = useDarkMode();

  return (
    <div style={{
      padding: '15px 20px',
      backgroundColor: isDarkMode ? '#1f2937' : '#fff',
      borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.3s ease'
    }}>
      <h3 style={{ 
        margin: 0, 
        fontSize: '1.1rem',
        color: isDarkMode ? '#ffffff' : '#111827'
      }}>
        SuMan Admin Panel
      </h3>
      <span style={{ 
        fontSize: '0.9rem', 
        color: isDarkMode ? '#9ca3af' : '#6b7280'
      }}>
        Xoş gəldiniz, Admin
      </span>
    </div>
  );
}