import type { CreateInvoiceData, UpdateInvoiceData } from '@entities/invoice-entity';
import { type CursorPaginationQuery, type Pagination, cursorPaginationForQuery } from '@libs/pagination';
import { prismaInstance } from '@libs/prisma-client';
import type { Invoice, Prisma } from '@prisma/client';
import { handleError } from './error-handling-repository';

export interface CreateInvoiceItemData {
  description: string;
  amount: Prisma.Decimal;
}

/**
 * Count Invoices
 */
const countInvoicesFn = async (where?: Prisma.InvoiceWhereInput): Promise<number> => {
  return prismaInstance.invoice.count({ where });
};

export const countInvoices = handleError(countInvoicesFn);

/**
 * Create Invoice
 */
const createInvoiceQuery = async (
  data: CreateInvoiceData,
): Promise<Prisma.InvoiceGetPayload<{ include: { items: true } }>> => {
  return prismaInstance.invoice.create({
    data: {
      contractId: data.contractId,
      invoiceNumber: data.invoiceNumber,
      totalAmount: data.totalAmount,
      status: data.status || 'DRAFT',
      dueDate: data.dueDate,
      sendDate: data.sendDate ? data.sendDate : null,
      pdfUrl: data.pdfUrl,
      items: {
        create: data.items.map((item) => ({
          description: item.description,
          amount: item.amount,
        })),
      },
    },
    include: {
      items: true,
    },
  });
};
export type CreateInvoiceQueryType = Prisma.PromiseReturnType<typeof createInvoiceQuery>;

const createInvoiceFn = async (data: CreateInvoiceData): Promise<CreateInvoiceQueryType> => {
  return await createInvoiceQuery(data);
};

export const createInvoice = handleError(createInvoiceFn);

/**
 * List Invoices
 */
const listInvoicesQuery = async (
  paginationQuery: { skip?: number; take: number } | undefined,
  include?: Prisma.InvoiceInclude,
  where?: Prisma.InvoiceWhereInput,
): Promise<Invoice[]> =>
  prismaInstance.invoice.findMany({
    ...(paginationQuery || {}),
    include,
    where,
    orderBy: { createdAt: 'desc' },
  });

export type ListInvoicesQueryType = Prisma.PromiseReturnType<typeof listInvoicesQuery>;

const listInvoicesFn = async (
  pagination?: Pagination,
  include?: Prisma.InvoiceInclude,
  where?: Prisma.InvoiceWhereInput,
): Promise<ListInvoicesQueryType> => {
  let paginationQuery: CursorPaginationQuery | undefined = undefined;
  if (pagination) {
    paginationQuery = cursorPaginationForQuery(pagination);
  }
  return await listInvoicesQuery(paginationQuery, include, where);
};

export const listInvoices = handleError(listInvoicesFn);

/**
 * Get Invoice by ID
 */
const getInvoiceQueryById = async (invoiceId: string, include?: Prisma.InvoiceInclude): Promise<Invoice> => {
  return prismaInstance.invoice.findUniqueOrThrow({
    where: { id: invoiceId },
    include,
  });
};

export type GetInvoiceQueryByIdType = Prisma.PromiseReturnType<typeof getInvoiceQueryById>;

const getInvoiceByIdFn = async (
  invoiceId: string,
  include?: Prisma.InvoiceInclude,
): Promise<GetInvoiceQueryByIdType> => {
  return await getInvoiceQueryById(invoiceId, include);
};

export const getInvoiceById = handleError(getInvoiceByIdFn);

/**
 * Update Invoice
 */
const updateInvoiceQuery = async (invoiceId: string, data: UpdateInvoiceData): Promise<Invoice> => {
  return prismaInstance.invoice.update({
    where: { id: invoiceId },
    data: {
      ...data,
      ...(data.sendDate && { sendDate: new Date(data.sendDate) }),
    },
  });
};

export type UpdateInvoiceQueryType = Prisma.PromiseReturnType<typeof updateInvoiceQuery>;

const updateInvoiceFn = async (invoiceId: string, data: UpdateInvoiceData): Promise<UpdateInvoiceQueryType> => {
  return await updateInvoiceQuery(invoiceId, data);
};

export const updateInvoice = handleError(updateInvoiceFn);

/**
 * Delete Invoice
 */
const deleteInvoiceQuery = async (invoiceId: string): Promise<Invoice> => {
  return prismaInstance.invoice.delete({
    where: { id: invoiceId },
    include: { items: true },
  });
};

export type DeleteInvoiceQueryType = Prisma.PromiseReturnType<typeof deleteInvoiceQuery>;

const deleteInvoiceFn = async (invoiceId: string): Promise<DeleteInvoiceQueryType> => {
  return await deleteInvoiceQuery(invoiceId);
};

export const deleteInvoice = handleError(deleteInvoiceFn);
