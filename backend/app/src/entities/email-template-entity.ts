import type { FromSchema } from 'json-schema-to-ts';

export const CreateEmailTemplateSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    subject: { type: 'string', minLength: 1 },
    content: { type: 'string', minLength: 1 },
  },
  required: ['name', 'subject', 'content'],
  additionalProperties: false,
} as const;

export type CreateEmailTemplateData = FromSchema<typeof CreateEmailTemplateSchema>;

export const UpdateEmailTemplateSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    subject: { type: 'string', minLength: 1 },
    content: { type: 'string', minLength: 1 },
  },
  required: [],
  additionalProperties: false,
} as const;

export type UpdateEmailTemplateData = FromSchema<typeof UpdateEmailTemplateSchema>;
