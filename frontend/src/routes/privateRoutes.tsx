import { ROUTE_PATHS, type RouteConfig } from "@config/routePaths";
import Dashboard from "@views/dashboard/Dashboard";
import DashboardLayout from "components/layouts/dashboard/DashboardLayout";

export const privateRoutes: RouteConfig[] = [
	{
		path: "/",
		element: <DashboardLayout />,
		children: [{ path: ROUTE_PATHS.private.dashboard, element: <Dashboard /> }],
	},
];
