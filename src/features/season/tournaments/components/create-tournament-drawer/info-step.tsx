import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Field, FieldError, FieldLabel, Input } from '@/components';
import type { CreateTournamentFormValues } from '../../types';

type InfoStepProps = {
  register: UseFormRegister<CreateTournamentFormValues>;
  errors: FieldErrors<CreateTournamentFormValues>;
};

export const InfoStep = ({ register, errors }: InfoStepProps) => (
  <Field data-invalid={!!errors.name}>
    <FieldLabel htmlFor={'tournament-name'}>Nome do torneio</FieldLabel>
    <Input
      id={'tournament-name'}
      type={'text'}
      placeholder={'ex.: Copa Andreaskruisen 2026'}
      aria-invalid={!!errors.name}
      {...register('name')}
    />
    <FieldError errors={errors.name ? [errors.name] : undefined} />
  </Field>
);
