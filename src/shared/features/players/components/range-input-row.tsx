import { Input, Slider } from '@/components/ui';
import { cn, RATING_TIER_ZONES } from '@/lib';

type RangeInputRowProps = {
  label: string;
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  min?: number;
  max?: number;
  zones?: boolean;
  className?: string;
};

export const RangeInputRow = ({
  label,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  min = 0,
  max = 99,
  zones = false,
  className,
}: RangeInputRowProps) => {
  const sliderValue: [number, number] = [
    minValue === '' ? min : Number(minValue),
    maxValue === '' ? max : Number(maxValue),
  ];

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className={'flex items-center gap-2'}>
        <span
          className={'w-28 shrink-0 truncate text-muted-foreground text-xs'}
        >
          {label}
        </span>
        <Input
          type={'number'}
          inputMode={'numeric'}
          min={min}
          max={max}
          placeholder={'Mín'}
          value={minValue}
          onChange={(event) => onMinChange(event.target.value)}
          className={'h-8 w-16 px-2 text-xs'}
        />
        <span className={'text-muted-foreground text-xs'}>–</span>
        <Input
          type={'number'}
          inputMode={'numeric'}
          min={min}
          max={max}
          placeholder={'Máx'}
          value={maxValue}
          onChange={(event) => onMaxChange(event.target.value)}
          className={'h-8 w-16 px-2 text-xs'}
        />
      </div>

      <Slider<[number, number]>
        className={'pl-[7.5rem]'}
        min={min}
        max={max}
        value={sliderValue}
        onValueChange={(value) => {
          const [nextMin, nextMax] = value;
          onMinChange(String(nextMin));
          onMaxChange(String(nextMax));
        }}
        zones={zones ? RATING_TIER_ZONES : undefined}
        indicatorClassName={
          zones
            ? 'bg-transparent ring-2 ring-foreground/70 ring-inset'
            : 'bg-accent'
        }
      />
    </div>
  );
};
