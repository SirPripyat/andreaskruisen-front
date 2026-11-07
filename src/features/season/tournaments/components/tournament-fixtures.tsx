import { useParams } from 'react-router';
import { useTournament, useTournamentAllMatches } from '../hooks';
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
  const { data: tournament } = useTournament(id);
  const { phases } = useTournamentAllMatches(id);
  const allMatches = phases.flatMap(({ matches }) => matches);
  // Liga não tem uma fase seguinte pra "avançar" — o botão de ação some.
  const isLeague = tournament?.format === 'LEAGUE';

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
          isLeague={isLeague}
          onRegisterGoals={onRegisterGoals}
          onAdvancePhase={onAdvancePhase}
          isAdvancingPhase={isAdvancingPhase}
        />
      ))}
    </div>
  );
};
