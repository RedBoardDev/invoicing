import { ROUTE_PATHS, type RouteConfig } from "@config/routePaths";
import { Home } from "@views/home";

export const publicRoutes: RouteConfig[] = [
	{ path: ROUTE_PATHS.public.home, element: <Home /> },
];
