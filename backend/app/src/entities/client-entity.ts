import type { FromSchema } from 'json-schema-to-ts';

export const CreateClientSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: {
      type: 'array',
      items: {
        type: 'string',
        format: 'email',
      },
      minItems: 1,
    },
  },
  required: ['name', 'email'],
  additionalProperties: false,
} as const;

export type CreateClientData = FromSchema<typeof CreateClientSchema>;

export const UpdateClientSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: {
      type: 'array',
      items: {
        type: 'string',
        format: 'email',
      },
      minItems: 1,
    },
  },
  required: [],
  additionalProperties: false,
} as const;

export type UpdateClientData = FromSchema<typeof UpdateClientSchema>;
