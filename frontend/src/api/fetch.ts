import type { HttpMethod, Result, FetchParams, ApiResponse } from './types/fetch';
import { refreshToken } from './services/auth';

const BASE_URL = 'http://localhost:3000';

type FetchOptions = Omit<RequestInit, 'method'> & {
  headers?: Record<string, string>;
  skipAuthRefresh?: boolean; // Nouvelle option pour désactiver le refresh
};

const getTokens = () => ({
  accessToken: sessionStorage.getItem('accessToken') ?? null,
  refreshToken: sessionStorage.getItem('refreshToken') ?? null,
});

const setTokens = (accessToken: string, refreshToken: string) => {
  console.log('Saving tokens:', accessToken, refreshToken);
  sessionStorage.setItem('accessToken', accessToken);
  sessionStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
  console.log('Clearing tokens');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
};

async function attemptRefreshToken(): Promise<boolean> {
  const { refreshToken: currentRefreshToken } = getTokens();
  if (!currentRefreshToken) return false;

  try {
    const refreshResult = await refreshToken(currentRefreshToken);
    console.log('Refresh result:', refreshResult);
    if (!refreshResult.success) {
      clearTokens();
      return false;
    }
    const { accessToken, refreshToken: newRefreshToken } = refreshResult.data.data;
    setTokens(accessToken, newRefreshToken);
    return true;
  } catch (error) {
    console.error('Refresh token failed:', error);
    clearTokens();
    return false;
  }
}

export async function apiFetch<T>(
  method: HttpMethod,
  endpoint: string,
  options: FetchOptions = {},
  params: FetchParams = {},
): Promise<Result<ApiResponse<T>>> {
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  }

  const url = `${BASE_URL}${endpoint}${queryParams.toString() ? `?${queryParams}` : ''}`;
  const { accessToken } = getTokens();

  const headers: Record<string, string> = {
    ...(options.headers || {}),
    ...(accessToken && !options.skipAuthRefresh ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const fetchOptions: RequestInit = {
    method,
    ...options,
    headers,
  };

  console.log(`Fetching ${url}`, fetchOptions); // Log pour debug

  async function performFetch(): Promise<Response> {
    const response = await fetch(url, fetchOptions);

    if (response.status === 401 && !options.skipAuthRefresh) {
      const refreshed = await attemptRefreshToken();
      if (!refreshed) {
        window.location.href = '/login';
        throw new Error('Unauthorized - Redirecting to login');
      }

      const newAccessToken = getTokens().accessToken;
      if (!newAccessToken) throw new Error('No new access token after refresh');
      headers.Authorization = `Bearer ${newAccessToken}`;

      console.log(`Retrying ${url} with new token`, { ...fetchOptions, headers });
      return fetch(url, { ...fetchOptions, headers });
    }

    return response;
  }

  try {
    const response = await performFetch();

    if (!response.ok) {
      let errorMessage = `Erreur API: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {}
      return { success: false, error: errorMessage };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur réseau ou inconnue';
    return { success: false, error: errorMessage };
  }
}

export async function fetchBlob(
  endpoint: string,
  params: FetchParams = {},
  options: FetchOptions = {},
): Promise<Result<Blob>> {
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  }

  const url = `${BASE_URL}${endpoint}${queryParams.toString() ? `?${queryParams}` : ''}`;
  const { accessToken } = getTokens();

  const headers: Record<string, string> = {
    ...(options.headers || {}),
    ...(accessToken && !options.skipAuthRefresh ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  console.log(`Fetching blob ${url}`, { method: 'GET', headers });

  async function performBlobFetch(): Promise<Response> {
    const response = await fetch(url, { method: 'GET', headers });

    if (response.status === 401 && !options.skipAuthRefresh) {
      const refreshed = await attemptRefreshToken();
      if (!refreshed) {
        window.location.href = '/login';
        throw new Error('Unauthorized - Redirecting to login');
      }

      const newAccessToken = getTokens().accessToken;
      if (!newAccessToken) throw new Error('No new access token after refresh');
      headers.Authorization = `Bearer ${newAccessToken}`;

      console.log(`Retrying blob ${url} with new token`, { method: 'GET', headers });
      return fetch(url, { method: 'GET', headers });
    }

    return response;
  }

  try {
    const response = await performBlobFetch();

    if (!response.ok) {
      let errorMessage = `Erreur API: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {}
      return { success: false, error: errorMessage };
    }

    const blob = await response.blob();
    return { success: true, data: blob };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur réseau ou inconnue';
    return { success: false, error: errorMessage };
  }
}
