import type Contract from '@interfaces/contract';

interface Client {
  id: string;
  name: string;
  contracts: Contract[];
  createdAt: string;
  updatedAt: string;
}

export default Client;
