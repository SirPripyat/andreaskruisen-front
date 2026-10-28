import type { SortingState, Updater } from '@tanstack/react-table';
import type { SortOrder } from '@/lib';

type UseUrlSortingParams<TSortField extends string> = {
  sortBy: TSortField;
  sortOrder: SortOrder;
  onSortingChange: (next: { sortBy: TSortField; sortOrder: SortOrder }) => void;
};

export const useUrlSorting = <TSortField extends string>({
  sortBy,
  sortOrder,
  onSortingChange,
}: UseUrlSortingParams<TSortField>) => {
  const sorting: SortingState = [{ id: sortBy, desc: sortOrder === 'desc' }];

  const handleSortingChange = (updater: Updater<SortingState>) => {
    const next = (
      typeof updater === 'function' ? updater(sorting) : updater
    )[0];
    if (!next) return;
    onSortingChange({
      sortBy: next.id as TSortField,
      sortOrder: next.desc ? 'desc' : 'asc',
    });
  };

  return { sorting, onSortingChange: handleSortingChange };
};
