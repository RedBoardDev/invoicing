import PlusIcon from './plus.svg?react';
import ContractIcon from './contract.svg?react';
import InvoiceIcon from './invoice.svg?react';
import HistoryIcon from './history.svg?react';
import TemplateIcon from './template.svg?react';
import EmailTemplateIcon from './email_template.svg?react';
import ClientsIcon from './clients.svg?react';

export const icons = {
  plus: PlusIcon,
  contract: ContractIcon,
  invoice: InvoiceIcon,
  history: HistoryIcon,
  template: TemplateIcon,
  emailTemplate: EmailTemplateIcon,
  clients: ClientsIcon,
};

export type IconName = keyof typeof icons;
