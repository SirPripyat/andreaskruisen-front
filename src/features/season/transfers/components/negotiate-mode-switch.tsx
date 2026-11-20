import { Cpu as CpuIcon, HandshakeIcon } from 'lucide-react';
import { cn } from '@/lib';

export const NEGOTIATE_MODES = ['direct', 'cpu'] as const;
export type NegotiateMode = (typeof NEGOTIATE_MODES)[number];

const MODE_COPY: Record<
  NegotiateMode,
  {
    label: string;
    hint: string;
    activeClassName: string;
    hintClassName: string;
  }
> = {
  direct: {
    label: 'Entre participantes',
    hint: 'Proposta · precisa de aceite',
    activeClassName: 'border-warning bg-warning-surface',
    hintClassName: 'text-warning',
  },
  cpu: {
    label: 'Com time CPU',
    hint: 'Instantânea · valor de mercado',
    activeClassName: 'border-value bg-value/10',
    hintClassName: 'text-value',
  },
};

export const NegotiateModeSwitch = ({
  mode,
  onModeChange,
}: {
  mode: NegotiateMode;
  onModeChange: (mode: NegotiateMode) => void;
}) => {
  return (
    <div
      role={'tablist'}
      aria-label={'Modo de negociação'}
      className={'grid grid-cols-2 gap-2'}
    >
      {NEGOTIATE_MODES.map((candidate) => {
        const active = candidate === mode;
        const copy = MODE_COPY[candidate];

        return (
          <button
            key={candidate}
            type={'button'}
            role={'tab'}
            aria-selected={active}
            onClick={() => onModeChange(candidate)}
            className={cn(
              'flex flex-col items-start gap-0.5 rounded-lg border bg-background px-3 py-2 text-left transition-colors',
              active ? copy.activeClassName : 'hover:bg-muted/40',
            )}
          >
            <span className={'flex items-center gap-1.5 font-medium text-sm'}>
              {candidate === 'direct' ? (
                <HandshakeIcon className={'size-4'} />
              ) : (
                <CpuIcon className={'size-4'} />
              )}
              {copy.label}
            </span>
            <span
              className={cn(
                'font-mono text-[11px] text-muted-foreground',
                active && copy.hintClassName,
              )}
            >
              {copy.hint}
            </span>
          </button>
        );
      })}
    </div>
  );
};
