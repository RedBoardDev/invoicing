import { prismaInstance } from '@libs/prisma-client';
import type { Prisma, User } from '@prisma/client';
import { handleError } from './error-handling-repository';

/**
 * Retrieves a user by their email
 */
const getUserByEmailQuery = async (email: string): Promise<User | null> => {
  return prismaInstance.user.findUnique({ where: { email } });
};

export type GetUserByEmailQueryType = Prisma.PromiseReturnType<typeof getUserByEmailQuery>;

const getUserByEmailFn = async (email: string): Promise<GetUserByEmailQueryType> => {
  return await getUserByEmailQuery(email);
};

export const getUserByEmail = handleError(getUserByEmailFn);

/**
 * Retrieves a user by their ID
 */
const getUserByIdQuery = async (id: string): Promise<User | null> => {
  return prismaInstance.user.findUnique({ where: { id } });
};

export type GetUserByIdQueryType = Prisma.PromiseReturnType<typeof getUserByIdQuery>;

const getUserByIdFn = async (id: string): Promise<GetUserByIdQueryType> => {
  return await getUserByIdQuery(id);
};

export const getUserById = handleError(getUserByIdFn);
