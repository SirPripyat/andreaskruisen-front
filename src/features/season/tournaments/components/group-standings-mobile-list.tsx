import { useMe } from '@/features/auth';
import { cn } from '@/lib';
import type { StandingWithOwner } from '../types';
import { TeamChip } from './team-chip';

type GroupStandingsMobileListProps = {
  standings: StandingWithOwner[];
  // Quantos primeiros colocados são marcados como classificados — null =
  // sem zona de classificação (ver TournamentGroupStandings).
  qualifyCount: number | null;
  // Times classificados que já têm bye garantido na 1ª rodada do mata-mata
  // (ver TournamentGroupStandings) — marcados com uma cor diferente do resto
  // da zona de classificação.
  byeTeamIds: Set<string>;
};

const RESULT_CLASS: Record<'W' | 'D' | 'L', string> = {
  W: 'bg-success',
  D: 'bg-muted-foreground',
  L: 'bg-destructive',
};

export const GroupStandingsMobileList = ({
  standings,
  qualifyCount,
  byeTeamIds,
}: GroupStandingsMobileListProps) => {
  const { data: me } = useMe();

  return (
    <div className={'flex flex-col'}>
      {standings.map((standing, index) => {
        const qualified = qualifyCount !== null && index < qualifyCount;
        const isMine = standing.teamId === me?.teamId;

        return (
          <div
            key={standing.teamId}
            className={cn(
              'flex flex-col gap-1.5 border-b px-1 py-2.5 last:border-b-0',
              isMine &&
                'rounded-lg border-b-transparent bg-accent-surface px-2',
            )}
          >
            <div className={'flex items-center gap-2'}>
              <span
                className={
                  'relative pl-2 font-medium text-muted-foreground text-sm'
                }
              >
                {qualified && (
                  <span
                    className={cn(
                      'absolute inset-y-0.5 left-0 w-0.5 rounded-full',
                      byeTeamIds.has(standing.teamId)
                        ? 'bg-info'
                        : 'bg-success',
                    )}
                  />
                )}
                {standing.position}
              </span>

              <TeamChip
                className={'flex-1'}
                teamId={standing.teamId}
                name={standing.teamName}
                crestUrl={standing.teamCrestUrl}
                owner={standing.owner}
              />

              <span className={'font-mono font-semibold text-sm tabular-nums'}>
                {standing.points}
                <span
                  className={
                    'ml-1 font-sans text-[10px] text-muted-foreground uppercase'
                  }
                >
                  pts
                </span>
              </span>
            </div>

            <div
              className={
                'flex items-center gap-2.5 pl-7 text-[11px] text-muted-foreground tabular-nums'
              }
            >
              <span>J {standing.played}</span>
              <span>V {standing.wins}</span>
              <span>E {standing.draws}</span>
              <span>D {standing.losses}</span>
              <span
                className={cn(
                  standing.goalDifference > 0 && 'text-success',
                  standing.goalDifference < 0 && 'text-destructive',
                )}
              >
                SG {standing.goalDifference > 0 ? '+' : ''}
                {standing.goalDifference}
              </span>

              {standing.last5.length > 0 && (
                <div className={'ml-auto flex gap-1'}>
                  {standing.last5.map((result, index) => (
                    <span
                      // biome-ignore lint/suspicious/noArrayIndexKey: last5 é uma lista fixa, sempre substituída por completo
                      key={index}
                      className={cn(
                        'size-2 rounded-full',
                        RESULT_CLASS[result],
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
