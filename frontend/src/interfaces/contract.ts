import type Client from '@interfaces/client';
import type { ContractHistory } from '@interfaces/contractHistory';
import type EmailTemplate from '@interfaces/emailTemplate';
import type Invoice from '@interfaces/invoice';

interface Contract {
  id: string;
  clientId: string;
  client: Client;
  amountHT: number;
  taxRate: number;
  paymentDelay: number;
  title: string;
  description: string;
  invoices?: Invoice[];
  history?: ContractHistory[];
  emailTemplateId: string;
  emailTemplate?: EmailTemplate;
  startDate: string;
  endDate: string;
  invoice: Invoice;
  createdAt: string;
  updatedAt: string;
}

export default Contract;
