import {
  ArrowLeftRightIcon,
  CheckIcon,
  CoinsIcon,
  TicketPercentIcon,
} from 'lucide-react';
import { Button, Label, Switch } from '@/components/ui';
import { cn, formatNumber, getErrorMessage } from '@/lib';
import type { useCpuTransferWizard } from './use-cpu-transfer-wizard';

type ConfirmStepProps = {
  wizard: ReturnType<typeof useCpuTransferWizard>;
};

export const ConfirmStep = ({ wizard }: ConfirmStepProps) => {
  const {
    outgoingPlayers,
    incomingPlayers,
    myTeam,
    incomingTeam,
    quote,
    isQuotePending,
    quoteError,
    useCoupon,
    setValue,
    isCreating,
    isDone,
    onSubmit,
  } = wizard;

  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex items-center gap-2'}>
        <div className={'flex min-w-0 flex-1 flex-col gap-1'}>
          <span className={'truncate font-display font-semibold text-sm'}>
            {outgoingPlayers.map((player) => player.name).join(' e ') || '—'}
          </span>
          <span className={'truncate text-muted-foreground text-xs'}>
            {myTeam?.name ?? '—'}
          </span>
        </div>

        <ArrowLeftRightIcon className={'size-4 shrink-0 text-primary'} />

        <div
          className={'flex min-w-0 flex-1 flex-col items-end gap-1 text-right'}
        >
          <span className={'truncate font-display font-semibold text-sm'}>
            {incomingPlayers.map((player) => player.name).join(' e ') || '—'}
          </span>
          <span className={'truncate text-muted-foreground text-xs'}>
            {incomingTeam?.name ?? '—'}
          </span>
        </div>
      </div>

      {isQuotePending && (
        <p className={'text-muted-foreground text-xs'}>
          {'Calculando custo...'}
        </p>
      )}

      {!isQuotePending && Boolean(quoteError) && (
        <p className={'text-destructive text-xs'}>
          {getErrorMessage(quoteError, 'Não foi possível calcular o custo.')}
        </p>
      )}

      {!isQuotePending && quote && (
        <>
          <div className={'flex items-center gap-2'}>
            <span
              className={cn(
                'flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium text-xs',
                quote.sufficientBalance
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-destructive/10 text-destructive',
              )}
            >
              <CoinsIcon className={'size-3.5'} />
              {`Custo: ${formatNumber(quote.cost)} coins`}
            </span>
            {!quote.sufficientBalance && (
              <span className={'text-destructive text-xs'}>
                {`Saldo insuficiente (${formatNumber(quote.balance)} coins)`}
              </span>
            )}
          </div>

          <div className={'flex items-center gap-2'}>
            <Switch
              id={'use-coupon'}
              checked={useCoupon}
              onCheckedChange={(checked) => setValue('useCoupon', checked)}
              disabled={quote.couponBalance === 0 && !useCoupon}
            />
            <Label
              htmlFor={'use-coupon'}
              className={'flex items-center gap-1.5 text-xs'}
            >
              <TicketPercentIcon className={'size-3.5 text-muted-foreground'} />
              {`Usar cupom de isenção (${quote.couponBalance} disponíveis)`}
            </Label>
          </div>
        </>
      )}

      <Button
        type={'button'}
        disabled={
          isCreating ||
          isDone ||
          isQuotePending ||
          Boolean(quoteError) ||
          quote?.sufficientBalance === false ||
          (useCoupon && quote?.couponBalance === 0)
        }
        onClick={onSubmit}
        className={'w-full'}
      >
        {isDone ? (
          <>
            <CheckIcon />
            {'Transferência registrada'}
          </>
        ) : isCreating ? (
          'Registrando...'
        ) : (
          'Registrar transferência'
        )}
      </Button>
    </div>
  );
};
