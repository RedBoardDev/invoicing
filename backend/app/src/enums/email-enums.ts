export enum EmailVariable {
  YEAR = 'year',
  CURRENT_DATE = 'currentDate',
  INVOICE_NUMBER = 'invoiceNumber',
  INVOICE_DATE = 'invoiceDate',
  DUE_DATE = 'dueDate',
  TOTAL_AMOUNT = 'totalAmount',
  EMAIL_EMAIL = 'emailClient',
}

export const VARIABLES_METADATA = {
  [EmailVariable.YEAR]: {
    description: 'Année courante',
    example: '2024',
  },
  [EmailVariable.CURRENT_DATE]: {
    description: 'Date courante',
    example: '2024-12-31T23:59:59.999Z',
  },
  [EmailVariable.INVOICE_NUMBER]: {
    description: 'Numéro de facture',
    example: '123456',
  },
  [EmailVariable.INVOICE_DATE]: {
    description: "Date d'émission de la facture",
    example: '2024-12-31',
  },
  [EmailVariable.DUE_DATE]: {
    description: "Date d'échéance de la facture",
    example: '2024-12-31',
  },
  [EmailVariable.TOTAL_AMOUNT]: {
    description: 'Montant total de la facture',
    example: '1234.56',
  },
  [EmailVariable.EMAIL_EMAIL]: {
    description: 'Email du client',
    example: 'client@example.com',
  },
} satisfies Record<EmailVariable, { description: string; example: string }>;

export const VARIABLES_DEFAULT_VALUES = {
  [EmailVariable.YEAR]: () => new Date().getFullYear().toString(),
  [EmailVariable.CURRENT_DATE]: () => new Date().toISOString(),
} satisfies Partial<Record<EmailVariable, () => string>>;
