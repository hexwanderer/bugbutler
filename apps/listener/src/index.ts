import { OpenAPIGenerator } from '@orpc/openapi';
import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';
import { db, installations } from '@workspace/db';
import { installationSchema } from '@workspace/types/sentry';
import { H3, redirect, serve } from 'h3';
import { v7 as uuidv7 } from 'uuid';
import { sentryRouter } from './router/sentry';
import { encrypt } from './utils/encrypt';

const app = new H3();

const handler = new OpenAPIHandler(sentryRouter);

const openAPIGenerator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
});

app.get('/spec.json', async () => {
  // Only generate in development
  if (process.env.NODE_ENV !== 'development') {
    return new Response('Not found', { status: 404 });
  }
  const spec = await openAPIGenerator.generate(sentryRouter, {
    info: {
      title: 'Bugbutler Listener',
      description:
        'This is the API documentation for the Bugbutler Listener. This spec is only intended for developer reference on localhost.',
      version: '0.0.1-alpha.0',
    },
    servers: [{ url: '/v1' } /** Should use absolute URLs in production */],
  });

  return new Response(JSON.stringify(spec), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
});

app.get('/docs', () => {
  if (process.env.NODE_ENV !== 'development') {
    return new Response('Not found', { status: 404 });
  }
  const html = `
    <!doctype html>
    <html>
      <head>
        <title>My Client</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="https://orpc.unnoq.com/icon.svg" />
      </head>
      <body>
        <div id="app"></div>

        <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
        <script>
          Scalar.createApiReference('#app', {
            url: '/spec.json',
          })
        </script>
      </body>
    </html>
  `;

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html',
    },
  });
});

const SENTRY_URL = (installationId: string) =>
  `https://sentry.io/api/0/sentry-app-installations/${installationId}/authorizations/`;

const SENTRY_VERIFY_URL = (installationId: string) =>
  `https://sentry.io/api/0/sentry-app-installations/${installationId}/`;

app.get('/callbacks/sentry', async (event) => {
  const { req } = event;
  const search = new URLSearchParams(new URL(req.url).search);
  const [code, installationId] = [
    search.get('code'),
    search.get('installationId'),
  ];
  if (!(code && installationId)) {
    return new Response('Not found', { status: 404 });
  }

  const response = await fetch(SENTRY_URL(installationId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      client_id: process.env.SENTRY_CLIENT_ID,
      client_secret: process.env.SENTRY_CLIENT_SECRET,
    }),
  });

  const { data, error } = await installationSchema.safeParseAsync(
    response.json()
  );
  if (error) {
    return new Response('Error parsing installation data', { status: 500 });
  }

  const encryptedToken = encrypt(data.token);
  const encryptedRefreshToken = encrypt(data.refreshToken);

  await db.insert(installations).values({
    id: uuidv7(),
    sentryId: installationId,
    token: encryptedToken,
    refreshToken: encryptedRefreshToken,
    expiresAt: data.expiresAt,
    dateCreated: data.dateCreated,
  });

  await fetch(SENTRY_VERIFY_URL(installationId), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'installed',
    }),
  });

  return redirect(event, 'https://sentry.io/settings/');
});

app.use('/v1/**', async ({ req }) => {
  const headers = new Headers(req.headers);
  const { matched, response } = await handler.handle(req, {
    prefix: '/v1',
    context: {
      headers,
    },
  });
  if (matched) {
    return response;
  }
  return new Response('Not found', { status: 404 });
});

serve(app, { port: 57_000 });
