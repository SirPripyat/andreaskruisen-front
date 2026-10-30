import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { cn } from '@/lib';
import type { GoalLeader } from '../api';
import { TeamChip } from './team-chip';

type LeadersTableProps = {
  leaders: GoalLeader[];
  filtered: GoalLeader[];
  countLabel: string;
  leaderCount: number;
};

export const LeadersTable = ({
  leaders,
  filtered,
  countLabel,
  leaderCount,
}: LeadersTableProps) => {
  return (
    <div className={'overflow-hidden rounded-2xl border bg-card shadow-sm'}>
      <div className={'flex items-center justify-between border-b px-4 py-3'}>
        <h3
          className={'font-display font-bold text-sm uppercase tracking-tight'}
        >
          Classificação completa
        </h3>

        <span
          className={'font-mono text-muted-foreground text-xs tabular-nums'}
        >
          {filtered.length} de {leaders.length} jogadores
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className={'px-4 py-6 text-center text-muted-foreground text-sm'}>
          Nenhum jogador encontrado para esse filtro.
        </p>
      ) : (
        <div className={'flex flex-col'}>
          {filtered.map((leader) => {
            const rank = leaders.indexOf(leader) + 1;

            return (
              <div
                key={leader.player.id}
                className="flex items-center gap-3 border-b px-4 py-2.5 text-sm"
              >
                <span
                  className={cn(
                    'w-5 shrink-0 text-center font-mono tabular-nums',
                    rank <= 3
                      ? 'font-semibold text-accent'
                      : 'text-muted-foreground',
                  )}
                >
                  {rank}
                </span>

                <Avatar size={'default'}>
                  <AvatarImage
                    src={leader.player.photoUrl}
                    alt={leader.player.name}
                  />
                  <AvatarFallback>
                    {leader.player.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className={'flex min-w-0 flex-1 flex-col'}>
                  <span className={'truncate font-medium'}>
                    {leader.player.name}
                  </span>

                  <TeamChip
                    teamId={leader.team.id}
                    name={leader.team.name}
                    crestUrl={leader.team.crestUrl}
                    className={'text-muted-foreground text-xs'}
                  />
                </div>

                <div className={'flex w-28 shrink-0 flex-col items-end gap-1'}>
                  <span className={'font-mono font-semibold tabular-nums'}>
                    {leader.count}
                    <span
                      className={
                        'ml-1 font-sans font-normal text-muted-foreground text-xs'
                      }
                    >
                      {countLabel}
                    </span>
                  </span>
                  <div
                    className={
                      'h-1 w-full overflow-hidden rounded-full bg-muted'
                    }
                  >
                    <div
                      className={'h-full rounded-full bg-accent'}
                      style={{
                        width: `${Math.round((leader.count / leaderCount) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
