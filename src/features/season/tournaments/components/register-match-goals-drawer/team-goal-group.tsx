import { PlusIcon } from 'lucide-react';
import type {
  Control,
  FieldErrors,
  UseFieldArrayReturn,
} from 'react-hook-form';
import { Button } from '@/components/ui';
import { cn } from '@/lib';
import type { MatchTeamWithPlayers } from '../../api';
import { TeamChip } from '../team-chip';
import { GoalRow } from './goal-row';
import type {
  FormValues,
  GoalRow as GoalRowValue,
  GoalsFieldName,
} from './goals-form-schema';

type TeamGoalGroupProps = {
  side: 'home' | 'away';
  team: MatchTeamWithPlayers;
  fieldName: GoalsFieldName;
  control: Control<FormValues>;
  fieldArray: UseFieldArrayReturn<FormValues, GoalsFieldName>;
  liveRows: GoalRowValue[];
  errors: FieldErrors<FormValues>;
  readOnly: boolean;
};

export const TeamGoalGroup = ({
  side,
  team,
  fieldName,
  control,
  fieldArray,
  liveRows,
  errors,
  readOnly,
}: TeamGoalGroupProps) => {
  const { fields, append, remove } = fieldArray;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-l-4',
        side === 'home' ? 'border-l-accent' : 'border-l-border-strong',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between gap-2 px-3 py-2',
          side === 'home' ? 'bg-accent-surface' : 'bg-muted',
        )}
      >
        <div className={'flex min-w-0 items-center gap-2'}>
          <TeamChip name={team.name} crestUrl={team.crestUrl} />

          <span className={'shrink-0 text-muted-foreground text-xs'}>
            {fields.length === 1 ? '1 gol' : `${fields.length} gols`}
          </span>
        </div>

        {!readOnly && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => append({ scorerId: '', assistId: '' })}
          >
            <PlusIcon />
            Adicionar gol
          </Button>
        )}
      </div>
      {fields.length === 0 && (
        <div className="px-3 py-4 text-muted-foreground text-sm italic">
          Nenhum gol registrado
        </div>
      )}

      {fields.length > 0 && (
        <div className={'divide-y divide-border'}>
          {fields.map((field, index) => (
            <GoalRow
              key={field.id}
              index={index}
              team={team}
              fieldName={fieldName}
              control={control}
              scorerId={liveRows[index]?.scorerId ?? ''}
              errors={errors}
              readOnly={readOnly}
              onRemove={() => remove(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
