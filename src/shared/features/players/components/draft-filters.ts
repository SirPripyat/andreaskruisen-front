import {
  type PlayersAdvancedFilters,
  type PositionCode,
  type PreferredFootFilter,
  SKILL_RATING_FIELDS,
  type SkillRatingField,
} from '@/features/admin/players';

export type SkillDraftFields = {
  [K in SkillRatingField as `${K}Min`]: string;
} & {
  [K in SkillRatingField as `${K}Max`]: string;
};

export type DraftFilters = {
  nationalityIds: string[];
  leagueId: string;
  clubId: string;
  positions: PositionCode[];
  preferredFoot: PreferredFootFilter | '';
  ageMin: string;
  ageMax: string;
  overallMin: string;
  overallMax: string;
} & SkillDraftFields;

export type DraftStringField = Exclude<
  keyof DraftFilters,
  'nationalityIds' | 'positions'
>;

const toDraftValue = (value: number | undefined) =>
  value === undefined ? '' : String(value);

export const buildDraft = (filters: PlayersAdvancedFilters): DraftFilters => {
  const skillValues = Object.fromEntries(
    SKILL_RATING_FIELDS.flatMap((field) => [
      [`${field}Min`, toDraftValue(filters[`${field}Min`])],
      [`${field}Max`, toDraftValue(filters[`${field}Max`])],
    ]),
  ) as SkillDraftFields;

  return {
    nationalityIds: filters.nationalityIds ?? [],
    leagueId: filters.leagueId ?? '',
    clubId: filters.clubId ?? '',
    positions: filters.positions ?? [],
    preferredFoot: filters.preferredFoot ?? '',
    ageMin: toDraftValue(filters.ageMin),
    ageMax: toDraftValue(filters.ageMax),
    overallMin: toDraftValue(filters.overallMin),
    overallMax: toDraftValue(filters.overallMax),
    ...skillValues,
  };
};

const toNumber = (value: string) =>
  value.trim() === '' ? undefined : Number(value);

export const toAdvancedFilters = (
  draft: DraftFilters,
): PlayersAdvancedFilters => {
  const skillValues = Object.fromEntries(
    SKILL_RATING_FIELDS.flatMap((field) => [
      [`${field}Min`, toNumber(draft[`${field}Min`])],
      [`${field}Max`, toNumber(draft[`${field}Max`])],
    ]),
  );

  return {
    nationalityIds: draft.nationalityIds.length
      ? draft.nationalityIds
      : undefined,
    leagueId: draft.leagueId || undefined,
    clubId: draft.clubId || undefined,
    positions: draft.positions.length ? draft.positions : undefined,
    preferredFoot: draft.preferredFoot || undefined,
    ageMin: toNumber(draft.ageMin),
    ageMax: toNumber(draft.ageMax),
    overallMin: toNumber(draft.overallMin),
    overallMax: toNumber(draft.overallMax),
    ...skillValues,
  };
};

export const EMPTY_DRAFT = buildDraft({});
