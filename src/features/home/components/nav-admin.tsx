import { ShieldIcon, UserRoundIcon, UsersIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui';

const items = [
  { title: 'Usuários', url: '/users', icon: UsersIcon },
  { title: 'Dados de jogadores', url: '/players', icon: UserRoundIcon },
  { title: 'Dados de times', url: '/teams', icon: ShieldIcon },
];

export function NavAdmin() {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Configurações</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
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
}
