import type Contract from '@interfaces/contract';

interface Client {
  id: string;
  name: string;
  email: string;
  contracts: Contract[];
  createdAt: string;
  updatedAt: string;
}

export default Client;
