import { os } from '@orpc/server';
import { eventSchema } from '@workspace/types/sentry';
import z from 'zod';

const newIssueWebhook = os
  .route({ method: 'POST', path: '/issues' })
  .meta({
    summary: 'Create a new issue',
    description: 'Create a new issue',
    tags: ['issues'],
  })
  .input(eventSchema)
  .output(z.object({ id: z.string() }))
  .handler(() => {
    return { id: '123' };
  });

export const sentryRouter = {
  newIssueWebhook,
};
