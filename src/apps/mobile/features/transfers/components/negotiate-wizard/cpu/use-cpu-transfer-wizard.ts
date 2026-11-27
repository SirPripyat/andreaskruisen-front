import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { type Path, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { TeamWithRatings } from '@/features/admin/teams';
import { useMe } from '@/features/auth';
import { useClub } from '@/features/season/clubs';
import type { RosterBySector } from '@/features/season/squads';
import { useRoster } from '@/features/season/squads';
import { useStepNavigation } from '@/hooks';
import {
  type CreateTransferFormValues,
  createTransferSchema,
  useCreateTransfer,
  useTransferQuote,
} from '@/shared/features/transfers';

export const CPU_STEPS = [
  { id: 'incoming', label: 'Time CPU' },
  { id: 'outgoing', label: 'Seu jogador' },
  { id: 'confirm', label: 'Confirmar' },
] as const;

export type CpuStepId = (typeof CPU_STEPS)[number]['id'];

const STEP_FIELDS: Record<CpuStepId, Path<CreateTransferFormValues>[]> = {
  incoming: ['incomingPlayerIds'],
  outgoing: ['outgoingPlayerIds'],
  confirm: [],
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

type UseCpuTransferWizardParams = {
  open: boolean;
  initialIncomingTeamId?: string;
  initialOutgoingPlayerId?: string;
  initialIncomingPlayerId?: string;
};

export const useCpuTransferWizard = ({
  open,
  initialIncomingTeamId,
  initialOutgoingPlayerId,
  initialIncomingPlayerId,
}: UseCpuTransferWizardParams) => {
  const [incomingTeam, setIncomingTeam] = useState<TeamWithRatings | null>(
    null,
  );
  const [isDone, setIsDone] = useState(false);

  const { data: me } = useMe();
  const { data: myTeam } = useClub(me?.teamId ?? undefined, open);
  const { data: preselectedIncomingTeam } = useClub(
    initialIncomingTeamId,
    open,
  );

  const { mutateAsync, isPending: isCreating } = useCreateTransfer();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CreateTransferFormValues>({
    resolver: zodResolver(createTransferSchema),
    defaultValues: {
      outgoingPlayerIds: [],
      incomingPlayerIds: [],
      useCoupon: false,
      requestedByUserId: '',
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
  } = useStepNavigation(CPU_STEPS, (step) => trigger(STEP_FIELDS[step]));

  const isIncomingLocked = Boolean(initialIncomingTeamId);
  const isOutgoingLocked = Boolean(initialOutgoingPlayerId);

  useEffect(() => {
    if (!open || !preselectedIncomingTeam) return;
    setIncomingTeam(preselectedIncomingTeam);
    setValue(
      'incomingPlayerIds',
      initialIncomingPlayerId ? [initialIncomingPlayerId] : [],
    );
  }, [open, preselectedIncomingTeam, initialIncomingPlayerId, setValue]);

  useEffect(() => {
    if (!open) return;
    setValue(
      'outgoingPlayerIds',
      initialOutgoingPlayerId ? [initialOutgoingPlayerId] : [],
    );
  }, [open, initialOutgoingPlayerId, setValue]);

  // Solicitante é sempre o próprio usuário logado no wizard mobile — a
  // reatribuição pra outro usuário é recurso de admin, só no desktop (ver
  // CpuTransferForm).
  useEffect(() => {
    if (!open || !me) return;
    setValue('requestedByUserId', me.id);
  }, [open, me, setValue]);

  // Time e jogador de entrada já vêm prontos de fora (ver NegotiateButton)
  // — pula o passo 1 assim que o time pré-preenchido fica resolvido.
  useEffect(() => {
    if (!open || !isIncomingLocked || currentStep !== 'incoming') return;
    if (!incomingTeam) return;
    goNext();
  }, [open, isIncomingLocked, currentStep, incomingTeam, goNext]);

  useEffect(() => {
    if (open) return;
    reset();
    setIncomingTeam(null);
    setIsDone(false);
    resetSteps();
  }, [open, reset, resetSteps]);

  const outgoingPlayerIds = useWatch({ control, name: 'outgoingPlayerIds' });
  const incomingPlayerIds = useWatch({ control, name: 'incomingPlayerIds' });
  const useCoupon = useWatch({ control, name: 'useCoupon' });

  const { data: myRoster, isPending: isMyRosterPending } = useRoster(
    myTeam?.id,
    open,
  );
  const { data: incomingRoster, isPending: isIncomingRosterPending } =
    useRoster(incomingTeam?.id, open);

  const outgoingPlayers = findRosterPlayers(myRoster, outgoingPlayerIds);
  const incomingPlayers = findRosterPlayers(incomingRoster, incomingPlayerIds);

  const canQuote = Boolean(
    outgoingPlayerIds.length &&
      incomingPlayerIds.length &&
      outgoingPlayerIds.every((id) => !incomingPlayerIds.includes(id)),
  );
  const {
    data: quote,
    isPending: isQuotePending,
    error: quoteError,
  } = useTransferQuote(
    outgoingPlayerIds,
    incomingPlayerIds,
    useCoupon,
    open && canQuote,
  );

  const selectIncomingTeam = (team: TeamWithRatings | null) => {
    setIncomingTeam(team);
    setValue('incomingPlayerIds', []);
  };

  const onSubmit = handleSubmit((values) =>
    mutateAsync({
      outgoingPlayerIds: values.outgoingPlayerIds,
      incomingPlayerIds: values.incomingPlayerIds,
      useCoupon: values.useCoupon,
      requestedByUserId: values.requestedByUserId || undefined,
    })
      .then(() => {
        toast.success('Transferência registrada com sucesso.');
        setIsDone(true);
      })
      .catch(() => {
        // Erro já reportado pelo toast global de mutation (meta.errorMessage em useCreateTransfer).
      }),
  );

  const isStepDone = (step: CpuStepId) =>
    CPU_STEPS.findIndex((candidate) => candidate.id === step) <
    CPU_STEPS.findIndex((candidate) => candidate.id === currentStep);

  const isStepUnlocked = (index: number) => index <= furthestStepIndex;

  return {
    control,
    errors,
    myTeam,
    myRoster,
    isMyRosterPending,
    incomingTeam,
    selectIncomingTeam,
    incomingRoster,
    isIncomingRosterPending,
    outgoingPlayers,
    incomingPlayers,
    outgoingPlayerIds: outgoingPlayerIds ?? [],
    incomingPlayerIds: incomingPlayerIds ?? [],
    useCoupon,
    setValue,
    quote,
    isQuotePending: canQuote && isQuotePending,
    quoteError,
    currentStep,
    goToStep,
    goBack,
    goNext,
    isFirstStep,
    isLastStep,
    isStepDone,
    isStepUnlocked,
    isIncomingLocked,
    isOutgoingLocked,
    isCreating,
    isDone,
    onSubmit,
  };
};
