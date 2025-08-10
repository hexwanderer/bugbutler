import { SignOutIcon } from '@phosphor-icons/react';
import { createFileRoute } from '@tanstack/react-router';
import { AnimatedButton } from '@workspace/ui/components/animated-button';
import { toast } from '@workspace/ui/components/sonner';
import { authClient } from '@/integrations/auth';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { queryClient } = Route.useRouteContext();
  return (
    <>
      <div className="flex items-center justify-end gap-2 p-2">
        <AnimatedButton
          className="text-red-500 hover:text-white"
          fillColor="bg-red-500"
          onClick={async () => {
            await authClient.signOut(
              {},
              {
                onSuccess: async () => {
                  toast.success('Signed out successfully!');
                  await queryClient.refetchQueries();
                },
              }
            );
          }}
          variant="outline"
        >
          <SignOutIcon className="h-5 w-5" />
          SIGN OUT
        </AnimatedButton>
      </div>
      <div className="p-2">
        <p>Hello World!</p>
      </div>
    </>
  );
}
