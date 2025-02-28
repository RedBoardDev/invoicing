import { paginationQuerySchema } from '@entities/pagination-query';
import { buildExtendsQuerySchema } from '@libs/parseQuery';
import { mergeSchemas } from '@libs/utils';
import type { FromSchema } from 'json-schema-to-ts';

export const body = {} as const;
export type TBody = FromSchema<typeof body>;

export const params = {} as const;
export type TParams = FromSchema<typeof params>;

export const headers = {} as const;
export type THeaders = FromSchema<typeof headers>;

export const extendsMap = {
  contracts: { include: { contracts: true } },
};
export const allowedExtensions = Object.keys(extendsMap);
export const includeQuerySchema = buildExtendsQuerySchema(allowedExtensions);

export const querystring = mergeSchemas(paginationQuerySchema, includeQuerySchema);
export type TQuerystring = FromSchema<typeof querystring>;

export const response = {} as const;
export type TResponse = FromSchema<typeof response>;
