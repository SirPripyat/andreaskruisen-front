import { Checkbox } from '@/components/ui';
import { cn } from '@/lib';
import type { MatchListItem } from '../../types';
import { TeamChip } from '../team-chip';
import { MatchCardAction } from './match-card-action';
import type { MatchStatus } from './match-status';

type MatchCardRowProps = {
  cardRef?: (el: HTMLDivElement | null) => void;
  cardClassName?: string;
  match: MatchListItem;
  status: MatchStatus;
  onRegisterGoals?: (matchId: string) => void;
  selected?: boolean;
  onToggleSelect?: (matchId: string) => void;
};

export const MatchCardRow = ({
  cardRef,
  cardClassName,
  match,
  status,
  onRegisterGoals,
  selected,
  onToggleSelect,
}: MatchCardRowProps) => {
  return (
    <div
      ref={cardRef}
      className={cn(
        'flex items-center gap-2 rounded-xl p-2 text-sm transition-colors hover:bg-background',
        cardClassName,
      )}
    >
      {onToggleSelect && !status.played && (
        <Checkbox
          checked={!!selected}
          onCheckedChange={() => onToggleSelect(match.id)}
          aria-label={'Selecionar partida pra simular em lote'}
        />
      )}
      {onToggleSelect && status.played && (
        <span className={'size-4 shrink-0'} />
      )}

      <TeamChip
        className={cn('flex-1', status.awayWinner && 'opacity-40')}
        teamId={match.homeTeam.id}
        name={match.homeTeam.name}
        crestUrl={match.homeTeam.crestUrl}
        owner={match.homeTeam.owner}
        compact
      />

      <span
        className={cn(
          'shrink-0 font-mono font-bold tabular-nums rounded-sm flex items-center justify-center px-2 text-sm bg-background',
        )}
      >
        {status.played ? `${match.homeScore} - ${match.awayScore}` : '—'}
      </span>

      <TeamChip
        className={cn('flex-1', status.homeWinner && 'opacity-40')}
        teamId={match.awayTeam.id}
        name={match.awayTeam.name}
        crestUrl={match.awayTeam.crestUrl}
        owner={match.awayTeam.owner}
        align="right"
        compact
      />

      <MatchCardAction
        matchId={match.id}
        locked={status.locked}
        onRegisterGoals={onRegisterGoals}
        className="size-7 shrink-0"
      />
    </div>
  );
};
