import { useState } from 'react';
import { useTeams } from '@/features/admin/teams';
import { useDebouncedValue } from '@/hooks';

const PAGE_SIZE = 6;

export const useSeasonTeamPicker = () => {
  const [{ page, draftName }, setTeamFilter] = useState({
    draftName: '',
    page: 1,
  });

  const debouncedName = useDebouncedValue(draftName, 400);

  const { data, isPending } = useTeams({
    name: debouncedName || undefined,
    page,
    pageSize: PAGE_SIZE,
    sortBy: 'averageOverallRating',
    sortOrder: 'desc',
  });

  const teams = data?.data ?? [];

  const handlePreviousPage = () => {
    setTeamFilter((current) => ({
      ...current,
      page: Math.max(1, current.page - 1),
    }));
  };

  const handleNextPage = () => {
    setTeamFilter((current) => ({
      ...current,
      page: Math.min(data?.totalPages ?? current.page, current.page + 1),
    }));
  };

  return {
    draftName,
    setTeamFilter,
    data,
    page,
    handleNextPage,
    handlePreviousPage,
    isPending,
    teams,
  };
};
