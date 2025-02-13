export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
  },
  users: {
    root: '/users',
    detail: (id: string): string => `/users/${id}`,
    update: (id: string): string => `/users/${id}`,
    delete: (id: string): string => `/users/${id}`,
  },
  posts: {
    root: '/posts',
    create: '/posts',
    detail: (id: string): string => `/posts/${id}`,
    update: (id: string): string => `/posts/${id}`,
    delete: (id: string): string => `/posts/${id}`,
  },
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;
