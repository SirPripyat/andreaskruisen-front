import { ChevronsRightIcon, DicesIcon, Loader2Icon } from 'lucide-react';
import { Button, Separator } from '@/components/ui';
import type { MatchListItem, PhaseSummary } from '../types';
import { FinishTournamentButton } from './finish-tournament-button';
import { MatchCard } from './match-card';
import { MatchGrid } from './match-grid';

type PhaseSectionProps = {
  tournamentId: string;
  phase: PhaseSummary;
  matches: MatchListItem[];
  isLatestPhase: boolean;
  // Liga não tem fase seguinte pra avançar — o endpoint de avanço nem
  // existe pra esse formato, então o botão não aparece.
  isLeague?: boolean;
  // null = torneio em andamento. Com isso setado, a fase decisiva já
  // trocou "Finalizar torneio" por nada — ela foi finalizada.
  tournamentFinishedAt?: string | null;
  onRegisterGoals?: (matchId: string) => void;
  onAdvancePhase: (phaseId: string) => void;
  isAdvancingPhase?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (matchId: string) => void;
  onSimulateIds?: (matchIds: string[]) => void;
};

const groupByRound = (matches: MatchListItem[]) => {
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
};

export const PhaseSection = ({
  tournamentId,
  phase,
  matches,
  isLatestPhase,
  isLeague,
  tournamentFinishedAt,
  onRegisterGoals,
  onAdvancePhase,
  isAdvancingPhase,
  selectedIds,
  onToggleSelect,
  onSimulateIds,
}: PhaseSectionProps) => {
  const isFinalPhase = phase.type === 'KNOCKOUT' && phase.name === 'Final';
  // Liga só tem uma fase (sempre a "vigente") e mata-mata não avança além
  // da Final — em ambos os casos não existe próxima fase, essa é a
  // decisiva, e é nela que "Finalizar torneio" aparece em vez de "Avançar
  // fase".
  const isDecisivePhase = isLeague || isFinalPhase;

  const allPlayed =
    matches.length > 0 &&
    matches.every(
      (match) => match.homeScore !== null && match.awayScore !== null,
    );

  const pendingInPhase = matches
    .filter((match) => match.homeScore === null)
    .map((match) => match.id);

  const rounds: Array<[number | null, MatchListItem[]]> =
    phase.type === 'GROUP' ? groupByRound(matches) : [];

  const lastRound = rounds[rounds.length - 1]?.[0];

  return (
    <div id={`phase-${phase.id}`} className={'flex flex-col gap-4'}>
      <div className={'flex items-center justify-between gap-4'}>
        <Separator className={'shrink'} />

        <h2 className={'shrink-0 font-display font-bold text-lg uppercase'}>
          {phase.name}
        </h2>

        <Separator className={'shrink'} />

        <div className={'flex shrink-0 items-center gap-2'}>
          {isLatestPhase && onSimulateIds && pendingInPhase.length > 0 && (
            <Button
              type={'button'}
              variant={'outline'}
              size={'sm'}
              onClick={() => onSimulateIds(pendingInPhase)}
            >
              <DicesIcon />
              {'Simular pendentes ('}
              {pendingInPhase.length}
              {')'}
            </Button>
          )}

          {isLatestPhase && !isDecisivePhase && (
            <Button
              type={'button'}
              variant={'outline'}
              size={'sm'}
              disabled={!allPlayed || isAdvancingPhase}
              onClick={() => onAdvancePhase(phase.id)}
            >
              {isAdvancingPhase ? (
                <Loader2Icon className={'animate-spin'} />
              ) : (
                <ChevronsRightIcon />
              )}
              Avançar fase
            </Button>
          )}

          {isLatestPhase && isDecisivePhase && !tournamentFinishedAt && (
            <FinishTournamentButton
              tournamentId={tournamentId}
              disabled={!allPlayed}
            />
          )}
        </div>
      </div>

      {phase.type === 'GROUP' ? (
        rounds.map(([round, roundMatches]) => (
          <MatchGrid
            key={round ?? 'single'}
            matches={roundMatches}
            roundLabel={round !== null ? `Rodada ${round}` : undefined}
            isCurrentRound={round === lastRound}
            onRegisterGoals={onRegisterGoals}
            selectedIds={selectedIds}
            onToggleSelect={onToggleSelect}
            onSimulateIds={onSimulateIds}
          />
        ))
      ) : (
        <div className="flex flex-wrap justify-center gap-3">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              isFinal={isFinalPhase}
              onRegisterGoals={onRegisterGoals}
              cardClassName="w-full sm:w-[22rem]"
            />
          ))}
        </div>
      )}
    </div>
  );
};
