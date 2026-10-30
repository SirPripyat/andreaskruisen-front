import { cn } from '@/lib';
import type { MatchListItem } from '../../api';
import { MatchCard } from '../match-card';

const GROUP_COLORS = [
  { dot: 'bg-accent', text: 'text-accent' },
  { dot: 'bg-info', text: 'text-info' },
  { dot: 'bg-success', text: 'text-success' },
  { dot: 'bg-value', text: 'text-value' },
];

type GroupCardProps = {
  index: number;
  groupLabel: string | null;
  groupMatches: MatchListItem[];
  onRegisterGoals?: (matchId: string) => void;
};

export const GroupCard = ({
  index,
  groupLabel,
  groupMatches,
  onRegisterGoals,
}: GroupCardProps) => {
  const { dot, text } = GROUP_COLORS[index % GROUP_COLORS.length];

  return (
    <div className={'flex flex-col gap-1.5 rounded-xl border bg-card p-3'}>
      {groupLabel && (
        <div className={'flex items-center gap-1.5 border-b pb-1.5'}>
          <span className={cn('size-1.5 shrink-0 rounded-full', dot)} />
          <span
            className={cn('font-display font-bold text-sm uppercase', text)}
          >
            Grupo {groupLabel}
          </span>
        </div>
      )}

      <div className={'flex flex-col gap-1.5'}>
        {groupMatches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            variant="row"
            onRegisterGoals={onRegisterGoals}
          />
        ))}
      </div>
    </div>
  );
};
