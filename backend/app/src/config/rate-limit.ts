import fastifyRateLimit from '@fastify/rate-limit';
import type { FastifyInstance } from 'fastify';

export const setupRateLimit = (ffy: FastifyInstance): void => {
  ffy.register(fastifyRateLimit, {
    max: 250,
    timeWindow: '5 minutes',
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
    },
    errorResponseBuilder: () => ({ code: 'FST_ERR_RATE_LIMIT' }),
  });
};
