import {
  useTournament,
  useTournamentAllMatches,
  useTournamentGroup,
} from '../../hooks';
import type { MatchDetail } from '../../types';
import { GroupStandingsTable } from '../group-standings-table';

type MatchGroupStandingsProps = {
  tournamentId: string;
  match: MatchDetail;
};

export const MatchGroupStandings = ({
  tournamentId,
  match,
}: MatchGroupStandingsProps) => {
  const { data: situation } = useTournamentGroup(
    tournamentId,
    match.groupLabel ?? undefined,
  );
  const { data: tournament } = useTournament(tournamentId);
  // Liga não tem zona de classificação pra um mata-mata que não existe (ver
  // TournamentGroupStandings, mesma regra usada no tab de Grupos).
  const qualifyCount =
    tournament?.format === 'LEAGUE'
      ? null
      : (tournament?.qualifiersPerGroup ?? null);

  // Mesma query usada pelo stepper de fases (cache compartilhado) — só pra
  // achar o primeiro mata-mata já gerado e descobrir quem pegou bye (ver
  // TournamentGroupStandings).
  const { phases } = useTournamentAllMatches(tournamentId);
  const firstKnockoutPhase = phases.find(
    ({ phase }) => phase.type === 'KNOCKOUT',
  );
  const byeTeamIds = new Set(
    firstKnockoutPhase?.matches
      .filter((knockoutMatch) => knockoutMatch.awayTeam === null)
      .map((knockoutMatch) => knockoutMatch.homeTeam.id) ?? [],
  );

  if (match.phaseType !== 'GROUP' || !match.groupLabel) return null;
  if (!situation) return null;

  return (
    <div className="flex flex-col gap-2 pt-4">
      <span className="font-medium text-muted-foreground text-xs uppercase">
        Classificação do grupo {match.groupLabel}
      </span>

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="overflow-x-auto px-4 py-2">
          <GroupStandingsTable
            standings={situation.standings}
            qualifyCount={qualifyCount}
            byeTeamIds={byeTeamIds}
          />
        </div>
      </div>
    </div>
  );
};
