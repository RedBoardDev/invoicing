import { type IncludeConfigs, IncludeType } from '@libs/parseQuery/types/include';
import type { SchemaType } from './merge-schemas';

/**
 * Recursively builds a JSON schema for query parameters based on the given include configurations.
 * Supports nested `DEFINE` configurations and `ID` types with simple toggles.
 *
 * @param configs - The inclusion configurations defining which entities can be included.
 * @returns A JSON schema object for Fastify query parameters based on the include configuration.
 */
export const buildIncludeQuerySchema = (configs: IncludeConfigs): SchemaType => {
  const properties = Object.entries(configs).reduce(
    (acc, [key, config]) => {
      const paramKey = `include${key.charAt(0).toUpperCase()}${key.slice(1)}`;

      if (config.type === IncludeType.ID) {
        acc[paramKey] = {
          type: 'string',
          enum: ['true', 'false'],
          default: 'false',
        };
      } else if (config.type === IncludeType.DEFINE) {
        acc[paramKey] = {
          type: 'string',
          enum: ['true', 'false'],
          default: 'false',
        };
        const nestedSchema = buildIncludeQuerySchema(config.include as IncludeConfigs);
        Object.assign(acc, nestedSchema.properties);
      }

      return acc;
    },
    {} as Record<string, { type: string; enum: string[]; default: string }>,
  );

  return {
    type: 'object',
    properties,
    required: [],
    additionalProperties: false,
  } as const;
};
