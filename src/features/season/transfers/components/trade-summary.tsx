import { ArrowLeftRightIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import type { TeamWithRatings } from '@/features/admin/teams';
import type { RosterPlayer } from '@/features/season/squads';

type TradeSummaryProps = {
  outgoingTeam: TeamWithRatings | null;
  outgoingPlayer: RosterPlayer | null;
  incomingTeam: TeamWithRatings | null;
  incomingPlayer: RosterPlayer | null;
};

export const TradeSummary = ({
  outgoingTeam,
  outgoingPlayer,
  incomingTeam,
  incomingPlayer,
}: TradeSummaryProps) => {
  if (!outgoingTeam) {
    return (
      <p className={'text-muted-foreground text-sm'}>
        {'Escolha o time de saída para começar.'}
      </p>
    );
  }

  if (!outgoingPlayer) {
    return (
      <p className={'text-muted-foreground text-sm'}>
        {`Escolha o jogador que vai sair do ${outgoingTeam.name}.`}
      </p>
    );
  }

  if (!incomingTeam) {
    return (
      <p className={'text-muted-foreground text-sm'}>
        {'Agora escolha o time de destino.'}
      </p>
    );
  }

  if (!incomingPlayer) {
    return (
      <p className={'text-muted-foreground text-sm'}>
        {`Escolha o jogador que vai entrar no ${incomingTeam.name}.`}
      </p>
    );
  }

  return (
    <div className={'flex min-w-0 items-center gap-2 text-sm'}>
      <PlayerChip player={outgoingPlayer} />
      <ArrowLeftRightIcon className={'size-3.5 shrink-0 text-primary'} />
      <PlayerChip player={incomingPlayer} />
    </div>
  );
};

const PlayerChip = ({ player }: { player: RosterPlayer }) => {
  return (
    <span className={'flex min-w-0 items-center gap-1.5'}>
      <Avatar size={'sm'}>
        <AvatarImage src={player.photoUrl} alt={''} />
        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className={'truncate font-medium'}>{player.name}</span>
    </span>
  );
};
