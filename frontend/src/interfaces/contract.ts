import type Client from '@interfaces/client';
import { ContractHistory } from '@interfaces/contractHistory';
import type Invoice from '@interfaces/invoice';

interface Contract {
  id: string;
  clientId: string;
  client: Client;
  amountHT: string;
  taxRate: string;
  paymentDelay: number;
  title: string;
  description: string;
  invoices?: Invoice[];
  history: ContractHistory[];
  startDate: string;
  endDate: string;
  invoice: Invoice;
  createdAt: string;
  updatedAt: string;
}

export default Contract;
