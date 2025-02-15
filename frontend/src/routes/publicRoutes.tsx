import { ROUTE_PATHS, type RouteConfig } from "@config/routePaths";
import Login from "@views/authentification/login/Login";

export const publicRoutes: RouteConfig[] = [
	{ path: ROUTE_PATHS.public.login, element: <Login /> },
];
