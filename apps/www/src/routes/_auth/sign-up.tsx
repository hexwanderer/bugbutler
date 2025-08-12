import { PencilLineIcon } from '@phosphor-icons/react';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Label } from '@workspace/ui/components/label';
import { toast } from '@workspace/ui/components/sonner';
import { z } from 'zod';
import { authClient } from '@/integrations/auth';
import { useAppForm } from '@/integrations/form';

const searchSchema = z.object({
  redirect_url: z.string().optional(),
});

export const Route = createFileRoute('/_auth/sign-up')({
  component: RouteComponent,
  validateSearch: searchSchema,
  beforeLoad: ({ context }) => {
    if (context.session) {
      throw redirect({ to: '/' });
    }
  },
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
      authClient.signUp.email(
        {
          name: value.name,
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            toast.success('Signed up successfully!');
            navigate({ to: '/orgs', search: { redirect_url: '/' } });
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

            <form.AppField name="email">
              {(field) => <field.InputField label="Email" />}
            </form.AppField>

            <form.AppField name="password">
              {(field) => <field.InputField label="Password" type="password" />}
            </form.AppField>

            <form.AppForm>
              <form.FormSubmit className="mt-4">
                <PencilLineIcon className="h-4 w-4" />
                <Label>SIGN UP</Label>
              </form.FormSubmit>
            </form.AppForm>
          </form>
        </CardContent>
        <CardFooter>
          <p>
            Already have an account?
            <Link
              className="ml-2 underline"
              search={{ redirect_url: '/' }}
              to="/sign-in"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
