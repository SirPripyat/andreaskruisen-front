import { Skeleton } from '@/components';

const PAGE_SIZE = 6;

const SKELETON_ROW_KEYS = Array.from(
  { length: PAGE_SIZE },
  (_, index) => `skeleton-squad-team-${index}`,
);

export const SeasonTeamPickerLoading = () => (
  <>
    {SKELETON_ROW_KEYS.map((item) => (
      <div
        key={item}
        className={
          'flex items-center gap-2 rounded-lg border bg-background p-2'
        }
      >
        <Skeleton className={'size-6 shrink-0 rounded-full'} />
        <Skeleton className={'h-4 w-full max-w-28'} />
      </div>
    ))}
  </>
);
