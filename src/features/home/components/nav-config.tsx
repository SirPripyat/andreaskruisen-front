import {
  CalendarRangeIcon,
  type LucideIcon,
  ShieldIcon,
  UploadIcon,
  UserRoundIcon,
  UsersIcon,
} from 'lucide-react';
import { Link, useLocation } from 'react-router';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui';
import type { UserRole } from '@/features/admin';
import type { Me } from '@/features/auth';

type NavConfigItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  roles: UserRole[];
};

const items: NavConfigItem[] = [
  { title: 'Usuários', url: '/users', icon: UsersIcon, roles: ['ADMIN'] },
  {
    title: 'Dados de jogadores',
    url: '/players',
    icon: UserRoundIcon,
    roles: ['ADMIN'],
  },
  {
    title: 'Dados de times',
    url: '/teams',
    icon: ShieldIcon,
    roles: ['ADMIN'],
  },
  {
    title: 'Temporadas',
    url: '/seasons',
    icon: CalendarRangeIcon,
    roles: ['PARTICIPANT', 'ADMIN'],
  },
  { title: 'Importações', url: '/import', icon: UploadIcon, roles: ['ADMIN'] },
];

type NavConfigProps = {
  user: Omit<Me, 'id'>;
};

export const NavConfig = ({ user }: NavConfigProps) => {
  const location = useLocation();

  const filteredItems = items.filter((item) => item.roles.includes(user.role));

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Configurações</SidebarGroupLabel>
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
