import { Link, useLocation } from 'react-router';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui';
import type { Me } from '@/features/auth';
import { adminNavItems } from '@/shared/layout';

type NavConfigProps = {
  user: Omit<Me, 'id'>;
};

export const NavConfig = ({ user }: NavConfigProps) => {
  const location = useLocation();

  const filteredItems = adminNavItems.filter((item) =>
    item.roles.includes(user.role),
  );

  if (filteredItems.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Administração</SidebarGroupLabel>
      <SidebarMenu>
        {filteredItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              isActive={location.pathname === item.url}
              tooltip={item.title}
              render={<Link to={item.url} />}
            >
              <item.icon />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
