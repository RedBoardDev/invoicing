import { apiFetch } from '@api/fetch';
import type { Result, ApiResponse } from '@api/types/fetch';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export async function login(email: string, password: string): Promise<Result<ApiResponse<LoginResponse>>> {
  return apiFetch('POST', '/auth/login', {
    body: JSON.stringify({ email, password }),
    skipAuthRefresh: true,
  });
}

export async function refreshToken(refreshToken: string): Promise<Result<ApiResponse<RefreshTokenResponse>>> {
  return apiFetch('POST', '/auth/refresh', {
    body: JSON.stringify({ refreshToken }),
    skipAuthRefresh: true,
  });
}

export async function verifyToken(userId: string): Promise<Result<ApiResponse<{ valid: boolean }>>> {
  return apiFetch('GET', `/auth/verify/${userId}`);
}
