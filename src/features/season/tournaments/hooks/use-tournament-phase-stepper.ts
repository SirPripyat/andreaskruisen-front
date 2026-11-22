import { useTournament } from './use-tournament';
import { useTournamentAllMatches } from './use-tournament-all-matches';

export type PhaseStepState = 'done' | 'now' | 'pending' | 'crowned';

export type PhaseStep = {
  id: string;
  label: string;
  state: PhaseStepState;
};

// Liga é uma única fase sem chaveamento — não há progressão de fase pra
// visualizar, então o stepper simplesmente não existe pra esse formato.
export const useTournamentPhaseStepper = (
  tournamentId: string | undefined,
): PhaseStep[] => {
  const { data: tournament } = useTournament(tournamentId);
  const { phases } = useTournamentAllMatches(tournamentId);

  if (!tournament || tournament.format === 'LEAGUE') return [];

  // A API às vezes mantém `currentPhase` preenchido mesmo após o torneio
  // ser finalizado — com o torneio encerrado, toda fase já criada está
  // necessariamente concluída, então ignoramos esse campo nesse caso.
  const currentPhaseId = tournament.finishedAt
    ? undefined
    : tournament.currentPhase?.id;

  const groupPhases = phases.filter(({ phase }) => phase.type === 'GROUP');
  const knockoutPhases = phases.filter(
    ({ phase }) => phase.type === 'KNOCKOUT',
  );

  const steps: PhaseStep[] = [];

  if (groupPhases.length > 0) {
    const isCurrent = groupPhases.some(
      ({ phase }) => phase.id === currentPhaseId,
    );
    steps.push({
      id: 'groups',
      label: 'Grupos',
      state: isCurrent ? 'now' : 'done',
    });
  }

  for (const { phase } of knockoutPhases) {
    steps.push({
      id: phase.id,
      label: phase.name,
      state: phase.id === currentPhaseId ? 'now' : 'done',
    });
  }

  steps.push({
    id: 'champion',
    label: 'Campeão',
    state: tournament.finishedAt ? 'crowned' : 'pending',
  });

  return steps;
};
