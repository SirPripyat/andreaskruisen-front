import { CircleAlertIcon, CircleCheckIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { Controller, useWatch } from 'react-hook-form';
import { Field, FieldError, FieldLabel, Switch } from '@/components';
import { cn } from '@/lib';
import { isValidGroupStageSetup, nextPowerOfTwo } from '../../api';
import type { CreateTournamentFormValues } from '../../types';

const GROUP_SIZE_OPTIONS = [2, 3, 4, 5, 6, 8];
const GROUPS_COUNT_OPTIONS = [2, 3, 4, 6, 8];

type ChipPickerProps = {
  label: string;
  htmlId: string;
  options: number[];
  value: number;
  onChange: (value: number) => void;
};

const ChipPicker = ({
  label,
  htmlId,
  options,
  value,
  onChange,
}: ChipPickerProps) => (
  <Field>
    <FieldLabel htmlFor={htmlId}>{label}</FieldLabel>
    <div id={htmlId} className={'flex flex-wrap items-center gap-2'}>
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type={'button'}
            aria-pressed={selected}
            onClick={() => onChange(option)}
            className={cn(
              'flex h-8 min-w-10 items-center justify-center rounded-md border px-2.5 font-mono font-semibold text-sm transition-colors',
              selected
                ? 'border-accent bg-accent text-accent-foreground'
                : 'border-border-strong hover:border-accent',
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  </Field>
);

type GroupStageConfigFieldsProps = {
  control: Control<CreateTournamentFormValues>;
  errors: FieldErrors<CreateTournamentFormValues>;
  maxTeamsValue: string;
  setValue: UseFormSetValue<CreateTournamentFormValues>;
};

export const GroupStageConfigFields = ({
  control,
  errors,
  maxTeamsValue,
  setValue,
}: GroupStageConfigFieldsProps) => {
  const groupStageConfig = useWatch({ control, name: 'groupStageConfig' });
  const groupStageErrors = errors.groupStageConfig;

  const groupSize =
    Number(groupStageConfig?.groupSize) || GROUP_SIZE_OPTIONS[1];
  const qualifiersPerGroup = Number(groupStageConfig?.qualifiersPerGroup) || 0;

  // Quantidade de grupos não faz parte do payload (o backend só recebe
  // groupSize/qualifiersPerGroup) — é só o controle que, junto com "times
  // por grupo", determina maxTeams (ver efeito abaixo).
  const [groupsCount, setGroupsCount] = useState(() => {
    const maxTeams = Number(maxTeamsValue);
    return maxTeams > 0 && maxTeams % groupSize === 0
      ? maxTeams / groupSize
      : GROUPS_COUNT_OPTIONS[1];
  });

  useEffect(() => {
    setValue('maxTeams', String(groupSize * groupsCount));
  }, [groupSize, groupsCount, setValue]);

  const maxTeams = groupSize * groupsCount;
  const classifiedCount = groupsCount * qualifiersPerGroup;
  const bracketSize = nextPowerOfTwo(classifiedCount);
  const byeCount = bracketSize - classifiedCount;
  const hasQualifiers = qualifiersPerGroup > 0;
  const isValid =
    hasQualifiers &&
    isValidGroupStageSetup(maxTeams, { groupSize, qualifiersPerGroup });

  const qualifiersOptions = Array.from(
    { length: groupSize },
    (_, index) => index + 1,
  );

  return (
    <div className={'flex flex-col gap-3 rounded-xl border border-border p-3'}>
      <div className={'grid grid-cols-1 gap-3 sm:grid-cols-2'}>
        <ChipPicker
          label={'Times por grupo'}
          htmlId={'group-stage-group-size'}
          options={GROUP_SIZE_OPTIONS}
          value={groupSize}
          onChange={(value) =>
            setValue('groupStageConfig.groupSize', String(value))
          }
        />

        <ChipPicker
          label={'Quantidade de grupos'}
          htmlId={'group-stage-groups-count'}
          options={GROUPS_COUNT_OPTIONS}
          value={groupsCount}
          onChange={setGroupsCount}
        />
      </div>

      <Field data-invalid={!!groupStageErrors?.qualifiersPerGroup}>
        <FieldLabel htmlFor={'group-stage-qualifiers'}>
          {'Classificados por grupo'}
        </FieldLabel>
        <div
          id={'group-stage-qualifiers'}
          className={'flex flex-wrap items-center gap-2'}
        >
          {qualifiersOptions.map((option) => {
            const selected = option === qualifiersPerGroup;
            return (
              <button
                key={option}
                type={'button'}
                aria-pressed={selected}
                onClick={() =>
                  setValue(
                    'groupStageConfig.qualifiersPerGroup',
                    String(option),
                  )
                }
                className={cn(
                  'flex h-8 min-w-10 items-center justify-center rounded-md border px-2.5 font-mono font-semibold text-sm transition-colors',
                  selected
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-border-strong hover:border-accent',
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
        <FieldError
          errors={
            groupStageErrors?.qualifiersPerGroup
              ? [groupStageErrors.qualifiersPerGroup]
              : undefined
          }
        />
      </Field>

      <div
        className={
          'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'
        }
      >
        <div className={'flex items-center gap-2'}>
          <Controller
            name={'groupStageConfig.doubleRound'}
            control={control}
            render={({ field }) => (
              <Switch
                id={'group-stage-double-round'}
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <FieldLabel
            htmlFor={'group-stage-double-round'}
            className={'font-normal'}
          >
            {'Ida e volta dentro do grupo'}
          </FieldLabel>
        </div>

        <div className={'flex items-center gap-2'}>
          <Controller
            name={'groupStageConfig.keepOwnedTeamsInSameGroup'}
            control={control}
            render={({ field }) => (
              <Switch
                id={'group-stage-keep-owned-teams'}
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <FieldLabel
            htmlFor={'group-stage-keep-owned-teams'}
            className={'font-normal'}
          >
            {'Manter times dos participantes no mesmo grupo'}
          </FieldLabel>
        </div>
      </div>

      {hasQualifiers && (
        <div
          className={cn(
            'flex items-center gap-1.5 font-mono text-xs',
            isValid ? 'text-accent-hover' : 'text-destructive',
          )}
        >
          {isValid ? (
            <CircleCheckIcon className={'size-3.5 shrink-0'} />
          ) : (
            <CircleAlertIcon className={'size-3.5 shrink-0'} />
          )}
          {isValid
            ? `${maxTeams} times — ${groupsCount} grupo${groupsCount === 1 ? '' : 's'} de ${groupSize} — ${classifiedCount} classificados${byeCount > 0 ? ` (${byeCount} de bye direto pro mata-mata)` : ''}.`
            : 'Combinação inválida: o total de classificados precisa ser pelo menos 2.'}
        </div>
      )}
    </div>
  );
};
