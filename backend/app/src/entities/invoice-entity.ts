import { InvoiceStatus } from '@prisma/client';
import type { FromSchema } from 'json-schema-to-ts';

export const CreateInvoiceSchema = {
  type: 'object',
  properties: {
    contractId: { type: 'string', format: 'uuid' },
    invoiceNumber: { type: 'string', minLength: 1 },
    totalAmount: { type: 'number', minimum: 0 },
    status: { type: 'string', enum: Object.values(InvoiceStatus) },
    dueDate: { type: 'string', format: 'date-time' },
    sendDate: { type: 'string', format: 'date-time' },
    pdfUrl: { type: 'string' },
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
      minItems: 1,
    },
  },
  required: ['contractId', 'invoiceNumber', 'totalAmount', 'dueDate', 'items'],
  additionalProperties: false,
} as const;

export type CreateInvoiceData = FromSchema<typeof CreateInvoiceSchema>;

export const UpdateInvoiceSchema = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: Object.values(InvoiceStatus) },
    sendDate: { type: 'string', format: 'date-time' },
    pdfUrl: { type: 'string' },
  },
  additionalProperties: false,
} as const;

export type UpdateInvoiceData = FromSchema<typeof UpdateInvoiceSchema>;
