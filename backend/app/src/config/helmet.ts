import fastifyHelmet from '@fastify/helmet';
import type { FastifyInstance } from 'fastify';

export const setupHelmet = (ffy: FastifyInstance): void => {
  ffy.register(fastifyHelmet);
};
