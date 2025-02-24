export const InvoiceStatus = {
  DRAFT: 'DRAFT',
  VALIDATED: 'VALIDATED',
  SENT: 'SENT',
  PAID: 'PAID',
  // OVERDUE: 'OVERDUE',
} as const;

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

export const STATUS_COLORS = {
  DRAFT: 'cyan',
  VALIDATED: 'blue',
  SENT: 'orange',
  PAID: 'green',
  // OVERDUE: 'red',
};