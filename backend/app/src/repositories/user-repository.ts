import type { CreateUserData } from '@entities/user-entity';
import { encryptPassword } from '@libs/password';
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

/**
 * Create a new user
 */

const createUserQuery = async (data: CreateUserData): Promise<User> => {
  const hashedPassword = await encryptPassword(data.password);
  return prismaInstance.user.create({
    data: {
      email: data.email,
      hashedPassword: hashedPassword,
    },
  });
};

export type CreateUserQueryType = Prisma.PromiseReturnType<typeof createUserQuery>;

const createUserFn = async (data: CreateUserData): Promise<CreateUserQueryType> => {
  return await createUserQuery(data);
};

export const createUser = handleError(createUserFn);
