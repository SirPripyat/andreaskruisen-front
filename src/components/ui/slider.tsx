import { Slider as SliderPrimitive } from '@base-ui/react/slider';
import { cn } from 'cn';

type SliderZone = {
  from: number;
  to: number;
  className: string;
};

type SliderProps<Value extends number | readonly number[]> =
  SliderPrimitive.Root.Props<Value> & {
    trackClassName?: string;
    indicatorClassName?: string;
    thumbClassName?: string;
    zones?: SliderZone[];
  };

const Slider = <Value extends number | readonly number[]>({
  className,
  trackClassName,
  indicatorClassName,
  thumbClassName,
  zones,
  min = 0,
  max = 100,
  value,
  defaultValue,
  ...props
}: SliderProps<Value>) => {
  const thumbValues = (value ?? defaultValue) as Value | undefined;
  const thumbCount = Array.isArray(thumbValues) ? thumbValues.length : 1;

  return (
    <SliderPrimitive.Root
      data-slot={'slider'}
      className={cn('relative flex w-full items-center', className)}
      min={min}
      max={max}
      value={value}
      defaultValue={defaultValue}
      {...props}
    >
      <SliderPrimitive.Control
        className={'relative flex w-full items-center py-2'}
      >
        <SliderPrimitive.Track
          data-slot={'slider-track'}
          className={cn(
            'relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted',
            trackClassName,
          )}
        >
          {zones?.map((zone) => (
            <span
              key={`${zone.from}-${zone.to}`}
              className={cn('absolute inset-y-0', zone.className)}
              style={{
                left: `${((zone.from - min) / (max - min)) * 100}%`,
                width: `${((zone.to - zone.from) / (max - min)) * 100}%`,
              }}
            />
          ))}
          <SliderPrimitive.Indicator
            data-slot={'slider-indicator'}
            className={cn('absolute h-full rounded-full', indicatorClassName)}
          />
          {Array.from({ length: thumbCount }, (_, index) => (
            <SliderPrimitive.Thumb
              // biome-ignore lint/suspicious/noArrayIndexKey: thumb count is fixed per slider instance (1 or 2), order never changes
              key={index}
              index={index}
              data-slot={'slider-thumb'}
              className={cn(
                'block size-4 shrink-0 rounded-full border-2 border-accent bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                thumbClassName,
              )}
            />
          ))}
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
};

export { Slider };
