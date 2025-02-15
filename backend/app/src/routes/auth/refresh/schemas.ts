import { authTokenResponseSchema } from '@entities/token-entities';
import type { FromSchema } from 'json-schema-to-ts';

export const body = {
  type: 'object',
  properties: {
    refreshToken: { type: 'string' },
  },
  required: ['refreshToken'],
  additionalProperties: false,
} as const;

export type TBody = FromSchema<typeof body>;

export const params = {} as const;

export type TParams = FromSchema<typeof params>;

export const headers = {} as const;

export type THeaders = FromSchema<typeof headers>;

export const querystring = {} as const;

export type TQuerystring = FromSchema<typeof querystring>;

export const response = {
  type: 'object',
  properties: {
    200: authTokenResponseSchema,
    additionalProperties: false,
  },
} as const;

export type TResponse = FromSchema<typeof response>;
