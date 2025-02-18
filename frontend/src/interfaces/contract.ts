import type Client from '@interfaces/clients';

interface Contract {
  id: string;
  clientId: string;
  client: Client;
  amountHT: string;
  taxRate: string;
  paymentDelay: number;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export default Contract;
