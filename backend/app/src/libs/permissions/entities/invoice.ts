import { type Invoice, InvoiceStatus } from '@prisma/client';
import type { PermissionConditions } from '../types';

export const invoicePermissionConditions: PermissionConditions<Invoice> = {
  canBeDeleted: async (invoice) => {
    const isDraft = invoice.status === InvoiceStatus.DRAFT;
    return isDraft;
  },
  canBeUpdated: {
    amountHT: async (invoice) => invoice.status === InvoiceStatus.DRAFT,
    taxRate: async (invoice) => invoice.status === InvoiceStatus.DRAFT,
    dueDate: async (invoice) => invoice.status === InvoiceStatus.DRAFT,
  },
};
