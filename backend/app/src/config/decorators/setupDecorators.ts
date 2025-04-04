import type { FastifyInstance } from 'fastify';

import { error, success } from './responseDecorators';

export function setupDecorators(ffy: FastifyInstance): void {
  ffy.decorateReply('success', success);
  ffy.decorateReply('error', error);
}
