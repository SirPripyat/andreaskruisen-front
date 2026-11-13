import { AlertTriangleIcon } from 'lucide-react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Field, FieldError, FieldLabel, Input } from '@/components/ui';
import type { MatchDetail } from '../../types';
import type { FormValues } from './goals-form-schema';

type PenaltiesFieldProps = {
  match: MatchDetail;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
};

export const PenaltiesField = ({
  match,
  register,
  errors,
}: PenaltiesFieldProps) => (
  <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed bg-muted/40 p-4">
    <p className="flex items-center gap-1.5 text-center font-medium text-sm">
      <AlertTriangleIcon className="size-4 shrink-0 text-warning" />
      Empate na eliminatória: informe o resultado dos pênaltis
    </p>

    <div className="flex items-center gap-3">
      <Field className="w-24">
        <FieldLabel
          htmlFor="penalties-home-score"
          className="justify-center truncate text-center text-muted-foreground text-xs"
        >
          {match.homeTeam.name}
        </FieldLabel>
        <Input
          id="penalties-home-score"
          type="number"
          min={0}
          inputMode="numeric"
          aria-invalid={!!errors.penalties}
          className="text-center font-mono tabular-nums"
          {...register('penalties.homeScore')}
        />
      </Field>

      <span className="pt-5 text-muted-foreground">x</span>

      <Field className="w-24">
        <FieldLabel
          htmlFor="penalties-away-score"
          className="justify-center truncate text-center text-muted-foreground text-xs"
        >
          {match.awayTeam.name}
        </FieldLabel>
        <Input
          id="penalties-away-score"
          type="number"
          min={0}
          inputMode="numeric"
          aria-invalid={!!errors.penalties}
          className="text-center font-mono tabular-nums"
          {...register('penalties.awayScore')}
        />
      </Field>
    </div>

    <FieldError
      errors={[
        errors.penalties,
        errors.penalties?.homeScore,
        errors.penalties?.awayScore,
      ]}
    />
  </div>
);
