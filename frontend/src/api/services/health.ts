import { apiFetch } from '@api/fetch';
import type { Result, ApiResponse } from '@api/types/fetch';

export async function checkHealth(): Promise<Result<ApiResponse<{ status: string; message: string }>>> {
  return apiFetch('GET', '/health');
}
