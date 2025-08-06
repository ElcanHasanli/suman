import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import { OrdersProvider } from './contexts/OrdersContext';
import BalancePanel from './pages/dashboard/BalancePanel';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CustomerPanel from './pages/dashboard/CustomerPanel';
import CustomerData from './pages/dashboard/CustomerData';
import Orders from './pages/Orders';
import CourierPanel from './pages/CourierPanel';
import DashboardContent from './pages/dashboard/DashboardContent';
import { useDarkMode } from './components/useDarkMode';
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
      <AuthProvider>
        <OrdersProvider>
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
                    <Dashboard /> {/* Bura Layoutdur */}
                  </PrivateRoute>
                }
              >
                <Route index element={<CustomerPanel />} />
                <Route path="customerpanel" element={<CustomerPanel />} />
                <Route path="customer-database" element={<CustomerData />} />
                <Route path="daily-process" element={<DashboardContent />} />
                <Route path="balance" element={<BalancePanel />} />
              </Route>

              {/* Private route for courier */}
              <Route
                path="/courier"
                element={
                  <PrivateRoute>
                    <CourierPanel />
                  </PrivateRoute>
                }
              />

              {/* Private route for regular user */}
              <Route
                path="/my-orders"
                element={
                  <PrivateRoute allowedRoles={['user']}>
                    <Orders />
                  </PrivateRoute>
                }
              />

              {/* Catch all - redirect to login if path not matched */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>

          </Router>
        </OrdersProvider>
      </AuthProvider>
    </div>
  );
}