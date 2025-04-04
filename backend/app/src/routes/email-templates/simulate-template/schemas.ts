import type { FromSchema } from 'json-schema-to-ts';

export const body = {} as const;
export type TBody = FromSchema<typeof body>;

export const params = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    invoiceId: { type: 'string' },
  },
  required: ['id', 'invoiceId'],
  additionalProperties: false,
} as const;
export type TParams = FromSchema<typeof params>;

export const headers = {} as const;
export type THeaders = FromSchema<typeof headers>;

export const querystring = {};
export type TQuerystring = FromSchema<typeof querystring>;

export const response = {} as const;
export type TResponse = FromSchema<typeof response>;
