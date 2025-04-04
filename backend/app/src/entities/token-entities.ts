import type { FromSchema } from 'json-schema-to-ts';

export const accessTokenResponseSchema = {
  type: 'object',
  properties: {
    accessToken: { type: 'string' },
  },
  required: ['accessToken'],
  additionalProperties: false,
} as const;

export type AccessTokenResponse = FromSchema<typeof accessTokenResponseSchema>;

export interface AccessTokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const refreshTokenResponseSchema = {
  type: 'object',
  properties: {
    refreshToken: { type: 'string' },
  },
  required: ['refreshToken'],
  additionalProperties: false,
} as const;

export type RefreshTokenResponse = FromSchema<typeof refreshTokenResponseSchema>;

export interface RefreshTokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export const authTokenResponseSchema = {
  type: 'object',
  properties: {
    accessToken: { type: 'string' },
    refreshToken: { type: 'string' },
  },
  required: ['accessToken', 'refreshToken'],
  additionalProperties: false,
} as const;

export type AuthTokenData = FromSchema<typeof authTokenResponseSchema>;
