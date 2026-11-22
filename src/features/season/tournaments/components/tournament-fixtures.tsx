import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks';
import { cn } from '@/lib';
import {
  useMatchBulkSelection,
  useSimulateMatchesBulk,
  useTournament,
  useTournamentAllMatches,
} from '../hooks';
import { BulkSimulateBar } from './bulk-simulate-bar';
import { FixturesOwnedTeamsFilter } from './fixtures-owned-teams-filter';
import { PhaseSection } from './phase-section';
import { SimulateMatchesDialog } from './simulate-matches-dialog';

type TournamentFixturesProps = {
  onRegisterGoals?: (matchId: string) => void;
};

export const TournamentFixtures = ({
  onRegisterGoals,
}: TournamentFixturesProps) => {
  const { id } = useParams<{ id: string }>();
  const { data: tournament } = useTournament(id);
  const [onlyOwnedTeams, setOnlyOwnedTeams] = useState(false);
  const { phases } = useTournamentAllMatches(
    id,
    onlyOwnedTeams ? { onlyOwnedTeams } : undefined,
  );
  const allMatches = phases.flatMap(({ matches }) => matches);
  const isMobile = useIsMobile();

  // No mobile, em vez de empilhar todas as fases (ótimo no desktop, mas
  // produz uma rolagem enorme na tela pequena), navega uma fase por vez
  // com os mesmos chips + setas do carrossel da aba Mata-mata.
  const [manualPhaseIndex, setManualPhaseIndex] = useState<number | null>(null);
  const defaultPhaseIndex = phases.length - 1;
  const activePhaseIndex = Math.min(
    manualPhaseIndex ?? defaultPhaseIndex,
    Math.max(defaultPhaseIndex, 0),
  );
  const showPhaseCarousel = isMobile && phases.length > 1;

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

  const isLeague = tournament?.format === 'LEAGUE';

  const ownedTeamsFilter = (
    <FixturesOwnedTeamsFilter
      value={onlyOwnedTeams}
      onValueChange={setOnlyOwnedTeams}
    />
  );

  return (
    <div className={'flex flex-col gap-5'}>
      {!isLeague && (
        <div className={'flex justify-end'}>{ownedTeamsFilter}</div>
      )}

      {allMatches.length === 0 && (
        <p className="text-center text-muted-foreground text-sm">
          {onlyOwnedTeams
            ? 'Nenhum jogo encontrado para o filtro selecionado.'
            : 'Nenhum jogo gerado ainda.'}
        </p>
      )}

      {showPhaseCarousel ? (
        <div className={'flex flex-col gap-3'}>
          <div className={'flex gap-1.5 overflow-x-auto pb-1'}>
            {phases.map(({ phase }, index) => (
              <button
                key={phase.id}
                type={'button'}
                onClick={() => setManualPhaseIndex(index)}
                className={cn(
                  'shrink-0 rounded-full border px-3 py-1 font-semibold text-xs transition-colors',
                  index === activePhaseIndex
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-border-strong text-muted-foreground hover:bg-background',
                )}
              >
                {phase.name}
              </button>
            ))}
          </div>

          <div className={'flex items-center justify-between'}>
            <button
              type={'button'}
              aria-label={'Fase anterior'}
              disabled={activePhaseIndex === 0}
              onClick={() =>
                setManualPhaseIndex(Math.max(0, activePhaseIndex - 1))
              }
              className={
                'flex size-8 shrink-0 items-center justify-center rounded-full border disabled:opacity-30'
              }
            >
              <ChevronLeftIcon className={'size-4'} />
            </button>

            <span
              className={
                'font-display font-bold text-sm text-muted-foreground uppercase'
              }
            >
              {phases[activePhaseIndex]?.phase.name}
            </span>

            <button
              type={'button'}
              aria-label={'Próxima fase'}
              disabled={activePhaseIndex === phases.length - 1}
              onClick={() =>
                setManualPhaseIndex(
                  Math.min(phases.length - 1, activePhaseIndex + 1),
                )
              }
              className={
                'flex size-8 shrink-0 items-center justify-center rounded-full border disabled:opacity-30'
              }
            >
              <ChevronRightIcon className={'size-4'} />
            </button>
          </div>

          {phases[activePhaseIndex] && (
            <PhaseSection
              key={phases[activePhaseIndex].phase.id}
              phase={phases[activePhaseIndex].phase}
              matches={phases[activePhaseIndex].matches}
              isLatestPhase={activePhaseIndex === phases.length - 1}
              onRegisterGoals={onRegisterGoals}
              selectedIds={selectedIds}
              onToggleSelect={toggle}
              onSimulateIds={handleSimulateIds}
              hideHeader
            />
          )}
        </div>
      ) : (
        phases.map(({ phase, matches }, phaseIndex) => (
          <PhaseSection
            key={phase.id}
            phase={phase}
            matches={matches}
            isLatestPhase={phaseIndex === phases.length - 1}
            onRegisterGoals={onRegisterGoals}
            selectedIds={selectedIds}
            onToggleSelect={toggle}
            onSimulateIds={handleSimulateIds}
            roundNavExtra={isLeague ? ownedTeamsFilter : undefined}
          />
        ))
      )}

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
