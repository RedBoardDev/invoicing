import { ROUTE_PATHS, type RouteConfig } from '@config/routePaths';
import Clients from '@views/clients/Clients';
import ClientsDetails from '@views/clients/details/Details';
import Contracts from '@views/contracts/Contracts';
import ContractsDetails from '@views/contracts/details/Details';
import Dashboard from '@views/dashboard/Dashboard';
import Invoices from '@views/invoices/Invoices';
import DashboardLayout from 'components/layouts/dashboard/DashboardLayout';

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
    ],
  },
];
