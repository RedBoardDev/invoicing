import type { JSX } from "react";

export const ROUTE_PATHS = {
	public: {
		login: "/login",
	},
	private: {
		dashboard: "/",
		clients: {
			root: "/clients",
			detail: (id: string) => `/clients/${id}`,
		},
		contracts: {
			root: "/contracts",
			detail: (id: string) => `/contracts/${id}`,
		},
		settings: "/settings",
	},
	error: {
		notFound: "/errors/404",
		unauthorized: "/errors/401",
	},
} as const;

export type RoutePaths = typeof ROUTE_PATHS;

export interface RouteConfig {
	path: string;
	element: JSX.Element;
	children?: RouteConfig[];
}
