import { ChevronsRightIcon, Loader2Icon } from 'lucide-react';
import {
  Badge,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import type { MatchListItem, TeamOwner } from '../api';
import type { MatchesByPhase } from '../hooks';
import { KnockoutMatchCard } from './knockout-match-card';
import { MatchRow } from './match-row';

export function TournamentFixtures({
  phases,
  ownerByTeamId,
  onRegisterGoals,
  onAdvancePhase,
  isAdvancingPhase,
}: {
  phases: MatchesByPhase[];
  ownerByTeamId?: Map<string, TeamOwner>;
  onRegisterGoals?: (matchId: string) => void;
  onAdvancePhase?: (phaseId: string) => void;
  isAdvancingPhase?: boolean;
}) {
  const allMatches = phases.flatMap(({ matches }) => matches);

  if (allMatches.length === 0) {
    return (
      <p className="text-center text-muted-foreground text-sm">
        Nenhum jogo gerado ainda.
      </p>
    );
  }

  const playedCount = allMatches.filter(
    (match) => match.homeScore !== null && match.awayScore !== null,
  ).length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="font-medium text-muted-foreground text-xs uppercase">
          {playedCount} de {allMatches.length} jogos disputados
        </span>
      </div>

      {phases.map(({ phase, matches }, phaseIndex) => {
        const isLatestPhase = phaseIndex === phases.length - 1;
        const isFinalPhase =
          phase.type === 'KNOCKOUT' && phase.name === 'Final';
        const allPlayed =
          matches.length > 0 &&
          matches.every(
            (match) => match.homeScore !== null && match.awayScore !== null,
          );

        return (
          <div key={phase.id} className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="shrink-0 font-display font-bold text-muted-foreground text-xs uppercase">
                  {phase.name}
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              {isLatestPhase && onAdvancePhase && !isFinalPhase && (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={!allPlayed || isAdvancingPhase}
                        onClick={() => onAdvancePhase(phase.id)}
                      >
                        {isAdvancingPhase ? (
                          <Loader2Icon className="animate-spin" />
                        ) : (
                          <ChevronsRightIcon />
                        )}
                        Avançar fase
                      </Button>
                    }
                  />
                  <TooltipContent>
                    {allPlayed
                      ? 'Trava os jogos desta fase e gera a próxima'
                      : 'Registre o resultado de todos os jogos desta fase antes de avançar'}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {phase.type === 'GROUP' ? (
              groupByRound(matches).map(([round, roundMatches]) => (
                <MatchGrid
                  key={round ?? 'single'}
                  matches={roundMatches}
                  roundLabel={round !== null ? `Rodada ${round}` : undefined}
                  ownerByTeamId={ownerByTeamId}
                  onRegisterGoals={onRegisterGoals}
                />
              ))
            ) : (
              <div className="flex flex-wrap justify-center gap-3">
                {matches.map((match) => (
                  <KnockoutMatchCard
                    key={match.id}
                    match={match}
                    isFinal={isFinalPhase}
                    ownerByTeamId={ownerByTeamId}
                    onRegisterGoals={onRegisterGoals}
                    cardClassName="w-full sm:w-[22rem]"
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MatchGrid({
  matches,
  roundLabel,
  ownerByTeamId,
  onRegisterGoals,
}: {
  matches: MatchListItem[];
  roundLabel?: string;
  ownerByTeamId?: Map<string, TeamOwner>;
  onRegisterGoals?: (matchId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {roundLabel && (
        <span className="block text-center font-display font-bold text-muted-foreground text-xs uppercase">
          {roundLabel}
        </span>
      )}
      <div className="flex flex-wrap justify-center gap-3">
        {groupByLabel(matches).map(([groupLabel, groupMatches]) => (
          <div
            key={groupLabel ?? 'single'}
            className="flex w-full flex-col gap-1.5 rounded-xl border bg-card p-3 sm:w-[22rem]"
          >
            {groupLabel && (
              <div className="flex items-center justify-between pb-1">
                <span className="font-display font-bold text-sm uppercase">
                  Grupo {groupLabel}
                </span>
                <Badge variant="outline">{groupMatches.length} jogos</Badge>
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              {groupMatches.map((match) => (
                <MatchRow
                  key={match.id}
                  match={match}
                  compact
                  homeOwner={ownerByTeamId?.get(match.homeTeam.id)}
                  awayOwner={ownerByTeamId?.get(match.awayTeam.id)}
                  onRegisterGoals={onRegisterGoals}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function groupByLabel(matches: MatchListItem[]) {
  const groups = new Map<string | null, MatchListItem[]>();
  for (const match of matches) {
    const list = groups.get(match.groupLabel) ?? [];
    list.push(match);
    groups.set(match.groupLabel, list);
  }

  return Array.from(groups.entries()).sort(([a], [b]) => {
    if (a === b) return 0;
    if (a === null) return 1;
    if (b === null) return -1;
    return a.localeCompare(b);
  });
}

function groupByRound(matches: MatchListItem[]) {
  const rounds = new Map<number | null, MatchListItem[]>();
  for (const match of matches) {
    const list = rounds.get(match.round) ?? [];
    list.push(match);
    rounds.set(match.round, list);
  }

  return Array.from(rounds.entries()).sort(([a], [b]) => {
    if (a === b) return 0;
    if (a === null) return 1;
    if (b === null) return -1;
    return a - b;
  });
}
