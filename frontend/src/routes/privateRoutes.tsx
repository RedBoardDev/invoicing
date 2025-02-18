import { ROUTE_PATHS, type RouteConfig } from '@config/routePaths';
import Clients from '@views/clients/Clients';
import Contracts from '@views/contracts/Contracts';
import Dashboard from '@views/dashboard/Dashboard';
import DashboardLayout from 'components/layouts/dashboard/DashboardLayout';

export const privateRoutes: RouteConfig[] = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { path: ROUTE_PATHS.private.dashboard, element: <Dashboard /> },
      { path: ROUTE_PATHS.private.clients.root, element: <Clients /> },
      { path: ROUTE_PATHS.private.contracts.root, element: <Contracts /> },
    ],
  },
];
