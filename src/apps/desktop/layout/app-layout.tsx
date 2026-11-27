import { useState } from 'react';
import { Outlet } from 'react-router';
import { Header } from '@/components';
import { SidebarInset, SidebarProvider } from '@/components/ui';
import { cn } from '@/lib';
import { useSidebarStore, useUserStore } from '@/stores';
import { AppSidebar } from './app-sidebar';

export const AppLayout = () => {
  const { user } = useUserStore();
  const { open, setOpen } = useSidebarStore();
  const [isScrolled, setIsScrolled] = useState(false);

  if (!user) return null;

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) =>
    setIsScrolled(event.currentTarget.scrollTop > 8);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen} className="h-svh">
      <AppSidebar user={user} />
      <SidebarInset className="min-h-0 overflow-hidden bg-card">
        <div
          className={cn(
            'shrink-0 border-b px-4 pt-3 pb-2 transition-[padding] duration-200',
            isScrolled && 'pt-1.5 pb-1',
          )}
        >
          <Header user={user} isCompact={isScrolled} />
        </div>
        <div
          data-scroll-container
          onScroll={handleScroll}
          className="min-h-0 flex-1 overflow-y-auto px-4 pb-12 [overflow-anchor:none]"
        >
          <div className="flex flex-1 flex-col gap-6">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
