import { XIcon } from 'lucide-react';
import type { Control } from 'react-hook-form';
import { Controller, useWatch } from 'react-hook-form';
import {
  Button,
  Field,
  FieldLabel,
  Input,
  type SelectOption,
  SelectOptions,
  toSelectOptions,
} from '@/components/ui';
import type { CreateNegotiationFormValues } from '../types';
import { NEGOTIATION_CLAUSE_TYPES } from '../types';
import { CLAUSE_TYPE_LABELS } from '../utils/negotiation-labels';

const CLAUSE_TYPE_OPTIONS = toSelectOptions(
  { value: '', label: 'Selecione o tipo', disabled: true },
  [...NEGOTIATION_CLAUSE_TYPES],
  (type) => ({ value: type, label: CLAUSE_TYPE_LABELS[type] }),
);

type NegotiationClauseRowProps = {
  control: Control<CreateNegotiationFormValues>;
  index: number;
  playerOptions: SelectOption[];
  onRemove: () => void;
};

export const NegotiationClauseRow = ({
  control,
  index,
  playerOptions,
  onRemove,
}: NegotiationClauseRowProps) => {
  const type = useWatch({ control, name: `clauses.${index}.type` });

  return (
    <div className={'flex flex-col gap-2 rounded-lg border p-3'}>
      <div className={'flex items-start gap-2'}>
        <Field className={'flex-1'}>
          <FieldLabel>{'Jogador'}</FieldLabel>
          <Controller
            name={`clauses.${index}.playerId`}
            control={control}
            render={({ field }) => (
              <SelectOptions
                value={field.value}
                onValueChange={field.onChange}
                options={[
                  { value: '', label: 'Selecione o jogador', disabled: true },
                  ...playerOptions,
                ]}
              />
            )}
          />
        </Field>

        <Field className={'flex-1'}>
          <FieldLabel>{'Cláusula'}</FieldLabel>
          <Controller
            name={`clauses.${index}.type`}
            control={control}
            render={({ field }) => (
              <SelectOptions
                value={field.value}
                onValueChange={field.onChange}
                options={CLAUSE_TYPE_OPTIONS}
              />
            )}
          />
        </Field>

        <Button
          type={'button'}
          variant={'ghost'}
          size={'icon-sm'}
          className={'mt-6 shrink-0'}
          aria-label={'Remover cláusula'}
          onClick={onRemove}
        >
          <XIcon />
        </Button>
      </div>

      <div className={'flex items-start gap-2'}>
        {type === 'LEI_DO_EX' && (
          <Field className={'flex-1'}>
            <FieldLabel>{'Partidas'}</FieldLabel>
            <Controller
              name={`clauses.${index}.matchesCount`}
              control={control}
              render={({ field }) => (
                <Input
                  type={'number'}
                  min={1}
                  value={field.value ?? ''}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value === ''
                        ? undefined
                        : Number(event.target.value),
                    )
                  }
                />
              )}
            />
          </Field>
        )}

        {(type === 'DIREITO_DE_RECOMPRA' || type === 'BONUS_POR_TITULO') && (
          <Field className={'flex-1'}>
            <FieldLabel>{'Valor (coins)'}</FieldLabel>
            <Controller
              name={`clauses.${index}.amount`}
              control={control}
              render={({ field }) => (
                <Input
                  type={'number'}
                  min={1}
                  value={field.value ?? ''}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value === ''
                        ? undefined
                        : Number(event.target.value),
                    )
                  }
                />
              )}
            />
          </Field>
        )}

        <Field className={'flex-1'}>
          <FieldLabel>{'Termos (opcional)'}</FieldLabel>
          <Controller
            name={`clauses.${index}.terms`}
            control={control}
            render={({ field }) => (
              <Input
                placeholder={'Ex.: válido até o fim da temporada'}
                value={field.value ?? ''}
                onChange={field.onChange}
              />
            )}
          />
        </Field>
      </div>
    </div>
  );
};
