import type { Contract, Prisma } from '@prisma/client';
import { ContractChangeType } from '@prisma/client';

const TRACKED_FIELDS = ['amountHT', 'taxRate', 'paymentDelay', 'title', 'description', 'startDate', 'endDate'] as const;

type TrackedField = (typeof TRACKED_FIELDS)[number];
type ChangeTypeMapping = Record<TrackedField, ContractChangeType>;

const CHANGE_TYPE_MAP: ChangeTypeMapping = {
  amountHT: ContractChangeType.AMOUNTHT_UPDATE,
  taxRate: ContractChangeType.TAXRATE_UPDATE,
  paymentDelay: ContractChangeType.PAYMENT_DELAY_UPDATE,
  title: ContractChangeType.TITLE_UPDATE,
  description: ContractChangeType.DESCRIPTION_UPDATE,
  startDate: ContractChangeType.STARTDATE_UPDATE,
  endDate: ContractChangeType.ENDDATE_UPDATE,
};

export type ContractUpdatePrimitives = {
  [K in TrackedField]?: Contract[K];
};

/**
 * Creates contract history entries based on the changes between the current contract and the update data.
 *
 * @param currentContract - The current state of the contract.
 * @param updateData - The data to update the contract with.
 * @param contractId - The unique identifier of the contract.
 * @returns An array of contract history entries to be created.
 */
export const createContractHistoryEntries = (
  currentContract: Contract,
  updateData: Partial<Contract>,
  contractId: string,
): Prisma.ContractHistoryCreateManyInput[] => {
  const entries: Prisma.ContractHistoryCreateManyInput[] = [];

  for (const field of TRACKED_FIELDS) {
    const newValue = updateData[field];
    const currentValue = currentContract[field];

    if (newValue === undefined || newValue === currentValue) continue;

    entries.push({
      contractId,
      changeType: CHANGE_TYPE_MAP[field],
      oldValue: serializeValue(currentValue),
      newValue: serializeValue(newValue),
    });
  }

  return entries;
};

/**
 * Serializes a given value into a string representation.
 *
 * @param value - The value to be serialized. It can be of any type.
 * @returns A string representation of the value, or null if the value is null or undefined.
 */
const serializeValue = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'number') return value.toString();
  return String(value);
};

/**
 * Saves the history entries in the database.
 *
 * @param entries - Entries to be saved.
 * @param prisma - Prisma transactional client.
 */
export const saveContractHistory = async (
  entries: Prisma.ContractHistoryCreateManyInput[],
  prisma: Prisma.TransactionClient,
): Promise<void> => {
  if (entries.length === 0) return;

  await prisma.contractHistory.createMany({
    data: entries,
    skipDuplicates: true,
  });
};
