import { NuqsAdapter } from 'nuqs/adapters/react-router/v8';
import { Outlet } from 'react-router';
import { Toaster, TooltipProvider } from '@/components/ui';

export function RootLayout() {
  return (
    <NuqsAdapter>
      <TooltipProvider>
        <Outlet />
        <Toaster />
      </TooltipProvider>
    </NuqsAdapter>
  );
}
