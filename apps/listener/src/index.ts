import { OpenAPIGenerator } from '@orpc/openapi';
import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';
import { H3, serve } from 'h3';
import { sentryRouter } from './router/sentry';

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

app.use('/v1/**', async ({ req }) => {
  const { matched, response } = await handler.handle(req, {
    prefix: '/v1',
    context: {},
  });
  if (matched) {
    return response;
  }
  return new Response('Not found', { status: 404 });
});

serve(app, { port: 57_000 });
