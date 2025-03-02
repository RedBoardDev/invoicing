import type { HttpMethod, Result, FetchParams, ApiResponse } from './types/fetch';
import type { PaginationParams, PaginatedApiResponse } from './types/pagination';

const BASE_URL = 'http://localhost:3000';

export async function apiFetch<T, TotalCount extends boolean = false>(
  method: HttpMethod,
  endpoint: string,
  options: Omit<RequestInit, 'method'> = {},
  params: FetchParams = {},
  pagination?: PaginationParams<TotalCount>,
): Promise<
  Result<PaginationParams<TotalCount> extends undefined ? ApiResponse<T> : PaginatedApiResponse<T, TotalCount>>
> {
  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      queryParams.append(key, String(value));
    }
  }

  if (pagination) {
    queryParams.append('page', String(pagination.page ?? 1));
    queryParams.append('pageSize', String(pagination.pageSize ?? 1000));
    if (pagination.totalCount) queryParams.append('totalCount', String(pagination.totalCount));
  }

  const url = `${BASE_URL}${endpoint}${queryParams.toString() ? `?${queryParams}` : ''}`;

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      method,
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || `Erreur API: ${response.status}` };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur réseau ou inconnue';
    return { success: false, error: errorMessage };
  }
}

export async function fetchBlob(endpoint: string): Promise<Result<Blob, string>> {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || `Erreur API: ${response.status}` };
    }
    const blob = await response.blob();
    return { success: true, data: blob };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur réseau ou inconnue';
    return { success: false, error: errorMessage };
  }
}
