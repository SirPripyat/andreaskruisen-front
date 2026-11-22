import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { Button, Field, FieldLabel, SheetFooter } from '@/components/ui';
import type { TeamWithRatings } from '@/features/admin/teams';
import { useUsers } from '@/features/admin/users';
import { useMe } from '@/features/auth';
import { useClub } from '@/features/season/clubs';
import type { RosterBySector } from '@/features/season/squads';
import { useRoster } from '@/features/season/squads';
import { useCreateTransfer, useTransferQuote } from '../hooks';
import { type CreateTransferFormValues, createTransferSchema } from '../types';
import { CpuTeamCombobox } from './cpu-team-combobox';
import {
  RequestedByCombobox,
  type RequestedByUser,
} from './requested-by-combobox';
import { SwapAxis } from './swap-axis';
import { TradeSummary } from './trade-summary';
import { TransferSidePanel } from './transfer-side-panel';

const findRosterPlayer = (
  roster: RosterBySector | undefined,
  playerId: string,
) => {
  if (!roster || !playerId) return null;
  return (
    Object.values(roster)
      .flat()
      .find((player) => player.id === playerId) ?? null
  );
};

type CpuTransferFormProps = {
  open: boolean;
  incomingTeamId?: string;
  outgoingPlayerId?: string;
  incomingPlayerId?: string;
  onSuccess: () => void;
};

