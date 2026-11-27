import { XIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useLeague } from '@/features/admin/leagues';
import { useNationality } from '@/features/admin/nationalities';
import type { PlayersAdvancedFilters } from '@/features/admin/players';
import { useClub } from '@/features/season/clubs';
import { PREFERRED_FOOT_LABELS } from '@/lib';
import { SKILL_FILTER_CATEGORIES } from '@/shared/features/players';

const SKILL_FIELD_LABELS: Record<string, string> = Object.fromEntries(
  SKILL_FILTER_CATEGORIES.flatMap((category) =>
    category.fields.map((field) => [field.key, field.label]),
  ),
);

type ChipProps = {
  children: ReactNode;
  onRemove: () => void;
};

const Chip = ({ children, onRemove }: ChipProps) => (
  <span
    className={
      'flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-accent/10 px-2.5 py-1 font-medium text-accent text-xs'
    }
  >
    {children}
    <button type={'button'} onClick={onRemove} aria-label={'Remover filtro'}>
      <XIcon className={'size-3'} />
    </button>
  </span>
);

type ClubChipProps = { clubId: string; onRemove: () => void };

const ClubChip = ({ clubId, onRemove }: ClubChipProps) => {
  const { data: club } = useClub(clubId);
  if (!club) return null;
  return <Chip onRemove={onRemove}>{club.name}</Chip>;
};

type LeagueChipProps = { leagueId: string; onRemove: () => void };

const LeagueChip = ({ leagueId, onRemove }: LeagueChipProps) => {
  const { data: league } = useLeague(leagueId);
  if (!league) return null;
  return <Chip onRemove={onRemove}>{league.name}</Chip>;
};

type NationalityChipProps = { nationalityId: string; onRemove: () => void };

const NationalityChip = ({ nationalityId, onRemove }: NationalityChipProps) => {
  const { data: nationality } = useNationality(nationalityId);
  if (!nationality) return null;
  return <Chip onRemove={onRemove}>{nationality.name}</Chip>;
};

type ActiveFilterChipsProps = {
  filters: PlayersAdvancedFilters;
  onApply: (values: PlayersAdvancedFilters) => void;
};

export const ActiveFilterChips = ({
  filters,
  onApply,
}: ActiveFilterChipsProps) => {
  const remove = (patch: Partial<PlayersAdvancedFilters>) =>
    onApply({ ...filters, ...patch });

  const skillChips = Object.keys(SKILL_FIELD_LABELS).flatMap((field) => {
    const minKey = `${field}Min` as keyof PlayersAdvancedFilters;
    const maxKey = `${field}Max` as keyof PlayersAdvancedFilters;

    if (filters[minKey] === undefined && filters[maxKey] === undefined) {
      return [];
    }

    const min = filters[minKey] ?? 0;
    const max = filters[maxKey] ?? 99;

    return [
      {
        key: field,
        label: `${SKILL_FIELD_LABELS[field]} ${min}–${max}`,
        onRemove: () =>
          remove({
            [minKey]: undefined,
            [maxKey]: undefined,
          } as Partial<PlayersAdvancedFilters>),
      },
    ];
  });

  const hasAgeRange =
    filters.ageMin !== undefined || filters.ageMax !== undefined;
  const hasOverallRange =
    filters.overallMin !== undefined || filters.overallMax !== undefined;

  const hasAnyFilter =
    Boolean(filters.leagueId) ||
    Boolean(filters.clubId) ||
    (filters.nationalityIds?.length ?? 0) > 0 ||
    (filters.positions?.length ?? 0) > 0 ||
    Boolean(filters.preferredFoot) ||
    hasAgeRange ||
    hasOverallRange ||
    skillChips.length > 0;

  if (!hasAnyFilter) return null;

  return (
    <div className={'flex gap-1.5 overflow-x-auto pb-1'}>
      {filters.leagueId && (
        <LeagueChip
          leagueId={filters.leagueId}
          onRemove={() => remove({ leagueId: undefined })}
        />
      )}

      {filters.clubId && (
        <ClubChip
          clubId={filters.clubId}
          onRemove={() => remove({ clubId: undefined })}
        />
      )}

      {filters.nationalityIds?.map((id) => (
        <NationalityChip
          key={id}
          nationalityId={id}
          onRemove={() =>
            remove({
              nationalityIds: filters.nationalityIds?.filter(
                (nationalityId) => nationalityId !== id,
              ),
            })
          }
        />
      ))}

      {filters.positions?.map((code) => (
        <Chip
          key={code}
          onRemove={() =>
            remove({
              positions: filters.positions?.filter(
                (position) => position !== code,
              ),
            })
          }
        >
          {code}
        </Chip>
      ))}

      {filters.preferredFoot && (
        <Chip onRemove={() => remove({ preferredFoot: undefined })}>
          {PREFERRED_FOOT_LABELS[filters.preferredFoot]}
        </Chip>
      )}

      {hasAgeRange && (
        <Chip onRemove={() => remove({ ageMin: undefined, ageMax: undefined })}>
          {`Idade ${filters.ageMin ?? 15}–${filters.ageMax ?? 45}`}
        </Chip>
      )}

      {hasOverallRange && (
        <Chip
          onRemove={() =>
            remove({ overallMin: undefined, overallMax: undefined })
          }
        >
          {`Overall ${filters.overallMin ?? 0}–${filters.overallMax ?? 99}`}
        </Chip>
      )}

      {skillChips.map((chip) => (
        <Chip key={chip.key} onRemove={chip.onRemove}>
          {chip.label}
        </Chip>
      ))}
    </div>
  );
};
