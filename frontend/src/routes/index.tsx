import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ROUTE_PATHS } from "@config/routePaths";
import { publicRoutes } from "./publicRoutes";
import { privateRoutes } from "./privateRoutes";

import ProtectedRoute from "./ProtectedRoute";
import NotFound from "@components/errors/notFound/NotFound";
import { Forbidden } from "@components/errors";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        {publicRoutes.map((route, idx) => (
          <Route key={idx} path={route.path} element={route.element} />
        ))}

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          {privateRoutes.map((route, idx) => (
            <Route key={idx} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* Fallback */}
        <Route path={ROUTE_PATHS.error.unauthorized} element={<Forbidden />} />
        <Route path={ROUTE_PATHS.error.notFound} element={<NotFound />} />
        <Route
          path="*"
          element={<Navigate to={ROUTE_PATHS.error.notFound} replace />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
