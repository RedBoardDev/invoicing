import type { FromSchema } from 'json-schema-to-ts';

export const body = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
  },
  required: ['email', 'password'],
  additionalProperties: false,
} as const;

export type TBody = FromSchema<typeof body>;

export const response = {} as const;

export type TResponse = FromSchema<typeof response>;
