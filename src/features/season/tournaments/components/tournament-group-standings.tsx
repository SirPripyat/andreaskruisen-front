import { useParams } from 'react-router';
import { cn } from '@/lib';
import { useTournament, useTournamentSituation } from '../hooks';
import { GroupStandingsTable } from './group-standings-table';

const GROUP_PHASE_ORDER = 1;

export const TournamentGroupStandings = () => {
  const { id } = useParams<{ id: string }>();
  const { data: tournament } = useTournament(id);
  // Liga não tem grupos de fato — é uma única tabela, sem zona de
  // classificação pra uma fase eliminatória que não existe.
  const isLeague = tournament?.format === 'LEAGUE';

  const { data: groupSituation } = useTournamentSituation(id, {
    round: GROUP_PHASE_ORDER,
  });

  const entries = Object.entries(groupSituation?.groups ?? {}).sort(
    ([a], [b]) => a.localeCompare(b),
  );

  if (entries.length === 0) {
    return (
      <p className="text-center text-muted-foreground text-sm">
        {isLeague
          ? 'Nenhum jogo gerado ainda.'
          : 'Nenhuma fase de grupos ativa neste torneio.'}
      </p>
    );
  }

  return (
    <div className={'flex flex-col gap-4'}>
      <span className={'font-medium text-muted-foreground text-xs uppercase'}>
        {isLeague ? 'Classificação' : 'Classificação final · fase de grupos'}
      </span>

      <div className={'grid gap-4 md:grid-cols-2'}>
        {entries.map(([groupLabel, standings]) => (
          <div
            key={groupLabel}
            className={cn(
              'w-full overflow-hidden rounded-xl border bg-card',
              isLeague && 'md:col-span-2',
            )}
          >
            {!isLeague && (
              <div
                className={
                  'flex items-center gap-2 border-b bg-muted/40 px-4 py-3'
                }
              >
                <span className={'font-display font-bold text-base uppercase'}>
                  Grupo {groupLabel}
                </span>
              </div>
            )}
            <div className={'overflow-x-auto px-4 py-2'}>
              <GroupStandingsTable
                standings={standings}
                showQualifyZone={!isLeague}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
