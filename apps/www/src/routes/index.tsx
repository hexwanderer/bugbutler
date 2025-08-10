import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@workspace/ui/components/button';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <>
      <div className="flex items-center justify-end gap-2 p-2">
        <Link className="align-end" to="/sign-in">
          <Button>Sign In</Button>
        </Link>
      </div>
      <div className="p-2">
        <p>Hello World!</p>
      </div>
    </>
  );
}
