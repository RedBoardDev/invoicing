import type { Client } from '@prisma/client';
import { countContracts } from '@repositories/contract-repository';
import type { PermissionConditions } from '../types';

export const clientPermissionConditions: PermissionConditions<Client> = {
  canBeDeleted: async (client) => {
    const contractCount = await countContracts({ clientId: client.id });
    return contractCount === 0;
  },
  canBeUpdated: {
    name: () => true,
    email: () => true,
  },
};
