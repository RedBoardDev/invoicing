import { PrismaClient } from '@prisma/client';

export const prismaInstance = new PrismaClient({ errorFormat: 'pretty' });

prismaInstance.$use(async (params, next) => {
  const startTime = Date.now();

  try {
    const result = await next(params);

    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();

    console.log(`[${timestamp}] ${params.model}.${params.action} - Duration: ${duration}ms - Status: Success`);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();

    console.error(`[${timestamp}] ${params.model}.${params.action} - Duration: ${duration}ms - Status: Error`);

    throw error;
  }
});
