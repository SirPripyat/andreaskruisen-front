import { ArrowLeftRightIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui';
import type { Transfer } from '@/features/season/transfers';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' });

type TeamTransferView = {
  transfer: Transfer;
  playerOut: Transfer['outgoingPlayer'];
  playerIn: Transfer['outgoingPlayer'];
  partnerTeam: Transfer['outgoingTeam'];
};

// Cada Transfer é uma troca entre dois times; outgoing*/incoming* guardam o
// estado de ANTES da troca (ver tipo Transfer), então o lado do time atual
// depende de qual dos dois ele era.
function toTeamPerspective(
  transfer: Transfer,
  teamId: string,
): TeamTransferView | null {
  if (transfer.outgoingTeam.id === teamId) {
    return {
      transfer,
      playerOut: transfer.outgoingPlayer,
      playerIn: transfer.incomingPlayer,
      partnerTeam: transfer.incomingTeam,
    };
  }
  if (transfer.incomingTeam.id === teamId) {
    return {
      transfer,
      playerOut: transfer.incomingPlayer,
      playerIn: transfer.outgoingPlayer,
      partnerTeam: transfer.outgoingTeam,
    };
  }
  return null;
}

export function TeamTransfersList({
  teamId,
  transfers,
  isPending,
}: {
  teamId: string;
  transfers: Transfer[];
  isPending: boolean;
}) {
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
      {views.map(({ transfer, playerOut, playerIn, partnerTeam }) => (
        <div
          key={transfer.id}
          className="flex items-center gap-3 border-b py-3.5 last:border-0"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ArrowLeftRightIcon className="size-4" />
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="text-sm">
              Trocou <span className="font-medium">{playerOut.name}</span> por{' '}
              <span className="font-medium">{playerIn.name}</span>
            </span>
            <span className="truncate text-muted-foreground text-xs">
              com {partnerTeam.name} · solicitado por{' '}
              {transfer.requestedBy.name}
            </span>
          </div>
          <span className="ml-auto shrink-0 font-mono text-muted-foreground text-xs">
            {dateFormatter.format(new Date(transfer.createdAt))}
          </span>
        </div>
      ))}
    </div>
  );
}
