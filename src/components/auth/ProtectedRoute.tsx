import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks';
import { ROUTES } from '@/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = ROUTES.ADMIN_LOGIN
}) => {
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // Mostrar loading mientras se inicializa la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requiredRole) {
    const userRole = user?.role;
    const userRoleId = user?.id_rol || user?.roleId;

    // Check both string role and numeric role ID (admin = 1)
    const isAdmin = userRole === 'admin' || userRoleId === 1;

    if (requiredRole === 'admin' && !isAdmin) {
      return <Navigate to={ROUTES.HOME} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;