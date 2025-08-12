import { ORPCError, os } from '@orpc/server';
import { db } from '@workspace/db';
import { installations } from '@workspace/db/schema';
import env from '@workspace/env';
import { installationSchema } from '@workspace/types/sentry';
import { v7 as uuidv7 } from 'uuid';
import { z } from 'zod';
import { encrypt } from './utils/encrypt';

const SENTRY_INSTALL_URL = (installationId: string) =>
  `https://sentry.io/api/0/sentry-app-installations/${installationId}/authorizations/`;

const SENTRY_VERIFY_URL = (installationId: string) =>
  `https://sentry.io/api/0/sentry-app-installations/${installationId}/`;

const installApp = os
  .$context<{ session: { activeOrganizationId: string } }>()
  .input(
    z.object({
      code: z.string(),
      installationId: z.string(),
    })
  )
  .handler(async ({ input, context }) => {
    try {
      if (context.session.activeOrganizationId === null) {
        throw new ORPCError('UNAUTHORIZED', {
          message: 'You must be logged in to install an app.',
        });
      }
      const response = await fetch(SENTRY_INSTALL_URL(input.installationId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code: input.code,
          client_id: env.SENTRY_CLIENT_ID,
          client_secret: env.SENTRY_CLIENT_SECRET,
        }),
      });

      const responseData = await response.json();
      const { data, error } =
        await installationSchema.safeParseAsync(responseData);
      if (error) {
        throw new ORPCError('INTERNAL_SERVER_ERROR', {
          message: `Failed to parse installation data: ${JSON.stringify(error)}`,
        });
      }

      const encryptedToken = encrypt(data.token);
      const encryptedRefreshToken = encrypt(data.refreshToken);

      await db.insert(installations).values({
        id: uuidv7(),
        sentryId: input.installationId,
        organizationId: context.session.activeOrganizationId,
        token: encryptedToken,
        refreshToken: encryptedRefreshToken,
        expiresAt: data.expiresAt,
        dateCreated: data.dateCreated,
      });

      const resp = await fetch(SENTRY_VERIFY_URL(input.installationId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify({
          status: 'installed',
        }),
      });
      if (!resp.ok) {
        throw new ORPCError('INTERNAL_SERVER_ERROR', {
          message: `Failed to verify installation: ${response.status}`,
        });
      }

      return;
    } catch (error) {
      throw new ORPCError('INTERNAL_SERVER_ERROR', {
        message: `Failed to install app: ${JSON.stringify(error)}`,
      });
    }
  });

export const router = {
  app: {
    install: installApp,
  },
};
