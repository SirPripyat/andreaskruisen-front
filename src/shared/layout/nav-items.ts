import {
  ArrowLeftRightIcon,
  AwardIcon,
  CalendarRangeIcon,
  DoorOpenIcon,
  FlagIcon,
  LayoutDashboardIcon,
  type LucideIcon,
  ShieldIcon,
  StarIcon,
  TrophyIcon,
  UploadIcon,
  UserRoundIcon,
  UsersIcon,
} from 'lucide-react';
import type { UserRole } from '@/features/admin';

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export type AdminNavItem = NavItem & {
  roles: UserRole[];
};

export const mainNavItems: NavItem[] = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboardIcon },
  { title: 'Torneios', url: '/tournaments', icon: TrophyIcon },
  { title: 'Mercado', url: '/transfers', icon: ArrowLeftRightIcon },
  { title: 'Jogadores', url: '/players/season', icon: UserRoundIcon },
  { title: 'Hall da Fama', url: '/hall-of-fame', icon: AwardIcon },
  { title: 'Temporada', url: '/seasons', icon: CalendarRangeIcon },
  { title: 'Times', url: '/clubs', icon: ShieldIcon },
  { title: 'Favoritos', url: '/favorites', icon: StarIcon },
];

const adminBaseNavItems: NavItem[] = [
  { title: 'Usuários', url: '/users', icon: UsersIcon },
  {
    title: 'Jogadores (cadastro)',
    url: '/players',
    icon: UserRoundIcon,
  },
  {
    title: 'Times (cadastro)',
    url: '/teams',
    icon: ShieldIcon,
  },
  {
    title: 'Nacionalidades',
    url: '/nationalities',
    icon: FlagIcon,
  },
  {
    title: 'Ligas',
    url: '/leagues',
    icon: TrophyIcon,
  },
  { title: 'Importações', url: '/import', icon: UploadIcon },
  {
    title: 'Janela de negociação',
    url: '/negotiation-window',
    icon: DoorOpenIcon,
  },
];

export const adminNavItems: AdminNavItem[] = adminBaseNavItems.map((item) => ({
  ...item,
  roles: ['ADMIN'],
}));
