import type { SchemaType } from '@libs/utils/merge-schemas';

export const buildExtendsQuerySchema = (allowedExtensions: string[]): SchemaType => {
  const pattern = allowedExtensions.length
    ? `^(${allowedExtensions.join('|')})(,(${allowedExtensions.join('|')}))*$`
    : '^$';

  return {
    type: 'object',
    properties: {
      extends: {
        type: 'string',
        pattern,
        description: 'Liste d\'extensions séparées par des virgules (ex: "contracts,permissions")',
        default: '',
      },
    },
    required: [],
    additionalProperties: false,
  } as const;
};
