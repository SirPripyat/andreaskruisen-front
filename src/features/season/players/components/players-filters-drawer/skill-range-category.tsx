import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui';
import type { SkillRatingField } from '@/features/admin/players';
import { cn } from '@/lib';
import type { SkillDraftFields } from './draft-filters';
import { RangeInputRow } from './range-input-row';

type SkillRangeCategoryProps = {
  label: string;
  fields: { key: SkillRatingField; label: string }[];
  values: SkillDraftFields;
  onFieldChange: (key: keyof SkillDraftFields, value: string) => void;
};

const isGeneralField = (label: string) => label.includes('(geral)');

export const SkillRangeCategory = ({
  label,
  fields,
  values,
  onFieldChange,
}: SkillRangeCategoryProps) => {
  const [open, setOpen] = useState(false);

  const activeCount = fields.filter(
    (field) => values[`${field.key}Min`] || values[`${field.key}Max`],
  ).length;

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={'rounded-lg border'}
    >
      <CollapsibleTrigger
        className={
          'flex w-full items-center justify-between gap-2 px-3 py-2 text-left'
        }
      >
        <span className={'font-semibold text-xs uppercase tracking-wide'}>
          {label}
          {activeCount > 0 && (
            <span className={'ml-1.5 text-muted-foreground'}>
              ({activeCount})
            </span>
          )}
        </span>
        <ChevronDownIcon
          className={cn(
            'size-4 shrink-0 text-muted-foreground transition-transform',
            open && 'rotate-180',
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className={'flex flex-col gap-3 border-t p-3'}>
          {fields.map((field) => (
            <RangeInputRow
              key={field.key}
              label={field.label}
              minValue={values[`${field.key}Min`] ?? ''}
              maxValue={values[`${field.key}Max`] ?? ''}
              onMinChange={(value) => onFieldChange(`${field.key}Min`, value)}
              onMaxChange={(value) => onFieldChange(`${field.key}Max`, value)}
              zones
              className={cn(
                isGeneralField(field.label) &&
                  'border-border border-dashed border-b pb-3 font-semibold',
              )}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
