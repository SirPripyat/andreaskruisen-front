import { useMyActiveSeason } from '@/features/admin/users';

export const useSelectedSeason = () => {
  const { data: activeSeason, isPending } = useMyActiveSeason();

  return {
    selectedSeason: activeSeason ?? null,
    isPending,
  };
};
