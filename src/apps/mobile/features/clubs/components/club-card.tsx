import { ChevronRightIcon } from 'lucide-react';
import { Link } from 'react-router';
import { OverallRatingBadge, TeamCell } from '@/components';
import { Progress } from '@/components/ui';
import type { ClubWithRatings } from '@/features/season/clubs';
import { getOverallRatingIndicatorClassName } from '@/lib';

type RatingKey =
  | 'averageAttackRating'
  | 'averageMidfieldRating'
  | 'averageDefenseRating';

const RATING_BARS: { key: RatingKey; label: string }[] = [
  { key: 'averageAttackRating', label: 'ATA' },
  { key: 'averageMidfieldRating', label: 'MEI' },
  { key: 'averageDefenseRating', label: 'DEF' },
];

type ClubCardProps = {
  club: ClubWithRatings;
};

export const ClubCard = ({ club }: ClubCardProps) => {
  return (
    <Link
      to={`/clubs/${club.id}`}
      className={'block rounded-xl border bg-card p-3 active:bg-accent/5'}
    >
      <div className={'flex items-center justify-between gap-2'}>
        <TeamCell
          crestUrl={club.crestUrl}
          name={club.name}
          size={'xl'}
          leagueName={club.league.name}
          formation={club.formation}
        />

        <div className={'flex shrink-0 items-center gap-1.5'}>
          <OverallRatingBadge rating={club.averageOverallRating} />
          <ChevronRightIcon className={'size-4 text-muted-foreground'} />
        </div>
      </div>

      <div className={'mt-3 grid grid-cols-3 gap-2 border-t pt-2'}>
        {RATING_BARS.map(({ key, label }) => {
          const value = club[key];

          return (
            <div key={key} className={'flex flex-col gap-1'}>
              <div
                className={
                  'flex items-center justify-between font-mono text-[10px] text-muted-foreground'
                }
              >
                <span>{label}</span>
                <span className={'tabular-nums'}>{value ?? '-'}</span>
              </div>
              <Progress
                value={value ?? 0}
                className={'h-1.5'}
                indicatorClassName={
                  value === null
                    ? 'bg-muted-foreground/30'
                    : getOverallRatingIndicatorClassName(value)
                }
              />
            </div>
          );
        })}
      </div>
    </Link>
  );
};
