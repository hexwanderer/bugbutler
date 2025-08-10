import {
  createRootRoute,
  Link,
  Outlet,
  useRouter,
} from '@tanstack/react-router';
import LayoutAddition from '../integrations/devtools';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const router = useRouter();
  return (
    <>
      <div className="flex gap-2 p-2">
        <Link className="[&.active]:font-bold" to="/">
          Home
        </Link>
      </div>
      <hr />
      <Outlet />
      <LayoutAddition router={router} />
    </>
  );
}
