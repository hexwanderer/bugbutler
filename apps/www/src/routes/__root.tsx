import type { QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  Outlet,
  redirect,
  useLocation,
  useRouter,
} from '@tanstack/react-router';
import type { Session, User } from 'better-auth';
import { AppSidebar } from '@/components/sidebar';
import { authClient } from '@/integrations/auth';
import LayoutAddition from '@/integrations/devtools';

interface Context {
  queryClient: QueryClient;
  user?: User;
  session?: Session;
}

export const Route = createRootRouteWithContext<Context>()({
  component: RootComponent,
  beforeLoad: async ({ context }) => {
    const result = await context.queryClient.fetchQuery({
      queryKey: ['__auth__'],
      queryFn: async () => {
        const { data, error } = await authClient.getSession();
        if (error) {
          throw error;
        }
        return data;
      },
    });
    return result;
  },
  loader: ({ context, location }) => {
    if (
      location.pathname !== '/sign-in' &&
      location.pathname !== '/sign-up' &&
      !context.session
    ) {
      throw redirect({ to: '/sign-in' });
    }
  },
});

function RootComponent() {
  const router = useRouter();
  const location = useLocation();
  if (
    ['/sign-in', '/sign-up', '/orgs', '/orgs/create'].includes(
      location.pathname
    )
  ) {
    return (
      <>
        <Outlet />
        <LayoutAddition router={router} />
      </>
    );
  }

  return (
    <div className="root">
      <AppSidebar>
        <Outlet />
        <LayoutAddition router={router} />
      </AppSidebar>
    </div>
  );
}
