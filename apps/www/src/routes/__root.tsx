import type { QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  Outlet,
  redirect,
  useRouter,
} from '@tanstack/react-router';
import type { Session, User } from 'better-auth';
import { authClient } from '../integrations/auth';
import LayoutAddition from '../integrations/devtools';

interface Context {
  queryClient: QueryClient;
  user?: User;
  session?: Session;
}

export const Route = createRootRouteWithContext<Context>()({
  component: RootComponent,
  beforeLoad: async ({ context }) => {
    const result = await context.queryClient.ensureQueryData({
      queryKey: ['__auth__'],
      queryFn: async () => {
        const { data, error } = await authClient.getSession();
        if (error) {
          throw error;
        }
        return data;
      },
    });
    if (!(result?.session && result?.user)) {
      throw redirect({ to: '/sign-in' });
    }
  },
});

function RootComponent() {
  const router = useRouter();
  return (
    <>
      <Outlet />
      <LayoutAddition router={router} />
    </>
  );
}
