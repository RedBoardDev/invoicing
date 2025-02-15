import type { FromSchema } from 'json-schema-to-ts';

export const CreateContractSchema = {
  type: 'object',
  properties: {
    clientId: { type: 'string', format: 'uuid' },
    amountHT: { type: 'number', minimum: 0 },
    amountTTC: { type: 'number', minimum: 0 },
    paymentDelayDays: { type: 'integer', minimum: 0 },
    description: { type: 'string', maxLength: 1000 },
    startDate: { type: 'string', format: 'date-time' },
    endDate: { type: 'string', format: 'date-time' },
  },
  required: ['clientId', 'amountHT', 'amountTTC', 'paymentDelayDays', 'startDate', 'endDate'],
  additionalProperties: false,
} as const;

export type CreateContractData = FromSchema<typeof CreateContractSchema>;

export const UpdateContractSchema = {
  type: 'object',
  properties: {
    clientId: { type: 'string', format: 'uuid' },
    amountHT: { type: 'number', minimum: 0 },
    amountTTC: { type: 'number', minimum: 0 },
    paymentDelayDays: { type: 'integer', minimum: 0 },
    description: { type: 'string', maxLength: 1000 },
    startDate: { type: 'string', format: 'date-time' },
    endDate: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
} as const;

export type UpdateContractData = FromSchema<typeof UpdateContractSchema>;
