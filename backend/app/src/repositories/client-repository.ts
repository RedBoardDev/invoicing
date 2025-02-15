import { type CursorPaginationQuery, type Pagination, cursorPaginationForQuery } from '@libs/pagination';
import { prismaInstance } from '@libs/prisma-client';
import type { Client, Prisma } from '@prisma/client';
import { handleError } from './error-handling-repository';

export interface CreateClientData {
  name: string;
}

export interface UpdateClientData {
  name?: string;
}

/**
 * Count Clients
 */
const countClientsFn = async (where?: Prisma.ClientWhereInput): Promise<number> => {
  return prismaInstance.client.count({ where });
};

export const countClients = handleError(countClientsFn);

/**
 * Create Client
 */
const createClientQuery = async (data: CreateClientData): Promise<Client> => {
  return prismaInstance.client.create({
    data: {
      name: data.name,
    },
  });
};

export type CreateClientQueryType = Prisma.PromiseReturnType<typeof createClientQuery>;

const createClientFn = async (data: CreateClientData): Promise<CreateClientQueryType> => {
  return await createClientQuery(data);
};

export const createClient = handleError(createClientFn);

/**
 * List Clients
 */
const listClientsQuery = async (
  paginationQuery: { skip?: number; take: number } | undefined,
  where?: Prisma.ClientWhereInput,
): Promise<Client[]> =>
  prismaInstance.client.findMany({
    ...(paginationQuery || {}),
    where,
    orderBy: { createdAt: 'desc' },
  });

export type ListClientsQueryType = Prisma.PromiseReturnType<typeof listClientsQuery>;

const listClientsFn = async (
  pagination?: Pagination,
  where?: Prisma.ClientWhereInput,
): Promise<ListClientsQueryType> => {
  let paginationQuery: CursorPaginationQuery | undefined = undefined;
  if (pagination) {
    paginationQuery = cursorPaginationForQuery(pagination);
  }
  const result = await listClientsQuery(paginationQuery, where);
  return result;
};

export const listClients = handleError(listClientsFn);

/**
 * Get Client by ID
 */
const getClientQueryById = async (clientId: string): Promise<Client> => {
  return prismaInstance.client.findUniqueOrThrow({ where: { id: clientId } });
};

export type GetClientQueryByIdType = Prisma.PromiseReturnType<typeof getClientQueryById>;

const getClientByIdFn = async (clientId: string): Promise<GetClientQueryByIdType> => {
  return await getClientQueryById(clientId);
};

export const getClientById = handleError(getClientByIdFn);

/**
 * Update Client
 */
const updateClientQuery = async (clientId: string, data: UpdateClientData): Promise<Client> => {
  return prismaInstance.client.update({
    where: { id: clientId },
    data,
  });
};

export type UpdateClientQueryType = Prisma.PromiseReturnType<typeof updateClientQuery>;

const updateClientFn = async (clientId: string, data: UpdateClientData): Promise<UpdateClientQueryType> => {
  return await updateClientQuery(clientId, data);
};

export const updateClient = handleError(updateClientFn);

/**
 * Delete Client
 */
const deleteClientQuery = async (clientId: string): Promise<Client> => {
  return prismaInstance.client.delete({ where: { id: clientId } });
};

export type DeleteClientQueryType = Prisma.PromiseReturnType<typeof deleteClientQuery>;

const deleteClientFn = async (clientId: string): Promise<DeleteClientQueryType> => {
  return await deleteClientQuery(clientId);
};

export const deleteClient = handleError(deleteClientFn);
