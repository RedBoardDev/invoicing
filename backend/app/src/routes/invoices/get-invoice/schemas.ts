import { buildExtendsQuerySchema } from '@libs/parseQuery';
import type { FromSchema } from 'json-schema-to-ts';

export const body = {} as const;
export type TBody = FromSchema<typeof body>;

export const params = {
  type: 'object',
  properties: {
    id: { type: 'string' },
  },
  required: ['id'],
  additionalProperties: false,
} as const;
export type TParams = FromSchema<typeof params>;

export const headers = {} as const;
export type THeaders = FromSchema<typeof headers>;

export const extendsMap = {
  items: { include: { items: true } },
  contract: { include: { contract: true } },
  permissions: { computed: true },
};

export const allowedExtensions = Object.keys(extendsMap);
export const includeQuerySchema = buildExtendsQuerySchema(allowedExtensions);

export const querystring = includeQuerySchema;
export type TQuerystring = FromSchema<typeof querystring>;

export const response = {} as const;

export type TResponse = FromSchema<typeof response>;
