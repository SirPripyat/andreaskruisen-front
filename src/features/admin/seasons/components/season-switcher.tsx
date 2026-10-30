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
import { useSeasonSelection } from '../hooks';

export function SeasonSwitcher({ className }: { className?: string }) {
  const { seasons, selectedSeason, isPending, selectSeasonId } =
    useSeasonSelection();

  if (isPending) {
    return <Skeleton className={cn('h-8 w-40', className)} />;
  }

  if (!selectedSeason || seasons.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted',
          className,
        )}
      >
        <CalendarRangeIcon className="size-4 text-muted-foreground" />
        {selectedSeason.name}
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
}
