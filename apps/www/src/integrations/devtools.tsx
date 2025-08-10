import { TanstackDevtools } from '@tanstack/react-devtools';
import type { AnyRouter } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

export default function LayoutAddition({ router }: { router: AnyRouter }) {
  return (
    <TanstackDevtools
      plugins={[
        {
          name: 'TanStack Router',
          render: <TanStackRouterDevtoolsPanel router={router} />,
        },
      ]}
    />
  );
}
