import type { FromSchema } from 'json-schema-to-ts';

export const paginationQuerySchema = {
  type: 'object',
  properties: {
    page: { type: 'string', pattern: '^[0-9]+$' },
    pageSize: { type: 'string', pattern: '^[0-9]+$' },
    findId: { type: 'string', pattern: '^[0-9]+$' },
    includeCount: { type: 'string', enum: ['true', 'false'] },
  },
  required: [],
  additionalProperties: false,
} as const;

export type PaginationQueryString = FromSchema<typeof paginationQuerySchema>;
