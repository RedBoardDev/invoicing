export const InvoiceStatus = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
} as const;

export type InvoiceStatus = keyof typeof InvoiceStatus;
