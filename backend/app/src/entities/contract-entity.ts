import type { FromSchema } from 'json-schema-to-ts';

export const CreateContractSchema = {
  type: 'object',
  properties: {
    clientId: { type: 'string', format: 'uuid' },
    emailTemplateId: { type: 'string', format: 'uuid' },
    amountHT: { type: 'number', minimum: 0 },
    taxRate: { type: 'number', minimum: 0 },
    paymentDelay: { type: 'integer', minimum: 0 },
    title: { type: 'string', maxLength: 255 },
    description: { type: 'string', maxLength: 1000 },
    startDate: { type: 'string', format: 'date-time' },
    endDate: { type: 'string', format: 'date-time' },
  },
  required: ['clientId', 'emailTemplateId', 'amountHT', 'taxRate', 'paymentDelay', 'startDate', 'endDate', 'title'],
  additionalProperties: false,
} as const;

export type CreateContractData = FromSchema<typeof CreateContractSchema>;

export const UpdateContractSchema = {
  type: 'object',
  properties: {
    emailTemplateId: { type: 'string', format: 'uuid' },
    amountHT: { type: 'number', minimum: 0 },
    taxRate: { type: 'number', minimum: 0 },
    paymentDelay: { type: 'integer', minimum: 0 },
    title: { type: 'string', maxLength: 255 },
    description: { type: 'string', maxLength: 1000 },
    startDate: { type: 'string', format: 'date-time' },
    endDate: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
} as const;

export type UpdateContractData = FromSchema<typeof UpdateContractSchema>;
