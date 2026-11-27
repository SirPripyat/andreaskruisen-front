import type { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { Controller, useWatch } from 'react-hook-form';
import { Field, FieldLabel } from '@/components';
import type { CreateTournamentFormValues } from '../../types';
import { TournamentFormatPicker } from '../tournament-format-picker';
import { GroupStageConfigFields } from './group-stage-config-fields';

const GROUP_STAGE_CONFIG_DEFAULTS = {
  groupSize: '4',
  qualifiersPerGroup: '2',
  doubleRound: false,
  keepOwnedTeamsInSameGroup: true,
};

type FormatStepProps = {
  control: Control<CreateTournamentFormValues>;
  errors: FieldErrors<CreateTournamentFormValues>;
  maxTeamsValue: string;
  onMaxTeamsChange: (value: string) => void;
  setValue: UseFormSetValue<CreateTournamentFormValues>;
};

export const FormatStep = ({
  control,
  errors,
  maxTeamsValue,
  onMaxTeamsChange,
  setValue,
}: FormatStepProps) => {
  const format = useWatch({ control, name: 'format' });

  return (
    <>
      <Field data-invalid={!!errors.format || !!errors.maxTeams}>
        <FieldLabel>Formato & vagas</FieldLabel>
        <Controller
          name={'format'}
          control={control}
          render={({ field }) => (
            <TournamentFormatPicker
              format={field.value}
              onFormatChange={(value) => {
                field.onChange(value);
                onMaxTeamsChange('');
                setValue(
                  'groupStageConfig',
                  value === 'GROUP_STAGE_KNOCKOUT'
                    ? GROUP_STAGE_CONFIG_DEFAULTS
                    : undefined,
                );
              }}
              maxTeams={maxTeamsValue}
              onMaxTeamsChange={onMaxTeamsChange}
              error={errors.maxTeams?.message}
            />
          )}
        />
      </Field>

      {format === 'GROUP_STAGE_KNOCKOUT' && (
        <GroupStageConfigFields
          control={control}
          errors={errors}
          maxTeamsValue={maxTeamsValue}
          setValue={setValue}
        />
      )}
    </>
  );
};
