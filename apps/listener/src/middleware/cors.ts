import { defineEventHandler } from 'h3';

// @ts-expect-error: we need to return a Response object for OPTIONS
// and not return others to continue to the next handler
export default defineEventHandler(({ req, res }) => {
  const origin = req.headers.get('origin') ?? '';
  res.headers.set('access-control-allow-origin', origin);
  res.headers.set(
    'access-control-allow-methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  res.headers.set(
    'access-control-allow-headers',
    'Authorization, Content-Type'
  );
  res.headers.set('access-control-allow-credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status = 204;
    return new Response(null, {
      status: 204,
      statusText: 'No Content',
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }
});
