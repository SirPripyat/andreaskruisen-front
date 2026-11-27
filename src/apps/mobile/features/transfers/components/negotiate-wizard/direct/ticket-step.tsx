import { Badge } from '@/components/ui';
import { SwapAxis } from '@/shared/features/transfers';
import { ClauseChipList } from './clause-chip-list';
import { CoinStepper } from './coin-stepper';
import type { useDirectNegotiationWizard } from './use-direct-negotiation-wizard';

type TicketStepProps = {
  wizard: ReturnType<typeof useDirectNegotiationWizard>;
};

export const TicketStep = ({ wizard }: TicketStepProps) => {
  const {
    myTeam,
    targetTeam,
    outgoingPlayers,
    incomingPlayers,
    coinAmount,
    setValue,
    canEstimateBaseCost,
    control,
  } = wizard;

  return (
    <div className={'flex flex-col gap-4'}>
      <p className={'text-muted-foreground text-xs'}>
        {
          'Os dois lados ficam visíveis aqui — ajuste o valor e as cláusulas sem perder o que já foi escolhido.'
        }
      </p>

      <div className={'flex items-center gap-2'}>
        <div className={'flex min-w-0 flex-1 flex-col gap-1'}>
          <Badge
            variant={'outline'}
            className={
              'w-fit border-transparent bg-warning-surface text-warning'
            }
          >
            {'Entrega'}
          </Badge>
          {outgoingPlayers.length > 0 ? (
            outgoingPlayers.map((player) => (
              <span key={player.id} className={'flex flex-col'}>
                <span className={'truncate font-display font-semibold text-sm'}>
                  {player.name}
                </span>
                <span className={'text-muted-foreground text-xs'}>
                  {player.position}
                  {' · overall '}
                  {player.overallRating}
                </span>
              </span>
            ))
          ) : (
            <span className={'text-muted-foreground text-sm'}>
              {'Nenhum jogador'}
            </span>
          )}
          <span className={'truncate text-muted-foreground text-[11px]'}>
            {myTeam?.name ?? '—'}
          </span>
        </div>

        <SwapAxis />

        <div
          className={'flex min-w-0 flex-1 flex-col items-end gap-1 text-right'}
        >
          <Badge
            variant={'outline'}
            className={
              'w-fit border-transparent bg-success-surface text-success'
            }
          >
            {'Recebe'}
          </Badge>
          {incomingPlayers.length > 0 ? (
            incomingPlayers.map((player) => (
              <span key={player.id} className={'flex flex-col'}>
                <span className={'truncate font-display font-semibold text-sm'}>
                  {player.name}
                </span>
                <span className={'text-muted-foreground text-xs'}>
                  {player.position}
                  {' · overall '}
                  {player.overallRating}
                </span>
              </span>
            ))
          ) : (
            <span className={'text-muted-foreground text-sm'}>
              {'Nenhum jogador'}
            </span>
          )}
          <span className={'truncate text-muted-foreground text-[11px]'}>
            {targetTeam?.name ?? '—'}
          </span>
        </div>
      </div>

      <CoinStepper
        value={coinAmount}
        onChange={(value) => setValue('coinAmount', value)}
        myTeamName={myTeam?.name ?? 'Seu time'}
        hint={
          canEstimateBaseCost
            ? 'Pré-preenchido com o custo de mercado dessa troca (diferença de overall) — ajuste ou zere se quiser outro valor.'
            : 'Positivo: seu time paga essa quantia. Negativo: seu time recebe.'
        }
      />

      <ClauseChipList
        control={control}
        outgoingPlayers={outgoingPlayers}
        incomingPlayers={incomingPlayers}
      />
    </div>
  );
};
