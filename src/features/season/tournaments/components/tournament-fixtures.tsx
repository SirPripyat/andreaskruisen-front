import { useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import {
  useMatchBulkSelection,
  useSimulateMatchesBulk,
  useTournament,
  useTournamentAllMatches,
} from '../hooks';
import { BulkSimulateBar } from './bulk-simulate-bar';
import { PhaseSection } from './phase-section';
import { SimulateMatchesDialog } from './simulate-matches-dialog';

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
  const isLeague = tournament?.format === 'LEAGUE';

  const { selectedIds, toggle, selectMany, clear } = useMatchBulkSelection();
  const [dialogIds, setDialogIds] = useState<string[] | null>(null);
  const { mutate: simulateMatches, isPending: isSimulating } =
    useSimulateMatchesBulk(tournament?.id);

  const handleSimulateIds = (matchIds: string[]) => {
    if (matchIds.length === 0) return;
    setDialogIds(matchIds);
  };

  const handleConfirmSimulate = () => {
    if (!dialogIds) return;

    simulateMatches(dialogIds, {
      onSuccess: ({ simulatedMatchIds, skipped }) => {
        setDialogIds(null);
        selectMany([]);

        if (skipped.length === 0) {
          toast.success(
            `${simulatedMatchIds.length} ${simulatedMatchIds.length > 1 ? 'partidas simuladas' : 'partida simulada'} com sucesso.`,
          );
          return;
        }

        toast.success(
          `${simulatedMatchIds.length} ${simulatedMatchIds.length > 1 ? 'partidas simuladas' : 'partida simulada'}. ${skipped.length} já ${skipped.length > 1 ? 'tinham' : 'tinha'} placar e ${skipped.length > 1 ? 'foram ignoradas' : 'foi ignorada'}.`,
        );
      },
    });
  };

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
          tournamentId={tournament?.id as string}
          phase={phase}
          matches={matches}
          isLatestPhase={phaseIndex === phases.length - 1}
          isLeague={isLeague}
          tournamentFinishedAt={tournament?.finishedAt}
          onRegisterGoals={onRegisterGoals}
          onAdvancePhase={onAdvancePhase}
          isAdvancingPhase={isAdvancingPhase}
          selectedIds={selectedIds}
          onToggleSelect={toggle}
          onSimulateIds={handleSimulateIds}
        />
      ))}

      <BulkSimulateBar
        count={selectedIds.size}
        onClear={clear}
        onSimulate={() => handleSimulateIds([...selectedIds])}
      />

      <SimulateMatchesDialog
        open={!!dialogIds}
        onOpenChange={(open) => !open && setDialogIds(null)}
        matchIds={dialogIds ?? []}
        matches={allMatches}
        isPending={isSimulating}
        onConfirm={handleConfirmSimulate}
      />
    </div>
  );
};
