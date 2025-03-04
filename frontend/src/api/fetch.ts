import type { HttpMethod, Result, FetchParams, ApiResponse } from './types/fetch';
import { refreshToken } from './services/auth';

// Configuration de base
const BASE_URL = 'http://localhost:3000';

// Types pour typer correctement les options
type FetchOptions = Omit<RequestInit, 'method'> & {
  headers?: Record<string, string>;
};

// Gestion des tokens dans sessionStorage
const getTokens = () => ({
  accessToken: sessionStorage.getItem('accessToken') ?? null,
  refreshToken: sessionStorage.getItem('refreshToken') ?? null,
});

const setTokens = (accessToken: string, refreshToken: string) => {
  console.log('rah 2 ??', accessToken, refreshToken);
  sessionStorage.setItem('accessToken', accessToken);
  sessionStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
  console.log('clear 1 ?');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
};

// Fonction pour tenter un refresh token
async function attemptRefreshToken(): Promise<boolean> {
  const { refreshToken: currentRefreshToken } = getTokens();
  if (!currentRefreshToken) return false;

  try {
    const refreshResult = await refreshToken(currentRefreshToken);
    console.log(refreshResult);
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

// Fonction principale fetchApi
export async function apiFetch<T>(
  method: HttpMethod,
  endpoint: string,
  options: FetchOptions = {},
  params: FetchParams = {},
): Promise<Result<ApiResponse<T>>> {
  // Construire les paramètres de requête
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  }

  const url = `${BASE_URL}${endpoint}${queryParams.toString() ? `?${queryParams}` : ''}`;
  const { accessToken } = getTokens();

  // Préparer les headers
  const headers: Record<string, string> = {
    ...(options.headers || {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
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

    if (response.status === 401) {
      const refreshed = await attemptRefreshToken();
      if (!refreshed) {
        window.location.href = '/login'; // Redirection si refresh échoue
        throw new Error('Unauthorized - Redirecting to login');
      }

      // Mettre à jour le token dans les headers pour la nouvelle tentative
      const newAccessToken = getTokens().accessToken;
      if (!newAccessToken) throw new Error('No new access token after refresh');
      headers.Authorization = `Bearer ${newAccessToken}`;

      console.log(`Retrying ${url} with new token`, { ...fetchOptions, headers }); // Log pour debug
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
      } catch {
        // Si le parsing JSON échoue, garder le message par défaut
      }
      return { success: false, error: errorMessage };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur réseau ou inconnue';
    return { success: false, error: errorMessage };
  }
}

// Version spécifique pour récupérer des Blobs
export async function fetchBlob(endpoint: string, params: FetchParams = {}): Promise<Result<Blob>> {
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  }

  const url = `${BASE_URL}${endpoint}${queryParams.toString() ? `?${queryParams}` : ''}`;
  const { accessToken } = getTokens();

  const headers: Record<string, string> = {
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  console.log(`Fetching blob ${url}`, { method: 'GET', headers }); // Log pour debug

  async function performBlobFetch(): Promise<Response> {
    const response = await fetch(url, { method: 'GET', headers });

    if (response.status === 401) {
      const refreshed = await attemptRefreshToken();
      if (!refreshed) {
        window.location.href = '/login';
        throw new Error('Unauthorized - Redirecting to login');
      }

      const newAccessToken = getTokens().accessToken;
      if (!newAccessToken) throw new Error('No new access token after refresh');
      headers.Authorization = `Bearer ${newAccessToken}`;

      console.log(`Retrying blob ${url} with new token`, { method: 'GET', headers }); // Log pour debug
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
      } catch {
        // Si le parsing JSON échoue, garder le message par défaut
      }
      return { success: false, error: errorMessage };
    }

    const blob = await response.blob();
    return { success: true, data: blob };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur réseau ou inconnue';
    return { success: false, error: errorMessage };
  }
}
