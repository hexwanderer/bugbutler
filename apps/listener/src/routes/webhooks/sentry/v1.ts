import { getEventSchema } from '@workspace/types/sentry';
import { eventHandler } from 'h3';
import { defineRouteMeta } from 'nitro/runtime';

defineRouteMeta({
  openAPI: {
    summary: 'Sentry webhook',
    description: 'Sentry webhook',
    tags: ['webhooks'],
  },
});

export default eventHandler(async (event) => {
  const resource = event.req.headers.get('Sentry-Hook-Resource') as
    | 'error'
    | 'installation';
  if (!resource) {
    return new Response('Error parsing event data', { status: 400 });
  }
  const { data, error } = await getEventSchema(resource).safeParseAsync(
    event.req.json()
  );
  if (error) {
    return new Response('Error parsing event data', { status: 400 });
  }

  console.log(`data: ${JSON.stringify(data)}`);

  return new Response('OK', { status: 200 });
});
