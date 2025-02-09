import { ROUTE_PATHS, RouteConfig } from "@config/routePaths";
import { Home } from "@views/home";

export const publicRoutes: RouteConfig[] = [
  { path: ROUTE_PATHS.public.home, element: <Home /> },
];
