/** biome-ignore-all lint/style/noNonNullAssertion: we run on node */
import { RPCHandler } from '@orpc/server/node';
import { CORSPlugin } from '@orpc/server/plugins';
import { router } from '@workspace/rpc';
import { defineEventHandler } from 'h3';

const handler = new RPCHandler(router, {
  plugins: [
    new CORSPlugin({
      origin: 'http://localhost:57010',
      allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  ],
});

export default defineEventHandler(async (event) => {
  const req = event.runtime!.node!.req;
  const res = event.runtime!.node!.res!;

  const { matched } = await handler.handle(req, res, {
    prefix: '/rpc',
    context: {
      session: event.context.authInfo.session,
    },
  });
  if (matched) {
    return;
  }

  return new Response('Not found', { status: 404 });
});
