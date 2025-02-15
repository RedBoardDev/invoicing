import { FastifyInstance } from 'fastify';
import fastifyHelmet from '@fastify/helmet';

export const setupHelmet = (ffy: FastifyInstance): void => {
  ffy.register(fastifyHelmet);
};
