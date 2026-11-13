import { ListFilterIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Badge,
  Button,
  SelectOptions,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  toSelectOptions,
} from '@/components';
import { LeagueCell, useAllLeagues } from '@/features/admin/leagues';
import type { PlayersAdvancedFilters } from '@/features/admin/players';
import { PREFERRED_FOOT_LABELS } from '@/lib';
import { ClubSelect } from './club-select';
import {
  buildDraft,
  type DraftFilters,
  type DraftStringField,
  EMPTY_DRAFT,
  toAdvancedFilters,
} from './draft-filters';
import { NationalityMultiSelect } from './nationality-multi-select';
import { PositionMultiSelect } from './position-multi-select';
import { RangeInputRow } from './range-input-row';
import { SKILL_FILTER_CATEGORIES } from './skill-filter-categories';
import { SkillRangeCategory } from './skill-range-category';

const ALL_LEAGUES = 'all';

const ALL_FEET = 'all';

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
          <div className={'flex flex-col gap-1.5'}>
            <span
              className={
                'font-semibold text-[11px] text-muted-foreground uppercase tracking-wide'
              }
            >
              Liga
            </span>
            <SelectOptions
              value={draft.leagueId || ALL_LEAGUES}
              onValueChange={(value) =>
                setField('leagueId', value === ALL_LEAGUES ? '' : value)
              }
              options={toSelectOptions(
                { value: ALL_LEAGUES, label: 'Todas as ligas' },
                leagues,
                (league) => ({
                  value: league.id,
                  label: (
                    <LeagueCell logoUrl={league.logoUrl} name={league.name} />
                  ),
                }),
              )}
              alignItemWithTrigger={false}
            />
          </div>

          <div className={'flex flex-col gap-1.5'}>
            <span
              className={
                'font-semibold text-[11px] text-muted-foreground uppercase tracking-wide'
              }
            >
              Clube
            </span>
            <ClubSelect
              value={draft.clubId}
              onValueChange={(clubId) => setField('clubId', clubId)}
            />
          </div>

          <div className={'flex flex-col gap-1.5'}>
            <span
              className={
                'font-semibold text-[11px] text-muted-foreground uppercase tracking-wide'
              }
            >
              Nacionalidade
            </span>
            <NationalityMultiSelect
              value={draft.nationalityIds}
              onValueChange={(ids) =>
                setDraft((prev) => ({ ...prev, nationalityIds: ids }))
              }
            />
          </div>

          <div className={'flex flex-col gap-1.5'}>
            <span
              className={
                'font-semibold text-[11px] text-muted-foreground uppercase tracking-wide'
              }
            >
              Posições
            </span>
            <PositionMultiSelect
              value={draft.positions}
              onValueChange={(positions) =>
                setDraft((prev) => ({ ...prev, positions }))
              }
            />
          </div>

          <div className={'flex flex-col gap-1.5'}>
            <span
              className={
                'font-semibold text-[11px] text-muted-foreground uppercase tracking-wide'
              }
            >
              Pé preferido
            </span>
            <SelectOptions
              value={draft.preferredFoot || ALL_FEET}
              onValueChange={(value) =>
                setField('preferredFoot', value === ALL_FEET ? '' : value)
              }
              options={[
                { value: ALL_FEET, label: 'Qualquer' },
                { value: 'LEFT', label: PREFERRED_FOOT_LABELS.LEFT },
                { value: 'RIGHT', label: PREFERRED_FOOT_LABELS.RIGHT },
              ]}
              alignItemWithTrigger={false}
            />
          </div>

          <div className={'flex flex-col gap-1.5'}>
            <span
              className={
                'font-semibold text-[11px] text-muted-foreground uppercase tracking-wide'
              }
            >
              Idade
            </span>
            <RangeInputRow
              label={'Anos'}
              minValue={draft.ageMin}
              maxValue={draft.ageMax}
              onMinChange={(value) => setField('ageMin', value)}
              onMaxChange={(value) => setField('ageMax', value)}
              min={15}
              max={45}
            />
          </div>

          <div className={'flex flex-col gap-1.5'}>
            <span
              className={
                'font-semibold text-[11px] text-muted-foreground uppercase tracking-wide'
              }
            >
              Overall
            </span>
            <RangeInputRow
              label={'Nota geral'}
              minValue={draft.overallMin}
              maxValue={draft.overallMax}
              onMinChange={(value) => setField('overallMin', value)}
              onMaxChange={(value) => setField('overallMax', value)}
              zones
            />
          </div>

          <div className={'flex flex-col gap-2'}>
            <span
              className={
                'font-semibold text-[11px] text-muted-foreground uppercase tracking-wide'
              }
            >
              Atributos
            </span>
            {SKILL_FILTER_CATEGORIES.map((category) => (
              <SkillRangeCategory
                key={category.label}
                label={category.label}
                fields={category.fields}
                values={draft}
                onFieldChange={setField}
              />
            ))}
          </div>
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