// Metade "instantânea" do drawer unificado (ver NegotiateDrawer) — troca
// pelo valor de mercado, sem precisar de aceite. O destino só lista times
// de CPU (CpuTeamCombobox); times de participante seguem só pelo modo de
// negociação direta.
export const CpuTransferForm = ({
  open,
  incomingTeamId,
  outgoingPlayerId: initialOutgoingPlayerId,
  incomingPlayerId: initialIncomingPlayerId,
  onSuccess,
}: CpuTransferFormProps) => {
  const [outgoingTeam, setOutgoingTeam] = useState<TeamWithRatings | null>(
    null,
  );
  const [incomingTeam, setIncomingTeam] = useState<TeamWithRatings | null>(
    null,
  );
  const [requestedByUser, setRequestedByUser] =
    useState<RequestedByUser | null>(null);
  const { mutateAsync, isPending: isCreating } = useCreateTransfer();
  const { data: me } = useMe();
  const isAdmin = me?.role === 'ADMIN';
  const { data: myTeam } = useClub(me?.teamId ?? undefined, open);
  const { data: users } = useUsers({ enabled: open && isAdmin });
  const { data: preselectedIncomingTeam } = useClub(incomingTeamId, open);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateTransferFormValues>({
    resolver: zodResolver(createTransferSchema),
    defaultValues: {
      outgoingPlayerId: '',
      incomingPlayerId: '',
      useCoupon: false,
      requestedByUserId: '',
    },
  });

  // Sem time de saída pré-definido, o painel de Saída começa com o time do
  // usuário logado — participante nunca troca esse time, só o admin pode.
  useEffect(() => {
    if (!open || !myTeam) return;
    setOutgoingTeam(myTeam);
  }, [open, myTeam]);

  useEffect(() => {
    if (!open || !initialOutgoingPlayerId) return;
    setValue('outgoingPlayerId', initialOutgoingPlayerId);
  }, [open, initialOutgoingPlayerId, setValue]);

  // Solicitante começa sempre como o próprio usuário logado — só o admin
  // pode trocar por outra pessoa (ver CLAUDE.md do backend).
  useEffect(() => {
    if (!open || !me) return;
    setRequestedByUser({ id: me.id, name: me.name });
    setValue('requestedByUserId', me.id);
  }, [open, me, setValue]);

  useEffect(() => {
    if (!open || !preselectedIncomingTeam) return;
    setIncomingTeam(preselectedIncomingTeam);
    setValue('incomingPlayerId', initialIncomingPlayerId ?? '');
  }, [open, preselectedIncomingTeam, initialIncomingPlayerId, setValue]);

  useEffect(() => {
    if (open) return;
    reset();
    setOutgoingTeam(null);
    setIncomingTeam(null);
    setRequestedByUser(null);
  }, [open, reset]);

  const outgoingPlayerId = useWatch({ control, name: 'outgoingPlayerId' });
  const incomingPlayerId = useWatch({ control, name: 'incomingPlayerId' });
  const useCoupon = useWatch({ control, name: 'useCoupon' });

  const { data: outgoingRoster, isPending: isOutgoingRosterPending } =
    useRoster(outgoingTeam?.id, open);
  const { data: incomingRoster, isPending: isIncomingRosterPending } =
    useRoster(incomingTeam?.id, open);

  const outgoingPlayer = findRosterPlayer(outgoingRoster, outgoingPlayerId);
  const incomingPlayer = findRosterPlayer(incomingRoster, incomingPlayerId);

  const canQuote = Boolean(
    outgoingPlayerId &&
      incomingPlayerId &&
      outgoingPlayerId !== incomingPlayerId,
  );
  const {
    data: quote,
    isPending: isQuotePending,
    error: quoteError,
  } = useTransferQuote(
    outgoingPlayerId,
    incomingPlayerId,
    useCoupon,
    open && canQuote,
  );

  const onSubmit = (values: CreateTransferFormValues) =>
    mutateAsync({
      outgoingPlayerId: values.outgoingPlayerId,
      incomingPlayerId: values.incomingPlayerId,
      useCoupon: values.useCoupon,
      requestedByUserId: isAdmin
        ? values.requestedByUserId || undefined
        : undefined,
    })
      .then(() => {
        toast.success('Transferência registrada com sucesso.');
        onSuccess();
      })
      .catch(() => {
        // Erro já reportado pelo toast global de mutation (meta.errorMessage em useCreateTransfer).
      });

  return (
    <>
      <form
        id={'cpu-transfer-form'}
        onSubmit={handleSubmit(onSubmit)}
        className={
          'flex min-h-0 flex-1 flex-col overflow-y-auto px-4 sm:overflow-hidden'
        }
      >
        <div
          className={
            'grid grid-cols-1 gap-3 sm:min-h-0 sm:flex-1 sm:grid-cols-[1fr_auto_1fr]'
          }
        >
          <TransferSidePanel
            title={'Saída'}
            tagLabel={'Sai da temporada'}
            tagClassName={'bg-warning-surface text-warning'}
            team={outgoingTeam}
            onTeamChange={(team) => {
              setOutgoingTeam(team);
              setValue('outgoingPlayerId', '');
            }}
            excludeTeamId={incomingTeam?.id}
            placeholder={'Buscar time de saída...'}
            teamDisabled={!isAdmin}
            extraField={
              isAdmin && (
                <Field>
                  <FieldLabel>{'Solicitado por'}</FieldLabel>
                  <RequestedByCombobox
                    users={users ?? []}
                    value={requestedByUser}
                    onValueChange={(user) => {
                      setRequestedByUser(user);
                      setValue('requestedByUserId', user?.id ?? '');
                    }}
                  />
                </Field>
              )
            }
            roster={outgoingRoster}
            isRosterPending={isOutgoingRosterPending}
            control={control}
            name={'outgoingPlayerId'}
            error={errors.outgoingPlayerId}
          />

          <SwapAxis />

          <TransferSidePanel
            title={'Destino'}
            tagLabel={'Entra na temporada'}
            tagClassName={'bg-success-surface text-success'}
            team={incomingTeam}
            picker={
              <CpuTeamCombobox
                value={incomingTeam}
                onValueChange={(team) => {
                  setIncomingTeam(team);
                  setValue('incomingPlayerId', '');
                }}
              />
            }
            roster={incomingRoster}
            isRosterPending={isIncomingRosterPending}
            control={control}
            name={'incomingPlayerId'}
            error={errors.incomingPlayerId}
          />
        </div>
      </form>

      <SheetFooter
        className={'flex-row items-center justify-between gap-4 border-t'}
      >
        <TradeSummary
          outgoingTeam={outgoingTeam}
          outgoingPlayer={outgoingPlayer}
          incomingTeam={incomingTeam}
          incomingPlayer={incomingPlayer}
          quote={quote}
          isQuotePending={canQuote && isQuotePending}
          quoteError={quoteError}
          useCoupon={useCoupon}
          onUseCouponChange={(checked) => setValue('useCoupon', checked)}
        />
        <Button
          type={'submit'}
          form={'cpu-transfer-form'}
          disabled={
            isCreating ||
            !outgoingPlayerId ||
            !incomingPlayerId ||
            (canQuote &&
              (isQuotePending ||
                Boolean(quoteError) ||
                quote?.sufficientBalance === false ||
                (useCoupon && quote?.couponBalance === 0)))
          }
          className={'shrink-0'}
        >
          {isCreating ? 'Registrando...' : 'Registrar transferência'}
        </Button>
      </SheetFooter>
    </>
  );
};
