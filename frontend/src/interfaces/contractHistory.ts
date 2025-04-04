import type Contract from '@interfaces/contract';

export interface ContractHistory {
  id: number;
  contractId: string;
  contract: Contract;
  changeType:
    | 'AMOUNTHT_UPDATE'
    | 'TAXRATE_UPDATE'
    | 'PAYMENT_DELAY_UPDATE'
    | 'TITLE_UPDATE'
    | 'DESCRIPTION_UPDATE'
    | 'STARTDATE_UPDATE'
    | 'ENDDATE_UPDATE';
  oldData?: string;
  newData?: string;
  createdAt: Date;
}

export const CHANGE_TYPE_DESCRIPTIONS: Record<string, string> = {
  AMOUNTHT_UPDATE: 'Modification du montant HT',
  TAXRATE_UPDATE: 'Modification du taux de taxe',
  PAYMENT_DELAY_UPDATE: 'Modification du délai de paiement',
  TITLE_UPDATE: 'Modification du titre',
  DESCRIPTION_UPDATE: 'Modification de la description',
  STARTDATE_UPDATE: 'Modification de la date de début',
  ENDDATE_UPDATE: 'Modification de la date de fin',
};

export const CHANGE_TYPE_COLORS: Record<string, string> = {
  AMOUNTHT_UPDATE: 'green',
  TAXRATE_UPDATE: 'orange',
  PAYMENT_DELAY_UPDATE: 'purple',
  TITLE_UPDATE: 'blue',
  DESCRIPTION_UPDATE: 'cyan',
  STARTDATE_UPDATE: 'magenta',
  ENDDATE_UPDATE: 'geekblue',
};
