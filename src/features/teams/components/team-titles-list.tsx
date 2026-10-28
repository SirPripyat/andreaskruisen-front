import { TrophyIcon } from 'lucide-react';
import { Badge, Skeleton } from '@/components/ui';
import { TOURNAMENT_FORMAT_LABELS } from '@/features/tournaments';
import type { TeamTitle } from '../api';

export function TeamTitlesList({
  titles,
  isPending,
}: {
  titles: TeamTitle[];
  isPending: boolean;
}) {
  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (titles.length === 0) {
    return (
      <p className="p-4 text-center text-muted-foreground text-sm">
        Este time ainda não foi campeão de nenhum torneio.
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {titles.map((title) => (
        <div
          key={title.tournamentId}
          className="flex items-center gap-3 border-b py-3.5 last:border-0"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-value text-white">
            <TrophyIcon className="size-4" />
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="font-medium text-sm">{title.tournamentName}</span>
            <span className="font-mono text-muted-foreground text-xs">
              Temporada {title.seasonName}
            </span>
          </div>
          <Badge variant="outline" className="ml-auto shrink-0">
            {TOURNAMENT_FORMAT_LABELS[title.format]}
          </Badge>
        </div>
      ))}
    </div>
  );
}
