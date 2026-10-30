import { parseAsStringEnum, useQueryStates } from 'nuqs';

export const TOURNAMENT_DETAIL_TABS = [
  'groups',
  'knockout',
  'matches',
  'scorers',
  'assists',
] as const;

export type TournamentDetailTab = (typeof TOURNAMENT_DETAIL_TABS)[number];

export const useTournamentDetailTabs = (defaultTab: TournamentDetailTab) => {
  const [{ tab }, setFilters] = useQueryStates({
    tab: parseAsStringEnum<TournamentDetailTab>(
      TOURNAMENT_DETAIL_TABS,
    ).withDefault(defaultTab),
  });

  const setTab = (value: TournamentDetailTab) => setFilters({ tab: value });

  return { tab, setTab };
};
