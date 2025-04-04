import type Client from '@interfaces/client';
import type Contract from '@interfaces/contract';
import type { ContractHistory } from '@interfaces/contractHistory';
import type EmailTemplate from '@interfaces/emailTemplate';
import type Invoice from '@interfaces/invoice';
import type InvoiceItem from '@interfaces/invoiceItem';

export interface Permissions {
  canBeDeleted: boolean;
  canBeUpdated: Record<string, boolean>;
}

export type WithExtends<T, E extends string = never> = [E] extends [never]
  ? T
  : T & {
      [K in E]: K extends 'client'
        ? Client
        : K extends 'contract'
          ? Contract
          : K extends 'contracts'
            ? Contract[]
            : K extends 'emailTemplate'
              ? EmailTemplate
              : K extends 'history'
                ? ContractHistory[]
                : K extends 'invoice'
                  ? Invoice
                  : K extends 'invoices'
                    ? Invoice[]
                    : K extends 'items'
                      ? InvoiceItem[]
                      : K extends 'permissions'
                        ? Permissions
                        : never;
    };
