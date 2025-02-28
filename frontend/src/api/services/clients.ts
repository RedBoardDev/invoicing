import { apiFetch } from '@api/fetch';
import type Client from '@interfaces/client';
import type { WithExtends } from '@api/types/extends';
import type { Result, ApiResponse, FetchParams } from '@api/types/fetch';
import type { PaginatedApiResponse, PaginationParams } from '@api/types/pagination';
import type Contract from '@interfaces/contract';

export type ClientExtends = 'contracts' | 'permissions';

// Liste des clients avec pagination
export async function getClients<E extends ClientExtends = never, TotalCount extends boolean = false>(
  extendsOptions?: E[],
  pagination?: PaginationParams<TotalCount>,
): Promise<Result<PaginatedApiResponse<WithExtends<Client, E>[], TotalCount>>> {
  const params: FetchParams = {
    extends: extendsOptions?.length ? extendsOptions.join(',') : undefined,
  };

  return apiFetch('GET', '/clients', {}, params, pagination ?? { page: 1, pageSize: 1000 });
}

// Récupérer un client par ID (pas de pagination)
export async function getClientById<E extends ClientExtends = never>(
  id: string,
  extendsOptions?: E[],
): Promise<Result<ApiResponse<WithExtends<Client, E>>>> {
  const params: FetchParams = {
    extends: extendsOptions?.length ? extendsOptions.join(',') : undefined,
  };

  return apiFetch('GET', `/clients/${id}`, {}, params);
}

// Créer un client (pas de pagination)
export async function createClient(data: { name: string; email: string }): Promise<Result<ApiResponse<Client>>> {
  return apiFetch('POST', '/clients', { body: JSON.stringify(data) });
}

// Mettre à jour un client (pas de pagination)
export async function updateClient(id: string, data: Partial<Client>): Promise<Result<ApiResponse<Client>>> {
  return apiFetch('PATCH', `/clients/${id}`, { body: JSON.stringify(data) });
}

// Supprimer des clients (pas de pagination)
export async function deleteClients(
  ids: string[],
): Promise<Result<ApiResponse<{ deletedIds: string[]; failedIds: { id: string; reason: string }[] }>>> {
  return apiFetch('DELETE', '/clients', { body: JSON.stringify({ ids }) });
}

// Liste des contrats d'un client avec pagination
export async function getClientContracts<E extends ContractExtends = never, TotalCount extends boolean = false>(
  clientId: string,
  extendsOptions?: E[],
  pagination?: PaginationParams<TotalCount>,
): Promise<Result<PaginatedApiResponse<WithExtends<Contract, E>[], TotalCount>>> {
  const params: FetchParams = {
    extends: extendsOptions?.length ? extendsOptions.join(',') : undefined,
  };

  return apiFetch('GET', `/clients/${clientId}/contracts`, {}, params, pagination ?? { page: 1, pageSize: 1000 });
}

// Extensions pour les contrats dans getClientContracts
export type ContractExtends = 'invoices' | 'history' | 'client';
