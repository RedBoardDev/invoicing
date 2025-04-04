import type { CreateEmailTemplateData, UpdateEmailTemplateData } from '@entities/email-template-entity';
// import type { CreateEmailTemplateData, UpdateEmailTemplateData } from '@entities/email-template-entity';
import { type CursorPaginationQuery, type Pagination, cursorPaginationForQuery } from '@libs/pagination';
import { prismaInstance } from '@libs/prisma-client';
import type { EmailTemplate, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { handleError } from './error-handling-repository';

/**
 * Count EmailTemplates
 */
const countEmailTemplatesFn = async (where?: Prisma.EmailTemplateWhereInput): Promise<number> => {
  return prismaInstance.emailTemplate.count({ where });
};

export const countEmailTemplates = handleError(countEmailTemplatesFn);

/**
 * Create EmailTemplate
 */
const createEmailTemplateQuery = async (data: CreateEmailTemplateData): Promise<EmailTemplate> =>
  prismaInstance.emailTemplate.create({
    data,
  });

export type CreateEmailTemplateQueryType = Prisma.PromiseReturnType<typeof createEmailTemplateQuery>;

const createEmailTemplateFn = async (data: CreateEmailTemplateData): Promise<CreateEmailTemplateQueryType> => {
  return await createEmailTemplateQuery(data);
};

export const createEmailTemplate = handleError(createEmailTemplateFn);

/**
 * List EmailTemplates
 */
const listEmailTemplatesQuery = async (
  paginationQuery: { skip?: number; take: number } | undefined,
  where?: Prisma.EmailTemplateWhereInput,
): Promise<EmailTemplate[]> =>
  prismaInstance.emailTemplate.findMany({
    ...(paginationQuery || {}),
    where,
    orderBy: { createdAt: 'desc' },
  });

export type ListEmailTemplatesQueryType = Prisma.PromiseReturnType<typeof listEmailTemplatesQuery>;

const listEmailTemplatesFn = async (
  pagination?: Pagination,
  where?: Prisma.EmailTemplateWhereInput,
): Promise<ListEmailTemplatesQueryType> => {
  let paginationQuery: CursorPaginationQuery | undefined = undefined;
  if (pagination) {
    paginationQuery = cursorPaginationForQuery(pagination);
  }
  return await listEmailTemplatesQuery(paginationQuery, where);
};

export const listEmailTemplates = handleError(listEmailTemplatesFn);

/**
 * Get EmailTemplate by ID
 */
const getEmailTemplateQueryById = async (emailTemplateId: string): Promise<EmailTemplate> =>
  prismaInstance.emailTemplate.findUniqueOrThrow({
    where: { id: emailTemplateId },
  });

export type GetEmailTemplateQueryByIdType = Prisma.PromiseReturnType<typeof getEmailTemplateQueryById>;

const getEmailTemplateByIdFn = async (emailTemplateId: string): Promise<GetEmailTemplateQueryByIdType> =>
  await getEmailTemplateQueryById(emailTemplateId);

export const getEmailTemplateById = handleError(getEmailTemplateByIdFn);

/**
 * Update EmailTemplate
 */
const updateEmailTemplateQuery = async (
  emailTemplateId: string,
  data: UpdateEmailTemplateData,
): Promise<EmailTemplate> => {
  return prismaInstance.emailTemplate.update({
    where: { id: emailTemplateId },
    data,
  });
};

export type UpdateEmailTemplateQueryType = Prisma.PromiseReturnType<typeof updateEmailTemplateQuery>;

const updateEmailTemplateFn = async (
  emailTemplateId: string,
  data: UpdateEmailTemplateData,
): Promise<UpdateEmailTemplateQueryType> => {
  return await updateEmailTemplateQuery(emailTemplateId, data);
};

export const updateEmailTemplate = handleError(updateEmailTemplateFn);

/**
 * Delete EmailTemplate
 */
const deleteEmailTemplatesQuery = async (
  ids: string[],
): Promise<{
  deletedIds: string[];
  failedIds: Array<{ id: string; reason: string }>;
}> => {
  return prismaInstance.$transaction(async (prisma) => {
    const results = {
      deletedIds: [] as string[],
      failedIds: [] as Array<{ id: string; reason: string }>,
    };

    for (const id of ids) {
      try {
        await prisma.emailTemplate.delete({
          where: { id },
          select: { id: true },
        });
        results.deletedIds.push(id);
      } catch (error) {
        results.failedIds.push({
          id,
          reason:
            error instanceof PrismaClientKnownRequestError && error.code === 'P2025' ? 'Not found' : 'Unknown error',
        });
      }
    }

    return results;
  });
};

export type DeleteEmailTemplatesQueryType = Prisma.PromiseReturnType<typeof deleteEmailTemplatesQuery>;

const deleteEmailTemplatesFn = async (ids: string[]): Promise<DeleteEmailTemplatesQueryType> => {
  return await deleteEmailTemplatesQuery(ids);
};

export const deleteEmailTemplates = handleError(deleteEmailTemplatesFn);
