import {
  ArrowLeftRightIcon,
  CalendarRangeIcon,
  LayoutDashboardIcon,
  ShieldIcon,
  StarIcon,
  TrophyIcon,
  UserRoundIcon,
} from 'lucide-react';
import { Link, useLocation } from 'react-router';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui';

const items = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboardIcon },
  { title: 'Temporada', url: '/seasons', icon: CalendarRangeIcon },
  { title: 'Times', url: '/clubs', icon: ShieldIcon },
  { title: 'Jogadores', url: '/players/season', icon: UserRoundIcon },
  { title: 'Torneios', url: '/tournaments', icon: TrophyIcon },
  { title: 'Transferências', url: '/transfers', icon: ArrowLeftRightIcon },
  { title: 'Favoritos', url: '/favorites', icon: StarIcon },
];

export const NavMain = () => {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
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
};
