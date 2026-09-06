import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';

export default function RoleRoute({ allowedRoles = [] }) {
  const { role } = useAuth();

  if (!allowedRoles.includes(role)) {
    return <Navigate to={ROUTES.WELCOME} replace />;
  }

  return <Outlet />;
}
