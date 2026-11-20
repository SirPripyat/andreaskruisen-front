import { parseAsStringEnum, useQueryStates } from 'nuqs';

export const MARKET_TABS = ['history', 'received', 'sent'] as const;

export type MarketTab = (typeof MARKET_TABS)[number];

export const useMarketTabs = (defaultTab: MarketTab) => {
  const [{ tab }, setFilters] = useQueryStates({
    tab: parseAsStringEnum<MarketTab>([...MARKET_TABS]).withDefault(defaultTab),
  });

  const setTab = (value: MarketTab) => setFilters({ tab: value });

  return { tab, setTab };
};
