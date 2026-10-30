import { ChevronsRightIcon, Loader2Icon } from 'lucide-react';
import { Button, Separator } from '@/components/ui';
import type { MatchListItem, PhaseSummary } from '../api';
import { MatchCard } from './match-card';
import { MatchGrid } from './match-grid';

type PhaseSectionProps = {
  phase: PhaseSummary;
  matches: MatchListItem[];
  isLatestPhase: boolean;
  onRegisterGoals?: (matchId: string) => void;
  onAdvancePhase: (phaseId: string) => void;
  isAdvancingPhase?: boolean;
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
  phase,
  matches,
  isLatestPhase,
  onRegisterGoals,
  onAdvancePhase,
  isAdvancingPhase,
}: PhaseSectionProps) => {
  const isFinalPhase = phase.type === 'KNOCKOUT' && phase.name === 'Final';

  const allPlayed =
    matches.length > 0 &&
    matches.every(
      (match) => match.homeScore !== null && match.awayScore !== null,
    );

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

        {isLatestPhase && !isFinalPhase && (
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
        )}
      </div>

      {phase.type === 'GROUP' ? (
        rounds.map(([round, roundMatches]) => (
          <MatchGrid
            key={round ?? 'single'}
            matches={roundMatches}
            roundLabel={round !== null ? `Rodada ${round}` : undefined}
            isCurrentRound={round === lastRound}
            onRegisterGoals={onRegisterGoals}
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
