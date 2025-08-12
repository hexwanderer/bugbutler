import { db } from '@workspace/db';
// biome-ignore lint/performance/noNamespaceImport: whatever
import * as authSchema from '@workspace/db/auth.schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { bearer, organization } from 'better-auth/plugins';
import { reactStartCookies } from 'better-auth/react-start';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    cookiePrefix: 'bugbutler',
  },
  plugins: [bearer(), organization(), reactStartCookies()],
  trustedOrigins: ['http://localhost:57010'],
});
