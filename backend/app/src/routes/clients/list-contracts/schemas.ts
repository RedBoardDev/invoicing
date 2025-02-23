import { paginationQuerySchema } from '@entities/pagination-query';
import { type IncludeConfigs, IncludeType } from '@libs/parseQuery/types/include';
import { mergeSchemas } from '@libs/utils';
import { buildIncludeQuerySchema } from '@libs/utils/build-include-query-schema';
import type { FromSchema } from 'json-schema-to-ts';

export const body = {} as const;
export type TBody = FromSchema<typeof body>;

export const params = {
  type: 'object',
  properties: {
    clientId: { type: 'string', format: 'uuid' },
  },
  required: ['clientId'],
  additionalProperties: false,
} as const;
export type TParams = FromSchema<typeof params>;

export const headers = {} as const;
export type THeaders = FromSchema<typeof headers>;

export const includeConfigs: IncludeConfigs = {
  invoices: { type: IncludeType.DEFINE, include: { invoices: true } },
  history: { type: IncludeType.DEFINE, include: { history: true } },
  client: { type: IncludeType.DEFINE, include: { client: true } },
};

export const querystring = mergeSchemas(paginationQuerySchema, buildIncludeQuerySchema(includeConfigs));
export type TQuerystring = FromSchema<typeof querystring>;

export const response = {} as const;
export type TResponse = FromSchema<typeof response>;
