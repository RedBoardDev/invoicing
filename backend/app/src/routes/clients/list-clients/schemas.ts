import { paginationQuerySchema } from '@entities/pagination-query';
import { type IncludeConfigs, IncludeType } from '@libs/parseQuery/types/include';
import { mergeSchemas } from '@libs/utils';
import { buildIncludeQuerySchema } from '@libs/utils/build-include-query-schema';
import type { FromSchema } from 'json-schema-to-ts';

export const body = {} as const;
export type TBody = FromSchema<typeof body>;

export const params = {} as const;
export type TParams = FromSchema<typeof params>;

export const headers = {} as const;
export type THeaders = FromSchema<typeof headers>;

export const includeConfigs: IncludeConfigs = { contracts: { type: IncludeType.DEFINE, include: { contracts: true } } };
export const includeQuerySchema = buildIncludeQuerySchema(includeConfigs);

export const querystring = mergeSchemas(paginationQuerySchema, includeQuerySchema);
export type TQuerystring = FromSchema<typeof querystring>;

export const response = {} as const;
export type TResponse = FromSchema<typeof response>;
