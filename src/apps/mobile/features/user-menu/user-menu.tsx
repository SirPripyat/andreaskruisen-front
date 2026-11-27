import { CheckIcon, LogOutIcon, UserIcon } from 'lucide-react';
import { Link } from 'react-router';
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
} from '@/components/ui';
import {
  useSeasons,
  useSelectedSeason,
  useSelectSeason,
} from '@/features/admin/seasons';
import { type Me, useLogout } from '@/features/auth';
import { type Theme, useTheme } from '@/hooks';
import {
  THEME_ICON,
  THEME_LABEL,
  USER_ROLE,
  UserAvatar,
} from '@/shared/features/user-menu';

type UserMenuProps = {
  user: Omit<Me, 'id'>;
};

export const UserMenu = ({ user }: UserMenuProps) => {
  const { mutate: logout, isPending } = useLogout();
  const { theme, setTheme } = useTheme();
  const { data: seasonsData, isPending: isSeasonsPending } = useSeasons();
  const { selectedSeason, isPending: isSelectedSeasonPending } =
    useSelectedSeason();
  const { mutate: selectSeason } = useSelectSeason();

  const handleLogout = () => logout();

  const seasons = seasonsData ?? [];
  const isSeasonSwitcherPending = isSeasonsPending || isSelectedSeasonPending;

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant={'ghost'}
            size={'icon'}
            className={'rounded-full p-0'}
          />
        }
      >
        <UserAvatar name={user.name} />
      </SheetTrigger>
      <SheetContent side={'bottom'} className={'h-auto'}>
        <SheetHeader className={'pr-10'}>
          <SheetTitle>Minha conta</SheetTitle>
          <div className={'flex items-center gap-3 pt-2'}>
            <UserAvatar name={user.name} size={'lg'} />
            <div className={'grid flex-1 text-left leading-tight'}>
              <span className={'truncate text-sm font-medium'}>
                {user.name}
              </span>
              <span
                className={'truncate text-xs text-muted-foreground capitalize'}
              >
                {USER_ROLE[user.role]}
              </span>
            </div>
          </div>
        </SheetHeader>

        <div
          className={
            'flex flex-col gap-4 overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]'
          }
        >
          <div
            className={
              'divide-y divide-border overflow-hidden rounded-xl border bg-card'
            }
          >
            <Link
              to={'/profile'}
              className={
                'flex items-center gap-3 px-3 py-2.5 active:bg-muted/60'
              }
            >
              <span
                className={
                  'flex size-7 shrink-0 items-center justify-center rounded-md bg-accent-surface text-accent'
                }
              >
                <UserIcon className={'size-4'} />
              </span>
              <span className={'flex-1 text-sm'}>Meu perfil</span>
            </Link>
          </div>

          {isSeasonSwitcherPending ? (
            <Skeleton className={'h-20 w-full rounded-xl'} />
          ) : selectedSeason && seasons.length > 0 ? (
            <div className={'flex flex-col gap-1.5'}>
              <p
                className={
                  'px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase'
                }
              >
                Temporada
              </p>
              <div
                className={
                  'divide-y divide-border overflow-hidden rounded-xl border bg-card'
                }
              >
                {seasons.map((season) => (
                  <button
                    key={season.id}
                    type={'button'}
                    className={
                      'flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-medium active:bg-muted/60'
                    }
                    onClick={() => selectSeason(season.id)}
                  >
                    {season.name}
                    {season.id === selectedSeason.id && (
                      <CheckIcon className={'size-4 text-muted-foreground'} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className={'flex flex-col gap-1.5'}>
            <p
              className={
                'px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase'
              }
            >
              Tema
            </p>
            <div
              className={
                'grid grid-cols-3 gap-1.5 rounded-xl border bg-card p-1.5'
              }
            >
              {Object.keys(THEME_ICON).map((value) => {
                const Icon = THEME_ICON[value as Theme];
                const isSelected = theme === value;

                return (
                  <Button
                    key={value}
                    type={'button'}
                    variant={isSelected ? 'default' : 'ghost'}
                    className={'h-auto flex-col gap-1 py-2'}
                    onClick={() => setTheme(value as Theme)}
                  >
                    <Icon />
                    {THEME_LABEL[value as Theme]}
                  </Button>
                );
              })}
            </div>
          </div>

          <Button
            variant={'destructive'}
            disabled={isPending}
            onClick={handleLogout}
          >
            <LogOutIcon />
            Sair
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
