import { Loader2Icon, ShieldAlertIcon } from 'lucide-react';
import { Link, Navigate, Outlet } from 'react-router';
import { Button } from '@/components/ui';
import type { UserRole } from '@/features/admin';
import { useMe } from '@/features/auth';

type RequireRoleProps = {
  roles: UserRole[];
};

export const RequireRole = ({ roles }: RequireRoleProps) => {
  const { data: me, isPending, isError } = useMe();

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !me) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(me.role)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
        <ShieldAlertIcon className="size-8 text-muted-foreground" />
        <div className="flex flex-col gap-1">
          <span className="font-display font-semibold text-lg">
            Acesso restrito
          </span>
          <span className="text-muted-foreground text-sm">
            Você não tem permissão para acessar esta página.
          </span>
        </div>
        <Button render={<Link to="/" />}>Voltar para o início</Button>
      </div>
    );
  }

  return <Outlet />;
};
