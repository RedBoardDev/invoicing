import { prismaInstance } from '@libs/prisma-client';
import { handleError } from './error-handling-repository';

const checkDatabaseConnectionFn = async (): Promise<boolean> => {
  try {
    await prismaInstance.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
};

export const checkDatabaseConnection = handleError(checkDatabaseConnectionFn);
