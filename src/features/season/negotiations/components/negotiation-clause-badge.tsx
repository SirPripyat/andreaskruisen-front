import { TicketPercentIcon } from 'lucide-react';
import type { NegotiationClause } from '../types';
import { CLAUSE_TYPE_LABELS } from '../utils/negotiation-labels';

const describeClause = (clause: NegotiationClause) => {
  const label = CLAUSE_TYPE_LABELS[clause.type];

  if (clause.type === 'LEI_DO_EX')
    return `${label} · ${clause.matchesCount} jogos · ${clause.player.name}`;

  if (
    clause.type === 'DIREITO_DE_RECOMPRA' ||
    clause.type === 'BONUS_POR_TITULO'
  )
    return `${label} · ${clause.amount} coins · ${clause.player.name}`;

  return `${label} · ${clause.player.name}`;
};

export const NegotiationClauseBadge = ({
  clause,
}: {
  clause: NegotiationClause;
}) => {
  return (
    <span
      className={
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-muted-foreground text-xs'
      }
    >
      <TicketPercentIcon className={'size-3 text-info'} />
      {describeClause(clause)}
    </span>
  );
};
