import { useParams } from 'react-router';
import { cn } from '@/lib';
import {
  useTournament,
  useTournamentAllMatches,
  useTournamentSituation,
} from '../hooks';
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

  // Mesma query usada pelo stepper de fases (cache compartilhado) — usamos
  // só pra achar o primeiro mata-mata já gerado e descobrir quem pegou bye
  // (awayTeam null, ver MatchListItem). Enquanto o mata-mata não existe
  // ainda, byeTeamIds fica vazio e a zona de classificação é só verde.
  const { phases } = useTournamentAllMatches(id);
  const firstKnockoutPhase = phases.find(
    ({ phase }) => phase.type === 'KNOCKOUT',
  );
  const byeTeamIds = new Set(
    firstKnockoutPhase?.matches
      .filter((match) => match.awayTeam === null)
      .map((match) => match.homeTeam.id) ?? [],
  );

  const entries = Object.entries(groupSituation?.groups ?? {}).sort(
    ([a], [b]) => a.localeCompare(b),
  );

  // null = sem zona de classificação (liga, ou torneio sem groupStageConfig
  // carregado ainda).
  const qualifyCount = isLeague
    ? null
    : (tournament?.qualifiersPerGroup ?? null);

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
      <div className={'flex flex-wrap items-center justify-between gap-2'}>
        <span className={'font-medium text-muted-foreground text-xs uppercase'}>
          {isLeague ? 'Classificação' : 'Classificação final · fase de grupos'}
        </span>

        {!isLeague && qualifyCount !== null && (
          <div
            className={
              'flex items-center gap-3 text-[11px] text-muted-foreground'
            }
          >
            <span className={'flex items-center gap-1.5'}>
              <span className={'size-1.5 shrink-0 rounded-full bg-success'} />
              {'Classificado'}
            </span>
            <span className={'flex items-center gap-1.5'}>
              <span className={'size-1.5 shrink-0 rounded-full bg-info'} />
              {'Bye — avança direto'}
            </span>
          </div>
        )}
      </div>

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
                qualifyCount={qualifyCount}
                byeTeamIds={byeTeamIds}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
