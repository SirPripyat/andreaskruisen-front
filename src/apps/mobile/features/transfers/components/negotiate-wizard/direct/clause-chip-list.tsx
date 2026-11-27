import { PlusIcon, TicketPercentIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import type { Control } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui';
import {
  CLAUSE_TYPE_LABELS,
  type CreateNegotiationFormValues,
  type NegotiationClauseFormValues,
} from '@/features/season/negotiations';
import type { RosterPlayer } from '@/features/season/squads';
import { type ClauseDraft, ClauseSheet } from './clause-sheet';

type ClauseChipListProps = {
  control: Control<CreateNegotiationFormValues>;
  outgoingPlayers: RosterPlayer[];
  incomingPlayers: RosterPlayer[];
};

const describeClause = (
  clause: NegotiationClauseFormValues,
  playerName: string,
) => {
  const label = CLAUSE_TYPE_LABELS[clause.type];

  if (clause.type === 'LEI_DO_EX')
    return `${label} · ${clause.matchesCount} jogos · ${playerName}`;

  if (
    clause.type === 'DIREITO_DE_RECOMPRA' ||
    clause.type === 'BONUS_POR_TITULO'
  )
    return `${label} · ${clause.amount} moedas · ${playerName}`;

  return `${label} · ${playerName}`;
};

export const ClauseChipList = ({
  control,
  outgoingPlayers,
  incomingPlayers,
}: ClauseChipListProps) => {
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: 'clauses',
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const players: RosterPlayer[] = [...outgoingPlayers, ...incomingPlayers];
  const canAddClause = players.length > 0;

  const findPlayerName = (playerId: string) =>
    players.find((player) => player.id === playerId)?.name ?? '—';

  const editingClause = editingIndex !== null ? fields[editingIndex] : null;

  return (
    <div className={'flex flex-col gap-2 border-t border-dashed pt-3'}>
      <div className={'flex items-center justify-between'}>
        <span className={'font-semibold text-sm'}>
          {'Cláusulas (opcional)'}
        </span>
        <Button
          type={'button'}
          variant={'outline'}
          size={'sm'}
          disabled={!canAddClause}
          onClick={() => setIsCreating(true)}
        >
          <PlusIcon />
          {'Adicionar'}
        </Button>
      </div>

      {!canAddClause && (
        <p className={'text-muted-foreground text-xs'}>
          {'Escolha ao menos um jogador para poder adicionar cláusulas.'}
        </p>
      )}

      {fields.length === 0 ? (
        canAddClause && (
          <p className={'text-muted-foreground text-xs'}>
            {'Nenhuma cláusula adicionada.'}
          </p>
        )
      ) : (
        <div className={'flex flex-wrap gap-2'}>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className={
                'flex items-center gap-1 rounded-full border py-1 pl-1 pr-1.5 text-muted-foreground text-xs'
              }
            >
              <button
                type={'button'}
                onClick={() => setEditingIndex(index)}
                className={'flex items-center gap-1.5 px-1.5'}
              >
                <TicketPercentIcon className={'size-3 text-info'} />
                {describeClause(field, findPlayerName(field.playerId))}
              </button>
              <button
                type={'button'}
                aria-label={'Remover cláusula'}
                onClick={() => remove(index)}
                className={'rounded-full p-0.5 hover:text-destructive'}
              >
                <XIcon className={'size-3'} />
              </button>
            </div>
          ))}
        </div>
      )}

      {(isCreating || editingClause) && (
        <ClauseSheet
          players={players}
          initial={editingClause ?? undefined}
          onCancel={() => {
            setIsCreating(false);
            setEditingIndex(null);
          }}
          onConfirm={(draft: ClauseDraft) => {
            if (editingIndex !== null) update(editingIndex, draft);
            else append(draft);
            setIsCreating(false);
            setEditingIndex(null);
          }}
        />
      )}
    </div>
  );
};
