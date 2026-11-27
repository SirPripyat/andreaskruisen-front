import { lazy, Suspense } from 'react';
import { useIsMobile } from '@/hooks';

const DesktopTransfersScreen = lazy(() =>
  import('@/apps/desktop/features/transfers').then((module) => ({
    default: module.TransfersScreen,
  })),
);

const MobileTransfersScreen = lazy(() =>
  import('@/apps/mobile/features/transfers').then((module) => ({
    default: module.TransfersScreen,
  })),
);

export const TransfersRoute = () => {
  const isMobile = useIsMobile();

  return (
    <Suspense fallback={null}>
      {isMobile ? <MobileTransfersScreen /> : <DesktopTransfersScreen />}
    </Suspense>
  );
};
