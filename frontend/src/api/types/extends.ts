// api/types/extends.ts
import type Client from '@interfaces/client';
import type Contract from '@interfaces/contract';
import type Invoice from '@interfaces/invoice';
import type InvoiceItem from '@interfaces/invoiceItem';
import type { ContractHistory } from '@interfaces/contractHistory';
import type EmailTemplate from '@interfaces/emailTemplate';

export interface Permissions {
  canBeDeleted: boolean;
  canBeUpdated: Record<string, boolean>;
}

export type WithExtends<T, E extends string = never> = [E] extends [never]
  ? T
  : T & {
      [K in E]: K extends 'contracts'
        ? Contract[]
        : K extends 'permissions'
          ? Permissions
          : K extends 'invoices'
            ? Invoice[]
            : K extends 'history'
              ? ContractHistory[]
              : K extends 'client'
                ? Client
                : K extends 'items'
                  ? InvoiceItem[]
                  : K extends 'emailTemplate'
                    ? EmailTemplate
                    : never;
    };
