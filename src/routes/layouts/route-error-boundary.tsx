import { AlertTriangleIcon } from 'lucide-react';
import { isRouteErrorResponse, useRouteError } from 'react-router';
import { Button } from '@/components/ui';

export const RouteErrorBoundary = () => {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
      ? error.message
      : undefined;

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-4 bg-background py-16 text-center">
      <AlertTriangleIcon className="size-8 text-muted-foreground" />
      <div className="flex flex-col gap-1">
        <span className="font-display font-semibold text-lg">
          Algo deu errado
        </span>
        <span className="text-muted-foreground text-sm">
          {message ?? 'Ocorreu um erro inesperado ao carregar a página.'}
        </span>
      </div>
      <Button onClick={() => window.location.reload()}>
        Recarregar página
      </Button>
    </div>
  );
};
