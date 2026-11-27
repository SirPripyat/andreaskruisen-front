import { lazy, Suspense } from 'react';
import { useIsMobile } from '@/hooks';

const DesktopPlayersScreen = lazy(() =>
  import('@/apps/desktop/features/players').then((module) => ({
    default: module.PlayersScreen,
  })),
);

const MobilePlayersScreen = lazy(() =>
  import('@/apps/mobile/features/players').then((module) => ({
    default: module.PlayersScreen,
  })),
);

export const PlayersRoute = () => {
  const isMobile = useIsMobile();

  return (
    <Suspense fallback={null}>
      {isMobile ? <MobilePlayersScreen /> : <DesktopPlayersScreen />}
    </Suspense>
  );
};
