export interface SchemaType {
  type: 'object';
  properties: Record<string, any>;
  readonly required: readonly string[];
  additionalProperties: boolean;
}

export const mergeSchemas = (...schemas: SchemaType[]): SchemaType => {
  return schemas.reduce(
    (acc, schema) => ({
      type: 'object',
      properties: { ...acc.properties, ...schema.properties },
      required: [...(acc.required || []), ...(schema.required || [])],
      additionalProperties: false,
    }),
    { type: 'object', properties: {}, required: [], additionalProperties: false },
  );
};
