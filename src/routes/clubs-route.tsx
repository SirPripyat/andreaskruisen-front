import { lazy, Suspense } from 'react';
import { useIsMobile } from '@/hooks';

const DesktopClubsScreen = lazy(() =>
  import('@/apps/desktop/features/clubs').then((module) => ({
    default: module.ClubsScreen,
  })),
);

const MobileClubsScreen = lazy(() =>
  import('@/apps/mobile/features/clubs').then((module) => ({
    default: module.ClubsScreen,
  })),
);

export const ClubsRoute = () => {
  const isMobile = useIsMobile();

  return (
    <Suspense fallback={null}>
      {isMobile ? <MobileClubsScreen /> : <DesktopClubsScreen />}
    </Suspense>
  );
};
