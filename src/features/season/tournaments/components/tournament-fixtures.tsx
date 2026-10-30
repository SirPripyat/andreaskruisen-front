import { useParams } from 'react-router';
import { useTournamentAllMatches } from '../hooks';
import { PhaseSection } from './phase-section';

type TournamentFixturesProps = {
  onRegisterGoals?: (matchId: string) => void;
  onAdvancePhase: (phaseId: string) => void;
  isAdvancingPhase?: boolean;
};

export const TournamentFixtures = ({
  onRegisterGoals,
  onAdvancePhase,
  isAdvancingPhase,
}: TournamentFixturesProps) => {
  const { id } = useParams<{ id: string }>();
  const { phases } = useTournamentAllMatches(id);
  const allMatches = phases.flatMap(({ matches }) => matches);

  if (allMatches.length === 0)
    return (
      <p className="text-center text-muted-foreground text-sm">
        Nenhum jogo gerado ainda.
      </p>
    );

  return (
    <div className={'flex flex-col gap-5'}>
      {phases.map(({ phase, matches }, phaseIndex) => (
        <PhaseSection
          key={phase.id}
          phase={phase}
          matches={matches}
          isLatestPhase={phaseIndex === phases.length - 1}
          onRegisterGoals={onRegisterGoals}
          onAdvancePhase={onAdvancePhase}
          isAdvancingPhase={isAdvancingPhase}
        />
      ))}
    </div>
  );
};
