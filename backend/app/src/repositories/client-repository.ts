import { type CursorPaginationQuery, type Pagination, cursorPaginationForQuery } from '@libs/pagination';
import { prismaInstance } from '@libs/prisma-client';
import type { Client, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
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
  include?: Prisma.ClientInclude,
  where?: Prisma.ClientWhereInput,
): Promise<Client[]> =>
  prismaInstance.client.findMany({
    ...(paginationQuery || {}),
    include: { ...include },
    where,
    orderBy: { createdAt: 'desc' },
  });

export type ListClientsQueryType = Prisma.PromiseReturnType<typeof listClientsQuery>;

const listClientsFn = async (
  pagination?: Pagination,
  include?: Prisma.ClientInclude,
  where?: Prisma.ClientWhereInput,
): Promise<ListClientsQueryType> => {
  let paginationQuery: CursorPaginationQuery | undefined = undefined;
  if (pagination) {
    paginationQuery = cursorPaginationForQuery(pagination);
  }
  const result = await listClientsQuery(paginationQuery, include, where);
  return result;
};

export const listClients = handleError(listClientsFn);

/**
 * Get Client by ID
 */
const getClientQueryById = async (clientId: string, include?: Prisma.ClientInclude): Promise<Client> => {
  return prismaInstance.client.findUniqueOrThrow({ where: { id: clientId }, include });
};

export type GetClientQueryByIdType = Prisma.PromiseReturnType<typeof getClientQueryById>;

const getClientByIdFn = async (clientId: string, include?: Prisma.ClientInclude): Promise<GetClientQueryByIdType> => {
  return await getClientQueryById(clientId, include);
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
const deleteClientsQuery = async (
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
        await prisma.client.delete({
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

export type DeleteClientsQueryType = Prisma.PromiseReturnType<typeof deleteClientsQuery>;

const deleteClientsFn = async (ids: string[]): Promise<DeleteClientsQueryType> => {
  return await deleteClientsQuery(ids);
};

export const deleteClients = handleError(deleteClientsFn);
