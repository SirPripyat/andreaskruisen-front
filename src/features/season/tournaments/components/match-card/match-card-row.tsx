import { Checkbox } from '@/components/ui';
import { useMe } from '@/features/auth';
import { cn } from '@/lib';
import type { MatchListItem } from '../../types';
import { TeamChip } from '../team-chip';
import { MatchCardAction } from './match-card-action';
import { MatchCardByeSlot } from './match-card-bye-slot';
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
  const { data: me } = useMe();
  const isMine =
    !!me?.teamId &&
    (match.homeTeam.id === me.teamId || match.awayTeam?.id === me.teamId);

  return (
    <div
      ref={cardRef}
      className={cn(
        'flex items-center gap-2 rounded-xl p-2 text-sm transition-colors hover:bg-background',
        isMine && 'bg-accent-surface',
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
        className={cn(
          'hidden flex-1 md:flex',
          status.awayWinner && 'opacity-40',
        )}
        teamId={match.homeTeam.id}
        name={match.homeTeam.name}
        crestUrl={match.homeTeam.crestUrl}
        owner={match.homeTeam.owner}
      />
      <TeamChip
        className={cn(
          'flex flex-1 md:hidden',
          status.awayWinner && 'opacity-40',
        )}
        teamId={match.homeTeam.id}
        name={match.homeTeam.name}
        crestUrl={match.homeTeam.crestUrl}
        owner={match.homeTeam.owner}
        compact
      />

      <div className={'flex shrink-0 flex-col items-center gap-0.5'}>
        <span
          className={cn(
            'font-mono font-bold tabular-nums rounded-sm flex items-center justify-center px-2 text-sm bg-background',
          )}
        >
          {status.isBye
            ? 'Bye'
            : status.played
              ? `${match.homeScore} - ${match.awayScore}`
              : '—'}
        </span>

        {match.penalties && (
          <span className={'text-[10px] text-muted-foreground'}>
            pên. {match.penalties.homeScore}-{match.penalties.awayScore}
          </span>
        )}
      </div>

      {match.awayTeam ? (
        <>
          <TeamChip
            className={cn(
              'hidden flex-1 md:flex',
              status.homeWinner && 'opacity-40',
            )}
            teamId={match.awayTeam.id}
            name={match.awayTeam.name}
            crestUrl={match.awayTeam.crestUrl}
            owner={match.awayTeam.owner}
            align="right"
          />
          <TeamChip
            className={cn(
              'flex flex-1 md:hidden',
              status.homeWinner && 'opacity-40',
            )}
            teamId={match.awayTeam.id}
            name={match.awayTeam.name}
            crestUrl={match.awayTeam.crestUrl}
            owner={match.awayTeam.owner}
            align="right"
            compact
          />
        </>
      ) : (
        <MatchCardByeSlot />
      )}

      <MatchCardAction
        matchId={match.id}
        locked={status.locked}
        onRegisterGoals={onRegisterGoals}
        className="size-7 shrink-0"
      />
    </div>
  );
};
