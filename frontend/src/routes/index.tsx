import type React from 'react';
import type { JSX } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTE_PATHS } from '@config/routePaths';
import { publicRoutes } from './publicRoutes';
import { privateRoutes } from './privateRoutes';
import { Forbidden, NotFound } from '@components/errors';
import ProtectedRoutesWrapper from './ProtectedRoutesWrapper';
import type { RouteObject } from 'react-router-dom';

const renderRoutes = (routes: RouteObject[]): JSX.Element[] =>
  routes.map((route: RouteObject) =>
    route.children ? (
      <Route key={route.path} element={route.element}>
        {renderRoutes(route.children)}
        {route.path && <Route path={route.path} element={route.element} />}
      </Route>
    ) : (
      <Route key={route.path} path={route.path} element={route.element} />
    ),
  );

const AppRoutes: React.FC = () => (
  <Routes>
    {/* Public routes */}
    {renderRoutes(publicRoutes)}

    {/* Protected routes */}
    <Route element={<ProtectedRoutesWrapper />}>{renderRoutes(privateRoutes)}</Route>

    {/* Fallback routes */}
    <Route path={ROUTE_PATHS.error.unauthorized} element={<Forbidden />} />
    <Route path={ROUTE_PATHS.error.notFound} element={<NotFound />} />
    <Route path="*" element={<Navigate to={ROUTE_PATHS.error.notFound} replace />} />
  </Routes>
);

export default AppRoutes;
