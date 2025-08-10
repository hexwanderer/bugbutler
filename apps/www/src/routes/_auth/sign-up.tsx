import { createFileRoute } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { toast } from '@workspace/ui/components/sonner';
import { z } from 'zod';
import { authClient } from '../../integrations/auth';
import { useAppForm } from '../../integrations/form';

export const Route = createFileRoute('/_auth/sign-up')({
  component: RouteComponent,
});

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    validators: {
      onChange: signUpSchema,
    },
    onSubmit: ({ value }) => {
      authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            toast.success('Signed up successfully!');
            navigate({ to: '/' });
          },
        }
      );
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <form
          className="flex flex-col gap-2 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.AppField name="name">
            {(field) => <field.InputField label="Name" />}
          </form.AppField>

          <form.AppField name="email">
            {(field) => <field.InputField label="Email" />}
          </form.AppField>

          <form.AppField name="password">
            {(field) => <field.InputField label="Password" type="password" />}
          </form.AppField>

          <form.AppForm>
            <form.FormSubmit className="mt-4" label="Sign In" />
          </form.AppForm>
        </form>
      </Card>
    </div>
  );
}
