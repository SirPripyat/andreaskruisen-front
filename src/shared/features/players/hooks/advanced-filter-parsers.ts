import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs';
import {
  POSITION_CODES,
  PREFERRED_FOOT_VALUES,
  SKILL_RATING_FIELDS,
} from '@/features/admin/players';

// Um par de parsers min/max por atributo filtrável por range, igual ao
// backend gera os pares <campo>Min/<campo>Max em ListPlayersSchema.
const skillRangeParsers = Object.fromEntries(
  SKILL_RATING_FIELDS.flatMap((field) => [
    [`${field}Min`, parseAsInteger],
    [`${field}Max`, parseAsInteger],
  ]),
) as Record<string, typeof parseAsInteger>;

export const ADVANCED_FILTER_PARSERS = {
  nationalityIds: parseAsArrayOf(parseAsString),
  leagueId: parseAsString,
  clubId: parseAsString,
  positions: parseAsArrayOf(parseAsStringEnum([...POSITION_CODES])),
  preferredFoot: parseAsStringEnum([...PREFERRED_FOOT_VALUES]),
  ageMin: parseAsInteger,
  ageMax: parseAsInteger,
  overallMin: parseAsInteger,
  overallMax: parseAsInteger,
  ...skillRangeParsers,
};
