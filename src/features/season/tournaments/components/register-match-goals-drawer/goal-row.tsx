import { SportShoeIcon, VolleyballIcon, XIcon } from 'lucide-react';
import { type Control, Controller, type FieldErrors } from 'react-hook-form';
import { Button, Field, FieldError, FieldLabel } from 'src/components/ui';
import type { MatchTeamWithPlayers } from '../../api';
import type { FormValues, GoalsFieldName } from './goals-form-schema';
import { PlayerCombobox } from './player-combobox';

type GoalRowProps = {
  index: number;
  team: MatchTeamWithPlayers;
  fieldName: GoalsFieldName;
  control: Control<FormValues>;
  scorerId: string;
  errors: FieldErrors<FormValues>;
  readOnly: boolean;
  onRemove: () => void;
};

export const GoalRow = ({
  index,
  team,
  fieldName,
  control,
  scorerId,
  errors,
  readOnly,
  onRemove,
}: GoalRowProps) => {
  const assistOptions = team.players.filter((player) => player.id !== scorerId);

  return (
    <div className={'flex items-end gap-2 p-3'}>
      <span
        className={
          'flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-muted-foreground text-xs'
        }
      >
        {index + 1}
      </span>

      <Field className={'min-w-0 flex-1'}>
        <FieldLabel className={'text-muted-foreground text-xs'}>
          <VolleyballIcon className="size-3.5" />
          Artilheiro
        </FieldLabel>

        <Controller
          control={control}
          name={`${fieldName}.${index}.scorerId`}
          render={({ field: controllerField }) => (
            <PlayerCombobox
              players={team.players}
              value={controllerField.value}
              onValueChange={controllerField.onChange}
              onBlur={controllerField.onBlur}
              disabled={readOnly}
            />
          )}
        />

        <FieldError
          errors={
            errors[fieldName]?.[index]?.scorerId
              ? [errors[fieldName]?.[index]?.scorerId]
              : undefined
          }
        />
      </Field>

      <Field className="min-w-0 flex-1">
        <FieldLabel className="text-muted-foreground text-xs">
          <SportShoeIcon className="size-3.5" />
          Assistente
        </FieldLabel>

        <Controller
          control={control}
          name={`${fieldName}.${index}.assistId`}
          render={({ field: controllerField }) => (
            <PlayerCombobox
              players={assistOptions}
              value={controllerField.value}
              onValueChange={controllerField.onChange}
              onBlur={controllerField.onBlur}
              placeholder="Sem assistência"
              disabled={readOnly || !scorerId}
            />
          )}
        />
      </Field>

      {!readOnly && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-muted-foreground hover:text-accent"
          onClick={onRemove}
          aria-label={`Remover gol ${index + 1}`}
        >
          <XIcon />
        </Button>
      )}
    </div>
  );
};
