import { createFileRoute } from '@tanstack/react-router';
import { Title } from '@/components/title';

export const Route = createFileRoute('/projects')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Title>Projects</Title>
      <div>Hello "/projects"!</div>
    </>
  );
}
