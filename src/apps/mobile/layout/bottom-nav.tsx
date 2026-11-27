import { ShieldIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import type { Me } from '@/features/auth';
import { cn } from '@/lib';
import { adminNavItems, mainNavItems, type NavItem } from '@/shared/layout';
import { MoreItemsNavItem } from './more-items-nav-item';
import { MoreItemsSheet } from './more-items-sheet';

const PRIMARY_ITEM_COUNT = 4;

type BottomNavProps = {
  user: Omit<Me, 'id'>;
};

export const BottomNav = ({ user }: BottomNavProps) => {
  const location = useLocation();
  const [isMoreItemsOpen, setIsMoreItemsOpen] = useState(false);

  const toggleMoreItems = () => setIsMoreItemsOpen((prev) => !prev);

  const myTeamItem: NavItem | undefined = user.teamId
    ? { title: 'Meu time', url: `/clubs/${user.teamId}`, icon: ShieldIcon }
    : undefined;

  const primaryItems = [
    ...mainNavItems.slice(0, PRIMARY_ITEM_COUNT),
    ...(myTeamItem ? [myTeamItem] : []),
  ];
  const overflowMainItems = mainNavItems.slice(PRIMARY_ITEM_COUNT);
  const overflowAdminItems = adminNavItems.filter((item) =>
    item.roles.includes(user.role),
  );
  const hasOverflow =
    overflowMainItems.length > 0 || overflowAdminItems.length > 0;

  return (
    <>
      <nav
        className={
          'fixed bottom-[calc(env(safe-area-inset-bottom)+2rem)] left-1/2 z-40 w-[calc(100%-2rem)] -translate-x-1/2 overflow-hidden rounded-full bg-card/80 shadow-lg ring-1 ring-foreground/10 backdrop-blur-xl'
        }
      >
        <div className={'flex h-14 items-stretch'}>
          {primaryItems.map((item) => {
            const isActive = location.pathname === item.url;

            return (
              <Link
                key={item.title}
                to={item.url}
                className={cn(
                  'flex flex-1 flex-col items-center justify-center gap-0.5 transition-transform active:scale-95',
                  isActive ? 'text-accent' : 'text-muted-foreground',
                )}
              >
                <item.icon
                  className={'size-6.5'}
                  strokeWidth={isActive ? 2.25 : 1.75}
                />
                <span
                  className={cn(
                    'text-[10px] leading-none',
                    isActive ? 'font-semibold' : 'font-medium',
                  )}
                >
                  {item.title}
                </span>
              </Link>
            );
          })}

          {hasOverflow && (
            <MoreItemsNavItem toggleMoreItems={toggleMoreItems} />
          )}
        </div>
      </nav>

      <MoreItemsSheet
        isMoreItemsOpen={isMoreItemsOpen}
        toggleMoreItems={toggleMoreItems}
        overflowMainItems={overflowMainItems}
        overflowAdminItems={overflowAdminItems}
      />
    </>
  );
};
