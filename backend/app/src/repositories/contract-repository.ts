import type { CreateContractData, UpdateContractData } from '@entities/contract-entity';
import { type CursorPaginationQuery, type Pagination, cursorPaginationForQuery } from '@libs/pagination';
import { prismaInstance } from '@libs/prisma-client';
import type { Contract, ContractHistory, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  type ContractUpdatePrimitives,
  createContractHistoryEntries,
  saveContractHistory,
} from '@services/contract-history-service';
import { handleError } from './error-handling-repository';

/**
 * Count Contracts
 */
const countContractsFn = async (where?: Prisma.ContractWhereInput): Promise<number> => {
  return prismaInstance.contract.count({ where });
};

export const countContracts = handleError(countContractsFn);

/**
 * Count ContractHistory
 */
const countContractHistoryFn = async (where?: Prisma.ContractHistoryWhereInput): Promise<number> => {
  return prismaInstance.contractHistory.count({ where });
};

export const countContractHistory = handleError(countContractHistoryFn);

/**
 * Create Contract
 */
const createContractQuery = async (data: CreateContractData): Promise<Contract> =>
  prismaInstance.contract.create({
    data,
  });

export type CreateContractQueryType = Prisma.PromiseReturnType<typeof createContractQuery>;

const createContractFn = async (data: CreateContractData): Promise<CreateContractQueryType> => {
  return await createContractQuery(data);
};

export const createContract = handleError(createContractFn);

/**
 * List Contracts
 */
const listContractsQuery = async (
  paginationQuery: { skip?: number; take: number } | undefined,
  include?: Prisma.ContractInclude,
  where?: Prisma.ContractWhereInput,
): Promise<Contract[]> =>
  prismaInstance.contract.findMany({
    ...(paginationQuery || {}),
    include: { ...include },
    where,
    orderBy: { createdAt: 'desc' },
  });

export type ListContractsQueryType = Prisma.PromiseReturnType<typeof listContractsQuery>;

const listContractsFn = async (
  pagination?: Pagination,
  include?: Prisma.ContractInclude,
  where?: Prisma.ContractWhereInput,
): Promise<ListContractsQueryType> => {
  let paginationQuery: CursorPaginationQuery | undefined = undefined;
  if (pagination) {
    paginationQuery = cursorPaginationForQuery(pagination);
  }
  const result = await listContractsQuery(paginationQuery, include, where);
  return result;
};

export const listContracts = handleError(listContractsFn);

/**
 * Get Contract by ID
 */
const getContractQueryById = async (contractId: string, include?: Prisma.ContractInclude): Promise<Contract> => {
  return prismaInstance.contract.findUniqueOrThrow({ where: { id: contractId }, include });
};

export type GetContractQueryByIdType = Prisma.PromiseReturnType<typeof getContractQueryById>;

const getContractByIdFn = async (
  contractId: string,
  include?: Prisma.ContractInclude,
): Promise<GetContractQueryByIdType> => {
  return await getContractQueryById(contractId, include);
};

export const getContractById = handleError(getContractByIdFn);

/**
 * Update Contract
 */
const updateContractQuery = async (contractId: string, data: Prisma.ContractUpdateInput): Promise<Contract> => {
  return prismaInstance.contract.update({
    where: { id: contractId },
    data,
  });
};

export type UpdateContractQueryType = Prisma.PromiseReturnType<typeof updateContractQuery>;

const updateContractFn = async (contractId: string, data: UpdateContractData): Promise<UpdateContractQueryType> => {
  // Conversion des dates et création d'un objet compatible
  const processedData: Prisma.ContractUpdateInput = {
    ...data,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
  };

  return prismaInstance.$transaction(async (prisma) => {
    const currentContract = await prisma.contract.findUniqueOrThrow({
      where: { id: contractId },
    });

    // Conversion explicite vers le type primitif
    const historyEntries = createContractHistoryEntries(
      currentContract,
      processedData as Record<string, unknown> as ContractUpdatePrimitives,
      contractId,
    );

    await saveContractHistory(historyEntries, prisma);

    return updateContractQuery(contractId, processedData);
  });
};

export const updateContract = handleError(updateContractFn);
/**
 * Delete Contract
 */
const deleteContractsQuery = async (
  ids: string[],
): Promise<{
  deletedIds: string[];
  failedIds: Array<{ id: string; reason: string }>;
}> => {
  return prismaInstance.$transaction(async (prisma) => {
    const results = {
      deletedIds: [] as string[],
      failedIds: [] as Array<{ id: string; reason: string }>,
    };

    for (const id of ids) {
      try {
        await prisma.contract.delete({
          where: { id },
          select: { id: true },
        });
        results.deletedIds.push(id);
      } catch (error) {
        results.failedIds.push({
          id,
          reason:
            error instanceof PrismaClientKnownRequestError && error.code === 'P2025' ? 'Not found' : 'Unknown error',
        });
      }
    }

    return results;
  });
};

export type DeleteContractsQueryType = Prisma.PromiseReturnType<typeof deleteContractsQuery>;

const deleteContractsFn = async (ids: string[]): Promise<DeleteContractsQueryType> => {
  return await deleteContractsQuery(ids);
};

export const deleteContracts = handleError(deleteContractsFn);

/**
 * List ContractHistory
 */
const listContractHistoryQuery = async (
  paginationQuery: { skip?: number; take: number } | undefined,
  include?: Prisma.ContractHistoryInclude,
  where?: Prisma.ContractHistoryWhereInput,
): Promise<ContractHistory[]> =>
  prismaInstance.contractHistory.findMany({
    ...(paginationQuery || {}),
    include: { ...include },
    where,
    orderBy: { createdAt: 'desc' },
  });

export type ListContractHistoryQueryType = Prisma.PromiseReturnType<typeof listContractHistoryQuery>;

const listContractHistoryFn = async (
  pagination?: Pagination,
  include?: Prisma.ContractHistoryInclude,
  where?: Prisma.ContractHistoryWhereInput,
): Promise<ListContractHistoryQueryType> => {
  let paginationQuery: CursorPaginationQuery | undefined = undefined;
  if (pagination) {
    paginationQuery = cursorPaginationForQuery(pagination);
  }
  return await listContractHistoryQuery(paginationQuery, include, where);
};

export const listContractHistory = handleError(listContractHistoryFn);
