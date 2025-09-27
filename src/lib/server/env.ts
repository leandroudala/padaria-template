// src/lib/server/env.ts
import { env } from '$env/dynamic/private';

// Validate required environment variables on startup
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET'
] as const;

const optionalEnvVars = {
  JWT_EXPIRES_IN: '15m',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  ADMIN_EMAIL: 'admin@padaria.com',
  ADMIN_PASSWORD_HASH: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lm0aKQZhzwUkGvXdC' // admin123
} as const;

for (const envVar of requiredEnvVars) {
  if (!env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const serverEnv = {
  DATABASE_URL: env.DATABASE_URL!,
  JWT_SECRET: env.JWT_SECRET!,
  JWT_EXPIRES_IN: env.JWT_EXPIRES_IN || optionalEnvVars.JWT_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN: env.REFRESH_TOKEN_EXPIRES_IN || optionalEnvVars.REFRESH_TOKEN_EXPIRES_IN,
  ADMIN_EMAIL: env.ADMIN_EMAIL || optionalEnvVars.ADMIN_EMAIL,
  ADMIN_PASSWORD_HASH: env.ADMIN_PASSWORD_HASH || optionalEnvVars.ADMIN_PASSWORD_HASH
};