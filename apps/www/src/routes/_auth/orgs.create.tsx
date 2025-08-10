import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { toast } from '@workspace/ui/components/sonner';
import z from 'zod';
import { authClient } from '@/integrations/auth';
import { useAppForm } from '@/integrations/form';

export const Route = createFileRoute('/_auth/orgs/create')({
  component: RouteComponent,
});

const orgCreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { queryClient } = Route.useRouteContext();
  const form = useAppForm({
    defaultValues: {
      name: '',
      slug: '',
    },
    validators: {
      onChange: orgCreateSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.organization.create(
        {
          name: value.name,
          slug: value.slug,
        },
        {
          onSuccess: () => {
            toast.success('Organization created successfully!');
            queryClient.resetQueries({ queryKey: ['__orgs__'] });
            navigate({ to: '/orgs' });
          },
        }
      );
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto w-md">
        <CardHeader>
          <CardTitle>Create Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.AppField name="name">
              {(field) => <field.InputField label="Name" />}
            </form.AppField>

            <form.AppField name="slug">
              {(field) => <field.InputField label="Slug" />}
            </form.AppField>

            <form.AppForm>
              <form.FormSubmit className="mt-4" label="Create" />
            </form.AppForm>
          </form>
        </CardContent>
        <CardFooter>
          <p>
            Already have an organization?
            <Link className="ml-2 underline" to="/orgs">
              Select existing organization
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
