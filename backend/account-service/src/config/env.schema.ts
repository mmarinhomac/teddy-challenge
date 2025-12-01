import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  PORT: z.coerce.number().int().positive().default(3000),

  DB_HOST: z.string().min(1, 'DB_HOST is required'),
  DB_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
  DB_USER: z.string().min(1, 'DB_USER is required'),
  DB_PASS: z.string().min(1, 'DB_PASS is required'),
  DB_NAME: z.string().min(1, 'DB_NAME is required'),
  DB_SSL: z.coerce.boolean().default(false),

  JWT_SECRET: z.string().min(10, 'JWT_SECRET must be at least 10 characters'),
  JWT_EXPIRES_IN: z.string().default('1h'),
});

export type Env = z.infer<typeof envSchema>;
