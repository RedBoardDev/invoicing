export enum EmailVariable {
  MONTH = 'MONTH',
  YEAR = 'YEAR',
  CURRENT_DATE = 'CURRENT_DATE',
  INVOICE_NUMBER = 'INVOICE_NUMBER',
  TAX_RATE = 'TAX_RATE',
  INVOICE_DATE = 'INVOICE_DATE',
  DUE_DATE = 'DUE_DATE',
  CLIENT_MAIL = 'CLIENT_MAIL',
  CLIENT_NAME = 'CLIENT_NAME',
  CONTRACT_PAYMENT_DELAY = 'CONTRACT_PAYMENT_DELAY',
  CONTRACT_TITLE = 'CONTRACT_TITLE',
}

export const VARIABLES_METADATA = {
  [EmailVariable.MONTH]: {
    description: 'Mois courant',
    example: '12',
  },
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
  [EmailVariable.TAX_RATE]: {
    description: 'Taux de TVA',
    example: '20',
  },
  [EmailVariable.INVOICE_DATE]: {
    description: "Date d'émission de la facture",
    example: '2024-12-31',
  },
  [EmailVariable.DUE_DATE]: {
    description: "Date d'échéance de la facture",
    example: '2024-12-31',
  },
  [EmailVariable.CLIENT_MAIL]: {
    description: 'Email du client',
    example: 'client@example.com',
  },
  [EmailVariable.CLIENT_NAME]: {
    description: 'Nom du client',
    example: 'John Doe',
  },
  [EmailVariable.CONTRACT_PAYMENT_DELAY]: {
    description: 'Délai de paiement du contrat',
    example: '30',
  },
  [EmailVariable.CONTRACT_TITLE]: {
    description: 'Titre du contrat',
    example: 'Contrat de prestation de service',
  },
} satisfies Record<EmailVariable, { description: string; example: string }>;

export const VARIABLES_DEFAULT_VALUES = {
  [EmailVariable.MONTH]: () => (new Date().getMonth() + 1).toString(),
  [EmailVariable.YEAR]: () => new Date().getFullYear().toString(),
  [EmailVariable.CURRENT_DATE]: () => new Date().toISOString(),
} satisfies Partial<Record<EmailVariable, () => string>>;
