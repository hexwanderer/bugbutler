import { defineNitroPlugin } from 'nitro/runtime';

export default defineNitroPlugin((nitro) => {
  nitro.h3App.use('/**/', (event, next) => {
    if (event.req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        statusText: 'No Content',
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:57010',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
        },
      });
    }

    event.res.headers.set(
      'Access-Control-Allow-Origin',
      'http://localhost:57010'
    );
    event.res.headers.set(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE,OPTIONS'
    );
    event.res.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );
    event.res.headers.set('Access-Control-Allow-Credentials', 'true');

    return next();
  });
});
