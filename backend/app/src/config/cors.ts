import { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';

export const setupCors = (ffy: FastifyInstance): void => {
  ffy.register(fastifyCors, {origin: '*',});
};
