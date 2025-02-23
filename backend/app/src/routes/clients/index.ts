import createClientRoute from '@routes/clients/create-client';
import deleteClientRoute from '@routes/clients/delete-client';
import getClientRoute from '@routes/clients/get-client';
import listClientsRoute from '@routes/clients/list-clients';
import listContractsForClientRoute from '@routes/clients/list-contracts';
import updateClientRoute from '@routes/clients/update-client';
import type { FastifyInstance } from 'fastify';

const clientsRoutes = async (app: FastifyInstance): Promise<void> => {
  app.register(createClientRoute);
  app.register(deleteClientRoute);
  app.register(getClientRoute);
  app.register(listClientsRoute);
  app.register(updateClientRoute);
  app.register(listContractsForClientRoute);
};

export default clientsRoutes;
