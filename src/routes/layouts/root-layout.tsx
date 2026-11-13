import { Loader2Icon } from 'lucide-react';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v8';
import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { Toaster, TooltipProvider } from '@/components/ui';

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
  </div>
);

export const RootLayout = () => {
  return (
    <NuqsAdapter>
      <TooltipProvider>
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
        <Toaster />
      </TooltipProvider>
    </NuqsAdapter>
  );
};
