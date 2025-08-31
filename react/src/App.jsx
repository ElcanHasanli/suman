import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import { OrdersProvider } from './contexts/OrdersContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CustomerPanel from './pages/dashboard/CustomerPanel';
import CustomerData from './pages/dashboard/CustomerData';
import CourierPanel from './pages/CourierPanel';
import DashboardContent from './pages/dashboard/DashboardContent';
import Payments from './pages/dashboard/Payments';
import { useDarkMode } from './components/useDarkMode';
import ScrollToTop from "./components/ScrollToTop";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Global styles for animated input effects and font family
const globalStyles = `
  * {
    font-family: 'Inter', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif;
  }

  .input-wrapper input:focus ~ .bottom {
    transform-origin: bottom left;
    transform: scaleX(1);
  }

  .input-wrapper input:focus ~ .right {
    transform-origin: bottom right;
    transform: scaleY(1);
  }

  .input-wrapper input:focus ~ .top {
    transform-origin: top right;
    transform: scaleX(1);
  }

  .input-wrapper input:focus ~ .left {
    transform-origin: top left;
    transform: scaleY(1);
  }

  /* Mobile responsiveness */
  @media (max-width: 767px) {
    body {
      overflow-x: hidden;
    }
    
    .dashboard-container {
      flex-direction: column;
    }
    
    .sidebar-mobile {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
  }
`;

export default function App() {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Default olaraq login səhifəsinə yönləndir */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Login səhifəsi */}
            <Route path="/login" element={<Login />} />

            {/* Admin paneli, yalnız admin roluna icazə verilir */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute >
                  <OrdersProvider>
                    <Dashboard /> {/* Bura Layoutdur */}
                  </OrdersProvider>
                </PrivateRoute>
              }
            >
              <Route index element={<CustomerPanel />} />
              <Route path="customerpanel" element={<CustomerPanel />} />
              <Route path="customer-database" element={<CustomerData />} />
              <Route path="daily-process" element={<DashboardContent />} />
              {/** Balance panel removed as per new requirements */}
              <Route path="payments" element={<Payments />} />
            </Route>

            {/* Private route for courier */}
            <Route
              path="/courier"
              element={
                <PrivateRoute>
                  <OrdersProvider>
                    <CourierPanel />
                  </OrdersProvider>
                </PrivateRoute>
              }
            />

          

            {/* Catch all - redirect to login if path not matched */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          {/* Toast Container - bütün tətbiqdə toast bildirişləri üçün */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={isDarkMode ? "dark" : "light"}
          />

          {/* Global Styles */}
          <style>{globalStyles}</style>

        </Router>
      </AuthProvider>
    </div>
  );
}