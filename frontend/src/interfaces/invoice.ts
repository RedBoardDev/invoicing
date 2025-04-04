import type { InvoiceStatus } from '@enums/invoiceStatus';

interface Invoice {
  id: string;
  contractId: string;
  invoiceNumber: string;
  amountHT: number;
  taxRate: number;
  status: InvoiceStatus;
  paymentDelay: number;
  dueDate: Date;
  sendDate?: Date;
  fileId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default Invoice;
