import { createRootRoute, Outlet, useRouter } from '@tanstack/react-router';
import LayoutAddition from '../integrations/devtools';

export const Route = createRootRoute({
  component: RootComponent,
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
