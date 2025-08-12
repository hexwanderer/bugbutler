import {
  ArrowsDownUpIcon,
  ArrowsLeftRightIcon,
  BriefcaseIcon,
  HouseSimpleIcon,
  PuzzlePieceIcon,
  SignOutIcon,
  UserCircleIcon,
} from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from '@tanstack/react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@workspace/ui/components/sidebar';
import { toast } from '@workspace/ui/components/sonner';
import { authClient } from '@/integrations/auth';
import { TitleProvider, useTitle } from './title-context';

const sidebarItems = [
  { name: 'Home', href: '/', icon: HouseSimpleIcon },
  { name: 'Integrations', href: '/integrations', icon: PuzzlePieceIcon },
  { name: 'Projects', href: '/projects', icon: BriefcaseIcon },
];

function InsetHeader() {
  const { title } = useTitle();
  return (
    <div className="flex items-center gap-2 border-b px-4 py-2">
      <SidebarTrigger />
      <h1 className="font-semibold text-lg">{title}</h1>
    </div>
  );
}

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const location = useLocation();
  return (
    <TitleProvider>
      <SidebarProvider>
        <Sidebar collapsible="icon" variant="floating">
          <SidebarHeader>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={(props) => (
                  <SidebarMenuButton
                    {...props}
                    className="flex justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <UserCircleIcon className="h-4 w-4" />
                      <span>USER</span>
                    </div>
                    <ArrowsDownUpIcon className="h-4 w-4" />
                  </SidebarMenuButton>
                )}
              />
              <DropdownMenuContent>
                <Link search={{ redirect_url: location.href }} to="/orgs">
                  <DropdownMenuItem>
                    <ArrowsLeftRightIcon className="h-4 w-4" />
                    <span>ORGS</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
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
                >
                  <SignOutIcon className="h-4 w-4" />
                  <span>SIGN OUT</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} to={item.href}>
                      <SidebarMenuButton
                        isActive={item.href === location.pathname}
                        tooltip={item.name}
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </SidebarMenuButton>
                    </Link>
                  );
                })}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarRail />
        <SidebarInset>
          <InsetHeader />
          <div className="p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TitleProvider>
  );
}
