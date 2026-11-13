import {
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
} from 'lucide-react';
import { Link } from 'react-router';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui';
import type { UserRole } from '@/features/admin';
import { type Me, useAvatar, useLogout } from '@/features/auth';
import { type Theme, useTheme } from '@/hooks';
import { getInitials } from '@/lib';

const USER_ROLE: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  PARTICIPANT: 'Participante',
};

const THEME_ICON: Record<Theme, typeof SunIcon> = {
  light: SunIcon,
  dark: MoonIcon,
  system: MonitorIcon,
};

const THEME_LABEL: Record<Theme, string> = {
  light: 'Claro',
  dark: 'Escuro',
  system: 'Sistema',
};

type UserMenuProps = {
  user: Omit<Me, 'id'>;
};

export const UserMenu = ({ user }: UserMenuProps) => {
  const { mutate: logout, isPending } = useLogout();
  const { url: avatarUrl } = useAvatar();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => logout();

  const ThemeIcon = THEME_ICON[theme];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant={'ghost'}
            size={'icon'}
            className={'rounded-full p-0'}
          />
        }
      >
        <Avatar>
          {avatarUrl && <AvatarImage src={avatarUrl} alt={''} />}
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={'w-56'} align={'end'} sideOffset={4}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className={'p-0 font-normal'}>
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar>
                {avatarUrl && <AvatarImage src={avatarUrl} alt={''} />}
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs capitalize">
                  {USER_ROLE[user.role]}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link to={'/profile'} />}>
            <UserIcon />
            Meu perfil
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <ThemeIcon />
              Tema
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) => setTheme(value as Theme)}
              >
                {Object.keys(THEME_ICON).map((value) => {
                  const Icon = THEME_ICON[value as Theme];

                  return (
                    <DropdownMenuRadioItem key={value} value={value}>
                      <Icon />
                      {THEME_LABEL[value as Theme]}
                    </DropdownMenuRadioItem>
                  );
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
          <LogOutIcon />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
