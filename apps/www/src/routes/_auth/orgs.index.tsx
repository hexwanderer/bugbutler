import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { toast } from '@workspace/ui/components/sonner';
import { useState } from 'react';
import { authClient } from '@/integrations/auth';

export const Route = createFileRoute('/_auth/orgs/')({
  component: RouteComponent,
  loader: async ({ context }) =>
    await context.queryClient.ensureQueryData({
      queryKey: ['__orgs__'],
      queryFn: async () => {
        const { data, error } = await authClient.organization.list();
        if (error) {
          throw error;
        }
        return data;
      },
    }),
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const [clicked, setClicked] = useState<undefined | string>(undefined);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto w-md">
        <CardHeader>
          <CardTitle>Select Organization</CardTitle>
          <CardDescription>
            If you don't have an organization, you can create one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.length > 0 ? (
            <div className="flex flex-col gap-2">
              {data.map((org) => (
                <Button
                  disabled={!!clicked}
                  key={org.id}
                  onClick={async () => {
                    setClicked(org.id);
                    toast.info(`Selected organization ${org.name}`);
                    await authClient.organization.setActive({
                      organizationId: org.id,
                    });
                    navigate({ to: '/' });
                  }}
                >
                  {clicked === org.id ? (
                    <div className="flex items-center justify-center">
                      {/* pulsing animation */}
                      <div className="h-4 w-4 animate-pulse rounded-full bg-gray-400" />
                    </div>
                  ) : (
                    <>
                      <span className="font-bold text-md">{org.name}</span>
                      <p className="text-xs underline">{org.slug}</p>
                    </>
                  )}
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="flex h-32 w-full items-center justify-center rounded-md border-2 border-gray-400 border-dotted p-6 text-center">
                No organizations found
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p>
            Don't have an organization?{' '}
            <Link className="ml-2 underline" to="/orgs/create">
              Create Organization
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
