import { PulseLoader } from '@components/common';
import { useAuth } from '@hooks/useAuth';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoutesWrapper: React.FC = () => {
  const { isAuthenticated, loading, verifyAuth } = useAuth();
  const location = useLocation();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      await verifyAuth();
      setIsVerified(true);
    };
    checkAuth();
  }, [verifyAuth]);

  console.log('ProtectedRoutesWrapper:', { loading, isAuthenticated, isVerified });

  if (loading || !isVerified) {
    return <PulseLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutesWrapper;
