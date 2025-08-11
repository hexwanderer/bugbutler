import { GithubLogoIcon, LinkIcon, SlackLogoIcon } from '@phosphor-icons/react';
import { createFileRoute } from '@tanstack/react-router';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AnimatedButton } from '@workspace/ui/components/animated-button';
import { useIsMobile } from '@workspace/ui/hooks/use-mobile';
import { type JSX, useMemo } from 'react';
import { Title } from '@/components/title';

export const Route = createFileRoute('/integrations')({
  component: RouteComponent,
});

const integrations = [
  {
    name: 'Sentry',
    description:
      'Error tracking and monitoring. Our agents listen to Sentry webhooks to understand why and when errors happen to write fixes in the background.',
    icon: <img alt="Sentry" className="h-6 w-6" src="/sentry.svg" />,
    link: '',
  },
  {
    name: 'GitHub',
    description:
      'Once code changes are done, we can create pull requests for you to review.',
    icon: <GithubLogoIcon className="h-6 w-6" />,
    link: '',
  },
  {
    name: 'Slack',
    description: 'Receive notifications when new pull requests are created.',
    icon: <SlackLogoIcon className="h-6 w-6" />,
    link: '',
  },
];

type Integration = {
  name: string;
  description: string;
  icon: JSX.Element;
  link: string;
};

function RouteComponent() {
  const columns = useMemo<ColumnDef<Integration>[]>(
    () => [
      {
        accessorKey: 'icon',
        header: '',
        size: 50,
        cell: ({ getValue }) => getValue<React.ReactNode>(),
      },
      {
        accessorKey: 'name',
        header: '',
        size: 100,
        cell: ({ getValue }) => (
          <span className="font-medium text-gray-900">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'description',
        header: '',
        size: 250,
        cell: ({ getValue }) => (
          <span className="text-gray-600">{getValue<string>()}</span>
        ),
      },
      {
        id: 'connect',
        header: '',
        size: 50,
        cell: ({ row }) => (
          <a href={row.original.link} target="_blank">
            <AnimatedButton className="w-full" variant="outline">
              <LinkIcon className="h-5 w-5" />
              CONNECT
            </AnimatedButton>
          </a>
        ),
      },
    ],
    []
  );

  const isMobile = useIsMobile();
  const table = useReactTable({
    data: integrations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility: {
        description: !isMobile,
      },
    },
  });

  return (
    <div className="flex px-6">
      <Title>Add Your Integrations</Title>
      <div className="w-full shadow-lg">
        <div className="overflow-x-auto">
          <table
            className="min-w-full table-fixed border-collapse"
            style={{ tableLayout: 'fixed' }}
          >
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  className="text-left font-semibold text-gray-700 text-sm dark:bg-gray-900"
                  key={headerGroup.id}
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      className="px-4 py-3"
                      key={header.id}
                      style={{
                        width: header.getSize(),
                        minWidth: header.getSize(),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, rowIndex) => (
                <tr
                  className={`transition-colors hover:bg-gray-50 ${
                    rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      className="items-center px-4 py-3"
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                        minWidth: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
