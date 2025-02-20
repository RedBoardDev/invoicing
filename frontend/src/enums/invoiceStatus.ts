export const InvoiceStatus = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
} as const;

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

export const STATUS_COLORS = {
  DRAFT: 'cyan',
  SENT: 'orange',
  PAID: 'green',
  OVERDUE: 'red',
};