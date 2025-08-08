import { ORPCError } from '@orpc/server';
import { db, installations } from '@workspace/db';
import {
  errorHookSchema,
  eventSchema,
  installationHookSchema,
} from '@workspace/types/sentry';
import { eq } from 'drizzle-orm';
import z from 'zod';
import { base } from './context';

const sentryWebhook = base
  .route({ method: 'POST', path: '/webhooks/sentry' })
  .meta({
    summary: 'Sentry webhook',
    description: 'Sentry webhook',
    tags: ['webhooks'],
  })
  .input(eventSchema)
  .output(z.void())
  .handler(async ({ input, context }) => {
    const resource = context.headers.get('Sentry-Hook-Resource');
    switch (resource) {
      case 'issue': {
        const { data, error } = errorHookSchema.safeParse(input.data);
        if (error) {
          throw new ORPCError('BAD_REQUEST', {
            message: 'Invalid error webhook',
          });
        }
        console.log(`data: ${JSON.stringify(data)}`);
        break;
      }
      case 'installation': {
        const { data, error } = installationHookSchema.safeParse(input.data);
        if (error) {
          throw new ORPCError('BAD_REQUEST', {
            message: 'Invalid installation webhook',
          });
        }
        await db
          .update(installations)
          .set({
            organizationId: data.installation.organization.id,
            organizationSlug: data.installation.organization.slug,
          })
          .where(eq(installations.sentryId, data.installation.uuid));
        return;
      }
      default:
      // do nothing
    }
  });

export const sentryRouter = {
  sentryWebhook,
};
