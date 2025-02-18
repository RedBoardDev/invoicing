type HttpMethod =
	| "GET"
	| "POST"
	| "PUT"
	| "DELETE"
	| "PATCH"
	| "OPTIONS"
	| "HEAD"
	| "CONNECT"
	| "TRACE";

export type ApiRoute = {
	method: HttpMethod;
	url: string;
};

export const API_ENDPOINTS = {
	auth: {
		login: { method: "POST", url: "/auth/login" } as ApiRoute,
		register: { method: "POST", url: "/auth/register" } as ApiRoute,
		refresh: { method: "POST", url: "/auth/refresh" } as ApiRoute,
		logout: { method: "POST", url: "/auth/logout" } as ApiRoute,
	},
	users: {
		getMe: { method: "GET", url: "/user" } as ApiRoute,
		update: (id: string): ApiRoute => ({
			method: "PUT",
			url: `/users/${id}`,
		}),
		delete: (id: string): ApiRoute => ({
			method: "DELETE",
			url: `/users/${id}`,
		}),
	},
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;
