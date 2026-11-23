import { TrophyIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { cn } from '@/lib';
import type { GoalLeader } from '../types';
import { TeamChip } from './team-chip';

type LeadersTableProps = {
  leaders: GoalLeader[];
  filtered: GoalLeader[];
  countLabel: string;
};

export const LeadersTable = ({
  leaders,
  filtered,
  countLabel,
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

                <div className={'flex w-fit shrink-0 flex-col items-end gap-1'}>
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

                  {leader.matchesPlayed !== undefined && (
                    <span
                      className={
                        'whitespace-nowrap font-mono text-[11px] text-muted-foreground tabular-nums'
                      }
                    >
                      {leader.matchesPlayed} jogos ·{' '}
                      {leader.average?.toFixed(2)}
                      /jogo
                    </span>
                  )}

                  {!!leader.titles && (
                    <span
                      className={
                        'inline-flex items-center gap-1 font-mono text-[11px] text-value tabular-nums'
                      }
                    >
                      <TrophyIcon className={'size-3'} />
                      {leader.titles}{' '}
                      {leader.titles === 1 ? 'título' : 'títulos'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
