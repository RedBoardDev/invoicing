import type { CreateContractData, UpdateContractData } from '@entities/contract-entity';
import { type CursorPaginationQuery, type Pagination, cursorPaginationForQuery } from '@libs/pagination';
import { prismaInstance } from '@libs/prisma-client';
import type { Contract, Prisma } from '@prisma/client';
import { handleError } from './error-handling-repository';

/**
 * Count Contracts
 */
const countContractsFn = async (where?: Prisma.ContractWhereInput): Promise<number> => {
  return prismaInstance.contract.count({ where });
};

export const countContracts = handleError(countContractsFn);

/**
 * Create Contract
 */
const createContractQuery = async (data: CreateContractData): Promise<Contract> => {
  return prismaInstance.contract.create({
    data: {
      clientId: data.clientId,
      amountHT: data.amountHT,
      amountTTC: data.amountTTC,
      paymentDelayDays: data.paymentDelayDays,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
    },
  });
};

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
const updateContractQuery = async (contractId: string, data: UpdateContractData): Promise<Contract> => {
  return prismaInstance.contract.update({
    where: { id: contractId },
    data,
  });
};

export type UpdateContractQueryType = Prisma.PromiseReturnType<typeof updateContractQuery>;

const updateContractFn = async (contractId: string, data: UpdateContractData): Promise<UpdateContractQueryType> => {
  return await updateContractQuery(contractId, data);
};

export const updateContract = handleError(updateContractFn);

/**
 * Delete Contract
 */
const deleteContractQuery = async (contractId: string): Promise<Contract> => {
  return prismaInstance.contract.delete({ where: { id: contractId } });
};

export type DeleteContractQueryType = Prisma.PromiseReturnType<typeof deleteContractQuery>;

const deleteContractFn = async (contractId: string): Promise<DeleteContractQueryType> => {
  return await deleteContractQuery(contractId);
};

export const deleteContract = handleError(deleteContractFn);
