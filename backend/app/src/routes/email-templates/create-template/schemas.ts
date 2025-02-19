import { CreateEmailTemplateSchema } from '@entities/email-template-entity';
import type { FromSchema } from 'json-schema-to-ts';

export const body = CreateEmailTemplateSchema;
export type TBody = FromSchema<typeof body>;

export const params = {} as const;
export type TParams = FromSchema<typeof params>;

export const headers = {} as const;
export type THeaders = FromSchema<typeof headers>;

export const querystring = {} as const;
export type TQuerystring = FromSchema<typeof querystring>;

export const response = {} as const;
export type TResponse = FromSchema<typeof response>;
