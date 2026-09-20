import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export type ProtectedRouteProps = {
  children: ReactNode;
  requiredRole?: 'admin' | 'user';
  redirectTo?: string;
};

const ProtectedRoute = ({
  children,
  requiredRole = 'admin',
  redirectTo = '/',
}: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
