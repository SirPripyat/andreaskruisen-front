import type { MatchListItem } from '../../api';
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
};

export const MatchCard = ({
  match,
  variant = 'card',
  isFinal,
  onRegisterGoals,
  cardRef,
  cardClassName,
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
