
import { FastifyInstance } from 'fastify';

import { success, error } from './responseDecorators';


export function setupDecorators(ffy: FastifyInstance): void {
  ffy.decorateReply('success', success);
  ffy.decorateReply('error', error);
}
