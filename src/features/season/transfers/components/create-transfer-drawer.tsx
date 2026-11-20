import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { type ReactElement, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Button,
  Field,
  FieldLabel,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';
import { type TeamWithRatings, useTeam } from '@/features/admin/teams';
import { useUsers } from '@/features/admin/users';
import { useMe } from '@/features/auth';
import type { RosterBySector } from '@/features/season/squads';
import { useRoster } from '@/features/season/squads';
import { useCreateTransfer, useTransferQuote } from '../hooks';
import { type CreateTransferFormValues, createTransferSchema } from '../types';
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

export const CreateTransferDrawer = ({
  seasonId,
  outgoingTeamId,
  outgoingPlayerId: initialOutgoingPlayerId,
  incomingTeamId,
  incomingPlayerId: initialIncomingPlayerId,
  windowClosed,
  trigger,
}: {
  seasonId: string | undefined;
  outgoingTeamId?: string;
  outgoingPlayerId?: string;
  incomingTeamId?: string;
  incomingPlayerId?: string;
  windowClosed?: boolean;
  trigger?: ReactElement;
}) => {
  const [open, setOpen] = useState(false);
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
  const { data: myTeam } = useTeam(me?.teamId ?? undefined, open);
  const { data: users } = useUsers({ enabled: open && isAdmin });
  const { data: preselectedOutgoingTeam } = useTeam(outgoingTeamId, open);
  const { data: preselectedIncomingTeam } = useTeam(incomingTeamId, open);
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

  useEffect(() => {
    if (!open || !preselectedOutgoingTeam) return;
    setOutgoingTeam(preselectedOutgoingTeam);
    setValue('outgoingPlayerId', initialOutgoingPlayerId ?? '');
  }, [open, preselectedOutgoingTeam, initialOutgoingPlayerId, setValue]);

  // Sem um time de saída pré-definido (ex.: botão "Negociar" de um jogador
  // específico), o painel de Saída começa com o time do usuário logado —
  // participante nunca troca esse time, só o admin pode.
  useEffect(() => {
    if (!open || outgoingTeamId || !myTeam) return;
    setOutgoingTeam(myTeam);
  }, [open, outgoingTeamId, myTeam]);

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

  const resetAll = () => {
    reset();
    setOutgoingTeam(null);
    setIncomingTeam(null);
    setRequestedByUser(null);
  };

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
        resetAll();
        setOpen(false);
      })
      .catch(() => {
        // Erro já reportado pelo toast global de mutation (meta.errorMessage em useCreateTransfer).
      });

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          resetAll();
        }
      }}
    >
      <SheetTrigger
        render={
          trigger ?? (
            <Button
              disabled={!seasonId || windowClosed || (!isAdmin && !me?.teamId)}
            >
              <PlusIcon />
              {'Nova transferência'}
            </Button>
          )
        }
      />
      <SheetContent className={'w-full data-[side=right]:sm:max-w-3xl'}>
        <SheetHeader>
          <SheetTitle className={'font-display text-2xl'}>
            Mesa de trocas
          </SheetTitle>
          <SheetDescription>
            Troque dois jogadores entre times da temporada selecionada.
          </SheetDescription>
        </SheetHeader>

        <form
          id={'create-transfer-form'}
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
              onTeamChange={(team) => {
                setIncomingTeam(team);
                setValue('incomingPlayerId', '');
              }}
              excludeTeamId={outgoingTeam?.id}
              placeholder={'Buscar time de destino...'}
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
            form={'create-transfer-form'}
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
      </SheetContent>
    </Sheet>
  );
};
