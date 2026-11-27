import { lazy, Suspense } from 'react';
import { useIsMobile } from '@/hooks';

const DesktopPlayerDetailScreen = lazy(() =>
  import('@/apps/desktop/features/players').then((module) => ({
    default: module.PlayerDetailScreen,
  })),
);

const MobilePlayerDetailScreen = lazy(() =>
  import('@/apps/mobile/features/players').then((module) => ({
    default: module.PlayerDetailScreen,
  })),
);

export const PlayerDetailRoute = () => {
  const isMobile = useIsMobile();

  return (
    <Suspense fallback={null}>
      {isMobile ? <MobilePlayerDetailScreen /> : <DesktopPlayerDetailScreen />}
    </Suspense>
  );
};
