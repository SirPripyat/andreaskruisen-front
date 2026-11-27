import { SlidersHorizontalIcon } from 'lucide-react';
import { useState } from 'react';
import { Button, SelectOptions } from '@/components';
import {
  Combobox,
  ComboboxClear,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxTrigger,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';
import { type League, LeagueCell } from '@/features/admin/leagues';
import { ALL_LEAGUES, type ClubSortField } from '@/features/season/clubs';
import { cn, type SortOrder } from '@/lib';

const isSameLeague = (a: League, b: League) => a.id === b.id;

type SortValue = 'overall-desc' | 'overall-asc' | 'name-asc';

type SortOption = {
  value: SortValue;
  label: string;
  sortBy: ClubSortField;
  sortOrder: SortOrder;
};

const SORT_OPTIONS: SortOption[] = [
  {
    value: 'overall-desc',
    label: 'Overall (maior)',
    sortBy: 'averageOverallRating',
    sortOrder: 'desc',
  },
  {
    value: 'overall-asc',
    label: 'Overall (menor)',
    sortBy: 'averageOverallRating',
    sortOrder: 'asc',
  },
  { value: 'name-asc', label: 'Nome (A-Z)', sortBy: 'name', sortOrder: 'asc' },
];

const toSortValue = (sortBy: ClubSortField, sortOrder: SortOrder): SortValue =>
  SORT_OPTIONS.find(
    (option) => option.sortBy === sortBy && option.sortOrder === sortOrder,
  )?.value ?? 'overall-desc';

export type ClubsFilterValues = {
  leagueId: string;
  sortBy: ClubSortField;
  sortOrder: SortOrder;
};

type ClubsFilterSheetProps = {
  leagueId: string;
  leagues: League[];
  sortBy: ClubSortField;
  sortOrder: SortOrder;
  activeFilterCount: number;
  onApply: (values: ClubsFilterValues) => void;
  onClear: () => void;
};

export const ClubsFilterSheet = ({
  leagueId,
  leagues,
  sortBy,
  sortOrder,
  activeFilterCount,
  onApply,
  onClear,
}: ClubsFilterSheetProps) => {
  const [open, setOpen] = useState(false);
  const [draftLeague, setDraftLeague] = useState<League | null>(
    leagues.find((league) => league.id === leagueId) ?? null,
  );
  const [draftSort, setDraftSort] = useState<SortValue>(
    toSortValue(sortBy, sortOrder),
  );

  const onOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDraftLeague(leagues.find((league) => league.id === leagueId) ?? null);
      setDraftSort(toSortValue(sortBy, sortOrder));
    }
    setOpen(nextOpen);
  };

  const handleApply = () => {
    const sort =
      SORT_OPTIONS.find((option) => option.value === draftSort) ??
      SORT_OPTIONS[0];

    onApply({
      leagueId: draftLeague?.id ?? ALL_LEAGUES,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
    });
    setOpen(false);
  };

  const handleClear = () => {
    setDraftLeague(null);
    setDraftSort('overall-desc');
    onClear();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger
        render={
          <Button
            variant={activeFilterCount > 0 ? 'default' : 'outline'}
            size={'icon-lg'}
            aria-label={'Filtros'}
            className={'relative shrink-0'}
          >
            <SlidersHorizontalIcon />
            {activeFilterCount > 0 && (
              <span
                className={
                  'absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-accent font-mono text-[10px] text-accent-foreground'
                }
              >
                {activeFilterCount}
              </span>
            )}
          </Button>
        }
      />

      <SheetContent side={'bottom'} className={'h-[60%] gap-4'}>
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>

        <div className={'flex flex-1 flex-col gap-5 overflow-y-auto px-4'}>
          <div className={'flex flex-col gap-2'}>
            <span className={'font-medium text-sm'}>Liga</span>
            <Combobox<League>
              items={leagues}
              value={draftLeague}
              onValueChange={setDraftLeague}
              isItemEqualToValue={isSameLeague}
              itemToStringLabel={(league) => league.name}
            >
              <ComboboxInputGroup>
                {draftLeague?.logoUrl && (
                  <img
                    src={draftLeague.logoUrl}
                    alt={''}
                    className={
                      'absolute top-1/2 left-1.5 size-4 shrink-0 -translate-y-1/2 object-contain'
                    }
                    onError={(event) => {
                      event.currentTarget.style.visibility = 'hidden';
                    }}
                  />
                )}
                <ComboboxInput
                  placeholder={'Todas as ligas'}
                  className={cn(draftLeague?.logoUrl && 'pl-7')}
                />
                <ComboboxClear aria-label={'Limpar seleção'} />
                <ComboboxTrigger />
              </ComboboxInputGroup>

              <ComboboxPopup>
                <ComboboxEmpty>Nenhuma liga encontrada.</ComboboxEmpty>
                <ComboboxList>
                  {(league: League) => (
                    <ComboboxItem key={league.id} value={league}>
                      <LeagueCell logoUrl={league.logoUrl} name={league.name} />
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxPopup>
            </Combobox>
          </div>

          <div className={'flex flex-col gap-2'}>
            <span className={'font-medium text-sm'}>Ordenar por</span>
            <SelectOptions
              value={draftSort}
              onValueChange={(value) => setDraftSort(value as SortValue)}
              options={SORT_OPTIONS.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
              triggerClassName={'w-full'}
            />
          </div>
        </div>

        <SheetFooter className={'flex-row'}>
          <Button
            variant={'outline'}
            className={'flex-1'}
            onClick={handleClear}
          >
            Limpar filtros
          </Button>
          <Button className={'flex-1'} onClick={handleApply}>
            Aplicar filtros
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
