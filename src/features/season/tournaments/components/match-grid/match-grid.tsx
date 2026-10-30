import type { MatchListItem } from '../../api';
import { GroupCard } from './group-card';
import { MatchRoundTitle } from './match-round-title';

type MatchGridProps = {
  matches: MatchListItem[];
  roundLabel?: string;
  isCurrentRound?: boolean;
  onRegisterGoals?: (matchId: string) => void;
};

const groupByLabel = (matches: MatchListItem[]) => {
  const groups = new Map<string | null, MatchListItem[]>();

  for (const match of matches) {
    const list = groups.get(match.groupLabel) ?? [];
    list.push(match);
    groups.set(match.groupLabel, list);
  }

  return Array.from(groups.entries()).sort(([a], [b]) => {
    if (a === b) return 0;
    if (a === null) return 1;
    if (b === null) return -1;
    return a.localeCompare(b);
  });
};

export const MatchGrid = ({
  matches,
  roundLabel,
  isCurrentRound,
  onRegisterGoals,
}: MatchGridProps) => {
  return (
    <div className={'flex flex-col gap-1.5'}>
      <MatchRoundTitle
        roundLabel={roundLabel}
        isCurrentRound={isCurrentRound}
      />

      <div
        className={
          'grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-4'
        }
      >
        {groupByLabel(matches).map(([groupLabel, groupMatches], index) => (
          <GroupCard
            key={groupLabel ?? 'single'}
            index={index}
            groupMatches={groupMatches}
            onRegisterGoals={onRegisterGoals}
            groupLabel={groupLabel}
          />
        ))}
      </div>
    </div>
  );
};
