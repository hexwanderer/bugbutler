import { createEnv } from '@t3-oss/env-core';
import { config } from 'dotenv';
import z from 'zod';

config({ path: '../../.env' });

export default createEnv({
  server: {
    PGHOST: z.string(),
    PGPORT: z.coerce.number(),
    PGDATABASE: z.string(),
    PGUSER: z.string(),
    PGPASSWORD: z.string(),

    MASTER_KEY: z.string(),

    SENTRY_CLIENT_ID: z.string(),
    SENTRY_CLIENT_SECRET: z.string(),
  },
  runtimeEnv: process.env,
});
