import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { type ReactElement, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';
import { type TeamWithRatings, useTeam } from '@/features/admin/teams';
import type { RosterBySector } from '@/features/season/squads';
import { useRoster } from '@/features/season/squads';
import { useCreateTransfer } from '../hooks';
import { type CreateTransferFormValues, createTransferSchema } from '../types';
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
  trigger,
}: {
  seasonId: string | undefined;
  outgoingTeamId?: string;
  outgoingPlayerId?: string;
  incomingTeamId?: string;
  incomingPlayerId?: string;
  trigger?: ReactElement;
}) => {
  const [open, setOpen] = useState(false);
  const [outgoingTeam, setOutgoingTeam] = useState<TeamWithRatings | null>(
    null,
  );
  const [incomingTeam, setIncomingTeam] = useState<TeamWithRatings | null>(
    null,
  );
  const { mutateAsync, isPending: isCreating } = useCreateTransfer();
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
    },
  });

  useEffect(() => {
    if (!open || !preselectedOutgoingTeam) return;
    setOutgoingTeam(preselectedOutgoingTeam);
    setValue('outgoingPlayerId', initialOutgoingPlayerId ?? '');
  }, [open, preselectedOutgoingTeam, initialOutgoingPlayerId, setValue]);

  useEffect(() => {
    if (!open || !preselectedIncomingTeam) return;
    setIncomingTeam(preselectedIncomingTeam);
    setValue('incomingPlayerId', initialIncomingPlayerId ?? '');
  }, [open, preselectedIncomingTeam, initialIncomingPlayerId, setValue]);

  const outgoingPlayerId = useWatch({ control, name: 'outgoingPlayerId' });
  const incomingPlayerId = useWatch({ control, name: 'incomingPlayerId' });

  const { data: outgoingRoster, isPending: isOutgoingRosterPending } =
    useRoster(outgoingTeam?.id, open);
  const { data: incomingRoster, isPending: isIncomingRosterPending } =
    useRoster(incomingTeam?.id, open);

  const outgoingPlayer = findRosterPlayer(outgoingRoster, outgoingPlayerId);
  const incomingPlayer = findRosterPlayer(incomingRoster, incomingPlayerId);

  const resetAll = () => {
    reset();
    setOutgoingTeam(null);
    setIncomingTeam(null);
  };

  const onSubmit = (values: CreateTransferFormValues) =>
    mutateAsync({
      outgoingPlayerId: values.outgoingPlayerId,
      incomingPlayerId: values.incomingPlayerId,
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
            <Button disabled={!seasonId}>
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
            Troque dois jogadores entre times da temporada selecionada, sem
            custo.
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
          />
          <Button
            type={'submit'}
            form={'create-transfer-form'}
            disabled={isCreating || !outgoingPlayerId || !incomingPlayerId}
            className={'shrink-0'}
          >
            {isCreating ? 'Registrando...' : 'Registrar transferência'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
