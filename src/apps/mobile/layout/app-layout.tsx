import { Outlet } from 'react-router';
import { NotificationsBell } from '@/apps/mobile/features/notifications';
import { UserMenu } from '@/apps/mobile/features/user-menu';
import { NegotiationWindowIndicator } from '@/features/admin/negotiation-window';
import { TeamCoinsIndicator } from '@/features/season/clubs';
import { useUserStore } from '@/stores';
import { BottomNav } from './bottom-nav';

export const AppLayout = () => {
  const { user } = useUserStore();

  if (!user) return null;

  return (
    <div className={'flex h-svh flex-col bg-card'}>
      <header
        className={
          'sticky top-0 z-30 flex h-11 shrink-0 items-center justify-between gap-2 border-b bg-card/80 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-xl'
        }
      >
        <div className={'flex min-w-0 items-center gap-2'}>
          <NegotiationWindowIndicator />
          <TeamCoinsIndicator />
        </div>
        <div className={'flex shrink-0 items-center gap-1'}>
          <NotificationsBell />
          <UserMenu user={user} />
        </div>
      </header>

      <div
        className={
          'min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+8rem)]'
        }
      >
        <div className={'flex flex-1 flex-col gap-6'}>
          <Outlet />
        </div>
      </div>

      <BottomNav user={user} />
    </div>
  );
};
