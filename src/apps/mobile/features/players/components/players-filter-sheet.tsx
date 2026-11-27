import { SlidersHorizontalIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';
import { useAllLeagues } from '@/features/admin/leagues';
import type { PlayersAdvancedFilters } from '@/features/admin/players';
import {
  buildDraft,
  type DraftFilters,
  type DraftStringField,
  EMPTY_DRAFT,
  PlayersFilterFields,
  toAdvancedFilters,
} from '@/shared/features/players';

type PlayersFilterSheetProps = {
  filters: PlayersAdvancedFilters;
  activeFilterCount: number;
  onApply: (values: PlayersAdvancedFilters) => void;
  onClear: () => void;
};

export const PlayersFilterSheet = ({
  filters,
  activeFilterCount,
  onApply,
  onClear,
}: PlayersFilterSheetProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DraftFilters>(() => buildDraft(filters));

  const { data: leagues } = useAllLeagues({ enabled: open });

  const setField = (key: DraftStringField, value: string) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const onOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setDraft(buildDraft(filters));
    setOpen(nextOpen);
  };

  const handleApply = () => {
    onApply(toAdvancedFilters(draft));
    setOpen(false);
  };

  const handleClear = () => {
    setDraft(EMPTY_DRAFT);
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

      <SheetContent side={'bottom'} className={'h-[88%] gap-4'}>
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>

        <div className={'flex flex-1 flex-col gap-5 overflow-y-auto px-4'}>
          <PlayersFilterFields
            draft={draft}
            leagues={leagues}
            setField={setField}
            setDraft={setDraft}
          />
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
