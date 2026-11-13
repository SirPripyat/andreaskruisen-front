import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Field, FieldLabel } from '@/components';
import type { CreateTournamentFormValues } from '../../types';
import { TournamentFormatPicker } from '../tournament-format-picker';

type FormatStepProps = {
  control: Control<CreateTournamentFormValues>;
  errors: FieldErrors<CreateTournamentFormValues>;
  maxTeamsValue: string;
  onMaxTeamsChange: (value: string) => void;
};

export const FormatStep = ({
  control,
  errors,
  maxTeamsValue,
  onMaxTeamsChange,
}: FormatStepProps) => (
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
          }}
          maxTeams={maxTeamsValue}
          onMaxTeamsChange={onMaxTeamsChange}
          error={errors.maxTeams?.message}
        />
      )}
    />
  </Field>
);
