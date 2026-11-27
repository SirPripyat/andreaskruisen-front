import { POSITION_CODES, type PositionCode } from '@/features/admin/players';
import { cn, getPositionGroupClassName } from '@/lib';

type PositionMultiSelectProps = {
  value: PositionCode[];
  onValueChange: (positions: PositionCode[]) => void;
};

export const PositionMultiSelect = ({
  value,
  onValueChange,
}: PositionMultiSelectProps) => {
  const toggle = (code: PositionCode) => {
    onValueChange(
      value.includes(code)
        ? value.filter((selected) => selected !== code)
        : [...value, code],
    );
  };

  return (
    <div className={'flex flex-wrap gap-1.5'}>
      {POSITION_CODES.map((code) => {
        const active = value.includes(code);

        return (
          <button
            key={code}
            type={'button'}
            onClick={() => toggle(code)}
            className={cn(
              'rounded-full border px-2.5 py-1 font-mono text-xs transition-colors',
              active
                ? cn('border-transparent', getPositionGroupClassName(code))
                : 'border-input text-muted-foreground hover:bg-muted',
            )}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
};
