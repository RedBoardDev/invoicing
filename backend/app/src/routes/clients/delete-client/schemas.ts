import type { FromSchema } from 'json-schema-to-ts';

export const body = {
  type: 'object',
  properties: {
    ids: {
      type: 'array',
      items: { type: 'string', format: 'uuid' },
      minItems: 1,
      maxItems: 100,
    },
  },
  required: ['ids'],
  additionalProperties: false,
} as const;
export type TBody = FromSchema<typeof body>;

export const params = {} as const;
export type TParams = FromSchema<typeof params>;

export const headers = {} as const;
export type THeaders = FromSchema<typeof headers>;

export const querystring = {} as const;
export type TQuerystring = FromSchema<typeof querystring>;

export const response = {} as const;
export type TResponse = FromSchema<typeof response>;
