import { parseAsStringEnum, useQueryStates } from 'nuqs';

export const IMPORT_TABS = ['sofifa', 'fc-squad-mania'] as const;

export type ImportTab = (typeof IMPORT_TABS)[number];

export const useImportTabs = () => {
  const [{ tab }, setFilters] = useQueryStates({
    tab: parseAsStringEnum<ImportTab>([...IMPORT_TABS]).withDefault('sofifa'),
  });

  const setTab = (value: ImportTab) => setFilters({ tab: value });

  return { tab, setTab };
};
