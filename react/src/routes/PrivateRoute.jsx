import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children || <Outlet />;
}
