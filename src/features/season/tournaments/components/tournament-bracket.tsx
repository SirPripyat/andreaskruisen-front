import { ChevronLeftIcon, ChevronRightIcon, DicesIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui';
import { useIsMobile } from '@/hooks';
import { cn } from '@/lib';
import {
  useBracketConnectors,
  useSimulateMatchesBulk,
  useTournamentBracket,
} from '../hooks';
import { MatchCard } from './match-card/match-card';
import { SimulateMatchesDialog } from './simulate-matches-dialog';

type TournamentBracketProps = {
  onRegisterGoals?: (matchId: string) => void;
};

export const TournamentBracket = ({
  onRegisterGoals,
}: TournamentBracketProps) => {
  const { id } = useParams<{ id: string }>();
  const { rounds } = useTournamentBracket(id);
  const { containerRef, paths, svgSize, registerCardRef } =
    useBracketConnectors(rounds);
  const isMobile = useIsMobile();

  const [dialogIds, setDialogIds] = useState<string[] | null>(null);
  const { mutate: simulateMatches, isPending: isSimulating } =
    useSimulateMatchesBulk(id);

  const handleSimulatePending = (matchIds: string[]) => {
    if (matchIds.length === 0) return;
    setDialogIds(matchIds);
  };

  const handleConfirmSimulate = () => {
    if (!dialogIds) return;

    simulateMatches(dialogIds, {
      onSuccess: ({ simulatedMatchIds, skipped }) => {
        setDialogIds(null);

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

  // null = segue a rodada "atual" calculada automaticamente; só passa a
  // fixar um índice depois que a pessoa navega manualmente pelo carrossel.
  const [manualStageIndex, setManualStageIndex] = useState<number | null>(null);

  const defaultStageIndex = useMemo(() => {
    const pendingRoundIndex = rounds.findIndex((round) =>
      round.matches.some((match) => match.homeScore === null),
    );
    return pendingRoundIndex === -1
      ? Math.max(0, rounds.length - 1)
      : pendingRoundIndex;
  }, [rounds]);

  const stageIndex = manualStageIndex ?? defaultStageIndex;
  const activeRound = rounds[stageIndex];
  const pendingInActiveRound =
    activeRound?.matches
      .filter((match) => match.homeScore === null)
      .map((match) => match.id) ?? [];

  if (rounds.length === 0)
    return (
      <p className={'text-center text-muted-foreground text-sm'}>
        Nenhuma fase de mata-mata ativa neste torneio.
      </p>
    );

  if (isMobile) {
    const stageLabels = rounds.map((round) => round.phase.name);

    return (
      <div className={'flex flex-col gap-3'}>
        <span className={'font-medium text-muted-foreground text-xs uppercase'}>
          Chaveamento
        </span>

        <div className={'flex gap-1.5 overflow-x-auto pb-1'}>
          {stageLabels.map((label, index) => (
            <button
              key={label}
              type={'button'}
              onClick={() => setManualStageIndex(index)}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1 font-semibold text-xs transition-colors',
                index === stageIndex
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border-strong text-muted-foreground hover:bg-background',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={'flex items-center justify-between'}>
          <button
            type={'button'}
            aria-label={'Fase anterior'}
            disabled={stageIndex === 0}
            onClick={() => setManualStageIndex(Math.max(0, stageIndex - 1))}
            className={
              'flex size-8 shrink-0 items-center justify-center rounded-full border disabled:opacity-30'
            }
          >
            <ChevronLeftIcon className={'size-4'} />
          </button>

          <span
            className={
              'font-display font-bold text-sm uppercase text-muted-foreground'
            }
          >
            {stageLabels[stageIndex]}
          </span>

          <button
            type={'button'}
            aria-label={'Próxima fase'}
            disabled={stageIndex === rounds.length - 1}
            onClick={() =>
              setManualStageIndex(Math.min(rounds.length - 1, stageIndex + 1))
            }
            className={
              'flex size-8 shrink-0 items-center justify-center rounded-full border disabled:opacity-30'
            }
          >
            <ChevronRightIcon className={'size-4'} />
          </button>
        </div>

        {pendingInActiveRound.length > 0 && (
          <Button
            type={'button'}
            variant={'outline'}
            size={'sm'}
            className={'self-end'}
            onClick={() => handleSimulatePending(pendingInActiveRound)}
          >
            <DicesIcon />
            {'Simular pendentes ('}
            {pendingInActiveRound.length}
            {')'}
          </Button>
        )}

        <div className={'flex flex-col gap-3'}>
          {activeRound?.matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              isFinal={activeRound.phase.name === 'Final'}
              onRegisterGoals={onRegisterGoals}
            />
          ))}
        </div>

        <SimulateMatchesDialog
          open={!!dialogIds}
          onOpenChange={(open) => !open && setDialogIds(null)}
          matchIds={dialogIds ?? []}
          matches={rounds.flatMap((round) => round.matches)}
          isPending={isSimulating}
          onConfirm={handleConfirmSimulate}
        />
      </div>
    );
  }

  return (
    <div className={'flex flex-col gap-3'}>
      <span className={'font-medium text-muted-foreground text-xs uppercase'}>
        Chaveamento
      </span>

      <div className={'overflow-x-auto pb-2'}>
        <div ref={containerRef} className={'relative flex min-w-fit gap-14'}>
          <svg
            aria-hidden={true}
            className={
              'pointer-events-none absolute inset-0 overflow-visible text-border-strong'
            }
            width={svgSize.width}
            height={svgSize.height}
          >
            {paths.map((d) => (
              <path
                key={d}
                d={d}
                stroke={'currentColor'}
                strokeWidth={1.5}
                fill={'none'}
              />
            ))}
          </svg>

          {rounds.map((round, roundIndex) => {
            const pendingInRound = round.matches
              .filter((match) => match.homeScore === null)
              .map((match) => match.id);

            return (
              <div
                key={round.phase.id}
                className={'flex min-w-60 flex-col justify-around gap-5'}
              >
                <div className={'flex flex-col items-center gap-1.5'}>
                  <span
                    className={
                      'text-center font-display font-bold text-muted-foreground text-xs uppercase'
                    }
                  >
                    {round.phase.name}
                  </span>

                  {pendingInRound.length > 0 && (
                    <Button
                      type={'button'}
                      variant={'outline'}
                      size={'sm'}
                      onClick={() => handleSimulatePending(pendingInRound)}
                    >
                      <DicesIcon />
                      {'Simular pendentes ('}
                      {pendingInRound.length}
                      {')'}
                    </Button>
                  )}
                </div>
                <div className={'flex flex-1 flex-col justify-around gap-5'}>
                  {round.matches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      isFinal={round.phase.name === 'Final'}
                      cardRef={registerCardRef(roundIndex, match.id)}
                      onRegisterGoals={onRegisterGoals}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <SimulateMatchesDialog
        open={!!dialogIds}
        onOpenChange={(open) => !open && setDialogIds(null)}
        matchIds={dialogIds ?? []}
        matches={rounds.flatMap((round) => round.matches)}
        isPending={isSimulating}
        onConfirm={handleConfirmSimulate}
      />
    </div>
  );
};
