import { Outlet } from 'react-router';
import { SidebarInset, SidebarProvider } from '@/components/ui';
import { AppSidebar } from '@/features/home';
import { useSidebarStore, useUserStore } from '@/stores';
import { Header } from '../components';

export function AppLayout() {
  const { user } = useUserStore();
  const { open, setOpen } = useSidebarStore();

  if (!user) return null;

  return (
    <SidebarProvider open={open} onOpenChange={setOpen} className="h-svh">
      <AppSidebar user={user} />
      <SidebarInset className="min-h-0 overflow-hidden bg-card">
        <div className="shrink-0 border-b px-8 pt-3 pb-2">
          <Header />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-12">
          <div className="flex flex-1 flex-col gap-6">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
