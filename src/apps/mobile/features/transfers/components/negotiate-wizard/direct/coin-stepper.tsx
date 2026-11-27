import { Button, Input } from '@/components/ui';
import { cn } from '@/lib';

const STEP = 10;

type CoinStepperProps = {
  value: number | undefined;
  onChange: (value: number) => void;
  myTeamName: string;
  hint: string;
};

export const CoinStepper = ({
  value,
  onChange,
  myTeamName,
  hint,
}: CoinStepperProps) => {
  const amount = value ?? 0;

  const label =
    amount > 0
      ? `${myTeamName} paga ${amount} moedas`
      : amount < 0
        ? `${myTeamName} recebe ${-amount} moedas`
        : 'Troca sem valor em moedas';

  return (
    <div className={'flex flex-col gap-2 border-t border-dashed pt-3'}>
      <span className={'font-semibold text-sm'}>{'Valor em moedas'}</span>
      <div className={'flex items-center gap-2.5'}>
        <div className={'flex items-center overflow-hidden rounded-lg border'}>
          <Button
            type={'button'}
            variant={'ghost'}
            size={'icon-sm'}
            className={'rounded-none'}
            onClick={() => onChange(amount - STEP)}
          >
            {'–'}
          </Button>
          <Input
            type={'number'}
            value={amount}
            onChange={(event) => onChange(Number(event.target.value) || 0)}
            className={'h-8 w-20 rounded-none border-x text-center font-mono'}
          />
          <Button
            type={'button'}
            variant={'ghost'}
            size={'icon-sm'}
            className={'rounded-none'}
            onClick={() => onChange(amount + STEP)}
          >
            {'+'}
          </Button>
        </div>
        <span
          className={cn(
            'font-medium text-xs',
            amount > 0
              ? 'text-accent'
              : amount < 0
                ? 'text-success'
                : 'text-muted-foreground',
          )}
        >
          {label}
        </span>
      </div>
      <p className={'text-muted-foreground text-[11px] leading-relaxed'}>
        {hint}
      </p>
    </div>
  );
};
