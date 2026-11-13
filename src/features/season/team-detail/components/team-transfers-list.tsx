import { ArrowLeftRightIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui';
import type { Transfer } from '@/features/season/transfers';
import { formatDate } from '@/lib';

type TeamTransferView = {
  transfer: Transfer;
  direction: 'in' | 'out';
  partnerTeam: Transfer['fromTeam'];
};

// Cada Transfer é a saída de um jogador de fromTeam para toTeam; o lado do
// time atual (chegada ou saída) depende de qual dos dois ele era.
const toTeamPerspective = (
  transfer: Transfer,
  teamId: string,
): TeamTransferView | null => {
  if (transfer.fromTeam.id === teamId) {
    return { transfer, direction: 'out', partnerTeam: transfer.toTeam };
  }
  if (transfer.toTeam.id === teamId) {
    return { transfer, direction: 'in', partnerTeam: transfer.fromTeam };
  }
  return null;
};

export const TeamTransfersList = ({
  teamId,
  transfers,
  isPending,
}: {
  teamId: string;
  transfers: Transfer[];
  isPending: boolean;
}) => {
  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  const views = transfers
    .map((transfer) => toTeamPerspective(transfer, teamId))
    .filter((view): view is TeamTransferView => view !== null);

  if (views.length === 0) {
    return (
      <p className="p-4 text-center text-muted-foreground text-sm">
        Nenhuma troca envolvendo este time nesta temporada.
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {views.map(({ transfer, direction, partnerTeam }) => (
        <div
          key={transfer.transferId}
          className="flex items-center gap-3 border-b py-3.5 last:border-0"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ArrowLeftRightIcon className="size-4" />
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="text-sm">
              {direction === 'out' ? 'Saiu' : 'Chegou'}{' '}
              <span className="font-medium">{transfer.player.name}</span>
            </span>
            <span className="truncate text-muted-foreground text-xs">
              {direction === 'out' ? 'para' : 'de'} {partnerTeam.name} ·
              solicitado por {transfer.requestedBy.name}
            </span>
          </div>
          <span className="ml-auto shrink-0 font-mono text-muted-foreground text-xs">
            {formatDate(transfer.date)}
          </span>
        </div>
      ))}
    </div>
  );
};
