export enum EmailVariable {
  YEAR = 'YEAR',
  CURRENT_DATE = 'CURRENT_DATE',
  INVOICE_NUMBER = 'INVOICE_NUMBER',
  TAX_RATE = 'TAX_RATE',
  INVOICE_DATE = 'INVOICE_DATE',
  DUE_DATE = 'DUE_DATE',
  CLIENT_EMAIL = 'CLIENT_MAIL',
  CLIENT_NAME = 'CLIENT_NAME',
  CONTRACT_DELAY = 'CONTRACT_PAYMENT_DELAY',
  CONTRACT_TITLE = 'CONTRACT_TITLE',
}

export interface VariableMetadata {
  label: string;
  description: string;
  example: string;
}

export const EMAIL_VARIABLES_METADATA: Record<EmailVariable, VariableMetadata> = {
  [EmailVariable.YEAR]: { label: 'Année', description: 'Année courante', example: '2025' },
  [EmailVariable.CURRENT_DATE]: { label: 'Date Actuelle', description: 'Date du jour', example: '31/12/2025' },
  [EmailVariable.INVOICE_NUMBER]: { label: 'N° Facture', description: 'Numéro de facture', example: '2025-00042' },
  [EmailVariable.TAX_RATE]: { label: 'Taux TVA', description: 'Taux de taxe', example: '20%' },
  [EmailVariable.INVOICE_DATE]: { label: 'Date Facture', description: 'Date d’émission', example: '15/12/2025' },
  [EmailVariable.DUE_DATE]: { label: 'Échéance', description: 'Date d’échéance', example: '14/01/2026' },
  [EmailVariable.CLIENT_EMAIL]: {
    label: 'Email Client',
    description: 'Email du client',
    example: 'john.doe@example.com',
  },
  [EmailVariable.CLIENT_NAME]: { label: 'Nom Client', description: 'Nom du client', example: 'John Doe' },
  [EmailVariable.CONTRACT_DELAY]: { label: 'Délai Contrat', description: 'Délai de paiement', example: '30 jours' },
  [EmailVariable.CONTRACT_TITLE]: {
    label: 'Titre Contrat',
    description: 'Titre du contrat',
    example: 'Prestation Web',
  },
};

export const EMAIL_VARIABLES_DEFAULTS: Partial<Record<EmailVariable, () => string>> = {
  [EmailVariable.YEAR]: () => new Date().getFullYear().toString(),
  [EmailVariable.CURRENT_DATE]: () => new Date().toLocaleDateString('fr-FR'),
};
