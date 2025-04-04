import type { EmailTemplate } from '@prisma/client';
import { countContracts } from '@repositories/contract-repository';
import type { PermissionConditions } from '../types';

export const emailTemplatePermissionConditions: PermissionConditions<EmailTemplate> = {
  canBeDeleted: async (template) => {
    const contractCount = await countContracts({ emailTemplateId: template.id });
    return contractCount === 0;
  },
  canBeUpdated: {
    name: () => true,
    subject: () => true,
    content: () => true,
  },
};
