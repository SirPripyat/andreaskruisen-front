import { useLeagues } from './use-leagues';

const PAGE_SIZE = 100;

export const useAllLeagues = (options?: { enabled?: boolean }) => {
  const { data, ...rest } = useLeagues(
    { page: 1, pageSize: PAGE_SIZE, sortBy: 'name', sortOrder: 'asc' },
    options,
  );

  return { ...rest, data: data?.data };
};
