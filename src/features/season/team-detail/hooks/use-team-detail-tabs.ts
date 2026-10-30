import { parseAsStringEnum, useQueryStates } from 'nuqs';

export const TEAM_DETAIL_TABS = [
  'overview',
  'roster',
  'lineup',
  'titles',
  'transfers',
] as const;

export type TeamDetailTab = (typeof TEAM_DETAIL_TABS)[number];

export const useTeamDetailTabs = (defaultTab: TeamDetailTab) => {
  const [{ tab }, setFilters] = useQueryStates({
    tab: parseAsStringEnum<TeamDetailTab>(TEAM_DETAIL_TABS).withDefault(
      defaultTab,
    ),
  });

  const setTab = (value: TeamDetailTab) => setFilters({ tab: value });

  return { tab, setTab };
};
