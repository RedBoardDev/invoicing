import path from 'node:path';

import { setupCors } from '@config/cors';
import { setupDecorators } from '@config/decorators/setupDecorators';
import { setupHelmet } from '@config/helmet';
import { setupRateLimit } from '@config/rate-limit';
import { ErrorsEnum } from '@enums/errors-enums';
import ApiError from '@libs/error-management/api-error';
import catchFinallyHandler from '@middlewares/catch-finally-handler';
import { router as apiRoutes } from '@routes/index';
import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
import dotenv from 'dotenv';
import fastify from 'fastify';

dotenv.config({ path: path.resolve(__dirname, '../env/.env') });

export const ffy = fastify({ logger: true });

export const setupServer = async (): Promise<void> => {
  // decorators
  setupDecorators(ffy);

  // plugins
  setupHelmet(ffy);
  setupCors(ffy);
  setupRateLimit(ffy);

  // swagger
  // setupSwagger(ffy);

  // routes
  ffy.register(apiRoutes);

  // handle errors
  ffy.setNotFoundHandler(async (_request, _reply) => {
    throw new ApiError('Route not found', 404, ErrorsEnum.ressourceNotFound);
  });

  ffy.setErrorHandler(catchFinallyHandler);

  ffy.setValidatorCompiler(({ schema }) => {
    const ajv = new Ajv({ coerceTypes: false, strict: true });
    ajvFormats(ajv);
    return ajv.compile(schema);
  });
};

export default ffy;
