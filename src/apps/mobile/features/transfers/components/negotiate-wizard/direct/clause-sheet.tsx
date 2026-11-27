import { useState } from 'react';
import {
  Button,
  Field,
  FieldLabel,
  Input,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui';
import {
  CLAUSE_TYPE_LABELS,
  NEGOTIATION_CLAUSE_TYPES,
  type NegotiationClauseFormValues,
} from '@/features/season/negotiations';
import type { RosterPlayer } from '@/features/season/squads';
import { cn } from '@/lib';

export type ClauseDraft = NegotiationClauseFormValues;

const DEFAULT_MATCHES_COUNT = 3;
const DEFAULT_AMOUNT = 200;

type ClauseSheetProps = {
  players: RosterPlayer[];
  initial?: ClauseDraft;
  onCancel: () => void;
  onConfirm: (draft: ClauseDraft) => void;
};

export const ClauseSheet = ({
  players,
  initial,
  onCancel,
  onConfirm,
}: ClauseSheetProps) => {
  const [draft, setDraft] = useState<ClauseDraft>(
    initial ?? {
      type: 'LEI_DO_EX',
      playerId: players[0]?.id ?? '',
      matchesCount: DEFAULT_MATCHES_COUNT,
      amount: DEFAULT_AMOUNT,
      terms: '',
    },
  );

  return (
    <Sheet open onOpenChange={(open) => !open && onCancel()}>
      <SheetContent
        side={'bottom'}
        showCloseButton={false}
        className={'gap-4 overflow-y-auto'}
      >
        <SheetHeader>
          <SheetTitle>
            {initial ? 'Editar cláusula' : 'Nova cláusula'}
          </SheetTitle>
        </SheetHeader>

        <div className={'flex flex-col gap-4 px-4'}>
          <Field>
            <FieldLabel>{'Tipo'}</FieldLabel>
            <div className={'grid grid-cols-2 gap-1.5'}>
              {NEGOTIATION_CLAUSE_TYPES.map((type) => (
                <button
                  key={type}
                  type={'button'}
                  aria-pressed={draft.type === type}
                  onClick={() => setDraft((current) => ({ ...current, type }))}
                  className={cn(
                    'rounded-lg border px-2.5 py-2 text-left font-medium text-xs',
                    draft.type === type
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'text-muted-foreground',
                  )}
                >
                  {CLAUSE_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </Field>

          <Field>
            <FieldLabel>{'Jogador'}</FieldLabel>
            <div className={'flex gap-1.5'}>
              {players.map((player) => (
                <button
                  key={player.id}
                  type={'button'}
                  aria-pressed={draft.playerId === player.id}
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      playerId: player.id,
                    }))
                  }
                  className={cn(
                    'rounded-full border px-3 py-1.5 font-medium text-xs',
                    draft.playerId === player.id
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground',
                  )}
                >
                  {player.name}
                </button>
              ))}
            </div>
          </Field>

          {draft.type === 'LEI_DO_EX' && (
            <Field>
              <FieldLabel>{'Jogos de carência'}</FieldLabel>
              <div
                className={
                  'flex w-fit items-center overflow-hidden rounded-lg border'
                }
              >
                <Button
                  type={'button'}
                  variant={'ghost'}
                  size={'icon-sm'}
                  className={'rounded-none'}
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      matchesCount: Math.max(
                        1,
                        (current.matchesCount ?? 1) - 1,
                      ),
                    }))
                  }
                >
                  {'–'}
                </Button>
                <Input
                  type={'number'}
                  value={draft.matchesCount ?? ''}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      matchesCount:
                        event.target.value === ''
                          ? undefined
                          : Number(event.target.value),
                    }))
                  }
                  className={
                    'h-8 w-16 rounded-none border-x text-center font-mono'
                  }
                />
                <Button
                  type={'button'}
                  variant={'ghost'}
                  size={'icon-sm'}
                  className={'rounded-none'}
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      matchesCount: Math.min(
                        20,
                        (current.matchesCount ?? 0) + 1,
                      ),
                    }))
                  }
                >
                  {'+'}
                </Button>
              </div>
            </Field>
          )}

          {(draft.type === 'DIREITO_DE_RECOMPRA' ||
            draft.type === 'BONUS_POR_TITULO') && (
            <Field>
              <FieldLabel>{'Valor em moedas'}</FieldLabel>
              <Input
                type={'number'}
                min={1}
                value={draft.amount ?? ''}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    amount:
                      event.target.value === ''
                        ? undefined
                        : Number(event.target.value),
                  }))
                }
              />
            </Field>
          )}

          {draft.type === 'PREFERENCIA_DE_COMPRA' && (
            <Field>
              <FieldLabel>{'Termos (opcional)'}</FieldLabel>
              <textarea
                rows={2}
                placeholder={'Ex.: direito de igualar qualquer proposta futura'}
                value={draft.terms ?? ''}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    terms: event.target.value,
                  }))
                }
                className={
                  'w-full rounded-lg border bg-transparent px-2.5 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'
                }
              />
            </Field>
          )}
        </div>

        <SheetFooter className={'flex-row'}>
          <Button
            type={'button'}
            variant={'outline'}
            className={'flex-1'}
            onClick={onCancel}
          >
            {'Cancelar'}
          </Button>
          <Button
            type={'button'}
            className={'flex-1'}
            disabled={!draft.playerId}
            onClick={() => onConfirm(draft)}
          >
            {initial ? 'Salvar' : 'Adicionar'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
