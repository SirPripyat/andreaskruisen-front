import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
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
import type { TeamWithRatings } from '@/features/admin/teams';
import type { RosterBySector } from '@/features/season/squads';
import { useRoster } from '@/features/season/squads';
import { type CreateTransferFormValues, createTransferSchema } from '../api';
import { useCreateTransfer } from '../hooks';
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
}: {
  seasonId: string | undefined;
}) => {
  const [open, setOpen] = useState(false);
  const [outgoingTeam, setOutgoingTeam] = useState<TeamWithRatings | null>(
    null,
  );
  const [incomingTeam, setIncomingTeam] = useState<TeamWithRatings | null>(
    null,
  );
  const { mutateAsync, isPending: isCreating } = useCreateTransfer();
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

  const onSubmit = async (values: CreateTransferFormValues) => {
    try {
      await mutateAsync({
        outgoingPlayerId: values.outgoingPlayerId,
        incomingPlayerId: values.incomingPlayerId,
      });
      toast.success('Transferência registrada com sucesso.');
      resetAll();
      setOpen(false);
    } catch {
      // Erro já reportado pelo toast global de mutation (meta.errorMessage em useCreateTransfer).
    }
  };

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
          <Button disabled={!seasonId}>
            <PlusIcon />
            {'Nova transferência'}
          </Button>
        }
      />
      <SheetContent className={'w-full data-[side=right]:sm:max-w-3xl'}>
        <SheetHeader>
          <SheetTitle className={'font-display text-2xl'}>
            {'Mesa de trocas'}
          </SheetTitle>
          <SheetDescription>
            {
              'Troque dois jogadores entre times da temporada selecionada, sem custo.'
            }
          </SheetDescription>
        </SheetHeader>

        <form
          id={'create-transfer-form'}
          onSubmit={handleSubmit(onSubmit)}
          className={'flex-1 overflow-y-auto px-4'}
        >
          <div
            className={
              'grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-start'
            }
          >
            <TransferSidePanel
              title={'Saída'}
              tagLabel={'sai da temporada'}
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
              tagLabel={'entra na temporada'}
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
