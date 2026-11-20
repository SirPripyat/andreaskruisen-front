import { zodResolver } from '@hookform/resolvers/zod';
import { HandshakeIcon } from 'lucide-react';
import { type ReactElement, useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Button,
  Field,
  FieldLabel,
  Input,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';
import { useTeam } from '@/features/admin/teams';
import { useMe } from '@/features/auth';
import type { RosterBySector, SeasonSquad } from '@/features/season/squads';
import { useRoster, useSeasonSquads } from '@/features/season/squads';
import { SwapAxis, useTransferQuote } from '@/features/season/transfers';
import { useProposeNegotiation } from '../hooks';
import {
  type CreateNegotiationFormValues,
  createNegotiationSchema,
} from '../types';
import { NegotiationClauseBuilder } from './negotiation-clause-builder';
import { NegotiationSidePanel } from './negotiation-side-panel';
import { SquadCombobox } from './squad-combobox';

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

export const CreateNegotiationDrawer = ({
  seasonId,
  targetTeamId: initialTargetTeamId,
  outgoingPlayerId: initialOutgoingPlayerId,
  incomingPlayerId: initialIncomingPlayerId,
  windowClosed,
  trigger,
}: {
  seasonId: string | undefined;
  targetTeamId?: string;
  outgoingPlayerId?: string;
  incomingPlayerId?: string;
  windowClosed?: boolean;
  trigger?: ReactElement;
}) => {
  const [open, setOpen] = useState(false);
  const [targetSquad, setTargetSquad] = useState<SeasonSquad | null>(null);

  const { data: me } = useMe();
  const { data: myTeam } = useTeam(me?.teamId ?? undefined, open);
  const { data: squads } = useSeasonSquads(open);
  const { data: targetTeam } = useTeam(targetSquad?.team.id, open);

  const { mutateAsync, isPending: isProposing } = useProposeNegotiation();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateNegotiationFormValues>({
    resolver: zodResolver(createNegotiationSchema),
    defaultValues: {
      targetTeamId: '',
      outgoingPlayerId: '',
      incomingPlayerId: '',
      clauses: [],
    },
  });

  useEffect(() => {
    if (!open || !initialTargetTeamId || !squads) return;
    const squad = squads.find(
      (candidate) => candidate.team.id === initialTargetTeamId,
    );
    if (!squad) return;
    setTargetSquad(squad);
    setValue('targetTeamId', squad.team.id);
    setValue('incomingPlayerId', initialIncomingPlayerId ?? '');
  }, [open, squads, initialTargetTeamId, initialIncomingPlayerId, setValue]);

  useEffect(() => {
    if (!open) return;
    setValue('outgoingPlayerId', initialOutgoingPlayerId ?? '');
  }, [open, initialOutgoingPlayerId, setValue]);

  const outgoingPlayerId = useWatch({ control, name: 'outgoingPlayerId' });
  const incomingPlayerId = useWatch({ control, name: 'incomingPlayerId' });

  const { data: myRoster, isPending: isMyRosterPending } = useRoster(
    myTeam?.id,
    open,
  );
  const { data: targetRoster, isPending: isTargetRosterPending } = useRoster(
    targetTeam?.id,
    open,
  );

  const outgoingPlayer = findRosterPlayer(myRoster, outgoingPlayerId ?? '');
  const incomingPlayer = findRosterPlayer(targetRoster, incomingPlayerId ?? '');

  // Quando os dois lados têm jogador escolhido, essa troca também poderia
  // ser feita como transferência de mercado — usamos a mesma fórmula
  // (diferença de overall) como valor inicial do campo de moedas, já que é
  // a referência natural de "quanto isso vale" (ver QuoteTransferUseCase).
  // useCoupon sempre false aqui: é só uma sugestão, não gasta cupom de
  // ninguém.
  const canEstimateBaseCost = Boolean(outgoingPlayerId && incomingPlayerId);
  const { data: baseCostQuote } = useTransferQuote(
    outgoingPlayerId ?? '',
    incomingPlayerId ?? '',
    false,
    open && canEstimateBaseCost,
  );

  useEffect(() => {
    if (!baseCostQuote) return;
    setValue('coinAmount', baseCostQuote.cost);
  }, [baseCostQuote, setValue]);

  const resetAll = () => {
    reset();
    setTargetSquad(null);
  };

  const onSubmit = (values: CreateNegotiationFormValues) =>
    mutateAsync({
      targetTeamId: values.targetTeamId,
      outgoingPlayerId: values.outgoingPlayerId || undefined,
      incomingPlayerId: values.incomingPlayerId || undefined,
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
        resetAll();
        setOpen(false);
      })
      .catch(() => {
        // Erro já reportado pelo toast global de mutation (meta.errorMessage em useProposeNegotiation).
      });

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) resetAll();
      }}
    >
      <SheetTrigger
        render={
          trigger ?? (
            <Button
              variant={'outline'}
              disabled={!seasonId || !me?.teamId || windowClosed}
            >
              <HandshakeIcon />
              {'Nova negociação'}
            </Button>
          )
        }
      />
      <SheetContent className={'w-full data-[side=right]:sm:max-w-3xl'}>
        <SheetHeader>
          <SheetTitle className={'font-display text-2xl'}>
            Negociação direta
          </SheetTitle>
          <SheetDescription>
            Proponha uma troca, compra ou venda livre com outro time — sem a
            fórmula fixa de overall. Sujeita ao aceite do outro lado.
          </SheetDescription>
        </SheetHeader>

        <form
          id={'create-negotiation-form'}
          onSubmit={handleSubmit(onSubmit)}
          className={
            'flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 sm:overflow-hidden'
          }
        >
          <div
            className={
              'grid grid-cols-1 gap-3 sm:min-h-0 sm:flex-1 sm:grid-cols-[1fr_auto_1fr]'
            }
          >
            <NegotiationSidePanel
              title={'Seu time'}
              tagLabel={'Entrega (opcional)'}
              tagClassName={'bg-warning-surface text-warning'}
              hint={'Escolha um jogador se for entregar alguém na troca.'}
              team={myTeam ?? null}
              roster={myRoster}
              isRosterPending={isMyRosterPending}
              control={control}
              name={'outgoingPlayerId'}
              error={errors.outgoingPlayerId}
            />

            <SwapAxis />

            <NegotiationSidePanel
              title={'Time de destino'}
              tagLabel={'Recebe (opcional)'}
              tagClassName={'bg-success-surface text-success'}
              hint={'Escolha um jogador se for receber alguém na troca.'}
              team={targetTeam ?? null}
              picker={
                <Field>
                  <FieldLabel>{'Participante'}</FieldLabel>
                  <SquadCombobox
                    value={targetSquad}
                    onValueChange={(squad) => {
                      setTargetSquad(squad);
                      setValue('targetTeamId', squad?.team.id ?? '');
                      setValue('incomingPlayerId', '');
                    }}
                    excludeTeamId={myTeam?.id}
                  />
                </Field>
              }
              roster={targetRoster}
              isRosterPending={isTargetRosterPending}
              control={control}
              name={'incomingPlayerId'}
              error={errors.incomingPlayerId}
            />
          </div>

          <Field>
            <FieldLabel>{'Valor em moedas (opcional)'}</FieldLabel>
            <Controller
              name={'coinAmount'}
              control={control}
              render={({ field }) => (
                <Input
                  type={'number'}
                  placeholder={'0'}
                  value={field.value ?? ''}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value === ''
                        ? undefined
                        : Number(event.target.value),
                    )
                  }
                />
              )}
            />
            <p className={'text-muted-foreground text-xs'}>
              {canEstimateBaseCost
                ? 'Pré-preenchido com o custo de mercado dessa troca (diferença de overall) — ajuste ou zere se quiser outro valor. Positivo: seu time paga. Negativo: seu time recebe.'
                : 'Positivo: seu time paga essa quantia. Negativo: seu time recebe.'}
            </p>
          </Field>

          <NegotiationClauseBuilder
            control={control}
            outgoingPlayer={outgoingPlayer}
            incomingPlayer={incomingPlayer}
          />
        </form>

        <SheetFooter className={'border-t'}>
          <Button
            type={'submit'}
            form={'create-negotiation-form'}
            disabled={isProposing || !targetSquad}
            className={'w-full'}
          >
            {isProposing ? 'Enviando...' : 'Enviar proposta'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
