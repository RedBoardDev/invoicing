import { PulseLoader } from '@components/common';
import { useAuth } from '@hooks/useAuth';
import type React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoutesWrapper: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  console.log(loading, isAuthenticated);
  if (loading) return <PulseLoader />;
  if (!isAuthenticated) {
    // return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutesWrapper;
