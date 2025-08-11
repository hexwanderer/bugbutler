import { TanstackDevtools } from '@tanstack/react-devtools';
import type { AnyRouter } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { Toaster } from '@workspace/ui/components/sonner';

export default function LayoutAddition({ router }: { router: AnyRouter }) {
  return (
    <>
      <TanstackDevtools
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel router={router} />,
          },
        ]}
      />
      <Toaster
        toastOptions={{
          classNames: {
            title: 'font-sans',
            description: 'font-sans',
            actionButton: 'font-sans',
          },
        }}
      />
    </>
  );
}
