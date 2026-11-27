import { PlusIcon } from 'lucide-react';
import type { Control } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { Button, type SelectOption } from '@/components/ui';
import type { RosterPlayer } from '@/features/season/squads';
import type { CreateNegotiationFormValues } from '../types';
import { NegotiationClauseRow } from './negotiation-clause-row';

type NegotiationClauseBuilderProps = {
  control: Control<CreateNegotiationFormValues>;
  outgoingPlayers: RosterPlayer[];
  incomingPlayers: RosterPlayer[];
};

export const NegotiationClauseBuilder = ({
  control,
  outgoingPlayers,
  incomingPlayers,
}: NegotiationClauseBuilderProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'clauses',
  });

  const playerOptions: SelectOption[] = [
    ...outgoingPlayers,
    ...incomingPlayers,
  ].map((player) => ({ value: player.id, label: player.name }));

  const canAddClause = playerOptions.length > 0;

  return (
    <div className={'flex flex-col gap-3'}>
      <div className={'flex items-center justify-between'}>
        <span className={'font-display font-semibold text-sm'}>
          {'Cláusulas (opcional)'}
        </span>
        <Button
          type={'button'}
          variant={'outline'}
          size={'sm'}
          disabled={!canAddClause}
          onClick={() =>
            append({
              type: 'PREFERENCIA_DE_COMPRA',
              playerId: playerOptions[0]?.value ?? '',
              terms: '',
            })
          }
        >
          <PlusIcon />
          {'Adicionar cláusula'}
        </Button>
      </div>

      {!canAddClause && (
        <p className={'text-muted-foreground text-xs'}>
          {'Escolha ao menos um jogador para poder adicionar cláusulas.'}
        </p>
      )}

      {fields.map((field, index) => (
        <NegotiationClauseRow
          key={field.id}
          control={control}
          index={index}
          playerOptions={playerOptions}
          onRemove={() => remove(index)}
        />
      ))}
    </div>
  );
};
