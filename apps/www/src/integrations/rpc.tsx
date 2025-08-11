import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { RouterClient } from '@orpc/server';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import type { router } from '@workspace/rpc';

const link = new RPCLink({
  url: 'http://localhost:57000/rpc',
  headers: {},
});

const orpc: RouterClient<typeof router> = createORPCClient(link);

export const rpc = createTanstackQueryUtils(orpc);
