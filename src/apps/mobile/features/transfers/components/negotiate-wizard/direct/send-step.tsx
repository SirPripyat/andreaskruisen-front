import { CheckIcon, SendIcon } from 'lucide-react';
import { Button } from '@/components/ui';
import type { useDirectNegotiationWizard } from './use-direct-negotiation-wizard';

type SendStepProps = {
  wizard: ReturnType<typeof useDirectNegotiationWizard>;
};

export const SendStep = ({ wizard }: SendStepProps) => {
  const {
    targetTeam,
    targetSquad,
    outgoingPlayers,
    incomingPlayers,
    coinAmount,
    clauses,
    isSending,
    isSent,
    onSubmit,
  } = wizard;

  const opponentName = targetTeam?.name ?? targetSquad?.team.name ?? '—';
  const clauseCount = clauses.length;
  const outgoingPlayerNames =
    outgoingPlayers.map((player) => player.name).join(' e ') ||
    'Nenhum jogador';
  const incomingPlayerNames =
    incomingPlayers.map((player) => player.name).join(' e ') ||
    'Nenhum jogador';

  const coinLabel =
    (coinAmount ?? 0) > 0
      ? `Você paga ${coinAmount} moedas`
      : (coinAmount ?? 0) < 0
        ? `Você recebe ${Math.abs(coinAmount ?? 0)} moedas`
        : 'Sem valor em moedas';

  return (
    <div className={'flex flex-col gap-4'}>
      <p className={'text-muted-foreground text-xs'}>
        {
          'Confirme os detalhes antes de enviar — depois disso fica pendente até o outro técnico decidir.'
        }
      </p>

      <div className={'flex flex-col gap-0 rounded-xl border'}>
        {[
          ['Adversário', opponentName],
          ['Você entrega', outgoingPlayerNames],
          ['Você recebe', incomingPlayerNames],
          ['Moedas', coinLabel],
          [
            'Cláusulas',
            clauseCount > 0 ? `${clauseCount} adicionada(s)` : 'Nenhuma',
          ],
        ].map(([label, value]) => (
          <div
            key={label}
            className={
              'flex items-center justify-between gap-2 border-b px-3 py-2.5 text-sm last:border-b-0'
            }
          >
            <span className={'text-muted-foreground'}>{label}</span>
            <span className={'font-medium'}>{value}</span>
          </div>
        ))}
      </div>

      <p
        className={
          'rounded-lg border bg-warning-surface px-3 py-2 text-warning text-xs leading-relaxed'
        }
      >
        {`Fica pendente até ${opponentName} aceitar — você pode editar ou cancelar enquanto isso.`}
      </p>

      <Button
        type={'button'}
        disabled={isSending || isSent}
        onClick={onSubmit}
        className={'w-full'}
      >
        {isSent ? (
          <>
            <CheckIcon />
            {'Proposta enviada'}
          </>
        ) : (
          <>
            <SendIcon />
            {isSending ? 'Enviando...' : 'Enviar proposta'}
          </>
        )}
      </Button>
    </div>
  );
};
