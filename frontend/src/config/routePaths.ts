import type { JSX } from 'react';

export const ROUTE_PATHS = {
  public: {
    home: '/',
    login: '/login',
    register: '/register',
  },
  private: {
    dashboard: '/dashboard',
    user: {
      root: '/user',
      detail: (id: string) => `/user/${id}`,
    },
    settings: '/settings',
  },
  error: {
    notFound: '/errors/404',
    unauthorized: '/errors/401',
  },
} as const;

export type RoutePaths = typeof ROUTE_PATHS;

export interface RouteConfig {
  path: string;
  element: JSX.Element;
}
