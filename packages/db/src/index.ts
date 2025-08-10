import env from '@workspace/env';
import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle({
  connection: {
    host: env.PGHOST,
    port: env.PGPORT,
    database: env.PGDATABASE,
    user: env.PGUSER,
    password: env.PGPASSWORD,
  },
  casing: 'snake_case',
});
