import { TrayArrowDownIcon } from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { AnimatedButton } from '@workspace/ui/components/animated-button';
import { Card, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { toast } from '@workspace/ui/components/sonner';
import { z } from 'zod';
import { rpc } from '@/integrations/rpc';

const searchSchema = z.object({
  code: z.string(),
  installationId: z.string(),
});

export const Route = createFileRoute('/installations/sentry')({
  component: RouteComponent,
  validateSearch: searchSchema,
});

function RouteComponent() {
  const { code, installationId } = Route.useSearch();
  const router = useRouter();
  const mutation = useMutation(
    rpc.app.install.mutationOptions({
      onSuccess: () => {
        toast.success('Sentry installed successfully! Redirecting...');
        setTimeout(() => {
          router.history.push('https://sentry.io/settings/');
        }, 1000);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="mx-auto max-w-md">Install Sentry</CardTitle>
        </CardHeader>
        <p className="max-w-md text-center">
          Ensure you are installing Sentry to the correct organization. To
          change, use the user dropdown in the top left.
        </p>
        <AnimatedButton
          className="mx-auto max-w-md before:bg-green-500 hover:text-white"
          onClick={() => mutation.mutate({ code, installationId })}
          variant="ghost"
        >
          <TrayArrowDownIcon className="h-5 w-5" />
          INSTALL
        </AnimatedButton>
      </Card>
    </div>
  );
}
