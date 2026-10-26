import { Loader2Icon } from 'lucide-react';
import { Navigate, Outlet } from 'react-router';
import { useMe } from '@/features/auth';

export function ProtectedRoute() {
  const { isPending, isError } = useMe();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
