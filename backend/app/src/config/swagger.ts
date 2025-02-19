import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';

export const setupSwagger = (ffy: FastifyInstance): void => {
  const apibaseUrl: string = process.env.API_BASE_URL || 'http://localhost:3000 ';

  ffy.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'API',
        description: 'documentation API',
        version: '0.1.0',
      },
      servers: [{ url: apibaseUrl }],
    },
  });

  ffy.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    staticCSP: true,
    transformSpecification: (swaggerObject) => swaggerObject,
  });
};
