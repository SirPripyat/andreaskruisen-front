import type { ComponentProps } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui';
import type { Me } from '@/features/auth';
import { NavConfig } from './nav-config';
import { NavMain } from './nav-main';

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  user: Omit<Me, 'id'>;
};

export const AppSidebar = ({ user, ...props }: AppSidebarProps) => {
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="pointer-events-none">
              <img
                src="/logo-flagband-square.svg"
                alt=""
                className="size-8 rounded-md"
              />
              <div className="grid flex-1 text-left text-lg leading-tight">
                <span className="truncate font-display font-semibold">
                  Andreaskruisen
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavConfig user={user} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
