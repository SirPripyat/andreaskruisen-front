import { CalendarRangeIcon, Loader2Icon } from 'lucide-react';
import { Link, Outlet } from 'react-router';
import { Button } from '@/components/ui';
import { useSelectedSeason } from '@/features/admin/seasons';

export const RequireSeason = () => {
  const { selectedSeason, isPending } = useSelectedSeason();

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!selectedSeason) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
        <CalendarRangeIcon className="size-8 text-muted-foreground" />
        <div className="flex flex-col gap-1">
          <span className="font-display font-semibold text-lg">
            Nenhuma temporada selecionada
          </span>
          <span className="text-muted-foreground text-sm">
            Cadastre ou selecione uma temporada para acessar esta página.
          </span>
        </div>
        <Button render={<Link to="/seasons" />}>Ir para Temporadas</Button>
      </div>
    );
  }

  return <Outlet />;
};
