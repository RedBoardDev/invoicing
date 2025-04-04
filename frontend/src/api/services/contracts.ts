import { apiFetch } from '@api/fetch';
import type Contract from '@interfaces/contract';
import type { ContractHistory } from '@interfaces/contractHistory';
import type { WithExtends } from '@api/types/extends';
import type { Result, ApiResponse, FetchParams } from '@api/types/fetch';
import type { PaginatedApiResponse, PaginationParams } from '@api/types/pagination';
import type Invoice from '@interfaces/invoice';

export type ContractExtends = 'invoices' | 'history' | 'client' | 'emailTemplate' | 'permissions';

// Liste des contrats avec pagination
export async function getContracts<E extends ContractExtends = never, TotalCount extends boolean = false>(
  extendsOptions?: E[],
  pagination?: PaginationParams<TotalCount>,
): Promise<
  Result<PaginatedApiResponse<WithExtends<Contract, E>[], TotalCount, E extends 'permissions' ? true : false>>
> {
  const params: FetchParams = {
    extends: extendsOptions?.length ? extendsOptions.join(',') : undefined,
  };

  return apiFetch('GET', '/contracts', {}, params, pagination ?? { page: 1, pageSize: 1000 });
}

// Récupérer un contrat par ID (pas de pagination)
export async function getContractById<E extends ContractExtends = never>(
  id: string,
  extendsOptions?: E[],
): Promise<Result<ApiResponse<WithExtends<Contract, E>, E extends 'permissions' ? true : false>>> {
  const params: FetchParams = {
    extends: extendsOptions?.length ? extendsOptions.join(',') : undefined,
  };

  return apiFetch('GET', `/contracts/${id}`, {}, params);
}

// Créer un contrat (pas de pagination)
export async function createContract(
  data: Omit<Contract, 'id' | 'createdAt' | 'updatedAt' | 'invoices' | 'history'>,
): Promise<Result<ApiResponse<Contract>>> {
  return apiFetch('POST', '/contracts', { body: JSON.stringify(data) });
}

// Mettre à jour un contrat (pas de pagination)
export async function updateContract<E extends ContractExtends = never>(
  id: string,
  data: Partial<Contract>,
  extendsOptions?: E[],
): Promise<Result<ApiResponse<WithExtends<Contract, E>, E extends 'permissions' ? true : false>>> {
  const params: FetchParams = {
    extends: extendsOptions?.length ? extendsOptions.join(',') : undefined,
  };
  return apiFetch('PATCH', `/contracts/${id}`, { body: JSON.stringify(data) }, params);
}

// Supprimer des contrats (pas de pagination)
export async function deleteContracts(
  ids: string[],
): Promise<Result<ApiResponse<{ deletedIds: string[]; failedIds: { id: string; reason: string }[] }>>> {
  return apiFetch('DELETE', '/contracts', { body: JSON.stringify({ ids }) });
}

// Liste des factures d'un contrat avec pagination
export async function getContractInvoices<E extends InvoiceExtends = never, TotalCount extends boolean = false>(
  contractId: string,
  extendsOptions?: E[],
  pagination?: PaginationParams<TotalCount>,
): Promise<
  Result<PaginatedApiResponse<WithExtends<Invoice, E>[], TotalCount, E extends 'permissions' ? true : false>>
> {
  const params: FetchParams = {
    extends: extendsOptions?.length ? extendsOptions.join(',') : undefined,
  };

  return apiFetch('GET', `/contracts/${contractId}/invoices`, {}, params, pagination ?? { page: 1, pageSize: 1000 });
}

// Liste de l'historique d'un contrat avec pagination
export async function getContractHistory<TotalCount extends boolean = false>(
  contractId: string,
  pagination?: PaginationParams<TotalCount>,
): Promise<Result<PaginatedApiResponse<ContractHistory[], TotalCount>>> {
  return apiFetch('GET', `/contracts/${contractId}/history`, {}, {}, pagination ?? { page: 1, pageSize: 1000 });
}

export type InvoiceExtends = 'items' | 'contract' | 'permissions';
