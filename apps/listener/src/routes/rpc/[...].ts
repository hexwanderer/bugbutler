/** biome-ignore-all lint/style/noNonNullAssertion: we run on node */
import { RPCHandler } from '@orpc/server/node';
import { router } from '@workspace/rpc';
import { defineEventHandler } from 'h3';

const handler = new RPCHandler(router);

export default defineEventHandler(async (event) => {
  console.log('rpc event', JSON.stringify(event.context.authInfo));
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
