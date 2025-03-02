export enum EmailVariable {
  MONTH = 'MONTH',
  YEAR = 'YEAR',
  CURRENT_DATE = 'CURRENT_DATE',
  INVOICE_NUMBER = 'INVOICE_NUMBER',
  TAX_RATE = 'TAX_RATE',
  INVOICE_DATE = 'INVOICE_DATE',
  DUE_DATE = 'DUE_DATE',
  PAYMENT_DELAY = 'PAYMENT_DELAY',
  CLIENT_NAME = 'CLIENT_NAME',
  CONTRACT_PAYMENT_DELAY = 'CONTRACT_PAYMENT_DELAY',
  CONTRACT_TITLE = 'CONTRACT_TITLE',
}

export interface VariableMetadata {
  label: string;
  description: string;
  example: string;
}

export const EMAIL_VARIABLES_METADATA: Record<EmailVariable, VariableMetadata> = {
  [EmailVariable.MONTH]: {
    label: 'Mois',
    description: 'Mois courant',
    example: '12',
  },
  [EmailVariable.YEAR]: {
    label: 'Année',
    description: 'Année courante',
    example: '2024',
  },
  [EmailVariable.CURRENT_DATE]: {
    label: 'Date Actuelle',
    description: 'Date courante',
    example: '2024-12-31T23:59:59.999Z',
  },
  [EmailVariable.INVOICE_NUMBER]: {
    label: 'N° Facture',
    description: 'Numéro de facture',
    example: '123456',
  },
  [EmailVariable.TAX_RATE]: {
    label: 'Taux TVA',
    description: 'Taux de TVA',
    example: '20',
  },
  [EmailVariable.INVOICE_DATE]: {
    label: 'Date Facture',
    description: "Date d'émission de la facture",
    example: '2024-12-31',
  },
  [EmailVariable.DUE_DATE]: {
    label: 'Échéance',
    description: "Date d'échéance de la facture",
    example: '2024-12-31',
  },
  [EmailVariable.PAYMENT_DELAY]: {
    label: 'Délai Paiement',
    description: 'Délai de paiement de la facture',
    example: '30',
  },
  [EmailVariable.CLIENT_NAME]: {
    label: 'Nom Client',
    description: 'Nom du client',
    example: 'John Doe',
  },
  [EmailVariable.CONTRACT_PAYMENT_DELAY]: {
    label: 'Délai Paiement Contrat',
    description: 'Délai de paiement du contrat',
    example: '30',
  },
  [EmailVariable.CONTRACT_TITLE]: {
    label: 'Titre Contrat',
    description: 'Titre du contrat',
    example: 'Contrat de prestation de service',
  },
};
