import { Outlet } from 'react-router';
import { Toaster, TooltipProvider } from '@/components/ui';

export function RootLayout() {
  return (
    <TooltipProvider>
      <Outlet />
      <Toaster />
    </TooltipProvider>
  );
}
