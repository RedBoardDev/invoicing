import { apiFetch } from '@api/fetch';
import type EmailTemplate from '@interfaces/emailTemplate';
import type { WithExtends } from '@api/types/extends';
import type { Result, ApiResponse, FetchParams } from '@api/types/fetch';
import type { PaginatedApiResponse, PaginationParams } from '@api/types/pagination';

export type EmailTemplateExtends = 'permissions';

// Liste des templates avec pagination
export async function getEmailTemplates<TotalCount extends boolean = false>(
  pagination?: PaginationParams<TotalCount>,
): Promise<Result<PaginatedApiResponse<EmailTemplate[], TotalCount>>> {
  return apiFetch('GET', '/email-templates', {}, {}, pagination ?? { page: 1, pageSize: 1000 });
}

// Récupérer un template par ID (pas de pagination)
export async function getEmailTemplateById<E extends EmailTemplateExtends = never>(
  id: string,
  extendsOptions?: E[],
): Promise<Result<ApiResponse<WithExtends<EmailTemplate, E>>>> {
  const params: FetchParams = {
    extends: extendsOptions?.length ? extendsOptions.join(',') : undefined,
  };

  return apiFetch('GET', `/email-templates/${id}`, {}, params);
}

// Créer un template (pas de pagination)
export async function createEmailTemplate(
  data: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Result<ApiResponse<EmailTemplate>>> {
  return apiFetch('POST', '/email-templates', { body: JSON.stringify(data) });
}

// Mettre à jour un template (pas de pagination)
export async function updateEmailTemplate(
  id: string,
  data: Partial<EmailTemplate>,
): Promise<Result<ApiResponse<EmailTemplate>>> {
  return apiFetch('PUT', `/email-templates/${id}`, { body: JSON.stringify(data) });
}

// Supprimer des templates (pas de pagination)
export async function deleteEmailTemplates(
  ids: string[],
): Promise<Result<ApiResponse<{ deletedIds: string[]; failedIds: { id: string; reason: string }[] }>>> {
  return apiFetch('DELETE', '/email-templates', { body: JSON.stringify({ ids }) });
}

// Simuler un template pour une facture (pas de pagination)
export async function simulateEmailTemplate(
  id: string,
  invoiceId: string,
): Promise<Result<ApiResponse<{ email: string; subject: string; content: string }>>> {
  return apiFetch('GET', `/email-templates/${id}/simulate/${invoiceId}`);
}
