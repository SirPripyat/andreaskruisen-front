import { CalendarRangeIcon, ChevronsUpDownIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  Skeleton,
} from '@/components/ui';
import { cn } from '@/lib';
import { useSeasons, useSelectedSeason, useSelectSeason } from '../hooks';

export const SeasonSwitcher = ({ className }: { className?: string }) => {
  const { data, isPending: isSeasonsPending } = useSeasons();
  const { selectedSeason, isPending: isSelectedPending } = useSelectedSeason();
  const { mutate: selectSeason } = useSelectSeason();

  const selectSeasonId = (seasonId: string) => selectSeason(seasonId);

  const isPending = isSeasonsPending || isSelectedPending;
  const seasons = data ?? [];

  if (isPending) return <Skeleton className={cn('h-8 w-40', className)} />;

  if (!selectedSeason || seasons.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'inline-flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm font-medium hover:bg-muted sm:px-3',
          className,
        )}
      >
        <CalendarRangeIcon className="size-4 text-muted-foreground" />
        <span className="hidden sm:inline">{selectedSeason.name}</span>
        <ChevronsUpDownIcon className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuRadioGroup
          value={selectedSeason.id}
          onValueChange={selectSeasonId}
        >
          {seasons.map((season) => (
            <DropdownMenuRadioItem key={season.id} value={season.id}>
              {season.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
