interface InvoiceItem {
  id: number;
  invoiceId: string;
  description: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export default InvoiceItem;
