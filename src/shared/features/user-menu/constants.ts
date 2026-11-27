import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import type { UserRole } from '@/features/admin';
import type { Theme } from '@/hooks';

export const USER_ROLE: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  PARTICIPANT: 'Participante',
};

export const THEME_ICON: Record<Theme, typeof SunIcon> = {
  light: SunIcon,
  dark: MoonIcon,
  system: MonitorIcon,
};

export const THEME_LABEL: Record<Theme, string> = {
  light: 'Claro',
  dark: 'Escuro',
  system: 'Sistema',
};
