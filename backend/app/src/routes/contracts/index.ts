import createContractRoute from '@routes/contracts/create-contract';
import deleteContractRoute from '@routes/contracts/delete-contract';
import getContractRoute from '@routes/contracts/get-contract';
import listContractsRoute from '@routes/contracts/list-contracts';
import updateContractRoute from '@routes/contracts/update-contract';
import type { FastifyInstance } from 'fastify';

const contractsRoutes = async (app: FastifyInstance): Promise<void> => {
  app.register(createContractRoute);
  app.register(deleteContractRoute);
  app.register(getContractRoute);
  app.register(listContractsRoute);
  app.register(updateContractRoute);
};

export default contractsRoutes;
