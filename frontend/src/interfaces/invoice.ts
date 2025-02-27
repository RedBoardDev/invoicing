import type { InvoiceStatus } from '@enums/invoiceStatus';
import type Contract from '@interfaces/contract';
import type InvoiceItem from '@interfaces/invoiceItem';

interface Invoice {
  id: string;
  contractId: string;
  contract?: Contract;
  invoiceNumber: string;
  amountHT: number;
  taxRate: number;
  status: InvoiceStatus;
  dueDate: Date;
  sendDate?: Date;
  fileId?: string;
  items: InvoiceItem[];
  createdAt: Date;
  updatedAt: Date;
}

export default Invoice;
