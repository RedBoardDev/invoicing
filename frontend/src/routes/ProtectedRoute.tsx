import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTE_PATHS } from "@config/routePaths";
import { PulseLoader } from "@components/common";
import { useAuth } from "@hooks/useAuth";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PulseLoader />;

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to={ROUTE_PATHS.error.unauthorized}
      state={{ from: location }}
      replace
    />
  );
};

export default ProtectedRoute;
