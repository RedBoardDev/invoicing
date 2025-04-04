import { InvoiceStatus } from '@prisma/client';
import type { FromSchema } from 'json-schema-to-ts';

export const CreateInvoiceSchema = {
  type: 'object',
  properties: {
    contractId: { type: 'string', format: 'uuid' },
    amountHT: { type: 'number', minimum: 0 },
    taxRate: { type: 'number', minimum: 0 },
    status: { type: 'string', enum: Object.values(InvoiceStatus) },
    paymentDelay: { type: 'integer', minimum: 0 },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          description: { type: 'string', minLength: 1 },
          amount: { type: 'number', minimum: 0 },
        },
        required: ['description', 'amount'],
      },
    },
  },
  required: ['contractId', 'amountHT', 'taxRate', 'status', 'paymentDelay'],
  additionalProperties: false,
} as const;

export type CreateInvoiceData = FromSchema<typeof CreateInvoiceSchema>;

export const UpdateInvoiceSchema = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: Object.values(InvoiceStatus) },
    sendDate: { type: 'string', format: 'date-time' },
    fileId: { type: 'string' },
    invoiceNumber: { type: 'string' },
    dueDate: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
} as const;

export type UpdateInvoiceData = FromSchema<typeof UpdateInvoiceSchema>;
