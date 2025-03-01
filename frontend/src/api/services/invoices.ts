import { apiFetch, fetchBlob } from '@api/fetch';
import type Invoice from '@interfaces/invoice';
import type { WithExtends } from '@api/types/extends';
import type { Result, ApiResponse, FetchParams } from '@api/types/fetch';
import type { PaginatedApiResponse, PaginationParams } from '@api/types/pagination';

export type InvoiceExtends = 'items' | 'contract' | 'permissions';

// Liste des factures avec pagination
export async function getInvoices<E extends InvoiceExtends = never, TotalCount extends boolean = false>(
  extendsOptions?: E[],
  pagination?: PaginationParams<TotalCount>,
): Promise<Result<PaginatedApiResponse<WithExtends<Invoice, E>[], TotalCount>>> {
  const params: FetchParams = {
    extends: extendsOptions?.length ? extendsOptions.join(',') : undefined,
  };

  return apiFetch('GET', '/invoices', {}, params, pagination ?? { page: 1, pageSize: 1000 });
}

// Récupérer une facture par ID (pas de pagination)
export async function getInvoiceById<E extends InvoiceExtends = never>(
  id: string,
  extendsOptions?: E[],
): Promise<Result<ApiResponse<WithExtends<Invoice, E>>>> {
  const params: FetchParams = {
    extends: extendsOptions?.length ? extendsOptions.join(',') : undefined,
  };

  return apiFetch('GET', `/invoices/${id}`, {}, params);
}

// Créer une facture (pas de pagination)
export async function createInvoice(
  data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'sendDate' | 'fileId' | 'invoiceNumber'> & {
    items?: { description: string; amount: number }[];
  },
): Promise<Result<ApiResponse<Invoice>>> {
  return apiFetch('POST', '/invoices', { body: JSON.stringify(data) });
}

// Mettre à jour une facture (pas de pagination)
export async function updateInvoice<E extends InvoiceExtends = never>(
  id: string,
  data: Partial<Invoice>,
  extendsOptions?: E[],
): Promise<Result<ApiResponse<WithExtends<Invoice, E>>>> {
  const params: FetchParams = {
    extends: extendsOptions?.length ? extendsOptions.join(',') : undefined,
  };
  return apiFetch('PATCH', `/invoices/${id}`, { body: JSON.stringify(data) }, params);
}

// Supprimer des factures (pas de pagination)
export async function deleteInvoices(
  ids: string[],
): Promise<Result<ApiResponse<{ deletedIds: string[]; failedIds: { id: string; reason: string }[] }>>> {
  return apiFetch('DELETE', '/invoices', { body: JSON.stringify({ ids }) });
}

// Envoyer une facture par email (pas de pagination)
export async function sendInvoice(
  id: string,
  data: { recipientEmail: string; subject: string; content: string },
): Promise<Result<ApiResponse<Invoice>>> {
  return apiFetch('PUT', `/invoices/${id}/send`, { body: JSON.stringify(data) });
}

// Valider une facture (pas de pagination)
export async function validateInvoice(id: string): Promise<Result<ApiResponse<Invoice>>> {
  return apiFetch('PATCH', `/invoices/${id}/validate`);
}

// Marquer une facture comme payée (pas de pagination)
export async function markInvoiceAsPaid(id: string): Promise<Result<ApiResponse<Invoice>>> {
  return apiFetch('PATCH', `/invoices/${id}/paid`);
}

// Récupérer le PDF d'une facture (pas de pagination)
export async function getInvoicePdf(id: string): Promise<Result<Blob>> {
  return fetchBlob(`/invoices/${id}/pdf`);
}

// Prévisualiser le prochain numéro de facture (pas de pagination)
export async function getNextInvoiceNumber(): Promise<Result<ApiResponse<{ invoiceNumber: string }>>> {
  return apiFetch('GET', '/invoices/preview-number');
}
