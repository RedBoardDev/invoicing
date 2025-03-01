export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type Result<T, E = string> = { success: true; data: T } | { success: false; error: E };

export interface FetchParams {
  [key: string]: string | number | boolean | undefined;
}

export interface ApiResponse<T> {
  data: T;
}
