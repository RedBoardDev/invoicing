export const InvoiceStatus = {
  DRAFT: 'DRAFT',
  VALIDATED: 'VALIDATED',
  SENT: 'SENT',
  PAID: 'PAID',
} as const;

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

export const STATUS_LABELS: Record<InvoiceStatus, string> = {
  DRAFT: 'Brouillon',
  VALIDATED: 'Validée',
  SENT: 'Envoyée',
  PAID: 'Payée',
};

export const STATUS_COLORS = {
  DRAFT: 'cyan',
  VALIDATED: 'blue',
  SENT: 'orange',
  PAID: 'green',
};
