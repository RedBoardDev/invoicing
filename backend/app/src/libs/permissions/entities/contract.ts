import type { Contract } from '@prisma/client';
import { countInvoices } from '@repositories/invoice-repository';
import type { PermissionConditions } from '../types';

export const contractPermissionConditions: PermissionConditions<Contract> = {
  canBeDeleted: async (contract) => {
    const invoiceCount = await countInvoices({ contractId: contract.id });
    return invoiceCount === 0;
  },
  canBeUpdated: {
    amountHT: () => true,
    taxRate: () => true,
    paymentDelay: () => true,
    title: () => true,
    description: () => true,
    startDate: () => true,
    endDate: () => true,
  },
};
