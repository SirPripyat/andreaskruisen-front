import { parseAsStringEnum, useQueryStates } from 'nuqs';

export const PLAYER_DETAIL_TABS = ['attributes', 'players'] as const;

export type PlayerDetailTab = (typeof PLAYER_DETAIL_TABS)[number];

export const usePlayerDetailTabs = (defaultTab: PlayerDetailTab) => {
  const [{ tab }, setFilters] = useQueryStates({
    tab: parseAsStringEnum<PlayerDetailTab>([
      ...PLAYER_DETAIL_TABS,
    ]).withDefault(defaultTab),
  });

  const setTab = (value: PlayerDetailTab) => setFilters({ tab: value });

  return { tab, setTab };
};
