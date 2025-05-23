import { ROUTE_PATHS, type RouteConfig } from '@config/routePaths';
import DashboardLayout from 'components/layouts/dashboard/DashboardLayout';

import Clients from '@views/clients/Clients';
import ClientsDetails from '@views/clients/details/Details';
import Contracts from '@views/contracts/Contracts';
import ContractsDetails from '@views/contracts/details/Details';
import Dashboard from '@views/dashboard/Dashboard';
import InvoicesDetails from '@views/invoices/details/Details';
import Invoices from '@views/invoices/Invoices';
import Settings from '@views/settings/Settings';

export const privateRoutes: RouteConfig[] = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { path: ROUTE_PATHS.private.dashboard, element: <Dashboard /> },
      { path: ROUTE_PATHS.private.clients.root, element: <Clients /> },
      { path: ROUTE_PATHS.private.clients.detail(':id'), element: <ClientsDetails /> },
      { path: ROUTE_PATHS.private.contracts.root, element: <Contracts /> },
      { path: ROUTE_PATHS.private.contracts.detail(':id'), element: <ContractsDetails /> },
      { path: ROUTE_PATHS.private.invoices.root, element: <Invoices /> },
      { path: ROUTE_PATHS.private.invoices.detail(':id'), element: <InvoicesDetails /> },
      { path: ROUTE_PATHS.private.settings, element: <Settings /> },
    ],
  },
];
