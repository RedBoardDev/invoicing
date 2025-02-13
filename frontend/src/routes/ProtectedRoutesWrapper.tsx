import type React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { ROUTE_PATHS } from '@config/routePaths';
import { PulseLoader } from '@components/common';
import { useAuth } from '@hooks/useAuth';

const ProtectedRoutesWrapper: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PulseLoader />;

  if (!isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.error.unauthorized} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutesWrapper;
