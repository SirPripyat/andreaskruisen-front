import { ListFilterIcon } from 'lucide-react';
import { useState } from 'react';
import { Badge, Button } from '@/components';
import {
  Sheet,
  SheetContent,
  SheetDescription,
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

type PlayersFiltersDrawerProps = {
  filters: PlayersAdvancedFilters;
  activeFilterCount: number;
  onApply: (values: PlayersAdvancedFilters) => void;
  onClear: () => void;
};

export const PlayersFiltersDrawer = ({
  filters,
  activeFilterCount,
  onApply,
  onClear,
}: PlayersFiltersDrawerProps) => {
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
          <Button variant={activeFilterCount > 0 ? 'default' : 'outline'}>
            <ListFilterIcon />
            Filtros avançados
            {activeFilterCount > 0 && (
              <Badge
                variant={'outline'}
                className={'border-transparent bg-background/20 text-current'}
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        }
      />

      <SheetContent className={'data-[side=right]:sm:max-w-lg'}>
        <SheetHeader>
          <SheetTitle>Filtros avançados</SheetTitle>
          <SheetDescription>
            Combine time, nacionalidade, posição e atributos para refinar a
            busca de jogadores.
          </SheetDescription>
        </SheetHeader>

        <div className={'flex flex-1 flex-col gap-5 overflow-y-auto px-4'}>
          <PlayersFilterFields
            draft={draft}
            leagues={leagues}
            setField={setField}
            setDraft={setDraft}
          />
        </div>

        <SheetFooter className={'flex-row justify-end'}>
          <Button variant={'outline'} onClick={handleClear}>
            Limpar filtros
          </Button>
          <Button onClick={handleApply}>Aplicar filtros</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
