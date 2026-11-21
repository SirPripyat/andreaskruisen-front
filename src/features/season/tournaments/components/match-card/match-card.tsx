import type { MatchListItem } from '../../types';
import { MatchCardColumn } from './match-card-column';
import { MatchCardRow } from './match-card-row';
import { getMatchStatus } from './match-status';

type MatchCardProps = {
  match: MatchListItem;
  variant?: 'card' | 'row';
  isFinal?: boolean;
  onRegisterGoals?: (matchId: string) => void;
  cardRef?: (el: HTMLDivElement | null) => void;
  cardClassName?: string;
  selected?: boolean;
  onToggleSelect?: (matchId: string) => void;
};

export const MatchCard = ({
  match,
  variant = 'card',
  isFinal,
  onRegisterGoals,
  cardRef,
  cardClassName,
  selected,
  onToggleSelect,
}: MatchCardProps) => {
  const status = getMatchStatus(match);

  if (variant === 'row') {
    return (
      <MatchCardRow
        cardRef={cardRef}
        cardClassName={cardClassName}
        match={match}
        status={status}
        onRegisterGoals={onRegisterGoals}
        selected={selected}
        onToggleSelect={onToggleSelect}
      />
    );
  }

  return (
    <MatchCardColumn
      cardRef={cardRef}
      cardClassName={cardClassName}
      match={match}
      status={status}
      onRegisterGoals={onRegisterGoals}
      isFinal={isFinal}
    />
  );
};
