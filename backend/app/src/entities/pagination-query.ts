import type { FromSchema } from 'json-schema-to-ts';

export const paginationQuerySchema = {
  type: 'object',
  properties: {
    page: { type: 'string', pattern: '^[0-9]+$', default: '1' },
    pageSize: { type: 'string', pattern: '^[0-9]+$', default: '1000' },
    findId: { type: 'string', format: 'uuid' },
    totalCount: { type: 'string', default: false },
  },
  required: [],
  additionalProperties: false,
} as const;

export type PaginationQueryString = FromSchema<typeof paginationQuerySchema>;
