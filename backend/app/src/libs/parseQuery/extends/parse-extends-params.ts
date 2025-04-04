import { mergeDeep } from '@libs/utils';
import type { ExtendsMap, ExtendsResult } from './types';

export const parseExtendsParams = (
  queryParams: Record<string, unknown> | null,
  extendsMap: ExtendsMap,
): ExtendsResult => {
  const result: ExtendsResult = { includes: {}, computed: [] };

  if (!queryParams || !queryParams.extends || typeof queryParams.extends !== 'string') {
    return result;
  }

  const extendsList = queryParams.extends
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  for (const extend of extendsList) {
    const config = extendsMap[extend];
    if (config) {
      if (config.include) {
        result.includes = mergeDeep(result.includes, config.include);
      }
      if (config.computed) {
        result.computed.push(extend);
      }
    }
  }

  return result;
};
