import type { InvoiceStatus } from '@enums/invoiceStatus';

interface Invoice {
  id: string;
  contractId: string;
  // contract?: Contract;
  invoiceNumber: string;
  totalAmount: number;
  status: InvoiceStatus;
  dueDate: Date;
  sendDate?: Date;
  pdfUrl?: string;
  // items: InvoiceItem[];
  createdAt: Date;
  updatedAt: Date;
}

export default Invoice;
