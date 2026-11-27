import { lazy, Suspense } from 'react';
import { useIsMobile } from '@/hooks';

const DesktopHomeScreen = lazy(() =>
  import('@/apps/desktop/features/home').then((module) => ({
    default: module.HomeScreen,
  })),
);

const MobileHomeScreen = lazy(() =>
  import('@/apps/mobile/features/home').then((module) => ({
    default: module.HomeScreen,
  })),
);

export const HomeRoute = () => {
  const isMobile = useIsMobile();

  return (
    <Suspense fallback={null}>
      {isMobile ? <MobileHomeScreen /> : <DesktopHomeScreen />}
    </Suspense>
  );
};
