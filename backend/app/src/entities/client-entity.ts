import type { FromSchema } from 'json-schema-to-ts';

export const CreateClientSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', format: 'uuid' },
    email: { type: 'string', format: 'email' },
  },
  required: ['name', 'email'],
  additionalProperties: false,
} as const;

export type CreateClientData = FromSchema<typeof CreateClientSchema>;

export const UpdateClientSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', format: 'uuid' },
    email: { type: 'string', format: 'email' },
  },
  required: [],
  additionalProperties: false,
} as const;

export type UpdateClientData = FromSchema<typeof UpdateClientSchema>;
