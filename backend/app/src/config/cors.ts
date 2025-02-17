import fastifyCors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';

export const setupCors = (ffy: FastifyInstance): void => {
  ffy.register(fastifyCors, { origin: '*' });
};
