import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { type Path, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { useMe } from '@/features/auth';
import { useClub } from '@/features/season/clubs';
import {
  type CreateNegotiationFormValues,
  createNegotiationSchema,
  useProposeNegotiation,
} from '@/features/season/negotiations';
import type { RosterBySector, SeasonSquad } from '@/features/season/squads';
import { useRoster, useSeasonSquads } from '@/features/season/squads';
import { useStepNavigation } from '@/hooks';
import { useTransferQuote } from '@/shared/features/transfers';

export const DIRECT_STEPS = [
  { id: 'opponent', label: 'Time' },
  { id: 'myPlayer', label: 'Seu jogador' },
  { id: 'theirPlayer', label: 'Deles' },
  { id: 'ticket', label: 'Resumo' },
  { id: 'send', label: 'Enviar' },
] as const;

export type DirectStepId = (typeof DIRECT_STEPS)[number]['id'];

const STEP_FIELDS: Record<DirectStepId, Path<CreateNegotiationFormValues>[]> = {
  opponent: ['targetTeamId'],
  myPlayer: [],
  theirPlayer: ['incomingPlayerIds'],
  ticket: ['coinAmount', 'clauses'],
  send: [],
};

const findRosterPlayers = (
  roster: RosterBySector | undefined,
  playerIds: string[],
) => {
  if (!roster) return [];
  const allPlayers = Object.values(roster).flat();
  return playerIds
    .map((playerId) => allPlayers.find((player) => player.id === playerId))
    .filter((player): player is NonNullable<typeof player> => Boolean(player));
};

type UseDirectNegotiationWizardParams = {
  open: boolean;
  initialTargetTeamId?: string;
  initialOutgoingPlayerId?: string;
  initialIncomingPlayerId?: string;
};

export const useDirectNegotiationWizard = ({
  open,
  initialTargetTeamId,
  initialOutgoingPlayerId,
  initialIncomingPlayerId,
}: UseDirectNegotiationWizardParams) => {
  const [targetSquad, setTargetSquad] = useState<SeasonSquad | null>(null);
  const [isSent, setIsSent] = useState(false);

  const { data: me } = useMe();
  const { data: myTeam } = useClub(me?.teamId ?? undefined, open);
  const { data: squads } = useSeasonSquads(open);
  const { data: targetTeam } = useClub(targetSquad?.team.id, open);

  const { mutateAsync, isPending: isSending } = useProposeNegotiation();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CreateNegotiationFormValues>({
    resolver: zodResolver(createNegotiationSchema),
    defaultValues: {
      targetTeamId: '',
      outgoingPlayerIds: [],
      incomingPlayerIds: [],
      clauses: [],
    },
  });

  const {
    currentStep,
    furthestStepIndex,
    goToStep,
    goBack,
    goNext,
    resetSteps,
    isFirstStep,
    isLastStep,
  } = useStepNavigation(DIRECT_STEPS, (step) => trigger(STEP_FIELDS[step]));

  const isOpponentLocked = Boolean(initialTargetTeamId);
  const isOutgoingLocked = Boolean(initialOutgoingPlayerId);
  const isIncomingLocked = Boolean(initialIncomingPlayerId);

  useEffect(() => {
    if (!open || !initialTargetTeamId || !squads) return;
    const squad = squads.find(
      (candidate) => candidate.team.id === initialTargetTeamId,
    );
    if (!squad) return;
    setTargetSquad(squad);
    setValue('targetTeamId', squad.team.id);
  }, [open, squads, initialTargetTeamId, setValue]);

  useEffect(() => {
    if (!open) return;
    setValue(
      'outgoingPlayerIds',
      initialOutgoingPlayerId ? [initialOutgoingPlayerId] : [],
    );
  }, [open, initialOutgoingPlayerId, setValue]);

  useEffect(() => {
    if (!open) return;
    setValue(
      'incomingPlayerIds',
      initialIncomingPlayerId ? [initialIncomingPlayerId] : [],
    );
  }, [open, initialIncomingPlayerId, setValue]);

  // Time já vem pronto de fora (ver NegotiateButton) — pula o passo 1
  // automaticamente assim que o targetTeamId pré-preenchido fica válido.
  useEffect(() => {
    if (!open || !isOpponentLocked || currentStep !== 'opponent') return;
    if (!targetSquad) return;
    goNext();
  }, [open, isOpponentLocked, currentStep, targetSquad, goNext]);

  useEffect(() => {
    if (open) return;
    reset();
    setTargetSquad(null);
    setIsSent(false);
    resetSteps();
  }, [open, reset, resetSteps]);

  const outgoingPlayerIds = useWatch({ control, name: 'outgoingPlayerIds' });
  const incomingPlayerIds = useWatch({ control, name: 'incomingPlayerIds' });
  const coinAmount = useWatch({ control, name: 'coinAmount' });
  const clauses = useWatch({ control, name: 'clauses' });

  const { data: myRoster, isPending: isMyRosterPending } = useRoster(
    myTeam?.id,
    open,
  );
  const { data: targetRoster, isPending: isTargetRosterPending } = useRoster(
    targetTeam?.id,
    open,
  );

  const outgoingPlayers = findRosterPlayers(myRoster, outgoingPlayerIds);
  const incomingPlayers = findRosterPlayers(targetRoster, incomingPlayerIds);

  const canEstimateBaseCost = Boolean(
    outgoingPlayerIds.length && incomingPlayerIds.length,
  );
  const { data: baseCostQuote } = useTransferQuote(
    outgoingPlayerIds,
    incomingPlayerIds,
    false,
    open && canEstimateBaseCost,
  );

  useEffect(() => {
    if (!baseCostQuote) return;
    setValue('coinAmount', baseCostQuote.cost);
  }, [baseCostQuote, setValue]);

  const selectOpponent = (squad: SeasonSquad) => {
    setTargetSquad(squad);
    setValue('targetTeamId', squad.team.id);
    setValue('incomingPlayerIds', []);
  };

  const onSubmit = handleSubmit((values) =>
    mutateAsync({
      targetTeamId: values.targetTeamId,
      outgoingPlayerIds: values.outgoingPlayerIds,
      incomingPlayerIds: values.incomingPlayerIds,
      coinAmount: values.coinAmount,
      clauses: values.clauses.map((clause) => ({
        type: clause.type,
        playerId: clause.playerId,
        ...(clause.type === 'LEI_DO_EX'
          ? { matchesCount: clause.matchesCount }
          : {}),
        ...(clause.type === 'DIREITO_DE_RECOMPRA' ||
        clause.type === 'BONUS_POR_TITULO'
          ? { amount: clause.amount }
          : {}),
        ...(clause.terms ? { terms: clause.terms } : {}),
      })),
    })
      .then(() => {
        toast.success('Proposta enviada com sucesso.');
        setIsSent(true);
      })
      .catch(() => {
        // Erro já reportado pelo toast global de mutation (meta.errorMessage em useProposeNegotiation).
      }),
  );

  const isStepDone = (step: DirectStepId) =>
    DIRECT_STEPS.findIndex((candidate) => candidate.id === step) <
    DIRECT_STEPS.findIndex((candidate) => candidate.id === currentStep);

  const isStepUnlocked = (index: number) => index <= furthestStepIndex;

  return {
    control,
    errors,
    me,
    myTeam,
    squads,
    targetSquad,
    selectOpponent,
    targetTeam,
    myRoster,
    isMyRosterPending,
    targetRoster,
    isTargetRosterPending,
    outgoingPlayers,
    incomingPlayers,
    outgoingPlayerIds: outgoingPlayerIds ?? [],
    incomingPlayerIds: incomingPlayerIds ?? [],
    coinAmount,
    clauses: clauses ?? [],
    canEstimateBaseCost,
    setValue,
    currentStep,
    goToStep,
    goBack,
    goNext,
    isFirstStep,
    isLastStep,
    isStepDone,
    isStepUnlocked,
    isOpponentLocked,
    isOutgoingLocked,
    isIncomingLocked,
    isSending,
    isSent,
    onSubmit,
  };
};
