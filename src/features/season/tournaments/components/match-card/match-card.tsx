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
  // Bye não tem placar pra registrar nem detalhe pra ver.
  const registerGoalsHandler = status.isBye ? undefined : onRegisterGoals;

  if (variant === 'row') {
    return (
      <MatchCardRow
        cardRef={cardRef}
        cardClassName={cardClassName}
        match={match}
        status={status}
        onRegisterGoals={registerGoalsHandler}
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
      onRegisterGoals={registerGoalsHandler}
      isFinal={isFinal}
    />
  );
};
