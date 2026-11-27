import { lazy, Suspense } from 'react';
import { useIsMobile } from '@/hooks';

const DesktopAppLayout = lazy(() =>
  import('@/apps/desktop/layout').then((module) => ({
    default: module.AppLayout,
  })),
);

const MobileAppLayout = lazy(() =>
  import('@/apps/mobile/layout').then((module) => ({
    default: module.AppLayout,
  })),
);

export const AppLayoutRoute = () => {
  const isMobile = useIsMobile();

  return (
    <Suspense fallback={null}>
      {isMobile ? <MobileAppLayout /> : <DesktopAppLayout />}
    </Suspense>
  );
};
